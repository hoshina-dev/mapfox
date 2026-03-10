import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";

export default function Home() {
  return (
    <Container size="lg" py={80}>
      <Stack align="center" gap="xl">
        <Stack align="center" gap="md" maw={700}>
          <Title order={1} ta="center" fz={{ base: 32, sm: 44 }}>
            Mapfox Demo
          </Title>
          <Text c="dimmed" ta="center" size="lg" maw={560}>
            Explore the current demo surfaces for organization browsing and map
            interaction.
          </Text>
        </Stack>

        <Group gap="md">
          <Button component="a" href="/organizations" size="md" radius="md">
            Browse Organizations
          </Button>
          <Button
            component="a"
            href="/map"
            size="md"
            radius="md"
            variant="light"
          >
            Open Map Explorer
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
