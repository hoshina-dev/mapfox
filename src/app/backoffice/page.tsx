import {
  Badge,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBox,
  IconBuildingFactory2,
  IconBuildingWarehouse,
  IconCategory,
  IconPackage,
  IconUsersGroup,
} from "@tabler/icons-react";
import Link from "next/link";

export const metadata = {
  title: "Backoffice | Mapfox",
  description: "Admin dashboard",
};

interface AdminCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  badge?: string;
}

function AdminCard({ icon, title, description, href, badge }: AdminCardProps) {
  const card = (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={href ? { cursor: "pointer" } : { opacity: 0.6 }}
    >
      <Group justify="space-between" mb="sm">
        <ThemeIcon variant="light" size="lg" radius="md">
          {icon}
        </ThemeIcon>
        {badge && (
          <Badge variant="light" color="gray" size="sm">
            {badge}
          </Badge>
        )}
      </Group>
      <Text fw={600} size="lg">
        {title}
      </Text>
      <Text size="sm" c="dimmed" mt={4}>
        {description}
      </Text>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
        {card}
      </Link>
    );
  }

  return card;
}

export default function BackofficePage() {
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">
            Backoffice
          </Title>
          <Text c="dimmed" size="lg">
            System administration dashboard
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          <AdminCard
            icon={<IconUsersGroup size={20} />}
            title="Organizations"
            description="Create and manage organizations"
            href="/backoffice/organizations"
          />
          <AdminCard
            icon={<IconBuildingFactory2 size={20} />}
            title="Manufacturers"
            description="Manage manufacturer information"
            href="/backoffice/manufacturers"
          />
          <AdminCard
            icon={<IconCategory size={20} />}
            title="Categories"
            description="Manage part and product categories"
            href="/backoffice/categories"
          />
          <AdminCard
            icon={<IconBox size={20} />}
            title="Parts"
            description="Manage parts catalog and specifications"
            href="/backoffice/parts"
          />
          <AdminCard
            icon={<IconPackage size={20} />}
            title="Products"
            description="Manage products assembled from parts"
            href="/backoffice/products"
          />
          <AdminCard
            icon={<IconBuildingWarehouse size={20} />}
            title="Inventory"
            description="Track stock levels of parts and products"
            badge="Coming soon"
          />
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
