import {
  Alert,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { notFound } from "next/navigation";

import {
  getProduct,
  getProductInventoryByProduct,
} from "@/app/actions/products";
import { ProductDetailSection } from "@/components/products/ProductDetailSection";
import { Models3DSection } from "@/components/viewer/Models3DSection";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CatalogProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [result, inventoryResult] = await Promise.all([
    getProduct(id),
    getProductInventoryByProduct(id),
  ]);

  if (!result.success) {
    if (result.error === "Product not found") {
      notFound();
    }

    return (
      <Container py="xl">
        <Alert color="red" title="Error loading product">
          <Text>Failed to fetch product details. Please try again later.</Text>
          <Text size="sm">{result.error}</Text>
        </Alert>
      </Container>
    );
  }

  const product = result.data;

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Group gap="sm" mb="xs">
            <Button
              component="a"
              href="/catalog/products"
              variant="subtle"
              size="compact-sm"
              leftSection={<IconArrowLeft size={14} />}
            >
              Back to Products
            </Button>
          </Group>
          <Title order={1}>{product.name}</Title>
        </div>

        <ProductDetailSection
          product={product}
          productInventory={
            inventoryResult.success ? inventoryResult.data : undefined
          }
        />
        <Models3DSection models3D={product.models3D} />
      </Stack>
    </Container>
  );
}
