import { Grid, GridCol, Stack } from "@mantine/core";
import type { ReactNode } from "react";

interface CatalogDetailLayoutProps {
  media: ReactNode;
  details: ReactNode;
}

export function CatalogDetailLayout({
  media,
  details,
}: CatalogDetailLayoutProps) {
  return (
    <Grid gutter="xl" align="start">
      <GridCol span={{ base: 12, md: 5 }}>
        <Stack gap="xl">{media}</Stack>
      </GridCol>
      <GridCol span={{ base: 12, md: 7 }}>
        <Stack gap="xl">{details}</Stack>
      </GridCol>
    </Grid>
  );
}
