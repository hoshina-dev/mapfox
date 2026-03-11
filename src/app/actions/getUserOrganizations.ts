"use server";

import { organizationsApi, usersApi } from "@/libs/apiClient";

export async function getUserOrganizations(userId: string) {
  try {
    const memberships = await usersApi.usersIdIdOrganizationsGet(userId);

    // Extract organization IDs and batch-fetch full organization data
    const orgIds = memberships
      .map((m) => m.organizationId)
      .filter((id): id is string => !!id);

    if (orgIds.length === 0) {
      return { success: true as const, data: [] };
    }

    const organizations = await organizationsApi.organizationsBatchPost({
      ids: orgIds,
    });

    return { success: true as const, data: organizations };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch user organizations",
      data: [],
    };
  }
}
