"use client";

import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalRoot,
  ModalTitle,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconUserMinus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { removeOrganizationMember } from "@/app/actions/removeOrganizationMember";
import { MemberRole, type UserWithRoleResponse } from "@/libs/api/custapi";

interface OrganizationUsersListProps {
  users: UserWithRoleResponse[];
  currentUserId?: string;
  isOrgManager?: boolean;
  organizationId?: string;
}

export function OrganizationUsersList({
  users,
  currentUserId,
  isOrgManager,
  organizationId,
}: OrganizationUsersListProps) {
  const router = useRouter();
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);
  const [confirmUser, setConfirmUser] = useState<UserWithRoleResponse | null>(
    null,
  );

  if (users.length === 0) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text c="dimmed" ta="center">
          No users found in this organization.
        </Text>
      </Card>
    );
  }

  const handleRemoveMember = async () => {
    if (!organizationId || !confirmUser) return;
    setRemovingUserId(confirmUser.id);
    const result = await removeOrganizationMember(
      organizationId,
      confirmUser.id,
    );
    if (result.success) {
      router.refresh();
    }
    setRemovingUserId(null);
    setConfirmUser(null);
  };

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {users.map((user) => {
          const isCurrentUser = currentUserId === user.id;
          const canKick = isOrgManager && organizationId && !isCurrentUser;

          return (
            <Card key={user.id} shadow="sm" padding="md" radius="md" withBorder>
              <Stack gap="sm">
                <Group gap="sm" justify="space-between" wrap="nowrap">
                  <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                    <Avatar
                      src={user.avatarUrl}
                      alt={user.name}
                      radius="xl"
                      size="lg"
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text fw={500} lineClamp={1}>
                        {user.name}
                      </Text>
                      <Text size="sm" c="dimmed" lineClamp={1}>
                        {user.email}
                      </Text>
                    </div>
                  </Group>
                  {canKick && (
                    <Tooltip label="Remove member" withArrow>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="lg"
                        onClick={() => setConfirmUser(user)}
                        aria-label={`Remove ${user.name}`}
                      >
                        <IconUserMinus size={18} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Group>

                {(user.memberRole === MemberRole.RoleManager ||
                  isCurrentUser) && (
                  <Group gap="xs">
                    {user.memberRole === MemberRole.RoleManager && (
                      <Badge color="blue" variant="light" size="sm">
                        Manager
                      </Badge>
                    )}
                    {isCurrentUser && (
                      <Badge color="teal" variant="light" size="sm">
                        You
                      </Badge>
                    )}
                  </Group>
                )}

                {user.description && (
                  <Text size="xs" c="dimmed" lineClamp={2}>
                    {user.description}
                  </Text>
                )}
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>

      <ModalRoot
        opened={!!confirmUser}
        onClose={() => setConfirmUser(null)}
        size="sm"
        zIndex={1100}
      >
        <ModalContent>
          <ModalHeader>
            <ModalTitle fw={600}>Remove Member</ModalTitle>
          </ModalHeader>
          <ModalBody pb="lg">
            <Stack gap="md">
              <Text size="sm">
                Are you sure you want to remove{" "}
                <Text span fw={600}>
                  {confirmUser?.name}
                </Text>{" "}
                from this organization?
              </Text>
              <Group justify="flex-end">
                <Button
                  variant="default"
                  onClick={() => setConfirmUser(null)}
                  disabled={!!removingUserId}
                >
                  Cancel
                </Button>
                <Button
                  color="red"
                  onClick={handleRemoveMember}
                  loading={!!removingUserId}
                >
                  Remove
                </Button>
              </Group>
            </Stack>
          </ModalBody>
        </ModalContent>
      </ModalRoot>
    </>
  );
}
