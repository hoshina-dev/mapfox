"use server";

import { revalidatePath } from "next/cache";

import { organizationsApi } from "@/libs/apiClient";
import type { CreateOrganizationRequest } from "@/libs/generated/custapi";

export async function createOrganization(data: CreateOrganizationRequest) {
  try {
    const result = await organizationsApi.organizationsPost(data);

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
