"use server";

import { revalidatePath } from "next/cache";

import { usersApi } from "@/libs/apiClient";
import { getSession } from "@/libs/dal";
import type { UpdateUserRequest } from "@/libs/generated/custapi";
import { ResponseError } from "@/libs/generated/custapi";
import { uploadImageToS3 } from "@/libs/s3Client";
import { createSession } from "@/libs/session";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function updateCurrentUser(
  data: Omit<
    UpdateUserRequest,
    "avatarUrl" | "isAdmin" | "email" | "password" | "organizationId"
  >,
  avatarFile?: File,
) {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    let avatarUrl: string | undefined;

    // Upload avatar to S3 if provided
    if (avatarFile) {
      if (!ALLOWED_TYPES.includes(avatarFile.type)) {
        return {
          success: false,
          error: `Invalid file type. Only JPEG, PNG, and WebP are allowed.`,
        };
      }

      if (avatarFile.size > MAX_FILE_SIZE) {
        return {
          success: false,
          error: `File exceeds 1MB limit. Size: ${(avatarFile.size / 1024 / 1024).toFixed(2)}MB`,
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

    const payload: UpdateUserRequest = {
      ...data,
      ...(avatarUrl !== undefined && { avatarUrl }),
    };

    const result = await usersApi.usersIdIdPatch(session.userId, payload);

    // Update the session with new data
    await createSession({
      id: result.id,
      name: result.name,
      email: result.email,
      avatarUrl: result.avatarUrl,
      organizationId: result.organizationId,
    });

    revalidatePath("/home");

    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ResponseError) {
      const errorText = await error.response.text();
      return {
        success: false,
        error: `Failed to update user: ${error.response.status} ${error.response.statusText} - ${errorText}`,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}
