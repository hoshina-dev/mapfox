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
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconEye, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

import { getProducts } from "@/app/actions/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Products | Backoffice | Mapfox",
  description: "Manage products",
};

export default async function BackofficeProductsPage() {
  const result = await getProducts();

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
            Products
          </Title>
          <Text c="dimmed">Manage products from here</Text>
        </div>

        <Group>
          <Link
            href="/backoffice/products/create"
            style={{ textDecoration: "none" }}
          >
            <Button leftSection={<IconPlus size={16} />}>Create Product</Button>
          </Link>
        </Group>

        {!result.success ? (
          <Alert color="red" title="Error loading products">
            <Text size="sm">{result.error}</Text>
          </Alert>
        ) : result.data.length === 0 ? (
          <Text c="dimmed" ta="center">
            No products yet. Create one to get started.
          </Text>
        ) : (
          <>
            <Table striped highlightOnHover>
              <TableThead>
                <TableTr>
                  <TableTh>Name</TableTh>
                  <TableTh>Version</TableTh>
                  <TableTh>Parts</TableTh>
                  <TableTh style={{ width: 48 }} />
                </TableTr>
              </TableThead>
              <TableTbody>
                {result.data.map((p) => (
                  <TableTr key={p.id}>
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
                      {p.version ? (
                        <Badge variant="light">{p.version}</Badge>
                      ) : (
                        <Text c="dimmed" size="sm">
                          —
                        </Text>
                      )}
                    </TableTd>
                    <TableTd>
                      <Badge variant="outline">
                        {p.parts?.length ?? 0} part
                        {(p.parts?.length ?? 0) !== 1 ? "s" : ""}
                      </Badge>
                    </TableTd>
                    <TableTd>
                      <Link href={`/backoffice/products/${p.id}`}>
                        <ActionIcon variant="subtle" aria-label="View product">
                          <IconEye size={16} />
                        </ActionIcon>
                      </Link>
                    </TableTd>
                  </TableTr>
                ))}
              </TableTbody>
            </Table>
            <Text size="sm" c="dimmed" ta="center">
              Showing {result.data.length} product
              {result.data.length !== 1 ? "s" : ""}
            </Text>
          </>
        )}
      </Stack>
    </Container>
  );
}
