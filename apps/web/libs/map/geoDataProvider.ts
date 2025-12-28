// GeoDataProvider - GraphQL-based data fetching for map layers
import {
  AdminAreasDocument,
  type AdminAreasQuery,
  ChildrenByCodeDocument,
  type ChildrenByCodeQuery,
} from "@repo/graphql";

import { getApolloClient } from "@/libs/apollo";

import { fixAntimeridianCrossing } from "./geoUtils";
import type { GeoJSONFeatureCollection } from "./types";

interface AdminArea {
  id: string;
  name: string;
  isoCode: string;
  geometry: unknown;
  adminLevel: number;
  parentCode: string | null;
}

/**
 * Transforms GraphQL AdminArea responses to GeoJSON FeatureCollection format
 */
function transformToGeoJSON(adminAreas: AdminArea[]): GeoJSONFeatureCollection {
  const raw: GeoJSONFeatureCollection = {
    type: "FeatureCollection",
    features: adminAreas.map((area) => ({
      type: "Feature" as const,
      id: area.id,
      geometry:
        area.geometry as GeoJSONFeatureCollection["features"][0]["geometry"],
      properties: {
        name: area.name,
        isoCode: area.isoCode,
      },
    })),
  };

  // Fix antimeridian crossing issues for features like Russia, Fiji
  return fixAntimeridianCrossing(raw);
}

/**
 * Loads the world map (Level 0 - all countries)
 */
export async function loadWorldMap(): Promise<GeoJSONFeatureCollection> {
  const client = getApolloClient();

  const { data } = await client.query<AdminAreasQuery>({
    query: AdminAreasDocument,
    variables: { adminLevel: 0 },
  });

  return transformToGeoJSON(data.adminAreas);
}

/**
 * Loads admin boundaries for a specific country (Level 1)
 * @param parentCode - The ISO code of the parent country (e.g., "US", "DE")
 */
export async function loadAdminBoundaries(
  parentCode: string,
): Promise<GeoJSONFeatureCollection | null> {
  const client = getApolloClient();

  try {
    const { data } = await client.query<ChildrenByCodeQuery>({
      query: ChildrenByCodeDocument,
      variables: { parentCode, childLevel: 1 },
    });

    if (!data.childrenByCode.length) {
      return null;
    }

    return transformToGeoJSON(data.childrenByCode);
  } catch (error) {
    console.error(`Failed to load admin boundaries for ${parentCode}:`, error);
    return null;
  }
}
