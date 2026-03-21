"use client";

import { Burger, Button, Drawer, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBuildingCommunity, IconPuzzle } from "@tabler/icons-react";
import Link from "next/link";

export function NavbarMobileNav() {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <Burger
        opened={opened}
        onClick={toggle}
        hiddenFrom="sm"
        size="sm"
        aria-label={opened ? "Close navigation menu" : "Open navigation menu"}
      />
      <Drawer
        opened={opened}
        onClose={close}
        title="Navigation"
        padding="md"
        position="right"
        zIndex={1100}
      >
        <Stack gap="xs">
          <Button
            component={Link}
            href="/organizations"
            variant="subtle"
            justify="start"
            fullWidth
            leftSection={<IconBuildingCommunity size={18} />}
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
            leftSection={<IconPuzzle size={18} />}
            onClick={close}
          >
            Parts Viewer
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
