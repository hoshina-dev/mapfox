import { Code, Container, Stack, Title } from "@mantine/core";
import request from "graphql-request";

import { AdminAreasNoGeoDocument } from "@/graphql/generated/graphql";

export default async function DemoAdminAreasPage() {
  const data = await request(
    "http://localhost:8080/query",
    AdminAreasNoGeoDocument,
    { adminLevel: 0 },
  );

  return (
    <Container py="xl">
      <Stack gap="md">
        <Title order={2}>Admin Areas (Level 0)</Title>

        {data ? (
          <Code block style={{ maxHeight: "70vh", overflow: "auto" }}>
            {JSON.stringify(data, null, 2)}
          </Code>
        ) : (
          <p>No Data</p>
        )}
      </Stack>
    </Container>
  );
}
