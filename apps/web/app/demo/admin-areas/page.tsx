"use client";

import { Code, Container, Loader, Stack, Text, Title } from "@mantine/core";

import { useAdminAreasQuery } from "@repo/graphql";

export default function AdminAreasDemo() {
  const { data, loading, error } = useAdminAreasQuery({
    variables: { adminLevel: 1 },
  });

  return (
    <Container py="xl">
      <Stack gap="md">
        <Title order={2}>Admin Areas (Level 1)</Title>

        {loading && (
          <Stack align="center" py="xl">
            <Loader size="lg" />
            <Text c="dimmed">Loading admin areas...</Text>
          </Stack>
        )}

        {error && (
          <Code block c="red">
            Error: {error.message}
          </Code>
        )}

        {data && (
          <Code block style={{ maxHeight: "70vh", overflow: "auto" }}>
            {JSON.stringify(data.adminAreas, null, 2)}
          </Code>
        )}
      </Stack>
    </Container>
  );
}
