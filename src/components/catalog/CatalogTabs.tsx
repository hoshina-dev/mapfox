"use client";

import { Tabs, TabsList, TabsTab } from "@mantine/core";
import { IconBoxSeam, IconPuzzle } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";

export function CatalogTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = pathname.startsWith("/catalog/products")
    ? "products"
    : "parts";

  return (
    <Tabs
      value={activeTab}
      onChange={(value) => {
        if (value) {
          router.push(`/catalog/${value}`);
        }
      }}
    >
      <TabsList>
        <TabsTab value="parts" leftSection={<IconPuzzle size={16} />}>
          Parts
        </TabsTab>
        <TabsTab value="products" leftSection={<IconBoxSeam size={16} />}>
          Products
        </TabsTab>
      </TabsList>
    </Tabs>
  );
}
