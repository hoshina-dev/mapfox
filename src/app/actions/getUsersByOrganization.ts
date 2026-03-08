"use server";

import { organizationsApi } from "@/libs/apiClient";

export async function getUsersByOrganization(organizationId: string) {
  try {
    const users =
      await organizationsApi.organizationsIdMembersGet(organizationId);
    return { success: true, data: users };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
      data: [],
    };
  }
}
