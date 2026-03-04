"use client";

import { Alert, SimpleGrid, Text } from "@mantine/core";

import type { OrganizationResponse } from "@/libs/generated/custapi";

import { OrganizationCard } from "./OrganizationCard";

interface OrganizationsListProps {
  organizations: OrganizationResponse[];
  userOrganizationId?: string;
}

export function OrganizationsList({
  organizations,
  userOrganizationId,
}: OrganizationsListProps) {
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
      {organizations.map((org) => (
        <OrganizationCard
          key={org.id}
          organization={org}
          isUserOrganization={
            !!userOrganizationId && org.id === userOrganizationId
          }
        />
      ))}
    </SimpleGrid>
  );
}
