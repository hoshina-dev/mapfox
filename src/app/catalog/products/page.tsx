import { Alert, Text } from "@mantine/core";

import { getProducts } from "@/app/actions/products";
import { ProductsList } from "@/components/catalog/ProductsList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products | Catalog | Mapfox",
  description: "Browse the products catalog",
};

export default async function CatalogProductsPage() {
  const result = await getProducts();

  if (!result.success) {
    return (
      <Alert color="red" title="Error loading products">
        <Text>
          Failed to fetch products from the API. Please try again later.
        </Text>
        <Text size="sm">{result.error}</Text>
      </Alert>
    );
  }

  return (
    <>
      <ProductsList products={result.data} />

      {result.data.length > 0 && (
        <Text size="sm" c="dimmed" ta="center">
          Showing {result.data.length} product
          {result.data.length !== 1 ? "s" : ""}
        </Text>
      )}
    </>
  );
}
