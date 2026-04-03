"use server";

import { revalidatePath } from "next/cache";

import {
  CreateCategoryDocument,
  type CreateCategoryInput,
  DeleteCategoryDocument,
  GetCategoriesDocument,
  UpdateCategoryDocument,
  type UpdateCategoryInput,
} from "@/libs/api/papi/generated/graphql";
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

export async function createCategory(input: CreateCategoryInput) {
  try {
    const data = await papiClient.request(CreateCategoryDocument, { input });
    revalidatePath("/backoffice/categories");
    return { success: true as const, data: data.createCategory };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
  }
}

export async function deleteCategory(id: string) {
  try {
    await papiClient.request(DeleteCategoryDocument, { id });
    revalidatePath("/backoffice/categories");
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}

export async function updateCategory(id: string, input: UpdateCategoryInput) {
  try {
    const data = await papiClient.request(UpdateCategoryDocument, {
      id,
      input,
    });
    revalidatePath("/backoffice/categories");
    return { success: true as const, data: data.updateCategory };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to update category",
    };
  }
}
