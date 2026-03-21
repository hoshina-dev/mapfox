import { Box, Container, Group, Text } from "@mantine/core";
import Link from "next/link";

import { UserRole } from "@/libs/api/custapi";
import { usersApi } from "@/libs/apiClient";
import { getSession } from "@/libs/dal";

import { NavbarAppLinks } from "./NavbarAppLinks";
import { NavbarLoginLink } from "./NavbarLoginLink";
import { NavbarMobileNav } from "./NavbarMobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

export async function Navbar() {
  const session = await getSession();

  let isAdmin = false;
  if (session) {
    try {
      const user = await usersApi.usersIdIdGet(session.userId);
      isAdmin = user.role === UserRole.UserRoleAdmin;
    } catch {
      // ignore
    }
  }

  return (
    <Box
      component="header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "8px 10px",
        pointerEvents: "none",
      }}
    >
      <Container
        size="xl"
        py="xs"
        px={{ base: "xs", sm: "md" }}
        style={{
          pointerEvents: "auto",
          borderRadius: "9999px",
          border:
            "1px solid light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.1))",
          backgroundColor:
            "light-dark(rgba(255, 255, 255, 0.7), rgba(30, 30, 30, 0.7))",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          boxShadow:
            "0 2px 16px light-dark(rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.3))",
        }}
      >
        <Group
          justify="space-between"
          align="center"
          wrap="nowrap"
          gap="xs"
          px={{ base: "xs", sm: "md" }}
        >
          <Link
            href="/"
            style={{ textDecoration: "none", flexShrink: 0, minWidth: 0 }}
          >
            <Text
              fw={800}
              variant="gradient"
              gradient={{ from: "blue", to: "teal", deg: 90 }}
              fz={{ base: "1.05rem", sm: "1.25rem" }}
              lh={1.2}
              truncate
            >
              Mapfox
            </Text>
          </Link>

          <Group gap="xs" wrap="nowrap" justify="flex-end" style={{ flex: 1 }}>
            <NavbarAppLinks />
            <NavbarMobileNav />
            <ThemeToggle />
            {session ? (
              <UserMenu
                name={session.name}
                avatarUrl={session.avatarUrl}
                isAdmin={isAdmin}
              />
            ) : (
              <NavbarLoginLink />
            )}
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
