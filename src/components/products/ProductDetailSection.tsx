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
import { IconCheck, IconX } from "@tabler/icons-react";

import type {
  GetProductInventoryByProductQuery,
  GetProductQuery,
} from "@/libs/api/papi/generated/graphql";

type ProductData = NonNullable<GetProductQuery["product"]>;
type ProductInventoryRow =
  GetProductInventoryByProductQuery["productInventoryByProduct"][number];

interface ProductDetailSectionProps {
  product: ProductData;
  productInventory?: ProductInventoryRow[];
}

export function ProductDetailSection({
  product,
  productInventory,
}: ProductDetailSectionProps) {
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

      {productInventory && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>Product Inventory</Title>
            <Text size="sm" c="dimmed">
              Individual product units tracked by serial number.
            </Text>

            {productInventory.length === 0 ? (
              <Text size="sm" c="dimmed">
                No inventory units recorded for this product.
              </Text>
            ) : (
              <TableScrollContainer minWidth={400}>
                <Table striped highlightOnHover withTableBorder>
                  <TableThead>
                    <TableTr>
                      <TableTh>Serial</TableTh>
                      <TableTh>Status</TableTh>
                      <TableTh>Parts Used</TableTh>
                      <TableTh>Notes</TableTh>
                    </TableTr>
                  </TableThead>
                  <TableTbody>
                    {productInventory.map((row) => (
                      <TableTr key={row.id}>
                        <TableTd>
                          <Text size="sm" ff="monospace">
                            {row.serialNumber}
                          </Text>
                        </TableTd>
                        <TableTd>
                          <Badge
                            color={row.isAvailable ? "green" : "red"}
                            variant="light"
                            size="sm"
                            leftSection={
                              row.isAvailable ? (
                                <IconCheck size={12} />
                              ) : (
                                <IconX size={12} />
                              )
                            }
                          >
                            {row.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </TableTd>
                        <TableTd>
                          {row.partsUsed && row.partsUsed.length > 0 ? (
                            <Group gap={4} wrap="wrap">
                              {row.partsUsed.map((pu) => (
                                <Badge key={pu.id} variant="outline" size="xs">
                                  {pu.part?.name ?? pu.serialNumber}
                                </Badge>
                              ))}
                            </Group>
                          ) : (
                            <Text size="sm" c="dimmed">
                              —
                            </Text>
                          )}
                        </TableTd>
                        <TableTd>
                          <Text size="sm" c="dimmed">
                            {row.notes ?? "—"}
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
      )}
    </Stack>
  );
}
