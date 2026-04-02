"use client";

import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  deletePartsInventoryItem,
  updatePartsInventoryItem,
} from "@/app/actions/parts";
import type { GetPartsInventoryItemQuery } from "@/libs/api/papi/generated/graphql";

type InventoryItem = NonNullable<
  GetPartsInventoryItemQuery["partsInventoryItem"]
>;

interface EditPartsInventoryFormProps {
  item: InventoryItem;
}

export function EditPartsInventoryForm({ item }: EditPartsInventoryFormProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [serialNumber, setSerialNumber] = useState(item.serialNumber);
  const [isAvailable, setIsAvailable] = useState(item.isAvailable);
  const [notes, setNotes] = useState(item.notes ?? "");

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const result = await updatePartsInventoryItem(item.id, {
      serialNumber: serialNumber.trim() || undefined,
      isAvailable,
      notes: notes.trim() || undefined,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setEditing(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this inventory unit?"))
      return;

    setLoading(true);
    const result = await deletePartsInventoryItem(item.id);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/backoffice/inventory/parts");
  };

  return (
    <Stack gap="lg">
      {error && (
        <Alert color="red" title="Error">
          {error}
        </Alert>
      )}

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={3}>Unit Details</Title>
            <Group>
              {editing ? (
                <Button
                  variant="subtle"
                  size="compact-sm"
                  leftSection={<IconX size={14} />}
                  onClick={() => {
                    setEditing(false);
                    setSerialNumber(item.serialNumber);
                    setIsAvailable(item.isAvailable);
                    setNotes(item.notes ?? "");
                  }}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  variant="subtle"
                  size="compact-sm"
                  leftSection={<IconEdit size={14} />}
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              )}
              <Button
                variant="subtle"
                color="red"
                size="compact-sm"
                leftSection={<IconTrash size={14} />}
                onClick={handleDelete}
                loading={loading && !editing}
              >
                Delete
              </Button>
            </Group>
          </Group>

          <div>
            <Text size="sm" c="dimmed">
              Part
            </Text>
            <Text fw={500}>
              {item.part?.name ?? "Unknown"}{" "}
              {item.part?.partNumber && (
                <Text span c="dimmed" size="sm">
                  ({item.part.partNumber})
                </Text>
              )}
            </Text>
          </div>

          {editing ? (
            <>
              <TextInput
                label="Serial Number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.currentTarget.value)}
                required
              />

              <Switch
                label="Available"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.currentTarget.checked)}
              />

              <Textarea
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.currentTarget.value)}
                autosize
                minRows={2}
              />

              <Group>
                <Button onClick={handleSave} loading={loading}>
                  Save
                </Button>
              </Group>
            </>
          ) : (
            <>
              <div>
                <Text size="sm" c="dimmed">
                  Serial Number
                </Text>
                <Text fw={500} ff="monospace">
                  {item.serialNumber}
                </Text>
              </div>

              <div>
                <Text size="sm" c="dimmed">
                  Status
                </Text>
                <Badge
                  color={item.isAvailable ? "green" : "red"}
                  variant="light"
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>

              {item.notes && (
                <div>
                  <Text size="sm" c="dimmed">
                    Notes
                  </Text>
                  <Text>{item.notes}</Text>
                </div>
              )}
            </>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
