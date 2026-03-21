"use client";

import { ActionIcon, Button, Tooltip } from "@mantine/core";
import { IconLogin } from "@tabler/icons-react";
import Link from "next/link";

export function NavbarLoginLink() {
  return (
    <>
      <Button
        component={Link}
        href="/login"
        variant="light"
        visibleFrom="sm"
        size="sm"
        leftSection={<IconLogin size={16} />}
      >
        Login
      </Button>
      <Tooltip label="Log in" position="bottom" zIndex={1100}>
        <ActionIcon
          component={Link}
          href="/login"
          variant="light"
          hiddenFrom="sm"
          size="lg"
          aria-label="Log in"
        >
          <IconLogin size={20} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
