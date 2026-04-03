"use client";

import {
  Badge,
  Group,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
} from "@mantine/core";
import { useRouter } from "next/navigation";

import type { ProductListItem } from "@/app/actions/products";

interface ProductsListProps {
  products: ProductListItem[];
}

export function ProductsList({ products }: ProductsListProps) {
  const router = useRouter();

  if (products.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No products in the catalog yet.
      </Text>
    );
  }

  return (
    <TableScrollContainer minWidth={500}>
      <Table striped highlightOnHover withTableBorder>
        <TableThead>
          <TableTr>
            <TableTh>Name</TableTh>
            <TableTh>Version</TableTh>
            <TableTh>Description</TableTh>
            <TableTh>Parts</TableTh>
            <TableTh>Inventory</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {products.map((product) => (
            <TableTr
              key={product.id}
              onClick={() => router.push(`/catalog/products/${product.id}`)}
              style={{ cursor: "pointer" }}
            >
              <TableTd>
                <Text size="sm" fw={500}>
                  {product.name}
                </Text>
              </TableTd>
              <TableTd>
                {product.version ? (
                  <Badge variant="light" size="sm">
                    {product.version}
                  </Badge>
                ) : (
                  <Text size="sm" c="dimmed">
                    —
                  </Text>
                )}
              </TableTd>
              <TableTd>
                <Text size="sm" c="dimmed" lineClamp={1}>
                  {product.description || "—"}
                </Text>
              </TableTd>
              <TableTd>
                {product.parts && product.parts.length > 0 ? (
                  <Group gap={4}>
                    <Badge variant="outline" size="sm">
                      {product.parts.length} part
                      {product.parts.length !== 1 ? "s" : ""}
                    </Badge>
                  </Group>
                ) : (
                  <Text size="sm" c="dimmed">
                    —
                  </Text>
                )}
              </TableTd>
              <TableTd>
                <Text size="sm">
                  {product.inventoryTotalCount === 0 ? (
                    <Text span c="dimmed" size="sm">
                      No units
                    </Text>
                  ) : (
                    <>
                      {product.inventoryAvailableCount} available /{" "}
                      {product.inventoryTotalCount} total
                    </>
                  )}
                </Text>
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </TableScrollContainer>
  );
}
