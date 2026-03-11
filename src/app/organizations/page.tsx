import {
  Alert,
  Button,
  Container,
  Flex,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

import { OrganizationsList } from "@/components/organizations/OrganizationsList";
import { organizationsApi, usersApi } from "@/libs/apiClient";
import { getSession } from "@/libs/dal";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const [session, orgResult] = await Promise.all([
    getSession(),
    organizationsApi
      .organizationsGet()
      .then((data) => ({ data, error: null }))
      .catch((e: unknown) => ({ data: null, error: e })),
  ]);

  const userOrganizationIds: string[] = [];
  if (session?.userId) {
    try {
      const memberships = await usersApi.usersIdIdOrganizationsGet(
        session.userId,
      );
      userOrganizationIds.push(
        ...memberships
          .map((m) => m.organizationId)
          .filter((id): id is string => !!id),
      );
    } catch {
      // Ignore errors fetching memberships
    }
  }

  const { data, error } = orgResult;

  if (error) {
    return (
      <Container py="xl">
        <Alert color="red" title="Error loading organizations">
          <Text>
            Failed to fetch organizations from the API. Please try again later.
          </Text>
          <Text size="sm">{String(error)}</Text>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Flex justify="space-between" align="flex-start" gap="md" wrap="wrap">
          <div>
            <Title order={1} mb="xs">
              Organizations
            </Title>
            <Text c="dimmed" size="lg">
              Browse and manage all organizations
            </Text>
          </div>
          <Button
            component="a"
            href="/organizations/create"
            leftSection={<IconPlus size={16} />}
          >
            Create Organization
          </Button>
        </Flex>

        <OrganizationsList
          organizations={data || []}
          userOrganizationIds={userOrganizationIds}
        />

        {data && data.length > 0 && (
          <Text size="sm" c="dimmed" ta="center">
            Showing {data.length} organization
            {data.length !== 1 ? "s" : ""}
          </Text>
        )}
      </Stack>
    </Container>
  );
}
