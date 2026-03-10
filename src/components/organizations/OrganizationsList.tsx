"use client";

import { Alert, SimpleGrid, Text } from "@mantine/core";
import { useMemo } from "react";

import type { OrganizationResponse } from "@/libs/api/custapi";

import { OrganizationCard } from "./OrganizationCard";

interface OrganizationsListProps {
  organizations: OrganizationResponse[];
  userOrganizationIds?: string[];
}

export function OrganizationsList({
  organizations,
  userOrganizationIds,
}: OrganizationsListProps) {
  const sorted = useMemo(() => {
    if (!userOrganizationIds || userOrganizationIds.length === 0) {
      return organizations;
    }
    const idSet = new Set(userOrganizationIds);
    return [...organizations].sort((a, b) => {
      const aIsMember = idSet.has(a.id) ? 0 : 1;
      const bIsMember = idSet.has(b.id) ? 0 : 1;
      return aIsMember - bIsMember;
    });
  }, [organizations, userOrganizationIds]);

  if (!organizations || organizations.length === 0) {
    return (
      <Alert color="blue" title="No organizations found">
        <Text>There are currently no organizations to display.</Text>
      </Alert>
    );
  }

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
      spacing="lg"
      verticalSpacing="lg"
    >
      {sorted.map((org) => (
        <OrganizationCard
          key={org.id}
          organization={org}
          isUserOrganization={
            !!userOrganizationIds && userOrganizationIds.includes(org.id)
          }
        />
      ))}
    </SimpleGrid>
  );
}
