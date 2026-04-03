import { Container, Stack, Text, Title } from "@mantine/core";

import { CatalogTabs } from "@/components/catalog/CatalogTabs";

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">
            Catalog
          </Title>
          <Text c="dimmed" size="lg">
            Browse parts and products
          </Text>
        </div>

        <CatalogTabs />

        {children}
      </Stack>
    </Container>
  );
}
