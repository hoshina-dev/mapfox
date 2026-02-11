"use server";

import { usersApi } from "@/libs/apiClient";

export async function getUsersByOrganization(organizationId: string) {
  try {
    const users = await usersApi.usersOrganizationOrgIdGet(organizationId);
    return { success: true, data: users };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch users",
      data: [],
    };
  }
}
