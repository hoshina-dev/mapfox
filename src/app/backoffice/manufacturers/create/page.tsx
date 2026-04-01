import { Container, Stack, Text } from "@mantine/core";

import { CreateManufacturerForm } from "@/components/manufacturers/CreateManufacturerForm";

export const metadata = {
  title: "Create Manufacturer | Backoffice | Mapfox",
  description: "Create a new manufacturer",
};

export default function CreateManufacturerPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Text component="h1" size="xl" fw={700} mb="sm">
            Create New Manufacturer
          </Text>
          <Text c="dimmed">
            Fill in the details below to create a new manufacturer
          </Text>
        </div>

        <CreateManufacturerForm />
      </Stack>
    </Container>
  );
}
