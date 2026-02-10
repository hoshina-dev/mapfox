"use server";

import { revalidatePath } from "next/cache";

import { organizationsApi } from "@/libs/apiClient";
import type { UpdateOrganizationRequest } from "@/libs/generated/custapi";
import { deleteImageFromS3, uploadImageToS3 } from "@/libs/s3Client";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function updateOrganization(
  id: string,
  data: UpdateOrganizationRequest,
  imageFiles?: File[],
  existingImageUrls?: string[],
  originalImageUrls?: string[],
) {
  try {
    let uploadedImageUrls: string[] = [...(existingImageUrls || [])];

    // Upload new images to S3 if any are provided
    if (imageFiles && imageFiles.length > 0) {
      // Validate all files before uploading
      for (const file of imageFiles) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          return {
            success: false,
            error: `Invalid file type: ${file.name}. Only JPEG, PNG, and WebP are allowed.`,
          };
        }

        if (file.size > MAX_FILE_SIZE) {
          return {
            success: false,
            error: `File ${file.name} exceeds 1MB limit. Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
          };
        }
      }

      // Upload all new files
      const uploadPromises = imageFiles.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        return uploadImageToS3(
          buffer,
          file.name,
          file.type,
          "organization-image",
        );
      });

      const newUploadedUrls = await Promise.all(uploadPromises);
      uploadedImageUrls = [...uploadedImageUrls, ...newUploadedUrls];
    }

    // Validate that at least one image exists
    if (uploadedImageUrls.length === 0) {
      return {
        success: false,
        error: "Organization must have at least one image",
      };
    }

    // Update organization with new image URLs
    const payload: UpdateOrganizationRequest = {
      ...data,
      imageUrls: uploadedImageUrls,
    };

    const result = await organizationsApi.organizationsIdPatch(id, payload);

    // Delete old unused images from S3
    if (originalImageUrls && originalImageUrls.length > 0) {
      const imagesToDelete = originalImageUrls.filter(
        (url) => !uploadedImageUrls.includes(url),
      );

      if (imagesToDelete.length > 0) {
        // Delete images in parallel but don't fail the operation if deletion fails
        await Promise.allSettled(
          imagesToDelete.map((url) => deleteImageFromS3(url)),
        );
      }
    }

    // Revalidate the organization page and list to show the updated data
    revalidatePath(`/organization/${id}`);
    revalidatePath("/organizations");

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update organization",
    };
  }
}
