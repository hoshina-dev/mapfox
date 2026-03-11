"use server";

import { revalidatePath } from "next/cache";

import {
  CreateManufacturerDocument,
  GetManufacturerDocument,
  GetManufacturersDocument,
} from "@/libs/api/pasta/generated/graphql";
import { pastaClient } from "@/libs/apiClient";

export async function getManufacturers() {
  try {
    const data = await pastaClient.request(GetManufacturersDocument);
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
    const data = await pastaClient.request(GetManufacturerDocument, { id });
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

export async function createManufacturer(input: {
  name: string;
  countryOfOrigin?: string;
}) {
  try {
    const data = await pastaClient.request(CreateManufacturerDocument, {
      input: {
        name: input.name,
        countryOfOrigin: input.countryOfOrigin || undefined,
      },
    });

    revalidatePath("/manufacturers");

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
