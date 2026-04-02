import {
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconBox, IconPackage } from "@tabler/icons-react";
import Link from "next/link";

export const metadata = {
  title: "Inventory | Backoffice | Mapfox",
  description: "Manage parts and product inventory",
};

export default function InventoryPage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Group gap="sm" mb="xs">
            <Link href="/backoffice" style={{ textDecoration: "none" }}>
              <Button
                variant="subtle"
                size="compact-sm"
                leftSection={<IconArrowLeft size={14} />}
              >
                Back to Backoffice
              </Button>
            </Link>
          </Group>
          <Title order={1} mb="xs">
            Inventory
          </Title>
          <Text c="dimmed" size="lg">
            Manage physical stock units for parts and assembled products
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          <Link
            href="/backoffice/inventory/parts"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ cursor: "pointer" }}
            >
              <Group justify="space-between" mb="sm">
                <ThemeIcon variant="light" size="lg" radius="md">
                  <IconBox size={20} />
                </ThemeIcon>
              </Group>
              <Text fw={600} size="lg">
                Parts Inventory
              </Text>
              <Text size="sm" c="dimmed" mt={4}>
                Track individual part units by serial number
              </Text>
            </Card>
          </Link>

          <Link
            href="/backoffice/inventory/products"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ cursor: "pointer" }}
            >
              <Group justify="space-between" mb="sm">
                <ThemeIcon variant="light" size="lg" radius="md">
                  <IconPackage size={20} />
                </ThemeIcon>
              </Group>
              <Text fw={600} size="lg">
                Product Inventory
              </Text>
              <Text size="sm" c="dimmed" mt={4}>
                Track assembled product units and their part composition
              </Text>
            </Card>
          </Link>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
