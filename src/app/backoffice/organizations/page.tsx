import {
  ActionIcon,
  Alert,
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
  IconBuilding,
  IconEye,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";

import { getOrganizations } from "@/app/actions/organizations";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Organizations | Backoffice | Mapfox",
  description: "Manage organizations",
};

export default async function BackofficeOrganizationsPage() {
  const result = await getOrganizations();

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
            Organizations
          </Title>
          <Text c="dimmed">Manage organizations from here</Text>
        </div>

        <Group>
          <Link
            href="/backoffice/organizations/create"
            style={{ textDecoration: "none" }}
          >
            <Button leftSection={<IconPlus size={16} />}>
              Create Organization
            </Button>
          </Link>
        </Group>

        {!result.success ? (
          <Alert color="red" title="Error loading organizations">
            <Text size="sm">{result.error}</Text>
          </Alert>
        ) : result.data.length === 0 ? (
          <Text c="dimmed" ta="center">
            No organizations yet. Create one to get started.
          </Text>
        ) : (
          <>
            <Table striped highlightOnHover>
              <TableThead>
                <TableTr>
                  <TableTh style={{ width: 48 }} />
                  <TableTh>Name</TableTh>
                  <TableTh>Description</TableTh>
                  <TableTh>Address</TableTh>
                  <TableTh>Created</TableTh>
                  <TableTh style={{ width: 48 }} />
                </TableTr>
              </TableThead>
              <TableTbody>
                {result.data.map((org) => (
                  <TableTr key={org.id}>
                    <TableTd>
                      {org.imageUrls.length > 0 ? (
                        <Tooltip
                          label={
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={org.imageUrls[0]}
                              alt={org.name}
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
                            src={org.imageUrls[0]}
                            alt={org.name}
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
                          aria-label="No organization image"
                        >
                          <IconBuilding size={16} stroke={1.5} />
                        </ThemeIcon>
                      )}
                    </TableTd>
                    <TableTd>
                      <Text fw={500} size="sm">
                        {org.name}
                      </Text>
                    </TableTd>
                    <TableTd>
                      <Text size="sm" c="dimmed" lineClamp={1}>
                        {org.description || "—"}
                      </Text>
                    </TableTd>
                    <TableTd>
                      <Text size="sm" c="dimmed" lineClamp={1}>
                        {org.address || "—"}
                      </Text>
                    </TableTd>
                    <TableTd>
                      <Text size="sm" c="dimmed">
                        {new Date(org.createdAt).toLocaleDateString()}
                      </Text>
                    </TableTd>
                    <TableTd>
                      <Link href={`/backoffice/organizations/${org.id}`}>
                        <ActionIcon
                          variant="subtle"
                          aria-label="View organization"
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Link>
                    </TableTd>
                  </TableTr>
                ))}
              </TableTbody>
            </Table>
            <Text size="sm" c="dimmed" ta="center">
              Showing {result.data.length} organization
              {result.data.length !== 1 ? "s" : ""}
            </Text>
          </>
        )}
      </Stack>
    </Container>
  );
}
