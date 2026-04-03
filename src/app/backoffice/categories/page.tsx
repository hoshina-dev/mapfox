import {
  Alert,
  Button,
  Container,
  Group,
  Stack,
  Table,
  TableTbody,
  TableTh,
  TableThead,
  TableTr,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

import { getCategories } from "@/app/actions/categories";
import { CategoryRow } from "@/components/categories/CategoryRow";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Categories | Backoffice | Mapfox",
  description: "Manage categories",
};

export default async function BackofficeCategoriesPage() {
  const result = await getCategories();

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
            Categories
          </Title>
          <Text c="dimmed">Manage categories from here</Text>
        </div>

        <Group>
          <Link
            href="/backoffice/categories/create"
            style={{ textDecoration: "none" }}
          >
            <Button leftSection={<IconPlus size={16} />}>
              Create Category
            </Button>
          </Link>
        </Group>

        {!result.success ? (
          <Alert color="red" title="Error loading categories">
            <Text size="sm">{result.error}</Text>
          </Alert>
        ) : result.data.length === 0 ? (
          <Text c="dimmed" ta="center">
            No categories yet. Create one to get started.
          </Text>
        ) : (
          <>
            <Table striped highlightOnHover>
              <TableThead>
                <TableTr>
                  <TableTh>Name</TableTh>
                  <TableTh>Description</TableTh>
                  <TableTh style={{ width: 100 }} />
                </TableTr>
              </TableThead>
              <TableTbody>
                {result.data.map((c) => (
                  <CategoryRow key={c.id} category={c} />
                ))}
              </TableTbody>
            </Table>
            <Text size="sm" c="dimmed" ta="center">
              Showing {result.data.length} categor
              {result.data.length !== 1 ? "ies" : "y"}
            </Text>
          </>
        )}
      </Stack>
    </Container>
  );
}
