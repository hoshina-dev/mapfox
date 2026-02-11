import { Container, Stack, Text } from "@mantine/core";

import { CreateUserForm } from "@/components/users/CreateUserForm";

export const metadata = {
  title: "Create User | Mapfox",
  description: "Create a new user account",
};

export default function CreateUserPage() {
  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <div>
          <Text component="h1" size="xl" fw={700} mb="sm">
            Create New User
          </Text>
          <Text c="dimmed">
            Fill in the details below to create a new user account
          </Text>
        </div>

        <CreateUserForm />
      </Stack>
    </Container>
  );
}
