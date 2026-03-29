import { Alert, Container, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

export const metadata = {
  title: "Create Manufacturer | Mapfox",
  description: "Create a manufacturer",
};

export default function CreateManufacturerPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Title order={1}>Create Manufacturer</Title>
        <Text c="dimmed">
          Manufacturer administration will live in the backoffice. This app only
          displays catalog data for now.
        </Text>
        <Alert color="blue" title="Read-only catalog">
          <Text size="sm">
            View manufacturers on the{" "}
            <Link
              href="/manufacturers"
              style={{
                textDecoration: "underline",
                color: "var(--mantine-color-anchor)",
              }}
            >
              manufacturers list
            </Link>
            .
          </Text>
        </Alert>
      </Stack>
    </Container>
  );
}
