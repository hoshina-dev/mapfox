"use client";

import {
  Badge,
  Card,
  Group,
  Stack,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  Title,
} from "@mantine/core";

import type { GetProductQuery } from "@/libs/api/papi/generated/graphql";

type ProductData = NonNullable<GetProductQuery["product"]>;

interface ProductDetailSectionProps {
  product: ProductData;
}

export function ProductDetailSection({ product }: ProductDetailSectionProps) {
  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Details</Title>

          <Stack gap="sm">
            {product.version && (
              <div>
                <Text size="sm" c="dimmed">
                  Version
                </Text>
                <Badge variant="light">{product.version}</Badge>
              </div>
            )}

            {product.description && (
              <div>
                <Text size="sm" c="dimmed">
                  Description
                </Text>
                <Text>{product.description}</Text>
              </div>
            )}
          </Stack>
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Parts Composition</Title>
          <Text size="sm" c="dimmed">
            Parts that make up this product and their quantities.
          </Text>

          {!product.parts || product.parts.length === 0 ? (
            <Text size="sm" c="dimmed">
              No parts assigned to this product.
            </Text>
          ) : (
            <TableScrollContainer minWidth={400}>
              <Table striped highlightOnHover withTableBorder>
                <TableThead>
                  <TableTr>
                    <TableTh>Part</TableTh>
                    <TableTh>Part #</TableTh>
                    <TableTh>Quantity</TableTh>
                    <TableTh>Notes</TableTh>
                  </TableTr>
                </TableThead>
                <TableTbody>
                  {product.parts.map((pp) => (
                    <TableTr key={pp.id}>
                      <TableTd>
                        <Text size="sm" fw={500}>
                          {pp.part?.name ?? "Unknown"}
                        </Text>
                      </TableTd>
                      <TableTd>
                        <Text size="sm" c="dimmed" ff="monospace">
                          {pp.part?.partNumber ?? "—"}
                        </Text>
                      </TableTd>
                      <TableTd>
                        <Group gap={4}>
                          <Badge variant="outline" size="sm">
                            ×{pp.quantity}
                          </Badge>
                        </Group>
                      </TableTd>
                      <TableTd>
                        <Text size="sm" c="dimmed">
                          {pp.notes ?? "—"}
                        </Text>
                      </TableTd>
                    </TableTr>
                  ))}
                </TableTbody>
              </Table>
            </TableScrollContainer>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
