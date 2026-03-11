import { Box, Button, Container, Group, Text } from "@mantine/core";
import {
  IconBuildingCommunity,
  IconLogin,
  IconPuzzle,
} from "@tabler/icons-react";
import Link from "next/link";

import { getSession } from "@/libs/dal";

import { UserMenu } from "./UserMenu";

export async function Navbar() {
  const session = await getSession();

  return (
    <Box
      component="header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "12px 16px",
        pointerEvents: "none",
      }}
    >
      <Container
        size="xl"
        py="xs"
        px="md"
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
        <Group justify="space-between" align="center" px="md">
          <Group gap="xl">
            <Link href="/" style={{ textDecoration: "none" }}>
              <Text
                size="xl"
                fw={800}
                variant="gradient"
                gradient={{ from: "blue", to: "teal", deg: 90 }}
              >
                Mapfox
              </Text>
            </Link>

            <Group gap="xs" visibleFrom="sm">
              <Button
                component="a"
                href="/organizations"
                variant="subtle"
                size="sm"
                leftSection={<IconBuildingCommunity size={16} />}
              >
                Organizations
              </Button>
              <Button
                component="a"
                href="/parts"
                variant="subtle"
                size="sm"
                leftSection={<IconPuzzle size={16} />}
              >
                Parts Viewer
              </Button>
              {/* <Button
                component="a"
                href="/manufacturers"
                variant="subtle"
                size="sm"
                leftSection={<IconBuildingFactory2 size={16} />}
              >
                Manufacturers
              </Button> */}
            </Group>
          </Group>

          {session ? (
            <UserMenu name={session.name} avatarUrl={session.avatarUrl} />
          ) : (
            <Link href="/login">
              <Button variant="light" leftSection={<IconLogin size={16} />}>
                Login
              </Button>
            </Link>
          )}
        </Group>
      </Container>
    </Box>
  );
}
