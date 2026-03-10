import { Badge, Card, Group, Image, Stack, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import Link from "next/link";

import type { GetPartsQuery } from "@/libs/api/pasta/generated/graphql";

type PartItem = GetPartsQuery["parts"][number];

interface PartCardProps {
  part: PartItem;
}

export function PartCard({ part }: PartCardProps) {
  const imageUrl = part.images.length > 0 ? part.images[0] : undefined;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component={Link}
      href={`/parts/${part.id}`}
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
          <Badge
            color={part.isAvailable ? "green" : "red"}
            variant="light"
            size="sm"
            leftSection={
              part.isAvailable ? <IconCheck size={12} /> : <IconX size={12} />
            }
          >
            {part.isAvailable ? "Available" : "Unavailable"}
          </Badge>

          <Badge variant="light" size="sm" color="blue">
            {part.condition}
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
