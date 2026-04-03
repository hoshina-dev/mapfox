"use client";

import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TableTd,
  TableTr,
  Text,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertTriangle, IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  deleteManufacturer,
  updateManufacturer,
} from "@/app/actions/manufacturers";
import { countryOptionsFilter, countrySelectData } from "@/libs/countries";
import { getCountryName } from "@/libs/countries";

interface ManufacturerRowProps {
  manufacturer: {
    id: string;
    name: string;
    countryOfOrigin?: string | null;
  };
}

export function ManufacturerRow({ manufacturer }: ManufacturerRowProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const [name, setName] = useState(manufacturer.name);
  const [countryOfOrigin, setCountryOfOrigin] = useState(
    manufacturer.countryOfOrigin ?? "",
  );

  const handleCancel = () => {
    setEditing(false);
    setError(null);
    setName(manufacturer.name);
    setCountryOfOrigin(manufacturer.countryOfOrigin ?? "");
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateManufacturer(manufacturer.id, {
        name,
        countryOfOrigin: countryOfOrigin || undefined,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update manufacturer",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteManufacturer(manufacturer.id);
      if (!result.success) {
        setError(result.error);
        closeDelete();
        return;
      }
      closeDelete();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete manufacturer",
      );
      closeDelete();
    } finally {
      setLoading(false);
    }
  };

  if (editing) {
    return (
      <TableTr>
        <TableTd colSpan={3}>
          <Stack gap="sm" py="xs">
            {error && (
              <Alert color="red" title="Error">
                {error}
              </Alert>
            )}
            <Alert
              color="orange"
              icon={<IconAlertTriangle size={16} />}
              title="Warning"
            >
              Editing this manufacturer will affect all parts associated with
              it.
            </Alert>
            <TextInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              required
            />
            <Select
              label="Country of Origin"
              data={countrySelectData}
              value={countryOfOrigin || null}
              onChange={(val) => setCountryOfOrigin(val ?? "")}
              filter={countryOptionsFilter}
              searchable
              clearable
            />
            <Group justify="flex-end">
              <Button
                variant="default"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={loading}
                disabled={!name || loading}
              >
                Save
              </Button>
            </Group>
          </Stack>
        </TableTd>
      </TableTr>
    );
  }

  return (
    <>
      <Modal
        opened={deleteOpened}
        onClose={closeDelete}
        title="Delete Manufacturer"
        centered
      >
        <Stack gap="md">
          <Alert
            color="orange"
            icon={<IconAlertTriangle size={16} />}
            title="Warning"
          >
            Deleting this manufacturer will affect all parts associated with it.
          </Alert>
          <Text>
            Are you sure you want to delete{" "}
            <Text component="span" fw={700}>
              {manufacturer.name}
            </Text>
            ? This action cannot be undone.
          </Text>
          {error && (
            <Alert color="red" title="Error">
              {error}
            </Alert>
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDelete} disabled={loading}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDelete}
              loading={loading}
              leftSection={<IconTrash size={16} />}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>

      <TableTr>
        <TableTd>
          <Text fw={500}>{manufacturer.name}</Text>
        </TableTd>
        <TableTd>
          {manufacturer.countryOfOrigin ? (
            <Badge variant="light">
              {getCountryName(manufacturer.countryOfOrigin) ??
                manufacturer.countryOfOrigin}
            </Badge>
          ) : (
            <Text c="dimmed" size="sm">
              —
            </Text>
          )}
        </TableTd>
        <TableTd>
          <Group gap="xs" justify="flex-end">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => setEditing(true)}
              title="Edit"
            >
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={openDelete}
              title="Delete"
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </TableTd>
      </TableTr>
    </>
  );
}
