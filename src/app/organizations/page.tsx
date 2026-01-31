import {
  Alert,
  Container,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  Title,
} from "@mantine/core";
import { IconBuildingCommunity, IconMap } from "@tabler/icons-react";

import { OrganizationMap } from "@/components/map/OrganizationMap";
import { OrganizationsList } from "@/components/organizations/OrganizationsList";
import { organizationsApi } from "@/libs/apiClient";

export const dynamic = "force-dynamic";

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

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTab
              value="all"
              leftSection={<IconBuildingCommunity size={14} />}
            >
              All Organizations
            </TabsTab>
            <TabsTab value="map" leftSection={<IconMap size={14} />}>
              Map
            </TabsTab>
          </TabsList>

          <TabsPanel value="all">
            <Stack gap="xl" pt="xl">
              <OrganizationsList organizations={data || []} />

              {data && data.length > 0 && (
                <Text size="sm" c="dimmed" ta="center">
                  Showing {data.length} organization
                  {data.length !== 1 ? "s" : ""}
                </Text>
              )}
            </Stack>
          </TabsPanel>

          <TabsPanel value="map">
            <OrganizationMap organizations={data || []} />
          </TabsPanel>
        </Tabs>
      </Stack>
    </Container>
  );
}
