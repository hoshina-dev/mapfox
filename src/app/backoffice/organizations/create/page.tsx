import { Container, Stack, Text } from "@mantine/core";

import { CreateOrganizationForm } from "@/components/organizations/CreateOrganizationForm";

export const metadata = {
  title: "Create Organization | Mapfox",
  description: "Create a new organization",
};

export default function CreateOrganizationPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Text component="h1" size="xl" fw={700} mb="sm">
            Create New Organization
          </Text>
          <Text c="dimmed">
            Fill in the details below to create a new organization
          </Text>
        </div>

        <CreateOrganizationForm />
      </Stack>
    </Container>
  );
}
