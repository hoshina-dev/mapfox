"use client";

import {
  Alert,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { IconEdit, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { updateProduct } from "@/app/actions/products";
import type { GetProductQuery } from "@/libs/api/papi/generated/graphql";

import { ProductDetailSection } from "./ProductDetailSection";

type ProductData = NonNullable<GetProductQuery["product"]>;

interface BackofficeProductDetailProps {
  product: ProductData;
}

export function BackofficeProductDetail({
  product,
}: BackofficeProductDetailProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description ?? "");
  const [version, setVersion] = useState(product.version ?? "");

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateProduct(product.id, {
        name: name || undefined,
        description: description || undefined,
        version: version || undefined,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(product.name);
    setDescription(product.description ?? "");
    setVersion(product.version ?? "");
    setError(null);
    setEditing(false);
  };

  return (
    <Stack gap="xl">
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
          <ProductDetailSection product={product} />
        </>
      ) : (
        <>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <Title order={3}>Edit Product</Title>
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

              <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
                minRows={3}
              />

              <TextInput
                label="Version"
                value={version}
                onChange={(e) => setVersion(e.currentTarget.value)}
              />

              <Text size="xs" c="dimmed">
                Parts composition can be modified when creating a new product.
              </Text>

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

          <ProductDetailSection product={product} />
        </>
      )}
    </Stack>
  );
}
