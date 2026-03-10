"use client";

import { Alert, Button, Group, Stack, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createManufacturer } from "@/app/actions/manufacturers";

export function CreateManufacturerForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createManufacturer({
        name,
        countryOfOrigin: countryOfOrigin || undefined,
      });

      if (!result.success) {
        setError(result.error || "Failed to create manufacturer");
        return;
      }

      router.push("/manufacturers");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create manufacturer",
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
            label="Manufacturer Name"
            placeholder="Enter manufacturer name"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            description="The name of the manufacturer"
          />

          <TextInput
            label="Country of Origin (3 Letter ISO Code)"
            placeholder="e.g., JPN, USA, DEU"
            value={countryOfOrigin}
            onChange={(e) => setCountryOfOrigin(e.currentTarget.value)}
            description="The country where the manufacturer is based"
          />

          <Group justify="flex-end" pt="md">
            <Button
              variant="default"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} disabled={!name.trim()}>
              Create Manufacturer
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  );
}
