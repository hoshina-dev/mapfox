"use client";

import {
  Avatar,
  Badge,
  Group,
  SegmentedControl,
  SimpleGrid,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { IconLayoutGrid, IconList, IconPackage } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { PartListItem } from "@/app/actions/parts";

import { PartCard } from "./PartCard";

interface PartsListProps {
  parts: PartListItem[];
}

export function PartsList({ parts }: PartsListProps) {
  const [view, setView] = useState<"grid" | "table">("grid");
  const router = useRouter();

  if (parts.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No parts in the catalog yet.
      </Text>
    );
  }

  return (
    <>
      <Group justify="flex-end">
        <SegmentedControl
          value={view}
          onChange={(value) => setView(value as "grid" | "table")}
          data={[
            {
              value: "grid",
              label: (
                <Group gap={6} wrap="nowrap">
                  <IconLayoutGrid size={14} />
                  <span>Grid View</span>
                </Group>
              ),
            },
            {
              value: "table",
              label: (
                <Group gap={6} wrap="nowrap">
                  <IconList size={14} />
                  <span>Table View</span>
                </Group>
              ),
            },
          ]}
          aria-label="Toggle parts view"
        />
      </Group>

      {view === "grid" ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
          {parts.map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </SimpleGrid>
      ) : (
        <TableScrollContainer minWidth={600}>
          <Table striped highlightOnHover withTableBorder>
            <TableThead>
              <TableTr>
                <TableTh />
                <TableTh>Name</TableTh>
                <TableTh>Part #</TableTh>
                <TableTh>Manufacturer</TableTh>
                <TableTh>Inventory</TableTh>
                <TableTh>Categories</TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>
              {parts.map((part) => {
                const imageUrl =
                  part.images.length > 0 ? part.images[0] : undefined;
                return (
                  <TableTr
                    key={part.id}
                    onClick={() => router.push(`/parts/${part.id}`)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <TableTd w={40}>
                      {imageUrl ? (
                        <Tooltip
                          label={
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageUrl}
                              alt={part.name}
                              style={{
                                maxWidth: 200,
                                maxHeight: 200,
                                borderRadius: 4,
                              }}
                            />
                          }
                          withArrow
                        >
                          <Avatar src={imageUrl} size="sm" radius="sm" />
                        </Tooltip>
                      ) : (
                        <ThemeIcon
                          size="sm"
                          radius="sm"
                          variant="light"
                          color="gray"
                          aria-label="No part image"
                        >
                          <IconPackage size={14} stroke={1.5} />
                        </ThemeIcon>
                      )}
                    </TableTd>
                    <TableTd>
                      <Text size="sm" fw={500}>
                        {part.name}
                      </Text>
                    </TableTd>
                    <TableTd>
                      <Text size="sm" c="dimmed">
                        {part.partNumber}
                      </Text>
                    </TableTd>
                    <TableTd>
                      <Text size="sm">{part.manufacturer?.name ?? "—"}</Text>
                    </TableTd>
                    <TableTd>
                      <Text size="sm">
                        {part.inventoryTotalCount === 0 ? (
                          <Text span c="dimmed" size="sm">
                            No units
                          </Text>
                        ) : (
                          <>
                            {part.inventoryAvailableCount} available /{" "}
                            {part.inventoryTotalCount} total
                          </>
                        )}
                      </Text>
                    </TableTd>
                    <TableTd>
                      {part.categories && part.categories.length > 0 ? (
                        <Group gap={4}>
                          {part.categories.map((cat) => (
                            <Badge key={cat.id} variant="outline" size="xs">
                              {cat.name}
                            </Badge>
                          ))}
                        </Group>
                      ) : (
                        <Text size="sm" c="dimmed">
                          —
                        </Text>
                      )}
                    </TableTd>
                  </TableTr>
                );
              })}
            </TableTbody>
          </Table>
        </TableScrollContainer>
      )}
    </>
  );
}
