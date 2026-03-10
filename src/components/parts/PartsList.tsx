"use client";

import { SimpleGrid, Text } from "@mantine/core";

import type { GetPartsQuery } from "@/libs/api/pasta/generated/graphql";

import { PartCard } from "./PartCard";

type PartItem = GetPartsQuery["parts"][number];

interface PartsListProps {
  parts: PartItem[];
}

export function PartsList({ parts }: PartsListProps) {
  if (parts.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No parts found. Create one to get started.
      </Text>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
      {parts.map((part) => (
        <PartCard key={part.id} part={part} />
      ))}
    </SimpleGrid>
  );
}
