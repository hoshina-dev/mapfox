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
  GetProductInventoryByProductDocument,
  GetProductInventoryDocument,
  GetProductInventoryItemDocument,
  type GetProductInventoryQuery,
  GetProductsDocument,
  type GetProductsQuery,
  RemovePartFromProductInventoryDocument,
  UpdateProductDocument,
  type UpdateProductInput,
  UpdateProductInventoryDocument,
  type UpdateProductInventoryInput,
} from "@/libs/api/papi/generated/graphql";
import { papiClient } from "@/libs/apiClient";

export type ProductListItem = GetProductsQuery["products"][number] & {
  inventoryAvailableCount: number;
  inventoryTotalCount: number;
};

function mergeProductsWithInventorySummary(
  products: GetProductsQuery["products"],
  inventoryRows: GetProductInventoryQuery["productInventory"],
): ProductListItem[] {
  const counts = new Map<string, { total: number; available: number }>();
  for (const row of inventoryRows) {
    const pid = String(row.productId);
    const cur = counts.get(pid) ?? { total: 0, available: 0 };
    cur.total += 1;
    if (row.isAvailable) cur.available += 1;
    counts.set(pid, cur);
  }

  return products.map((p) => {
    const c = counts.get(String(p.id)) ?? { total: 0, available: 0 };
    return {
      ...p,
      inventoryAvailableCount: c.available,
      inventoryTotalCount: c.total,
    };
  });
}

export async function getProducts() {
  try {
    const [productsRes, invRes] = await Promise.all([
      papiClient.request(GetProductsDocument),
      papiClient.request(GetProductInventoryDocument).catch(() => null),
    ]);

    const inventoryRows = invRes?.productInventory ?? [];
    const data = mergeProductsWithInventorySummary(
      productsRes.products,
      inventoryRows,
    );

    return { success: true as const, data };
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

export async function getProductInventoryByProduct(productId: string) {
  try {
    const data = await papiClient.request(
      GetProductInventoryByProductDocument,
      { productId },
    );
    return {
      success: true as const,
      data: data.productInventoryByProduct,
    };
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
