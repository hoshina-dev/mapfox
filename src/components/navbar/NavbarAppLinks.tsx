"use client";

import { ActionIcon, Button, Group, Tooltip } from "@mantine/core";
import { IconBuildingCommunity, IconPuzzle } from "@tabler/icons-react";
import Link from "next/link";

export function NavbarAppLinks() {
  return (
    <>
      <Group gap={4} visibleFrom="sm" hiddenFrom="md" wrap="nowrap">
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
        <Tooltip label="Catalog" position="bottom" zIndex={1100}>
          <ActionIcon
            component={Link}
            href="/catalog"
            variant="subtle"
            size="lg"
            aria-label="Catalog"
          >
            <IconPuzzle size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Group gap="xs" visibleFrom="md" wrap="nowrap">
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
          href="/catalog"
          variant="subtle"
          size="sm"
          leftSection={<IconPuzzle size={16} />}
        >
          Catalog
        </Button>
      </Group>
    </>
  );
}
