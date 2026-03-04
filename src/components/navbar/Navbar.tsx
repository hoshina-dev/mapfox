import { Box, Button, Container, Group, Text } from "@mantine/core";
import { IconLogin } from "@tabler/icons-react";
import Link from "next/link";

import { getSession } from "@/libs/dal";

import { UserMenu } from "./UserMenu";

export async function Navbar() {
  const session = await getSession();

  return (
    <Box
      component="header"
      style={{
        borderBottom: "1px solid var(--mantine-color-gray-3)",
        backgroundColor: "var(--mantine-color-body)",
      }}
    >
      <Container size="xl" py="sm">
        <Group justify="space-between" align="center">
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
