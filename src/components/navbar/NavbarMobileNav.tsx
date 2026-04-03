"use client";

import {
  Burger,
  Button,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Icon3dCubeSphere,
  IconBuildingCommunity,
  IconPuzzle,
} from "@tabler/icons-react";
import Link from "next/link";

export function NavbarMobileNav() {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <Popover
      opened={opened}
      onClose={close}
      position="bottom-start"
      zIndex={1100}
      shadow="md"
      withinPortal
    >
      <PopoverTarget>
        <Burger
          opened={opened}
          onClick={toggle}
          size="sm"
          hiddenFrom="sm"
          color="var(--mantine-color-blue-filled)"
          aria-label={opened ? "Close navigation menu" : "Open navigation menu"}
        />
      </PopoverTarget>
      <PopoverDropdown p="xs" style={{ minWidth: 200 }}>
        <Stack gap={4}>
          <Button
            component={Link}
            href="/organizations"
            variant="subtle"
            justify="start"
            fullWidth
            size="sm"
            leftSection={<IconBuildingCommunity size={16} />}
            onClick={close}
          >
            Organizations
          </Button>
          <Button
            component={Link}
            href="/parts"
            variant="subtle"
            justify="start"
            fullWidth
            size="sm"
            leftSection={<IconPuzzle size={16} />}
            onClick={close}
          >
            Parts Viewer
          </Button>
          <Button
            component={Link}
            href="/demo/models"
            variant="subtle"
            justify="start"
            fullWidth
            size="sm"
            leftSection={<Icon3dCubeSphere size={16} />}
            onClick={close}
          >
            Demo: 3D Viewer
          </Button>
        </Stack>
      </PopoverDropdown>
    </Popover>
  );
}
