"use server";

import { revalidatePath } from "next/cache";

import {
  CreatePartDocument,
  type CreatePartInput,
  DeletePartDocument,
  GetPartDocument,
  GetPartsDocument,
  UpdatePartDocument,
  type UpdatePartInput,
} from "@/libs/api/pasta/generated/graphql";
import { pastaClient } from "@/libs/apiClient";
import { deleteImageFromS3, uploadImageToS3 } from "@/libs/s3Client";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

type CreatePartActionInput = Omit<CreatePartInput, "images">;
type UpdatePartActionInput = Omit<UpdatePartInput, "images">;

export async function getParts() {
  try {
    const data = await pastaClient.request(GetPartsDocument);
    return { success: true as const, data: data.parts };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to fetch parts",
    };
  }
}

export async function getPart(id: string) {
  try {
    const data = await pastaClient.request(GetPartDocument, { id });
    if (!data.part) {
      return { success: false as const, error: "Part not found" };
    }
    return { success: true as const, data: data.part };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to fetch part",
    };
  }
}

export async function createPart(
  input: CreatePartActionInput,
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
            error: `File ${file.name} exceeds 1MB limit. Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
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

    const data = await pastaClient.request(CreatePartDocument, {
      input: {
        name: input.name,
        partNumber: input.partNumber,
        description: input.description || undefined,
        condition: input.condition,
        isAvailable: input.isAvailable ?? true,
        temperatureStage: input.temperatureStage || undefined,
        manufacturerId: input.manufacturerId,
        categoryIds: input.categoryIds,
        organizationId: input.organizationId,
        userId: input.userId,
        images: uploadedImageUrls,
      },
    });

    revalidatePath("/parts");

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
  input: UpdatePartActionInput,
  imageFiles?: File[],
  existingImageUrls?: string[],
  originalImageUrls?: string[],
) {
  try {
    let uploadedImageUrls: string[] = [...(existingImageUrls || [])];

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
            error: `File ${file.name} exceeds 1MB limit. Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          };
        }
      }

      const uploadPromises = imageFiles.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        return uploadImageToS3(buffer, file.name, file.type, "part-image");
      });

      const newUploadedUrls = await Promise.all(uploadPromises);
      uploadedImageUrls = [...uploadedImageUrls, ...newUploadedUrls];
    }

    const data = await pastaClient.request(UpdatePartDocument, {
      id,
      input: {
        name: input.name,
        description: input.description,
        condition: input.condition,
        isAvailable: input.isAvailable,
        temperatureStage: input.temperatureStage,
        categoryIds: input.categoryIds,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
      },
    });

    // Delete old unused images from S3
    if (originalImageUrls && originalImageUrls.length > 0) {
      const imagesToDelete = originalImageUrls.filter(
        (url) => !uploadedImageUrls.includes(url),
      );
      if (imagesToDelete.length > 0) {
        await Promise.allSettled(
          imagesToDelete.map((url) => deleteImageFromS3(url)),
        );
      }
    }

    revalidatePath(`/parts/${id}`);
    revalidatePath("/parts");

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
    // Fetch part to get images for cleanup
    const partResult = await pastaClient.request(GetPartDocument, { id });
    const images = partResult.part?.images || [];

    await pastaClient.request(DeletePartDocument, { id });

    // Clean up images from S3
    if (images.length > 0) {
      await Promise.allSettled(images.map((url) => deleteImageFromS3(url)));
    }

    revalidatePath("/parts");

    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to delete part",
    };
  }
}
