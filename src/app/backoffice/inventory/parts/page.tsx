import {
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
  Title,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCheck,
  IconEye,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";

import { getAllPartsInventory } from "@/app/actions/parts";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Parts Inventory | Backoffice | Mapfox",
  description: "Manage parts inventory",
};

export default async function PartsInventoryPage() {
  const result = await getAllPartsInventory();

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Group gap="sm" mb="xs">
            <Link
              href="/backoffice/inventory"
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="subtle"
                size="compact-sm"
                leftSection={<IconArrowLeft size={14} />}
              >
                Back to Inventory
              </Button>
            </Link>
          </Group>
          <Title order={1} mb="xs">
            Parts Inventory
          </Title>
          <Text c="dimmed">Individual part units tracked by serial number</Text>
        </div>

        <Group>
          <Link
            href="/backoffice/inventory/parts/create"
            style={{ textDecoration: "none" }}
          >
            <Button leftSection={<IconPlus size={16} />}>Register Unit</Button>
          </Link>
        </Group>

        {!result.success ? (
          <Alert color="red" title="Error loading parts inventory">
            <Text size="sm">{result.error}</Text>
          </Alert>
        ) : result.data.length === 0 ? (
          <Text c="dimmed" ta="center">
            No parts inventory units yet. Register one to get started.
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <TableThead>
              <TableTr>
                <TableTh>Part</TableTh>
                <TableTh>Serial Number</TableTh>
                <TableTh>Status</TableTh>
                <TableTh>Notes</TableTh>
                <TableTh style={{ width: 48 }} />
              </TableTr>
            </TableThead>
            <TableTbody>
              {result.data.map((item) => (
                <TableTr key={item.id}>
                  <TableTd>
                    <Text size="sm" fw={500}>
                      {item.part?.name ?? "Unknown"}
                    </Text>
                    {item.part?.partNumber && (
                      <Text size="xs" c="dimmed">
                        {item.part.partNumber}
                      </Text>
                    )}
                  </TableTd>
                  <TableTd>
                    <Text size="sm" ff="monospace">
                      {item.serialNumber}
                    </Text>
                  </TableTd>
                  <TableTd>
                    <Badge
                      color={item.isAvailable ? "green" : "red"}
                      variant="light"
                      size="sm"
                      leftSection={
                        item.isAvailable ? (
                          <IconCheck size={12} />
                        ) : (
                          <IconX size={12} />
                        )
                      }
                    >
                      {item.isAvailable ? "Available" : "In use"}
                    </Badge>
                  </TableTd>
                  <TableTd>
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      {item.notes ?? "—"}
                    </Text>
                  </TableTd>
                  <TableTd>
                    <Link
                      href={`/backoffice/inventory/parts/${item.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        variant="subtle"
                        size="compact-sm"
                        aria-label="View unit"
                      >
                        <IconEye size={16} />
                      </Button>
                    </Link>
                  </TableTd>
                </TableTr>
              ))}
            </TableTbody>
          </Table>
        )}
      </Stack>
    </Container>
  );
}
