"use client";

import {
  Badge,
  Card,
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
  GetPartQuery,
  GetPartsInventoryByPartQuery,
} from "@/libs/api/papi/generated/graphql";

type PartData = NonNullable<GetPartQuery["part"]>;
type PartsInventoryRow =
  GetPartsInventoryByPartQuery["partsInventoryByPart"][number];

interface PartDetailSectionProps {
  part: PartData;
  partsInventory: PartsInventoryRow[];
}

function formatSpecifications(spec: unknown): string | null {
  if (spec == null) return null;
  if (typeof spec === "string") return spec;
  try {
    return JSON.stringify(spec, null, 2);
  } catch {
    return String(spec);
  }
}

export function PartDetailSection({
  part,
  partsInventory,
}: PartDetailSectionProps) {
  const specText = formatSpecifications(part.specifications);

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Details</Title>

          <Stack gap="sm">
            <div>
              <Text size="sm" c="dimmed">
                Part Number
              </Text>
              <Text fw={500}>{part.partNumber}</Text>
            </div>

            {part.description && (
              <div>
                <Text size="sm" c="dimmed">
                  Description
                </Text>
                <Text>{part.description}</Text>
              </div>
            )}

            {part.manufacturer && (
              <div>
                <Text size="sm" c="dimmed">
                  Manufacturer
                </Text>
                <Text fw={500}>{part.manufacturer.name}</Text>
                {part.manufacturer.countryOfOrigin && (
                  <Badge variant="light" size="sm" mt={4}>
                    {part.manufacturer.countryOfOrigin}
                  </Badge>
                )}
              </div>
            )}

            {part.temperatureStage && (
              <div>
                <Text size="sm" c="dimmed">
                  Temperature Stage
                </Text>
                <Text>{part.temperatureStage}</Text>
              </div>
            )}

            {specText && (
              <div>
                <Text size="sm" c="dimmed" mb={4}>
                  Specifications
                </Text>
                <Text
                  component="pre"
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "var(--mantine-font-size-sm)",
                    fontFamily: "var(--mantine-font-family-monospace)",
                  }}
                >
                  {specText}
                </Text>
              </div>
            )}

            {part.categories && part.categories.length > 0 && (
              <div>
                <Text size="sm" c="dimmed">
                  Categories
                </Text>
                <Stack gap="xs" mt={4}>
                  {part.categories.map((cat) => (
                    <div key={cat.id}>
                      <Badge variant="outline">{cat.name}</Badge>
                      {cat.description && (
                        <Text size="xs" c="dimmed" maw={360}>
                          {cat.description}
                        </Text>
                      )}
                    </div>
                  ))}
                </Stack>
              </div>
            )}
          </Stack>
        </Stack>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Part inventory</Title>
          <Text size="sm" c="dimmed">
            Sellable units of this part (serial-tracked stock). Catalog data
            above describes the part; inventory rows are individual units.
          </Text>

          {partsInventory.length === 0 ? (
            <Text size="sm" c="dimmed">
              No inventory units recorded for this part.
            </Text>
          ) : (
            <TableScrollContainer minWidth={400}>
              <Table striped highlightOnHover withTableBorder>
                <TableThead>
                  <TableTr>
                    <TableTh>Serial</TableTh>
                    <TableTh>Status</TableTh>
                    <TableTh>Notes</TableTh>
                  </TableTr>
                </TableThead>
                <TableTbody>
                  {partsInventory.map((row) => (
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
    </Stack>
  );
}
