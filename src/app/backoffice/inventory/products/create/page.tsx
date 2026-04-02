import { Alert, Container, Stack, Text } from "@mantine/core";

import { getProducts } from "@/app/actions/products";
import { CreateProductInventoryForm } from "@/components/inventory/CreateProductInventoryForm";

export const metadata = {
  title: "Register Product Unit | Backoffice | Mapfox",
  description: "Register a new product inventory unit",
};

export default async function CreateProductInventoryPage() {
  const productsResult = await getProducts();

  if (!productsResult.success) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" title="Error">
          <Text size="sm">Failed to load products: {productsResult.error}</Text>
        </Alert>
      </Container>
    );
  }

  const productOptions = productsResult.data.map((p) => ({
    id: p.id,
    name: p.name,
    version: p.version,
  }));

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Text component="h1" size="xl" fw={700} mb="sm">
            Register Product Unit
          </Text>
          <Text c="dimmed">
            Register a new assembled product unit in inventory
          </Text>
        </div>

        <CreateProductInventoryForm products={productOptions} />
      </Stack>
    </Container>
  );
}
