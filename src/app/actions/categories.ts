"use server";

import { GetCategoriesDocument } from "@/libs/api/papi/generated/graphql";
import { papiClient } from "@/libs/apiClient";

export async function getCategories() {
  try {
    const data = await papiClient.request(GetCategoriesDocument);
    return { success: true as const, data: data.categories };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
}
