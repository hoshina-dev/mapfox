"use server";

import { usersApi } from "@/libs/apiClient";
import {
  type CreateUserRequest,
  ResponseError,
} from "@/libs/generated/custapi";
import { uploadImageToS3 } from "@/libs/s3Client";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function createUser(
  data: Omit<CreateUserRequest, "avatarUrl" | "isAdmin">,
  avatarFile?: File,
) {
  try {
    let avatarUrl: string | undefined;

    // Upload avatar to S3 if provided
    if (avatarFile) {
      if (!ALLOWED_TYPES.includes(avatarFile.type)) {
        return {
          success: false,
          error: `Invalid file type: ${avatarFile.name}. Only JPEG, PNG, and WebP are allowed.`,
        };
      }

      if (avatarFile.size > MAX_FILE_SIZE) {
        return {
          success: false,
          error: `File ${avatarFile.name} exceeds 1MB limit. Size: ${(avatarFile.size / 1024 / 1024).toFixed(2)}MB`,
        };
      }

      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      avatarUrl = await uploadImageToS3(
        buffer,
        avatarFile.name,
        avatarFile.type,
        "user-avatar",
      );
    }

    const payload: CreateUserRequest = {
      ...data,
      isAdmin: false,
      avatarUrl,
    };

    const result = await usersApi.usersPost(payload);

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ResponseError) {
      const errorText = await error.response.text();
      return {
        success: false,
        error: `Failed to create user: ${error.response.status} ${error.response.statusText} - ${errorText}`,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}
