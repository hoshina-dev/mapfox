import { Alert, Container, Stack, Text, Title } from "@mantine/core";

import { OrganizationsList } from "@/components/organizations/OrganizationsList";
import { organizationsApi } from "@/libs/apiClient";

export default async function OrganizationsPage() {
  let data;
  let error;

  try {
    data = await organizationsApi.organizationsGet();
  } catch (e) {
    error = e;
  }

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
        <div>
          <Title order={1} mb="xs">
            Organizations
          </Title>
          <Text c="dimmed" size="lg">
            Browse all organizations in the system
          </Text>
        </div>

        <OrganizationsList organizations={data || []} />

        {data && data.length > 0 && (
          <Text size="sm" c="dimmed" ta="center">
            Showing {data.length} organization{data.length !== 1 ? "s" : ""}
          </Text>
        )}
      </Stack>
    </Container>
  );
}
