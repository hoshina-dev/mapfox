"use client";

import { Badge, Card, Stack, Text, Title } from "@mantine/core";

import type { GetManufacturerQuery } from "@/libs/api/papi/generated/graphql";

type ManufacturerData = NonNullable<GetManufacturerQuery["manufacturer"]>;

interface ManufacturerDetailSectionProps {
  manufacturer: ManufacturerData;
}

export function ManufacturerDetailSection({
  manufacturer,
}: ManufacturerDetailSectionProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={3}>Details</Title>

        <Stack gap="sm">
          <div>
            <Text size="sm" c="dimmed">
              Name
            </Text>
            <Text fw={500}>{manufacturer.name}</Text>
          </div>

          {manufacturer.countryOfOrigin && (
            <div>
              <Text size="sm" c="dimmed">
                Country of Origin
              </Text>
              <Badge variant="light" size="lg">
                {manufacturer.countryOfOrigin}
              </Badge>
            </div>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
