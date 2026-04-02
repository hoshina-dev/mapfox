"use client";

import {
  Alert,
  Button,
  Group,
  Select,
  Stack,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createProductInventoryItem } from "@/app/actions/products";

interface ProductOption {
  id: string;
  name: string;
  version?: string | null;
}

interface CreateProductInventoryFormProps {
  products: ProductOption[];
}

export function CreateProductInventoryForm({
  products,
}: CreateProductInventoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productId, setProductId] = useState<string | null>(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [notes, setNotes] = useState("");

  const productOptions = products.map((p) => ({
    value: p.id,
    label: p.version ? `${p.name} (v${p.version})` : p.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !serialNumber.trim()) return;

    setLoading(true);
    setError(null);

    const result = await createProductInventoryItem({
      productId,
      serialNumber: serialNumber.trim(),
      isAvailable,
      notes: notes.trim() || undefined,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/backoffice/inventory/products");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Group>
          <Link
            href="/backoffice/inventory/products"
            style={{ textDecoration: "none" }}
          >
            <Button
              variant="subtle"
              size="compact-sm"
              leftSection={<IconArrowLeft size={14} />}
            >
              Back to Product Inventory
            </Button>
          </Link>
        </Group>

        {error && (
          <Alert color="red" title="Error">
            {error}
          </Alert>
        )}

        <Select
          label="Product"
          placeholder="Select a product"
          data={productOptions}
          value={productId}
          onChange={setProductId}
          searchable
          required
        />

        <TextInput
          label="Serial Number"
          placeholder="Enter serial number"
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
          placeholder="Optional notes"
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
          autosize
          minRows={2}
        />

        <Group>
          <Button
            type="submit"
            loading={loading}
            disabled={!productId || !serialNumber.trim()}
          >
            Register Unit
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
