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
import { IconArrowLeft, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

import { getManufacturers } from "@/app/actions/manufacturers";
import { getCountryName } from "@/libs/countries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Manufacturers | Backoffice | Mapfox",
  description: "Manage manufacturers",
};

export default async function BackofficeManufacturersPage() {
  const result = await getManufacturers();

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
            Manufacturers
          </Title>
          <Text c="dimmed">Manage manufacturers from here</Text>
        </div>

        <Group>
          <Link
            href="/backoffice/manufacturers/create"
            style={{ textDecoration: "none" }}
          >
            <Button leftSection={<IconPlus size={16} />}>
              Create Manufacturer
            </Button>
          </Link>
        </Group>

        {!result.success ? (
          <Alert color="red" title="Error loading manufacturers">
            <Text size="sm">{result.error}</Text>
          </Alert>
        ) : result.data.length === 0 ? (
          <Text c="dimmed" ta="center">
            No manufacturers yet. Create one to get started.
          </Text>
        ) : (
          <>
            <Table striped highlightOnHover>
              <TableThead>
                <TableTr>
                  <TableTh>Name</TableTh>
                  <TableTh>Country of Origin</TableTh>
                </TableTr>
              </TableThead>
              <TableTbody>
                {result.data.map((m) => (
                  <TableTr key={m.id}>
                    <TableTd>
                      <Text fw={500}>{m.name}</Text>
                    </TableTd>
                    <TableTd>
                      {m.countryOfOrigin ? (
                        <Badge variant="light">
                          {getCountryName(m.countryOfOrigin) ??
                            m.countryOfOrigin}
                        </Badge>
                      ) : (
                        <Text c="dimmed" size="sm">
                          —
                        </Text>
                      )}
                    </TableTd>
                  </TableTr>
                ))}
              </TableTbody>
            </Table>
            <Text size="sm" c="dimmed" ta="center">
              Showing {result.data.length} manufacturer
              {result.data.length !== 1 ? "s" : ""}
            </Text>
          </>
        )}
      </Stack>
    </Container>
  );
}
