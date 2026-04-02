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

import { createPartsInventoryItem } from "@/app/actions/parts";

interface PartOption {
  id: string;
  name: string;
  partNumber: string;
}

interface CreatePartsInventoryFormProps {
  parts: PartOption[];
}

export function CreatePartsInventoryForm({
  parts,
}: CreatePartsInventoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [partId, setPartId] = useState<string | null>(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [notes, setNotes] = useState("");

  const partOptions = parts.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.partNumber})`,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partId || !serialNumber.trim()) return;

    setLoading(true);
    setError(null);

    const result = await createPartsInventoryItem({
      partId,
      serialNumber: serialNumber.trim(),
      isAvailable,
      notes: notes.trim() || undefined,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/backoffice/inventory/parts");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Group>
          <Link
            href="/backoffice/inventory/parts"
            style={{ textDecoration: "none" }}
          >
            <Button
              variant="subtle"
              size="compact-sm"
              leftSection={<IconArrowLeft size={14} />}
            >
              Back to Parts Inventory
            </Button>
          </Link>
        </Group>

        {error && (
          <Alert color="red" title="Error">
            {error}
          </Alert>
        )}

        <Select
          label="Part"
          placeholder="Select a part"
          data={partOptions}
          value={partId}
          onChange={setPartId}
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
            disabled={!partId || !serialNumber.trim()}
          >
            Register Unit
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
