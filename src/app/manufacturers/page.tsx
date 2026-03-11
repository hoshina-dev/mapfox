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

import { getManufacturers } from "@/app/actions/manufacturers";
import { ManufacturersList } from "@/components/manufacturers/ManufacturersList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manufacturers | Mapfox",
  description: "Browse and manage manufacturers",
};

export default async function ManufacturersPage() {
  const result = await getManufacturers();

  if (!result.success) {
    return (
      <Container py="xl">
        <Alert color="red" title="Error loading manufacturers">
          <Text>
            Failed to fetch manufacturers from the API. Please try again later.
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
              Manufacturers
            </Title>
            <Text c="dimmed" size="lg">
              Browse and manage all manufacturers
            </Text>
          </div>
          <Button
            component="a"
            href="/manufacturers/create"
            leftSection={<IconPlus size={16} />}
          >
            Create Manufacturer
          </Button>
        </Flex>

        <ManufacturersList manufacturers={result.data} />

        {result.data.length > 0 && (
          <Text size="sm" c="dimmed" ta="center">
            Showing {result.data.length} manufacturer
            {result.data.length !== 1 ? "s" : ""}
          </Text>
        )}
      </Stack>
    </Container>
  );
}
