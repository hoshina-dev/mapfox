import { Alert, Container, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

export const metadata = {
  title: "Create Part | Mapfox",
  description: "Create a new part",
};

export default function CreatePartPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Title order={1}>Create Part</Title>
        <Text c="dimmed">
          Creating and editing parts is handled in the backoffice. This catalog
          view will stay read-only here until that flow is wired up.
        </Text>
        <Alert color="blue" title="Read-only catalog">
          <Text size="sm">
            Browse parts from the{" "}
            <Link
              href="/parts"
              style={{
                textDecoration: "underline",
                color: "var(--mantine-color-anchor)",
              }}
            >
              parts list
            </Link>
            .
          </Text>
        </Alert>
      </Stack>
    </Container>
  );
}
