"use client";

import { SimpleGrid, Text } from "@mantine/core";

import type { GetManufacturersQuery } from "@/libs/api/papi/generated/graphql";

import { ManufacturerCard } from "./ManufacturerCard";

type ManufacturerItem = GetManufacturersQuery["manufacturers"][number];

interface ManufacturersListProps {
  manufacturers: ManufacturerItem[];
}

export function ManufacturersList({ manufacturers }: ManufacturersListProps) {
  if (manufacturers.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No manufacturers in the catalog yet.
      </Text>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
      {manufacturers.map((manufacturer) => (
        <ManufacturerCard key={manufacturer.id} manufacturer={manufacturer} />
      ))}
    </SimpleGrid>
  );
}
