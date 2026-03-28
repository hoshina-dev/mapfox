"use server";

import {
  GetPartDocument,
  type GetPartQuery,
  GetPartsDocument,
  GetPartsInventoryByPartDocument,
  type GetPartsInventoryByPartQuery,
  GetPartsInventoryDocument,
  type GetPartsInventoryQuery,
  type GetPartsQuery,
} from "@/libs/api/papi/generated/graphql";
import { papiClient } from "@/libs/apiClient";

export type PartListItem = GetPartsQuery["parts"][number] & {
  inventoryAvailableCount: number;
  inventoryTotalCount: number;
};

function mergePartsWithInventorySummary(
  parts: GetPartsQuery["parts"],
  inventoryRows: GetPartsInventoryQuery["partsInventory"],
): PartListItem[] {
  const counts = new Map<string, { total: number; available: number }>();
  for (const row of inventoryRows) {
    const pid = String(row.partId);
    const cur = counts.get(pid) ?? { total: 0, available: 0 };
    cur.total += 1;
    if (row.isAvailable) cur.available += 1;
    counts.set(pid, cur);
  }

  return parts.map((p) => {
    const c = counts.get(String(p.id)) ?? { total: 0, available: 0 };
    return {
      ...p,
      inventoryAvailableCount: c.available,
      inventoryTotalCount: c.total,
    };
  });
}

export async function getParts() {
  try {
    const [partsRes, invRes] = await Promise.all([
      papiClient.request(GetPartsDocument),
      papiClient.request(GetPartsInventoryDocument).catch(() => null),
    ]);

    const inventoryRows = invRes?.partsInventory ?? [];
    const data = mergePartsWithInventorySummary(partsRes.parts, inventoryRows);

    return { success: true as const, data };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to fetch parts",
    };
  }
}

export type PartDetailPayload = {
  part: NonNullable<GetPartQuery["part"]>;
  partsInventory: GetPartsInventoryByPartQuery["partsInventoryByPart"];
};

export async function getPart(id: string) {
  try {
    const [partData, invData] = await Promise.all([
      papiClient.request(GetPartDocument, { id }),
      papiClient.request(GetPartsInventoryByPartDocument, { partId: id }),
    ]);

    if (!partData.part) {
      return { success: false as const, error: "Part not found" };
    }

    return {
      success: true as const,
      data: {
        part: partData.part,
        partsInventory: invData.partsInventoryByPart,
      } satisfies PartDetailPayload,
    };
  } catch (error) {
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Failed to fetch part",
    };
  }
}
