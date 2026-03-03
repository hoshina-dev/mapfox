import { Button, SimpleGrid, Stack, Text, Title } from "@mantine/core";

import { Welcome } from "@/components/demo/Welcome";

const DEMOS = [
  {
    title: "Organization List Demo",
    href: "/organizations",
    description:
      "View list of all organizations and map that show marker of each organization",
  },
];

export default function Home() {
  return (
    <Stack gap="xl" py="xl" px="md">
      <Welcome />

      <Stack gap="md" align="center">
        <Title order={2} ta="center">
          Demos
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 1 }} spacing="md" maw={600} w="100%">
          {DEMOS.map((demo) => (
            <Stack
              key={demo.href}
              gap="md"
              p="md"
              style={{
                border: "1px solid var(--mantine-color-gray-3)",
                borderRadius: "var(--mantine-radius-md)",
              }}
            >
              <div>
                <Title order={3} size="h5">
                  {demo.title}
                </Title>
                <Text size="sm" c="dimmed">
                  {demo.description}
                </Text>
              </div>
              <Button component="a" href={demo.href} variant="light" fullWidth>
                Open Demo
              </Button>
            </Stack>
          ))}
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
