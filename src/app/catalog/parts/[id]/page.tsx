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

import { getPart } from "@/app/actions/parts";
import { PartDetailSection } from "@/components/parts/PartDetailSection";
import { PartImageCarousel } from "@/components/parts/PartImageCarousel";
import { Models3DSection } from "@/components/viewer/Models3DSection";

interface PartPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CatalogPartPage({ params }: PartPageProps) {
  const { id } = await params;
  const partResult = await getPart(id);

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
            <Button
              component="a"
              href="/catalog/parts"
              variant="subtle"
              size="compact-sm"
              leftSection={<IconArrowLeft size={14} />}
            >
              Back to Parts
            </Button>
          </Group>
          <Title order={1}>{part.name}</Title>
        </div>

        {part.images.length > 0 && (
          <PartImageCarousel imageUrls={part.images} partName={part.name} />
        )}

        <PartDetailSection part={part} partsInventory={partsInventory} />
        <Models3DSection models3D={part.models3D} />
      </Stack>
    </Container>
  );
}
