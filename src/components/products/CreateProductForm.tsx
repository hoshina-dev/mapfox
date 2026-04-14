"use client";

import {
  ActionIcon,
  Alert,
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createProduct } from "@/app/actions/products";

interface PartOption {
  id: string;
  name: string;
  partNumber: string;
}

interface CreateProductFormProps {
  parts: PartOption[];
}

interface ProductPartRow {
  key: number;
  partId: string | null;
  quantity: number;
  notes: string;
}

export function CreateProductForm({ parts }: CreateProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("");

  const [partRows, setPartRows] = useState<ProductPartRow[]>([]);
  const [nextKey, setNextKey] = useState(1);

  const addPartRow = () => {
    setPartRows((prev) => [
      ...prev,
      { key: nextKey, partId: null, quantity: 1, notes: "" },
    ]);
    setNextKey((k) => k + 1);
  };

  const removePartRow = (key: number) => {
    setPartRows((prev) => prev.filter((r) => r.key !== key));
  };

  const updatePartRow = (
    key: number,
    field: keyof ProductPartRow,
    value: unknown,
  ) => {
    setPartRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)),
    );
  };

  const partOptions = parts.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.partNumber})`,
  }));

  const isFormValid = name.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validParts = partRows
      .filter((r) => r.partId && r.quantity > 0)
      .map((r) => ({
        partId: r.partId!,
        quantity: r.quantity,
        notes: r.notes || undefined,
      }));

    try {
      const result = await createProduct(
        {
          name,
          description: description || undefined,
          version: version || undefined,
          images: [],
        },
        validParts.length > 0 ? validParts : undefined,
      );

      if (!result.success) {
        setError(result.error || "Failed to create product");
        return;
      }

      router.push("/backoffice/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
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
            label="Product Name"
            placeholder="Enter product name"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            description="The name of the product"
          />

          <Textarea
            label="Description"
            placeholder="Describe the product"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            description="Optional description of the product"
            minRows={3}
          />

          <TextInput
            label="Version"
            placeholder="e.g., v1.0, rev2"
            value={version}
            onChange={(e) => setVersion(e.currentTarget.value)}
            description="Optional version identifier"
          />

          {/* Parts Composition */}
          <div>
            <Group justify="space-between" mb="sm">
              <div>
                <Text fw={500} size="sm">
                  Parts Composition
                </Text>
                <Text size="xs" c="dimmed">
                  Add parts that make up this product with their quantities
                </Text>
              </div>
              <Button
                size="sm"
                variant="light"
                leftSection={<IconPlus size={14} />}
                onClick={addPartRow}
                disabled={loading}
              >
                Add Part
              </Button>
            </Group>

            {partRows.length > 0 ? (
              <Table withTableBorder>
                <TableThead>
                  <TableTr>
                    <TableTh>Part</TableTh>
                    <TableTh style={{ width: 100 }}>Quantity</TableTh>
                    <TableTh>Notes</TableTh>
                    <TableTh style={{ width: 50 }} />
                  </TableTr>
                </TableThead>
                <TableTbody>
                  {partRows.map((row) => (
                    <TableTr key={row.key}>
                      <TableTd>
                        <Select
                          placeholder="Select part"
                          data={partOptions}
                          value={row.partId}
                          onChange={(val) =>
                            updatePartRow(row.key, "partId", val)
                          }
                          searchable
                          size="sm"
                        />
                      </TableTd>
                      <TableTd>
                        <NumberInput
                          min={1}
                          value={row.quantity}
                          onChange={(val) =>
                            updatePartRow(
                              row.key,
                              "quantity",
                              typeof val === "number" ? val : 1,
                            )
                          }
                          size="sm"
                        />
                      </TableTd>
                      <TableTd>
                        <TextInput
                          placeholder="Optional notes"
                          value={row.notes}
                          onChange={(e) =>
                            updatePartRow(
                              row.key,
                              "notes",
                              e.currentTarget.value,
                            )
                          }
                          size="sm"
                        />
                      </TableTd>
                      <TableTd>
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          onClick={() => removePartRow(row.key)}
                          disabled={loading}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </TableTd>
                    </TableTr>
                  ))}
                </TableTbody>
              </Table>
            ) : (
              <Text size="sm" c="dimmed" ta="center" py="md">
                No parts added yet. Click &quot;Add Part&quot; to add parts to
                this product.
              </Text>
            )}
          </div>

          <Group justify="flex-end" pt="md">
            <Button
              variant="default"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!isFormValid || loading}
            >
              Create Product
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  );
}
