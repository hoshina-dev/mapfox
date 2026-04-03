import { Badge, Card, Group, Image, Stack, Text } from "@mantine/core";
import Link from "next/link";

import type { PartListItem } from "@/app/actions/parts";

interface PartCardProps {
  part: PartListItem;
}

export function PartCard({ part }: PartCardProps) {
  const imageUrl = part.images.length > 0 ? part.images[0] : undefined;
  const { inventoryAvailableCount, inventoryTotalCount } = part;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component={Link}
      href={`/catalog/parts/${part.id}`}
      style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
    >
      {imageUrl && (
        <Card.Section>
          <Image
            src={imageUrl}
            height={160}
            alt={part.name}
            fallbackSrc="https://placehold.co/400x160?text=No+Image"
          />
        </Card.Section>
      )}

      <Stack gap="sm" mt="md">
        <Text fw={500} size="lg">
          {part.name}
        </Text>

        <Text size="sm" c="dimmed">
          Part #: {part.partNumber}
        </Text>

        {part.manufacturer && (
          <Group gap="xs">
            <Text size="sm" fw={500}>
              Manufacturer:
            </Text>
            <Text size="sm">{part.manufacturer.name}</Text>
          </Group>
        )}

        {part.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {part.description}
          </Text>
        )}

        <Group gap="xs">
          <Badge variant="light" size="sm" color="gray">
            Stock: {inventoryAvailableCount}/{inventoryTotalCount} available
          </Badge>
        </Group>

        {part.categories && part.categories.length > 0 && (
          <Group gap="xs">
            {part.categories.map((cat) => (
              <Badge key={cat.id} variant="outline" size="xs">
                {cat.name}
              </Badge>
            ))}
          </Group>
        )}
      </Stack>
    </Card>
  );
}
