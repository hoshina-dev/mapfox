import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";

import type { GetManufacturersQuery } from "@/libs/api/pasta/generated/graphql";

type ManufacturerItem = GetManufacturersQuery["manufacturers"][number];

interface ManufacturerCardProps {
  manufacturer: ManufacturerItem;
}

export function ManufacturerCard({ manufacturer }: ManufacturerCardProps) {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component={Link}
      href={`/manufacturers/${manufacturer.id}`}
      style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
    >
      <Stack gap="sm">
        <Text fw={500} size="lg">
          {manufacturer.name}
        </Text>

        {manufacturer.countryOfOrigin && (
          <Group gap="xs">
            <Text size="sm" fw={500}>
              🌐
            </Text>
            <Badge variant="light" size="sm">
              {manufacturer.countryOfOrigin}
            </Badge>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
