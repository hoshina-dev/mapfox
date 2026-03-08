"use client";

import { Button, Card, Group, Stack, Title } from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";
import { useState } from "react";

import type { UserWithRoleResponse } from "@/libs/generated/custapi";

import { AddMemberModal } from "./AddMemberModal";
import { OrganizationUsersList } from "./OrganizationUsersList";

interface OrganizationMembersSectionProps {
  organizationId: string;
  users: UserWithRoleResponse[];
  isAdmin: boolean;
  currentUserId?: string;
}

export function OrganizationMembersSection({
  organizationId,
  users,
  isAdmin,
  currentUserId,
}: OrganizationMembersSectionProps) {
  const [modalOpened, setModalOpened] = useState(false);

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Title order={3}>Members ({users.length})</Title>
            {isAdmin && (
              <Button
                leftSection={<IconUserPlus size={16} />}
                variant="light"
                size="compact-md"
                onClick={() => setModalOpened(true)}
              >
                Add Member
              </Button>
            )}
          </Group>
          <OrganizationUsersList users={users} currentUserId={currentUserId} />
        </Stack>
      </Card>

      <AddMemberModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        organizationId={organizationId}
        existingMemberIds={users.map((u) => u.id)}
      />
    </>
  );
}
