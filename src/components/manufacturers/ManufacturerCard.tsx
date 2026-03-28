import { Badge, Card, Stack, Text } from "@mantine/core";
import Link from "next/link";

import type { GetManufacturersQuery } from "@/libs/api/papi/generated/graphql";

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
          <Badge variant="light" size="sm">
            {manufacturer.countryOfOrigin}
          </Badge>
        )}
      </Stack>
    </Card>
  );
}
