"use client";

import {
  Alert,
  Button,
  Group,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createCategory } from "@/app/actions/categories";

export function CreateCategoryForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createCategory({
        name,
        description: description || undefined,
      });

      if (!result.success) {
        setError(result.error || "Failed to create category");
        return;
      }

      router.push("/backoffice/categories");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create category",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert color="red" title="Error" mb="lg">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <TextInput
            label="Category Name"
            placeholder="Enter category name"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            description="The name of the category"
          />

          <Textarea
            label="Description"
            placeholder="Describe what this category represents"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            description="Optional description for the category"
            minRows={3}
          />

          <Group justify="flex-end" pt="md">
            <Button
              variant="default"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} disabled={!name || loading}>
              Create Category
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  );
}
