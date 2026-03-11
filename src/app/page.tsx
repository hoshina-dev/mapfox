import { Alert, Container, Text } from "@mantine/core";

import { LandingHero } from "@/components/landing/LandingHero";
import { organizationsApi } from "@/libs/apiClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const orgResult = await organizationsApi
    .organizationsGet()
    .then((data) => ({ data, error: null }))
    .catch((e: unknown) => ({ data: null, error: e }));

  const { data, error } = orgResult;

  if (error) {
    return (
      <Container py="xl">
        <Alert color="red" title="Error loading map data">
          <Text>Failed to fetch organizations. Please try again later.</Text>
        </Alert>
      </Container>
    );
  }

  return <LandingHero organizations={data || []} />;
}
