"use server";

import { revalidatePath } from "next/cache";

import {
  CreatePartDocument,
  type CreatePartInput,
  DeletePartDocument,
  GetPartDocument,
  type GetPartQuery,
  GetPartsDocument,
  GetPartsInventoryByPartDocument,
  type GetPartsInventoryByPartQuery,
  GetPartsInventoryDocument,
  type GetPartsInventoryQuery,
  type GetPartsQuery,
  UpdatePartDocument,
  type UpdatePartInput,
} from "@/libs/api/papi/generated/graphql";
import { papiClient } from "@/libs/apiClient";
import { uploadImageToS3 } from "@/libs/s3Client";

export type PartListItem = GetPartsQuery["parts"][number] & {
  inventoryAvailableCount: number;
  inventoryTotalCount: number;
};

function mergePartsWithInventorySummary(
  parts: GetPartsQuery["parts"],
  inventoryRows: GetPartsInventoryQuery["partsInventory"],
): PartListItem[] {
  const counts = new Map<string, { total: number; available: number }>();
  for (const row of inventoryRows) {
    const pid = String(row.partId);
    const cur = counts.get(pid) ?? { total: 0, available: 0 };
    cur.total += 1;
    if (row.isAvailable) cur.available += 1;
    counts.set(pid, cur);
  }

  return parts.map((p) => {
    const c = counts.get(String(p.id)) ?? { total: 0, available: 0 };
    return {
      ...p,
      inventoryAvailableCount: c.available,
      inventoryTotalCount: c.total,
    };
  });
}

export async function getParts() {
  try {
    const [partsRes, invRes] = await Promise.all([
      papiClient.request(GetPartsDocument),
      papiClient.request(GetPartsInventoryDocument).catch(() => null),
    ]);

    const inventoryRows = invRes?.partsInventory ?? [];
    const data = mergePartsWithInventorySummary(partsRes.parts, inventoryRows);

    return { success: true as const, data };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to fetch parts",
    };
  }
}

export type PartDetailPayload = {
  part: NonNullable<GetPartQuery["part"]>;
  partsInventory: GetPartsInventoryByPartQuery["partsInventoryByPart"];
};

export async function getPart(id: string) {
  try {
    const [partData, invData] = await Promise.all([
      papiClient.request(GetPartDocument, { id }),
      papiClient.request(GetPartsInventoryByPartDocument, { partId: id }),
    ]);

    if (!partData.part) {
      return { success: false as const, error: "Part not found" };
    }

    return {
      success: true as const,
      data: {
        part: partData.part,
        partsInventory: invData.partsInventoryByPart,
      } satisfies PartDetailPayload,
    };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to fetch part",
    };
  }
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function createPart(
  input: Omit<CreatePartInput, "images">,
  imageFiles?: File[],
) {
  try {
    let uploadedImageUrls: string[] = [];

    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          return {
            success: false as const,
            error: `Invalid file type: ${file.name}. Only JPEG, PNG, and WebP are allowed.`,
          };
        }
        if (file.size > MAX_FILE_SIZE) {
          return {
            success: false as const,
            error: `File ${file.name} exceeds 1MB limit.`,
          };
        }
      }

      const uploadPromises = imageFiles.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        return uploadImageToS3(buffer, file.name, file.type, "part-image");
      });

      uploadedImageUrls = await Promise.all(uploadPromises);
    }

    const data = await papiClient.request(CreatePartDocument, {
      input: {
        ...input,
        images: uploadedImageUrls,
      },
    });

    revalidatePath("/parts");
    revalidatePath("/backoffice/parts");
    return { success: true as const, data: data.createPart };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to create part",
    };
  }
}

export async function updatePart(id: string, input: UpdatePartInput) {
  try {
    const data = await papiClient.request(UpdatePartDocument, { id, input });
    revalidatePath("/parts");
    revalidatePath("/backoffice/parts");
    return { success: true as const, data: data.updatePart };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to update part",
    };
  }
}

export async function deletePart(id: string) {
  try {
    await papiClient.request(DeletePartDocument, { id });
    revalidatePath("/parts");
    revalidatePath("/backoffice/parts");
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to delete part",
    };
  }
}
