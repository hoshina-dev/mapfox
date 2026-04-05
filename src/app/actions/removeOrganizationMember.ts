"use server";

import { revalidatePath } from "next/cache";

import { MemberRole, ResponseError } from "@/libs/api/custapi";
import { organizationsApi, usersApi } from "@/libs/apiClient";
import { getSession } from "@/libs/dal";

export async function removeOrganizationMember(
  organizationId: string,
  userId: string,
) {
  try {
    // Verify the current user is a manager of this organization
    const session = await getSession();
    if (!session?.userId) {
      return { success: false, error: "Not authenticated" };
    }
    const memberships = await usersApi.usersIdIdOrganizationsGet(
      session.userId,
    );
    const membership = memberships.find(
      (m) => m.organizationId === organizationId,
    );
    if (membership?.role !== MemberRole.RoleManager) {
      return {
        success: false,
        error: "Only organization managers can remove members",
      };
    }

    await organizationsApi.organizationsIdMembersUserIdDelete(
      organizationId,
      userId,
    );

    revalidatePath(`/organization/${organizationId}`);

    return { success: true };
  } catch (error) {
    if (error instanceof ResponseError) {
      const errorText = await error.response.text();
      return {
        success: false,
        error: `Failed to remove member: ${error.response.status} - ${errorText}`,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove member",
    };
  }
}
