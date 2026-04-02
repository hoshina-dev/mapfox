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

import { getAllPartsInventory } from "@/app/actions/parts";
import { getProductInventoryItem } from "@/app/actions/products";
import { ProductInventoryDetail } from "@/components/inventory/ProductInventoryDetail";

export const dynamic = "force-dynamic";

interface ProductInventoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductInventoryDetailPage({
  params,
}: ProductInventoryDetailPageProps) {
  const { id } = await params;
  const [itemResult, partsInvResult] = await Promise.all([
    getProductInventoryItem(id),
    getAllPartsInventory(),
  ]);

  if (!itemResult.success) {
    if (itemResult.error === "Product inventory item not found") {
      notFound();
    }

    return (
      <Container py="xl">
        <Alert color="red" title="Error loading inventory item">
          <Text>
            Failed to fetch inventory item details. Please try again later.
          </Text>
          <Text size="sm">{itemResult.error}</Text>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Group gap="sm" mb="xs">
            <Link
              href="/backoffice/inventory/products"
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="subtle"
                size="compact-sm"
                leftSection={<IconArrowLeft size={14} />}
              >
                Back to Product Inventory
              </Button>
            </Link>
          </Group>
          <Title order={1}>
            {itemResult.data.product?.name ?? "Product Unit"} —{" "}
            {itemResult.data.serialNumber}
          </Title>
        </div>

        <ProductInventoryDetail
          item={itemResult.data}
          availablePartUnits={partsInvResult.success ? partsInvResult.data : []}
        />
      </Stack>
    </Container>
  );
}
