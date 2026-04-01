import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Container,
  Group,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconEye,
  IconPackage,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";

import { getParts } from "@/app/actions/parts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Parts | Backoffice | Mapfox",
  description: "Manage parts",
};

export default async function BackofficePartsPage() {
  const result = await getParts();

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Group gap="sm" mb="xs">
            <Link href="/backoffice" style={{ textDecoration: "none" }}>
              <Button
                variant="subtle"
                size="compact-sm"
                leftSection={<IconArrowLeft size={14} />}
              >
                Back to Backoffice
              </Button>
            </Link>
          </Group>
          <Title order={1} mb="xs">
            Parts
          </Title>
          <Text c="dimmed">Manage parts from here</Text>
        </div>

        <Group>
          <Link
            href="/backoffice/parts/create"
            style={{ textDecoration: "none" }}
          >
            <Button leftSection={<IconPlus size={16} />}>Create Part</Button>
          </Link>
        </Group>

        {!result.success ? (
          <Alert color="red" title="Error loading parts">
            <Text size="sm">{result.error}</Text>
          </Alert>
        ) : result.data.length === 0 ? (
          <Text c="dimmed" ta="center">
            No parts yet. Create one to get started.
          </Text>
        ) : (
          <>
            <Table striped highlightOnHover>
              <TableThead>
                <TableTr>
                  <TableTh style={{ width: 48 }} />
                  <TableTh>Name</TableTh>
                  <TableTh>Part #</TableTh>
                  <TableTh>Manufacturer</TableTh>
                  <TableTh>Categories</TableTh>
                  <TableTh>Inventory</TableTh>
                  <TableTh style={{ width: 48 }} />
                </TableTr>
              </TableThead>
              <TableTbody>
                {result.data.map((p) => (
                  <TableTr key={p.id}>
                    <TableTd>
                      {p.images.length > 0 ? (
                        <Tooltip
                          label={
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              style={{
                                maxWidth: 200,
                                maxHeight: 200,
                                borderRadius: 4,
                              }}
                            />
                          }
                          withArrow
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 4,
                              objectFit: "cover",
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <ThemeIcon
                          size="md"
                          radius="sm"
                          variant="light"
                          color="gray"
                          aria-label="No part image"
                        >
                          <IconPackage size={16} stroke={1.5} />
                        </ThemeIcon>
                      )}
                    </TableTd>
                    <TableTd>
                      <Text fw={500} size="sm">
                        {p.name}
                      </Text>
                      {p.description && (
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {p.description}
                        </Text>
                      )}
                    </TableTd>
                    <TableTd>
                      <Text size="sm" c="dimmed">
                        {p.partNumber}
                      </Text>
                    </TableTd>
                    <TableTd>
                      <Text size="sm">{p.manufacturer?.name ?? "—"}</Text>
                    </TableTd>
                    <TableTd>
                      {p.categories && p.categories.length > 0 ? (
                        <Group gap={4}>
                          {p.categories.map((c) => (
                            <Badge key={c.id} variant="light" size="sm">
                              {c.name}
                            </Badge>
                          ))}
                        </Group>
                      ) : (
                        <Text c="dimmed" size="sm">
                          —
                        </Text>
                      )}
                    </TableTd>
                    <TableTd>
                      <Text size="sm">
                        {p.inventoryAvailableCount}/{p.inventoryTotalCount}
                      </Text>
                    </TableTd>
                    <TableTd>
                      <Link href={`/backoffice/parts/${p.id}`}>
                        <ActionIcon variant="subtle" aria-label="View part">
                          <IconEye size={16} />
                        </ActionIcon>
                      </Link>
                    </TableTd>
                  </TableTr>
                ))}
              </TableTbody>
            </Table>
            <Text size="sm" c="dimmed" ta="center">
              Showing {result.data.length} part
              {result.data.length !== 1 ? "s" : ""}
            </Text>
          </>
        )}
      </Stack>
    </Container>
  );
}
