"use client";

import { ActionIcon, Button, Group, Tooltip } from "@mantine/core";
import { IconBuildingCommunity, IconPuzzle } from "@tabler/icons-react";
import Link from "next/link";

export function NavbarAppLinks() {
  return (
    <>
      <Group gap={4} visibleFrom="sm" hiddenFrom="lg" wrap="nowrap">
        <Tooltip label="Organizations" position="bottom" zIndex={1100}>
          <ActionIcon
            component={Link}
            href="/organizations"
            variant="subtle"
            size="lg"
            aria-label="Organizations"
          >
            <IconBuildingCommunity size={20} />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Parts Viewer" position="bottom" zIndex={1100}>
          <ActionIcon
            component={Link}
            href="/parts"
            variant="subtle"
            size="lg"
            aria-label="Parts Viewer"
          >
            <IconPuzzle size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Group gap="xs" visibleFrom="lg" wrap="nowrap">
        <Button
          component={Link}
          href="/organizations"
          variant="subtle"
          size="sm"
          leftSection={<IconBuildingCommunity size={16} />}
        >
          Organizations
        </Button>
        <Button
          component={Link}
          href="/parts"
          variant="subtle"
          size="sm"
          leftSection={<IconPuzzle size={16} />}
        >
          Parts Viewer
        </Button>
      </Group>
    </>
  );
}
