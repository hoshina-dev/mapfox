import { Alert, Container, Stack, Text } from "@mantine/core";

import { getParts } from "@/app/actions/parts";
import { CreatePartsInventoryForm } from "@/components/inventory/CreatePartsInventoryForm";

export const metadata = {
  title: "Register Part Unit | Backoffice | Mapfox",
  description: "Register a new part inventory unit",
};

export default async function CreatePartsInventoryPage() {
  const partsResult = await getParts();

  if (!partsResult.success) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" title="Error">
          <Text size="sm">Failed to load parts: {partsResult.error}</Text>
        </Alert>
      </Container>
    );
  }

  const partOptions = partsResult.data.map((p) => ({
    id: p.id,
    name: p.name,
    partNumber: p.partNumber,
  }));

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Text component="h1" size="xl" fw={700} mb="sm">
            Register Part Unit
          </Text>
          <Text c="dimmed">Register a new physical part unit in inventory</Text>
        </div>

        <CreatePartsInventoryForm parts={partOptions} />
      </Stack>
    </Container>
  );
}
