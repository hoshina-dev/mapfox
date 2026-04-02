"use client";

import { Alert, Button, Group, Select, Stack, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createManufacturer } from "@/app/actions/manufacturers";
import { countryOptionsFilter, countrySelectData } from "@/libs/countries";

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

      router.push("/backoffice/manufacturers");
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

          <Select
            label="Country of Origin"
            placeholder="Search for a country"
            data={countrySelectData}
            value={countryOfOrigin || null}
            onChange={(val) => setCountryOfOrigin(val ?? "")}
            description="The country where the manufacturer is based"
            filter={countryOptionsFilter}
            searchable
            clearable
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
              Create Manufacturer
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  );
}
