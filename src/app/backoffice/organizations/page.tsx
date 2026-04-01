import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export const metadata = {
  title: "Organizations | Backoffice | Mapfox",
  description: "Manage organizations",
};

export default function BackofficeOrganizationsPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Group gap="sm" mb="xs">
            <Link href="/backoffice" style={{ textDecoration: "none" }}>
              <Button
                variant="subtle"
                size="compact-sm"
                leftSection={<IconArrowLeft size={14} />}
              >
                Back to Backoffice
              </Button>
            </Link>
          </Group>
          <Title order={1} mb="xs">
            Organizations
          </Title>
          <Text c="dimmed">Manage organizations from here</Text>
        </div>

        <Group>
          <Link
            href="/backoffice/organizations/create"
            style={{ textDecoration: "none" }}
          >
            <Button leftSection={<IconPlus size={16} />}>
              Create Organization
            </Button>
          </Link>
        </Group>
      </Stack>
    </Container>
  );
}
