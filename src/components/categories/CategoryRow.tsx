"use client";

import {
  ActionIcon,
  Alert,
  Button,
  Group,
  Modal,
  Stack,
  TableTd,
  TableTr,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAlertTriangle, IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteCategory, updateCategory } from "@/app/actions/categories";

interface CategoryRowProps {
  category: {
    id: string;
    name: string;
    description?: string | null;
  };
}

export function CategoryRow({ category }: CategoryRowProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);

  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");

  const handleCancel = () => {
    setEditing(false);
    setError(null);
    setName(category.name);
    setDescription(category.description ?? "");
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await updateCategory(category.id, {
        name,
        description: description || undefined,
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteCategory(category.id);
      if (!result.success) {
        setError(result.error);
        closeDelete();
        return;
      }
      closeDelete();
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category",
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
              Editing this category will affect all parts associated with it.
            </Alert>
            <TextInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              required
            />
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              minRows={2}
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
        title="Delete Category"
        centered
      >
        <Stack gap="md">
          <Alert
            color="orange"
            icon={<IconAlertTriangle size={16} />}
            title="Warning"
          >
            Deleting this category will affect all parts associated with it.
          </Alert>
          <Text>
            Are you sure you want to delete{" "}
            <Text component="span" fw={700}>
              {category.name}
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
          <Text fw={500}>{category.name}</Text>
        </TableTd>
        <TableTd>
          {category.description ? (
            <Text size="sm">{category.description}</Text>
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
