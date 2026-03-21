"use client";

import {
  Avatar,
  Button,
  Group,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { IconHome, IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { logout } from "@/app/actions/auth";

interface UserMenuProps {
  name: string;
  avatarUrl?: string;
}

function getDisplayName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1][0]?.toUpperCase() ?? "";
  return `${firstName} ${lastInitial}.`;
}

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return (
    (parts[0][0]?.toUpperCase() ?? "") +
    (parts[parts.length - 1][0]?.toUpperCase() ?? "")
  );
}

export function UserMenu({ name, avatarUrl }: UserMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const displayName = getDisplayName(name);
  const initials = getInitials(name);

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <Popover width={200} position="bottom-end" shadow="md" zIndex={1100}>
      <PopoverTarget>
        <UnstyledButton>
          <Group gap="xs">
            <Avatar
              src={avatarUrl}
              alt={name}
              radius="xl"
              size="md"
              color="blue"
            >
              {initials}
            </Avatar>
            <Text size="sm" fw={500} visibleFrom="sm">
              {displayName}
            </Text>
          </Group>
        </UnstyledButton>
      </PopoverTarget>

      <PopoverDropdown>
        <Stack gap="xs">
          <Button
            variant="subtle"
            leftSection={<IconHome size={16} />}
            justify="start"
            fullWidth
            onClick={() => router.push("/home")}
          >
            Home
          </Button>
          <Button
            variant="subtle"
            color="red"
            leftSection={<IconLogout size={16} />}
            justify="start"
            fullWidth
            onClick={handleLogout}
            loading={isPending}
          >
            Logout
          </Button>
        </Stack>
      </PopoverDropdown>
    </Popover>
  );
}
