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
  Tooltip,
} from "@mantine/core";
import {
  IconCheck,
  IconLayoutGrid,
  IconList,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { GetPartsQuery } from "@/libs/api/pasta/generated/graphql";

import { PartCard } from "./PartCard";

type PartItem = GetPartsQuery["parts"][number];

interface PartsListProps {
  parts: PartItem[];
}

export function PartsList({ parts }: PartsListProps) {
  const [view, setView] = useState<"grid" | "table">("grid");
  const router = useRouter();

  if (parts.length === 0) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        No parts found. Create one to get started.
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
                <TableTh>Condition</TableTh>
                <TableTh>Status</TableTh>
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
                        <Avatar size="sm" radius="sm" />
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
                      <Badge variant="light" size="sm" color="blue">
                        {part.condition}
                      </Badge>
                    </TableTd>
                    <TableTd>
                      <Badge
                        color={part.isAvailable ? "green" : "red"}
                        variant="light"
                        size="sm"
                        leftSection={
                          part.isAvailable ? (
                            <IconCheck size={12} />
                          ) : (
                            <IconX size={12} />
                          )
                        }
                      >
                        {part.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
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
