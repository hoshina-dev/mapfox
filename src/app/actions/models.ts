"use server";

import { getPresignedUrl, listS3FilesByPart } from "@/libs/s3Client";

const MODEL_PREFIX = "optimized/";

export async function listModels() {
  try {
    const data = await listS3FilesByPart(MODEL_PREFIX);
    return { success: true as const, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to list models";
    return { success: false as const, error: message };
  }
}

export async function getModelUrl(key: string) {
  try {
    const url = await getPresignedUrl(key);
    return { success: true as const, url };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to get model URL";
    return { success: false as const, error: message };
  }
}
