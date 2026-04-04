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
import { useDisclosure } from "@mantine/hooks";
import { IconHome, IconLayoutDashboard, IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { logout } from "@/app/actions/auth";

interface UserMenuProps {
  name: string;
  avatarUrl?: string;
  isAdmin?: boolean;
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

export function UserMenu({ name, avatarUrl, isAdmin = false }: UserMenuProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [opened, { close, toggle }] = useDisclosure(false);

  const displayName = getDisplayName(name);
  const initials = getInitials(name);

  const handleNavigate = (path: string) => {
    close();
    router.push(path);
  };

  const handleLogout = () => {
    close();
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <Popover
      width={200}
      position="bottom-end"
      shadow="md"
      zIndex={1100}
      opened={opened}
      onChange={(o) => {
        if (!o) close();
      }}
      middlewares={{ flip: false, shift: { padding: 8 } }}
    >
      <PopoverTarget>
        <UnstyledButton onClick={toggle}>
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
            onClick={() => handleNavigate("/home")}
          >
            Home
          </Button>
          {isAdmin && (
            <Button
              variant="subtle"
              leftSection={<IconLayoutDashboard size={16} />}
              justify="start"
              fullWidth
              onClick={() => handleNavigate("/backoffice")}
            >
              Backoffice
            </Button>
          )}
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
