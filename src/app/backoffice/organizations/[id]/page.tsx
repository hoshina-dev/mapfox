import {
  Alert,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getUsersByOrganization } from "@/app/actions/getUsersByOrganization";
import { BackofficeOrganizationDetail } from "@/components/organizations/BackofficeOrganizationDetail";
import { OrganizationMembersSection } from "@/components/organizations/OrganizationMembersSection";
import { organizationsApi } from "@/libs/apiClient";

export const dynamic = "force-dynamic";

interface BackofficeOrganizationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BackofficeOrganizationDetailPage({
  params,
}: BackofficeOrganizationDetailPageProps) {
  const { id } = await params;
  let organization;
  let error;

  try {
    organization = await organizationsApi.organizationsIdGet(id);
  } catch (e) {
    error = e;
  }

  if (error || !organization) {
    if (error && String(error).includes("404")) {
      notFound();
    }

    return (
      <Container py="xl">
        <Alert color="red" title="Error loading organization">
          <Text>
            Failed to fetch organization details. Please try again later.
          </Text>
          <Text size="sm">{String(error)}</Text>
        </Alert>
      </Container>
    );
  }

  const usersResult = await getUsersByOrganization(id);
  const users = usersResult.success ? usersResult.data : [];

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Group gap="sm" mb="xs">
            <Link
              href="/backoffice/organizations"
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="subtle"
                size="compact-sm"
                leftSection={<IconArrowLeft size={14} />}
              >
                Back to Organizations
              </Button>
            </Link>
          </Group>
          <Title order={1}>{organization.name}</Title>
        </div>

        <BackofficeOrganizationDetail organization={organization} />

        <OrganizationMembersSection
          organizationId={organization.id}
          users={users}
          isOrgManager={true}
        />
      </Stack>
    </Container>
  );
}
