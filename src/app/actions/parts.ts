"use server";

import { revalidatePath } from "next/cache";

import {
  CreatePartDocument,
  type CreatePartInput,
  CreatePartsInventoryDocument,
  type CreatePartsInventoryInput,
  DeletePartDocument,
  DeletePartsInventoryDocument,
  GetPartDocument,
  type GetPartQuery,
  GetPartsDocument,
  GetPartsInventoryByPartDocument,
  type GetPartsInventoryByPartQuery,
  GetPartsInventoryDocument,
  GetPartsInventoryItemDocument,
  type GetPartsInventoryQuery,
  type GetPartsQuery,
  UpdatePartDocument,
  type UpdatePartInput,
  UpdatePartsInventoryDocument,
  type UpdatePartsInventoryInput,
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

    revalidatePath("/catalog/parts");
    revalidatePath("/backoffice/parts");
    return { success: true as const, data: data.createPart };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to create part",
    };
  }
}

export async function updatePart(
  id: string,
  input: Omit<UpdatePartInput, "images">,
  existingImageUrls?: string[],
  newImageFiles?: File[],
) {
  try {
    let uploadedImageUrls: string[] = [];

    if (newImageFiles && newImageFiles.length > 0) {
      for (const file of newImageFiles) {
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

      const uploadPromises = newImageFiles.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        return uploadImageToS3(buffer, file.name, file.type, "part-image");
      });

      uploadedImageUrls = await Promise.all(uploadPromises);
    }

    const images =
      existingImageUrls || newImageFiles
        ? [...(existingImageUrls ?? []), ...uploadedImageUrls]
        : undefined;

    const data = await papiClient.request(UpdatePartDocument, {
      id,
      input: { ...input, images },
    });
    revalidatePath("/catalog/parts");
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
    revalidatePath("/catalog/parts");
    revalidatePath("/backoffice/parts");
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to delete part",
    };
  }
}

// --- Parts Inventory CRUD ---

export async function getAllPartsInventory() {
  try {
    const data = await papiClient.request(GetPartsInventoryDocument);
    return { success: true as const, data: data.partsInventory };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch parts inventory",
    };
  }
}

export async function getPartsInventoryItem(id: string) {
  try {
    const data = await papiClient.request(GetPartsInventoryItemDocument, {
      id,
    });
    if (!data.partsInventoryItem) {
      return {
        success: false as const,
        error: "Parts inventory item not found",
      };
    }
    return { success: true as const, data: data.partsInventoryItem };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch parts inventory item",
    };
  }
}

export async function createPartsInventoryItem(
  input: CreatePartsInventoryInput,
) {
  try {
    const data = await papiClient.request(CreatePartsInventoryDocument, {
      input,
    });
    revalidatePath("/backoffice/inventory");
    revalidatePath("/backoffice/parts");
    return { success: true as const, data: data.createPartsInventory };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create parts inventory item",
    };
  }
}

export async function updatePartsInventoryItem(
  id: string,
  input: UpdatePartsInventoryInput,
) {
  try {
    const data = await papiClient.request(UpdatePartsInventoryDocument, {
      id,
      input,
    });
    revalidatePath("/backoffice/inventory");
    revalidatePath("/backoffice/parts");
    return { success: true as const, data: data.updatePartsInventory };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update parts inventory item",
    };
  }
}

export async function deletePartsInventoryItem(id: string) {
  try {
    await papiClient.request(DeletePartsInventoryDocument, { id });
    revalidatePath("/backoffice/inventory");
    revalidatePath("/backoffice/parts");
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete parts inventory item",
    };
  }
}
