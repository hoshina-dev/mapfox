import { Card, Flex, Group, Image, Stack, Text } from "@mantine/core";
import Link from "next/link";

import type { OrganizationResponse } from "@/libs/generated/custapi";

interface OrganizationCardProps {
  organization: OrganizationResponse;
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const imageUrl =
    organization.imageUrls && organization.imageUrls.length > 0
      ? organization.imageUrls[0]
      : undefined;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      component={Link}
      href={`/organization/${organization.id}`}
      style={{ cursor: "pointer", textDecoration: "none", color: "inherit" }}
    >
      {imageUrl && (
        <Card.Section>
          <Image
            src={imageUrl}
            height={160}
            alt={organization.name || "Organization"}
            fallbackSrc="https://placehold.co/400x160?text=No+Image"
          />
        </Card.Section>
      )}

      <Stack gap="sm" mt="md">
        <Flex direction="column" align="flex-start">
          <Text fw={500} size="lg">
            {organization.name}
          </Text>
        </Flex>

        {organization.description && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {organization.description}
          </Text>
        )}

        {organization.address && (
          <Group gap="xs">
            <Text size="sm" fw={500}>
              📍
            </Text>
            <Text size="sm">{organization.address}</Text>
          </Group>
        )}

        {organization.lat !== undefined && organization.lng !== undefined && (
          <Group gap="xs">
            <Text size="sm" fw={500}>
              🌐
            </Text>
            <Text size="sm" c="dimmed">
              {organization.lat.toFixed(4)}, {organization.lng.toFixed(4)}
            </Text>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
