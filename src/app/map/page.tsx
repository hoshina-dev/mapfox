import { Alert, Container, Stack, Text, Title } from "@mantine/core";

import { OrganizationMap } from "@/components/map/OrganizationMap";
import { organizationsApi } from "@/libs/apiClient";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const orgResult = await organizationsApi
    .organizationsGet()
    .then((data) => ({ data, error: null }))
    .catch((e: unknown) => ({ data: null, error: e }));

  const { data, error } = orgResult;

  if (error) {
    return (
      <Container py="xl">
        <Alert color="red" title="Error loading map data">
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
        <div>
          <Title order={1} mb="xs">
            Map Explorer
          </Title>
          <Text c="dimmed" size="lg">
            This page demonstrates the capabilities of our map feature,
            <br />
            allowing you to explore organizations on an interactive map with
            area boundaries, search, and more
          </Text>
        </div>

        <OrganizationMap organizations={data || []} />
      </Stack>
    </Container>
  );
}
