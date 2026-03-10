"use server";

import {
  CreateCategoryDocument,
  GetCategoriesDocument,
} from "@/libs/api/pasta/generated/graphql";
import { pastaClient } from "@/libs/apiClient";

export async function getCategories() {
  try {
    const data = await pastaClient.request(GetCategoriesDocument);
    return { success: true as const, data: data.categories };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
}

export async function createCategory(name: string) {
  try {
    const data = await pastaClient.request(CreateCategoryDocument, {
      input: { name },
    });
    return { success: true as const, data: data.createCategory };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
  }
}
