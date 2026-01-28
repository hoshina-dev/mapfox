"use server";

import { FilterCoordinatesByBoundaryDocument } from "@/graphql/generated/graphql";
import { gapiClient } from "@/libs/apiClient";
import { OrganizationResponse } from "@/libs/generated/custapi";

export async function filterOrganizationsByBoundary(
  organizations: OrganizationResponse[],
  boundaryId: string,
): Promise<OrganizationResponse[]> {
  // Convert organizations to coordinate inputs
  const coordinates = organizations
    .filter((org) => org.lat != null && org.lng != null)
    .map((org) => ({
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

    const filteredCoordinates = result.filterCoordinatesByBoundary;

    // Map filtered coordinates back to organizations
    const filteredOrgs = organizations.filter((org) => {
      if (org.lat == null || org.lng == null) return false;

      return filteredCoordinates.some(
        (coord: { lat: number; lon: number }) =>
          Math.abs(coord.lat - org.lat!) < 0.000001 &&
          Math.abs(coord.lon - org.lng!) < 0.000001,
      );
    });

    return filteredOrgs;
  } catch (error) {
    console.error("Error filtering organizations by boundary:", error);
    return [];
  }
}
