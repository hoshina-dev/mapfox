import { Alert, Text } from "@mantine/core";

import { getParts } from "@/app/actions/parts";
import { PartsList } from "@/components/parts/PartsList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Parts | Catalog | Mapfox",
  description: "Browse the parts catalog and stock",
};

export default async function CatalogPartsPage() {
  const result = await getParts();

  if (!result.success) {
    return (
      <Alert color="red" title="Error loading parts">
        <Text>Failed to fetch parts from the API. Please try again later.</Text>
        <Text size="sm">{result.error}</Text>
      </Alert>
    );
  }

  return (
    <>
      <PartsList parts={result.data} />

      {result.data.length > 0 && (
        <Text size="sm" c="dimmed" ta="center">
          Showing {result.data.length} part
          {result.data.length !== 1 ? "s" : ""}
        </Text>
      )}
    </>
  );
}
