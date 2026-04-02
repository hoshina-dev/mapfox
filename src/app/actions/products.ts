"use server";

import { revalidatePath } from "next/cache";

import {
  AddPartToProductInventoryDocument,
  AddProductPartDocument,
  type AddProductPartInput,
  CreateProductDocument,
  type CreateProductInput,
  CreateProductInventoryDocument,
  type CreateProductInventoryInput,
  DeleteProductDocument,
  DeleteProductInventoryDocument,
  GetProductDocument,
  GetProductInventoryDocument,
  GetProductInventoryItemDocument,
  GetProductsDocument,
  RemovePartFromProductInventoryDocument,
  UpdateProductDocument,
  type UpdateProductInput,
  UpdateProductInventoryDocument,
  type UpdateProductInventoryInput,
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

// --- Product Inventory CRUD ---

export async function getAllProductInventory() {
  try {
    const data = await papiClient.request(GetProductInventoryDocument);
    return { success: true as const, data: data.productInventory };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch product inventory",
    };
  }
}

export async function getProductInventoryItem(id: string) {
  try {
    const data = await papiClient.request(GetProductInventoryItemDocument, {
      id,
    });
    if (!data.productInventoryItem) {
      return {
        success: false as const,
        error: "Product inventory item not found",
      };
    }
    return { success: true as const, data: data.productInventoryItem };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch product inventory item",
    };
  }
}

export async function createProductInventoryItem(
  input: CreateProductInventoryInput,
) {
  try {
    const data = await papiClient.request(CreateProductInventoryDocument, {
      input,
    });
    revalidatePath("/backoffice/inventory");
    revalidatePath("/backoffice/products");
    return { success: true as const, data: data.createProductInventory };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create product inventory item",
    };
  }
}

export async function updateProductInventoryItem(
  id: string,
  input: UpdateProductInventoryInput,
) {
  try {
    const data = await papiClient.request(UpdateProductInventoryDocument, {
      id,
      input,
    });
    revalidatePath("/backoffice/inventory");
    revalidatePath("/backoffice/products");
    return { success: true as const, data: data.updateProductInventory };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update product inventory item",
    };
  }
}

export async function deleteProductInventoryItem(id: string) {
  try {
    await papiClient.request(DeleteProductInventoryDocument, { id });
    revalidatePath("/backoffice/inventory");
    revalidatePath("/backoffice/products");
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete product inventory item",
    };
  }
}

export async function linkPartToProductUnit(
  partsInventoryId: string,
  productInventoryId: string,
) {
  try {
    await papiClient.request(AddPartToProductInventoryDocument, {
      partsInventoryId,
      productInventoryId,
    });
    revalidatePath("/backoffice/inventory");
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to link part to product unit",
    };
  }
}

export async function unlinkPartFromProductUnit(
  partsInventoryId: string,
  productInventoryId: string,
) {
  try {
    await papiClient.request(RemovePartFromProductInventoryDocument, {
      partsInventoryId,
      productInventoryId,
    });
    revalidatePath("/backoffice/inventory");
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to unlink part from product unit",
    };
  }
}
