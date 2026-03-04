import { Container, Stack, Text } from "@mantine/core";
import { redirect } from "next/navigation";

import { HomeForm } from "@/components/home/HomeForm";
import { usersApi } from "@/libs/apiClient";
import { getSession } from "@/libs/dal";

export const metadata = {
  title: "Home | Mapfox",
  description: "Manage your profile",
};

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await usersApi.usersIdIdGet(session.userId);

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <div>
          <Text component="h1" size="xl" fw={700} mb="sm">
            My Profile
          </Text>
          <Text c="dimmed">View and update your profile information</Text>
        </div>

        <HomeForm user={user} />
      </Stack>
    </Container>
  );
}
