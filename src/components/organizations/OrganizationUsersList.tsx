import {
  Avatar,
  Badge,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";

import type { UserWithRoleResponse } from "@/libs/generated/custapi";

interface OrganizationUsersListProps {
  users: UserWithRoleResponse[];
  currentUserId?: string;
}

export function OrganizationUsersList({
  users,
  currentUserId,
}: OrganizationUsersListProps) {
  if (users.length === 0) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text c="dimmed" ta="center">
          No users found in this organization.
        </Text>
      </Card>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
      {users.map((user) => (
        <Card key={user.id} shadow="sm" padding="md" radius="md" withBorder>
          <Stack gap="sm">
            <Group gap="sm">
              <Avatar
                src={user.avatarUrl}
                alt={user.name}
                radius="xl"
                size="lg"
              />
              <div style={{ flex: 1 }}>
                <Text fw={500} lineClamp={1}>
                  {user.name}
                </Text>
                <Text size="sm" c="dimmed" lineClamp={1}>
                  {user.email}
                </Text>
              </div>
            </Group>

            {(user.role === "admin" || currentUserId === user.id) && (
              <Group gap="xs">
                {user.role === "admin" && (
                  <Badge color="blue" variant="light" size="sm">
                    Admin
                  </Badge>
                )}
                {currentUserId === user.id && (
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
      ))}
    </SimpleGrid>
  );
}
