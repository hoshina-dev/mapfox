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
import Link from "next/link";
import { notFound } from "next/navigation";

import { getProduct } from "@/app/actions/products";
import { BackofficeProductDetail } from "@/components/products/BackofficeProductDetail";

export const dynamic = "force-dynamic";

interface BackofficeProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BackofficeProductDetailPage({
  params,
}: BackofficeProductDetailPageProps) {
  const { id } = await params;
  const result = await getProduct(id);

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
            <Link
              href="/backoffice/products"
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="subtle"
                size="compact-sm"
                leftSection={<IconArrowLeft size={14} />}
              >
                Back to Products
              </Button>
            </Link>
          </Group>
          <Title order={1}>{product.name}</Title>
        </div>

        <BackofficeProductDetail product={product} />
      </Stack>
    </Container>
  );
}
