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

import { getAllProductInventory } from "@/app/actions/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Product Inventory | Backoffice | Mapfox",
  description: "Manage product inventory",
};

export default async function ProductInventoryPage() {
  const result = await getAllProductInventory();

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
            Product Inventory
          </Title>
          <Text c="dimmed">
            Assembled product units tracked by serial number
          </Text>
        </div>

        <Group>
          <Link
            href="/backoffice/inventory/products/create"
            style={{ textDecoration: "none" }}
          >
            <Button leftSection={<IconPlus size={16} />}>Register Unit</Button>
          </Link>
        </Group>

        {!result.success ? (
          <Alert color="red" title="Error loading product inventory">
            <Text size="sm">{result.error}</Text>
          </Alert>
        ) : result.data.length === 0 ? (
          <Text c="dimmed" ta="center">
            No product inventory units yet. Register one to get started.
          </Text>
        ) : (
          <Table striped highlightOnHover>
            <TableThead>
              <TableTr>
                <TableTh>Product</TableTh>
                <TableTh>Serial Number</TableTh>
                <TableTh>Status</TableTh>
                <TableTh>Parts Used</TableTh>
                <TableTh>Notes</TableTh>
                <TableTh style={{ width: 48 }} />
              </TableTr>
            </TableThead>
            <TableTbody>
              {result.data.map((item) => (
                <TableTr key={item.id}>
                  <TableTd>
                    <Text size="sm" fw={500}>
                      {item.product?.name ?? "Unknown"}
                    </Text>
                    {item.product?.version && (
                      <Text size="xs" c="dimmed">
                        v{item.product.version}
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
                    <Badge variant="light" size="sm">
                      {item.partsUsed?.length ?? 0} parts
                    </Badge>
                  </TableTd>
                  <TableTd>
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      {item.notes ?? "—"}
                    </Text>
                  </TableTd>
                  <TableTd>
                    <Link
                      href={`/backoffice/inventory/products/${item.id}`}
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
