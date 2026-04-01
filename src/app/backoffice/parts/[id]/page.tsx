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

import { getCategories } from "@/app/actions/categories";
import { getPart } from "@/app/actions/parts";
import { BackofficePartDetail } from "@/components/parts/BackofficePartDetail";

export const dynamic = "force-dynamic";

interface BackofficePartDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BackofficePartDetailPage({
  params,
}: BackofficePartDetailPageProps) {
  const { id } = await params;
  const [partResult, categoriesResult] = await Promise.all([
    getPart(id),
    getCategories(),
  ]);

  if (!partResult.success) {
    if (partResult.error === "Part not found") {
      notFound();
    }

    return (
      <Container py="xl">
        <Alert color="red" title="Error loading part">
          <Text>Failed to fetch part details. Please try again later.</Text>
          <Text size="sm">{partResult.error}</Text>
        </Alert>
      </Container>
    );
  }

  const { part, partsInventory } = partResult.data;

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Group gap="sm" mb="xs">
            <Link href="/backoffice/parts" style={{ textDecoration: "none" }}>
              <Button
                variant="subtle"
                size="compact-sm"
                leftSection={<IconArrowLeft size={14} />}
              >
                Back to Parts
              </Button>
            </Link>
          </Group>
          <Title order={1}>{part.name}</Title>
        </div>

        <BackofficePartDetail
          part={part}
          partsInventory={partsInventory}
          categories={categoriesResult.success ? categoriesResult.data : []}
        />
      </Stack>
    </Container>
  );
}
