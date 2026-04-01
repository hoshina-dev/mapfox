"use client";

import {
  Alert,
  Button,
  Card,
  Group,
  MultiSelect,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconEdit, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { updatePart } from "@/app/actions/parts";
import type {
  GetPartQuery,
  GetPartsInventoryByPartQuery,
} from "@/libs/api/papi/generated/graphql";

import { PartDetailSection } from "./PartDetailSection";
import { PartImageCarousel } from "./PartImageCarousel";

type PartData = NonNullable<GetPartQuery["part"]>;
type PartsInventoryRow =
  GetPartsInventoryByPartQuery["partsInventoryByPart"][number];

interface CategoryOption {
  id: string;
  name: string;
}

interface BackofficePartDetailProps {
  part: PartData;
  partsInventory: PartsInventoryRow[];
  categories: CategoryOption[];
}

function formatSpecifications(spec: unknown): string {
  if (spec == null) return "";
  if (typeof spec === "string") return spec;
  try {
    return JSON.stringify(spec, null, 2);
  } catch {
    return String(spec);
  }
}

export function BackofficePartDetail({
  part,
  partsInventory,
  categories,
}: BackofficePartDetailProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(part.name);
  const [description, setDescription] = useState(part.description ?? "");
  const [temperatureStage, setTemperatureStage] = useState(
    part.temperatureStage ?? "",
  );
  const [specifications, setSpecifications] = useState(
    formatSpecifications(part.specifications),
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(
    part.categories?.map((c) => c.id) ?? [],
  );

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    if (specifications.trim()) {
      try {
        JSON.parse(specifications);
      } catch {
        setError("Specifications must be valid JSON");
        setLoading(false);
        return;
      }
    }

    try {
      const parsedSpec = specifications.trim()
        ? JSON.parse(specifications)
        : undefined;

      const result = await updatePart(part.id, {
        name: name || undefined,
        description: description || undefined,
        temperatureStage: temperatureStage || undefined,
        specifications: parsedSpec,
        categoryIds,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update part");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(part.name);
    setDescription(part.description ?? "");
    setTemperatureStage(part.temperatureStage ?? "");
    setSpecifications(formatSpecifications(part.specifications));
    setCategoryIds(part.categories?.map((c) => c.id) ?? []);
    setError(null);
    setEditing(false);
  };

  return (
    <Stack gap="xl">
      {part.images.length > 0 && (
        <PartImageCarousel imageUrls={part.images} partName={part.name} />
      )}

      {!editing ? (
        <>
          <Group justify="flex-end">
            <Button
              variant="light"
              leftSection={<IconEdit size={16} />}
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          </Group>
          <PartDetailSection part={part} partsInventory={partsInventory} />
        </>
      ) : (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>Edit Part</Title>
              <Button
                variant="subtle"
                color="gray"
                size="compact-sm"
                leftSection={<IconX size={14} />}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </Group>

            {error && (
              <Alert color="red" title="Error">
                {error}
              </Alert>
            )}

            <TextInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              required
            />

            <TextInput
              label="Part Number"
              value={part.partNumber}
              disabled
              description="Part number cannot be changed after creation."
            />

            <TextInput
              label="Manufacturer"
              value={part.manufacturer?.name ?? "—"}
              disabled
              description="Manufacturer cannot be changed after creation."
            />

            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              minRows={3}
            />

            <TextInput
              label="Temperature Stage"
              placeholder="e.g., -40°C to 85°C"
              value={temperatureStage}
              onChange={(e) => setTemperatureStage(e.currentTarget.value)}
            />

            <MultiSelect
              label="Categories"
              data={categoryOptions}
              value={categoryIds}
              onChange={setCategoryIds}
              searchable
            />

            <Textarea
              label="Specifications (JSON)"
              value={specifications}
              onChange={(e) => setSpecifications(e.currentTarget.value)}
              minRows={3}
              styles={{ input: { fontFamily: "monospace" } }}
            />

            <Group justify="flex-end" pt="sm">
              <Button
                variant="default"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} loading={loading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
