"use client";

import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createManufacturer } from "@/app/actions/manufacturers";
import type { GetManufacturerQuery } from "@/libs/api/pasta/generated/graphql";

type ManufacturerData = NonNullable<GetManufacturerQuery["manufacturer"]>;

interface ManufacturerDetailSectionProps {
  manufacturer: ManufacturerData;
}

export function ManufacturerDetailSection({
  manufacturer,
}: ManufacturerDetailSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Edit Manufacturer</Title>
          <ManufacturerEditForm
            manufacturer={manufacturer}
            onCancel={() => setIsEditing(false)}
          />
        </Stack>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={3}>Details</Title>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={() => setIsEditing(true)}
            aria-label="Edit manufacturer"
          >
            <IconPencil size={20} />
          </ActionIcon>
        </Group>

        <Stack gap="sm">
          <div>
            <Text size="sm" c="dimmed">
              Name
            </Text>
            <Text fw={500}>{manufacturer.name}</Text>
          </div>

          {manufacturer.countryOfOrigin && (
            <div>
              <Text size="sm" c="dimmed">
                Country of Origin
              </Text>
              <Badge variant="light" size="lg">
                {manufacturer.countryOfOrigin}
              </Badge>
            </div>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}

// Note: The Pasta API doesn't have an updateManufacturer mutation,
// so we re-create (this is a display-only edit form for now)
function ManufacturerEditForm({
  manufacturer,
  onCancel,
}: {
  manufacturer: ManufacturerData;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(manufacturer.name);
  const [countryOfOrigin, setCountryOfOrigin] = useState(
    manufacturer.countryOfOrigin || "",
  );

  const hasChanged =
    name !== manufacturer.name ||
    countryOfOrigin !== (manufacturer.countryOfOrigin || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Note: Pasta API only has createManufacturer, no update mutation
      const result = await createManufacturer({
        name,
        countryOfOrigin: countryOfOrigin || undefined,
      });

      if (!result.success) {
        setError(result.error || "Failed to update manufacturer");
        return;
      }

      router.push(`/manufacturers/${result.data.id}`);
      router.refresh();
      onCancel();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update manufacturer",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert color="red" title="Error" mb="md">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Manufacturer Name"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <TextInput
            label="Country of Origin (3 Letter ISO Code)"
            placeholder="e.g., JPN, USA, DEU"
            value={countryOfOrigin}
            onChange={(e) => setCountryOfOrigin(e.currentTarget.value)}
          />

          <Group justify="flex-end">
            <Button variant="default" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!hasChanged || !name.trim()}
            >
              Save as New Manufacturer
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  );
}
