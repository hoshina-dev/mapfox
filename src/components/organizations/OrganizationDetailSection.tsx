"use client";

import { ActionIcon, Card, Group, Stack, Title } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { useState } from "react";

import type { OrganizationResponse } from "@/libs/generated/custapi";

import { OrganizationEditForm } from "./OrganizationEditForm";

interface OrganizationDetailSectionProps {
  organization: OrganizationResponse;
  children: React.ReactNode;
}

export function OrganizationDetailSection({
  organization,
  children,
}: OrganizationDetailSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Edit Organization</Title>
          <OrganizationEditForm
            organization={organization}
            onCancel={() => setIsEditing(false)}
          />
        </Stack>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={3}>Details</Title>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={() => setIsEditing(true)}
            aria-label="Edit organization"
          >
            <IconPencil size={20} />
          </ActionIcon>
        </Group>
        {children}
      </Stack>
    </Card>
  );
}
