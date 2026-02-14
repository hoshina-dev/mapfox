"use server";

import { FilterCoordinatesByBoundaryDocument } from "@/graphql/generated/graphql";
import { gapiClient } from "@/libs/apiClient";
import { OrganizationResponse } from "@/libs/generated/custapi";

export async function filterOrganizationsByBoundary(
  organizations: OrganizationResponse[],
  boundaryId: string,
): Promise<OrganizationResponse[]> {
  // Convert organizations to coordinate inputs with unique IDs
  const coordinates = organizations
    .filter((org) => org.id != null && org.lat != null && org.lng != null)
    .map((org) => ({
      id: org.id!,
      lat: org.lat!,
      lon: org.lng!, // Note: GraphQL uses 'lon' while custapi uses 'lng'
    }));

  if (coordinates.length === 0) {
    return [];
  }

  try {
    // Call GAPI to filter coordinates by boundary
    const result = await gapiClient.request(
      FilterCoordinatesByBoundaryDocument,
      {
        coordinates,
        boundaryId,
      },
    );

    const filteredIds = new Set(
      result.filterCoordinatesByBoundary.map((coord) => coord.id),
    );

    // Filter organizations by matching IDs from the query result
    const filteredOrgs = organizations.filter(
      (org) => org.id != null && filteredIds.has(org.id),
    );

    return filteredOrgs;
  } catch (error) {
    console.error("Error filtering organizations by boundary:", error);
    return [];
  }
}
