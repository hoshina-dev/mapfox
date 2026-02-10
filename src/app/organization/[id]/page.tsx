import {
  Alert,
  AspectRatio,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notFound } from "next/navigation";

import { OrganizationDetailSection } from "@/components/organizations/OrganizationDetailSection";
import { OrganizationImageCarousel } from "@/components/organizations/OrganizationImageCarousel";
import { organizationsApi } from "@/libs/apiClient";

interface OrganizationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrganizationPage({
  params,
}: OrganizationPageProps) {
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

  const imageUrls = organization.imageUrls || [];

  // Google Maps embed URL with marker
  const mapsEmbedUrl = `https://www.google.com/maps?q=${organization.lat},${organization.lng}&z=14&output=embed`;

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">
            {organization.name}
          </Title>
          {organization.description && (
            <Text c="dimmed" size="lg">
              {organization.description}
            </Text>
          )}
        </div>

        {imageUrls.length > 0 && (
          <OrganizationImageCarousel
            imageUrls={imageUrls}
            organizationName={organization.name || "Organization"}
          />
        )}

        <OrganizationDetailSection organization={organization}>
          {organization.address && (
            <Group gap="xs">
              <Text size="sm" fw={500}>
                📍 Address:
              </Text>
              <Text size="sm">{organization.address}</Text>
            </Group>
          )}

          <Group gap="xs">
            <Text size="sm" fw={500}>
              🌐 Coordinates:
            </Text>
            <Text size="sm" c="dimmed">
              {organization.lat!.toFixed(6)}, {organization.lng!.toFixed(6)}
            </Text>
          </Group>
        </OrganizationDetailSection>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>Location</Title>
            <AspectRatio ratio={16 / 9}>
              <iframe
                src={mapsEmbedUrl}
                title={`Map showing ${organization.name}`}
                style={{ border: 0, borderRadius: "8px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </AspectRatio>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
