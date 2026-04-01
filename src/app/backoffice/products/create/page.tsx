import { Alert, Container, Stack, Text } from "@mantine/core";

import { getParts } from "@/app/actions/parts";
import { CreateProductForm } from "@/components/products/CreateProductForm";

export const metadata = {
  title: "Create Product | Backoffice | Mapfox",
  description: "Create a new product",
};

export default async function CreateProductPage() {
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

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Text component="h1" size="xl" fw={700} mb="sm">
            Create New Product
          </Text>
          <Text c="dimmed">
            Fill in the details below to create a new product
          </Text>
        </div>

        <CreateProductForm parts={partsResult.data} />
      </Stack>
    </Container>
  );
}
