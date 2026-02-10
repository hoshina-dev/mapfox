"use server";

import { revalidatePath } from "next/cache";

import { organizationsApi } from "@/libs/apiClient";
import type { CreateOrganizationRequest } from "@/libs/generated/custapi";
import { uploadImageToS3 } from "@/libs/s3Client";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function createOrganization(
  data: CreateOrganizationRequest,
  imageFiles?: File[],
) {
  try {
    let uploadedImageUrls: string[] = [];

    // Upload images to S3 if any are provided
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

      // Upload all files
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

      uploadedImageUrls = await Promise.all(uploadPromises);
    }

    // Create organization with uploaded image URLs
    const payload: CreateOrganizationRequest = {
      ...data,
      imageUrls: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
    };

    const result = await organizationsApi.organizationsPost(payload);

    // Revalidate the organizations page to show the new organization
    revalidatePath("/organizations");

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create organization",
    };
  }
}
