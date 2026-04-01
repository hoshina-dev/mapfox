"use server";

import { revalidatePath } from "next/cache";

import {
  AddProductPartDocument,
  type AddProductPartInput,
  CreateProductDocument,
  type CreateProductInput,
  DeleteProductDocument,
  GetProductDocument,
  GetProductsDocument,
  UpdateProductDocument,
  type UpdateProductInput,
} from "@/libs/api/papi/generated/graphql";
import { papiClient } from "@/libs/apiClient";

export async function getProducts() {
  try {
    const data = await papiClient.request(GetProductsDocument);
    return { success: true as const, data: data.products };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to fetch products",
    };
  }
}

export async function getProduct(id: string) {
  try {
    const data = await papiClient.request(GetProductDocument, { id });
    if (!data.product) {
      return { success: false as const, error: "Product not found" };
    }
    return { success: true as const, data: data.product };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to fetch product",
    };
  }
}

export async function createProduct(
  input: CreateProductInput,
  parts?: Omit<AddProductPartInput, "productId">[],
) {
  try {
    const data = await papiClient.request(CreateProductDocument, { input });
    const productId = data.createProduct.id;

    if (parts && parts.length > 0) {
      await Promise.all(
        parts.map((part) =>
          papiClient.request(AddProductPartDocument, {
            input: { ...part, productId },
          }),
        ),
      );
    }

    revalidatePath("/backoffice/products");
    return { success: true as const, data: data.createProduct };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  try {
    const data = await papiClient.request(UpdateProductDocument, { id, input });
    revalidatePath("/backoffice/products");
    return { success: true as const, data: data.updateProduct };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    await papiClient.request(DeleteProductDocument, { id });
    revalidatePath("/backoffice/products");
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}
