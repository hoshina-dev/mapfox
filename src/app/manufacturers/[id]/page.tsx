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

import { getManufacturer } from "@/app/actions/manufacturers";
import { ManufacturerDetailSection } from "@/components/manufacturers/ManufacturerDetailSection";

interface ManufacturerPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ManufacturerPage({
  params,
}: ManufacturerPageProps) {
  const { id } = await params;
  const result = await getManufacturer(id);

  if (!result.success) {
    if (result.error === "Manufacturer not found") {
      notFound();
    }

    return (
      <Container py="xl">
        <Alert color="red" title="Error loading manufacturer">
          <Text>
            Failed to fetch manufacturer details. Please try again later.
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
            <Button
              component="a"
              href="/manufacturers"
              variant="subtle"
              size="compact-sm"
              leftSection={<IconArrowLeft size={14} />}
            >
              Back to Manufacturers
            </Button>
          </Group>
          <Title order={1}>{result.data.name}</Title>
        </div>

        <ManufacturerDetailSection manufacturer={result.data} />
      </Stack>
    </Container>
  );
}
