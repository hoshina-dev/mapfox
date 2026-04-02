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

import { getPartsInventoryItem } from "@/app/actions/parts";
import { EditPartsInventoryForm } from "@/components/inventory/EditPartsInventoryForm";

export const dynamic = "force-dynamic";

interface PartsInventoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PartsInventoryDetailPage({
  params,
}: PartsInventoryDetailPageProps) {
  const { id } = await params;
  const result = await getPartsInventoryItem(id);

  if (!result.success) {
    if (result.error === "Parts inventory item not found") {
      notFound();
    }

    return (
      <Container py="xl">
        <Alert color="red" title="Error loading inventory item">
          <Text>
            Failed to fetch inventory item details. Please try again later.
          </Text>
          <Text size="sm">{result.error}</Text>
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
              href="/backoffice/inventory/parts"
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="subtle"
                size="compact-sm"
                leftSection={<IconArrowLeft size={14} />}
              >
                Back to Parts Inventory
              </Button>
            </Link>
          </Group>
          <Title order={1}>
            {result.data.part?.name ?? "Part Unit"} — {result.data.serialNumber}
          </Title>
        </div>

        <EditPartsInventoryForm item={result.data} />
      </Stack>
    </Container>
  );
}
