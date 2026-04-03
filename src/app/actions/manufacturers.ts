"use server";

import { revalidatePath } from "next/cache";

import {
  CreateManufacturerDocument,
  type CreateManufacturerInput,
  DeleteManufacturerDocument,
  GetManufacturerDocument,
  GetManufacturersDocument,
  UpdateManufacturerDocument,
  type UpdateManufacturerInput,
} from "@/libs/api/papi/generated/graphql";
import { papiClient } from "@/libs/apiClient";

export async function getManufacturers() {
  try {
    const data = await papiClient.request(GetManufacturersDocument);
    return { success: true as const, data: data.manufacturers };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch manufacturers",
    };
  }
}

export async function getManufacturer(id: string) {
  try {
    const data = await papiClient.request(GetManufacturerDocument, { id });
    if (!data.manufacturer) {
      return { success: false as const, error: "Manufacturer not found" };
    }
    return { success: true as const, data: data.manufacturer };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to fetch manufacturer",
    };
  }
}

export async function createManufacturer(input: CreateManufacturerInput) {
  try {
    const data = await papiClient.request(CreateManufacturerDocument, {
      input,
    });
    revalidatePath("/backoffice/manufacturers");
    return { success: true as const, data: data.createManufacturer };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create manufacturer",
    };
  }
}

export async function deleteManufacturer(id: string) {
  try {
    await papiClient.request(DeleteManufacturerDocument, { id });
    revalidatePath("/backoffice/manufacturers");
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete manufacturer",
    };
  }
}

export async function updateManufacturer(
  id: string,
  input: UpdateManufacturerInput,
) {
  try {
    const data = await papiClient.request(UpdateManufacturerDocument, {
      id,
      input,
    });
    revalidatePath("/backoffice/manufacturers");
    return { success: true as const, data: data.updateManufacturer };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update manufacturer",
    };
  }
}
