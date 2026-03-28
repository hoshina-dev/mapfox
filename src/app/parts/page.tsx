import { Alert, Container, Flex, Stack, Text, Title } from "@mantine/core";

import { getParts } from "@/app/actions/parts";
import { PartsList } from "@/components/parts/PartsList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Parts | Mapfox",
  description: "Browse and manage parts",
};

export default async function PartsPage() {
  const result = await getParts();

  if (!result.success) {
    return (
      <Container py="xl">
        <Alert color="red" title="Error loading parts">
          <Text>
            Failed to fetch parts from the API. Please try again later.
          </Text>
          <Text size="sm">{result.error}</Text>
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
              Parts
            </Title>
            <Text c="dimmed" size="lg">
              Browse the parts catalog and stock
            </Text>
          </div>
          {/* <Button
            component="a"
            href="/parts/create"
            leftSection={<IconPlus size={16} />}
          >
            Create Part
          </Button> */}
        </Flex>

        <PartsList parts={result.data} />

        {result.data.length > 0 && (
          <Text size="sm" c="dimmed" ta="center">
            Showing {result.data.length} part
            {result.data.length !== 1 ? "s" : ""}
          </Text>
        )}
      </Stack>
    </Container>
  );
}
