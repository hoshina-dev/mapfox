"use server";

import {
  GetManufacturerDocument,
  GetManufacturersDocument,
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
