"use server";

import { revalidatePath } from "next/cache";

import type { OrganizationResponse } from "@/libs/api/custapi";
import { organizationsApi } from "@/libs/apiClient";

export async function getOrganizations(): Promise<
  | { success: true; data: OrganizationResponse[] }
  | { success: false; error: string }
> {
  try {
    const data = await organizationsApi.organizationsGet();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch organizations",
    };
  }
}

export async function deleteOrganization(id: string) {
  try {
    await organizationsApi.organizationsIdDelete(id);
    revalidatePath("/backoffice/organizations");
    revalidatePath("/organizations");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete organization",
    };
  }
}
