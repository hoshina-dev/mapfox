import { Alert, Container, Stack, Text } from "@mantine/core";

import { getCategories } from "@/app/actions/categories";
import { getManufacturers } from "@/app/actions/manufacturers";
import { CreatePartForm } from "@/components/parts/CreatePartForm";

export const metadata = {
  title: "Create Part | Backoffice | Mapfox",
  description: "Create a new part",
};

export default async function CreatePartPage() {
  const [manufacturersResult, categoriesResult] = await Promise.all([
    getManufacturers(),
    getCategories(),
  ]);

  if (!manufacturersResult.success) {
    return (
      <Container size="md" py="xl">
        <Alert color="red" title="Error">
          <Text size="sm">
            Failed to load manufacturers: {manufacturersResult.error}
          </Text>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <div>
          <Text component="h1" size="xl" fw={700} mb="sm">
            Create New Part
          </Text>
          <Text c="dimmed">Fill in the details below to create a new part</Text>
        </div>

        <CreatePartForm
          manufacturers={manufacturersResult.data}
          categories={categoriesResult.success ? categoriesResult.data : []}
        />
      </Stack>
    </Container>
  );
}
