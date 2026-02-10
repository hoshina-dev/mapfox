"use client";

import { ActionIcon } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export function BackToOrganizationsButton() {
  return (
    <ActionIcon
      component={Link}
      href="/organizations"
      variant="subtle"
      size="lg"
      aria-label="Back to organizations"
    >
      <IconArrowLeft size={20} />
    </ActionIcon>
  );
}
