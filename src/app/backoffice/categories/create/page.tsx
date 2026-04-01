import { Container, Stack, Text } from "@mantine/core";

import { CreateCategoryForm } from "@/components/categories/CreateCategoryForm";

export const metadata = {
  title: "Create Category | Backoffice | Mapfox",
  description: "Create a new category",
};

export default function CreateCategoryPage() {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Text component="h1" size="xl" fw={700} mb="sm">
            Create New Category
          </Text>
          <Text c="dimmed">
            Fill in the details below to create a new category
          </Text>
        </div>

        <CreateCategoryForm />
      </Stack>
    </Container>
  );
}
