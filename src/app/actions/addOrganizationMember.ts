"use server";

import { revalidatePath } from "next/cache";

import { organizationsApi } from "@/libs/apiClient";
import type { MemberRole } from "@/libs/generated/custapi";
import { ResponseError } from "@/libs/generated/custapi";

export async function addOrganizationMember(
  organizationId: string,
  userId: string,
  role: MemberRole,
) {
  try {
    await organizationsApi.organizationsIdMembersPost(organizationId, {
      userId,
      role,
    });

    revalidatePath(`/organization/${organizationId}`);

    return { success: true };
  } catch (error) {
    if (error instanceof ResponseError) {
      const errorText = await error.response.text();
      return {
        success: false,
        error: `Failed to add member: ${error.response.status} - ${errorText}`,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add member",
    };
  }
}
