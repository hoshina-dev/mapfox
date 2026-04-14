"use client";

import { Card, SegmentedControl, Stack, Title } from "@mantine/core";
import { useState } from "react";

import { ModelViewer } from "@/components/viewer/ModelViewer";

function getModelLabel(url: string, index: number): string {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split("/").pop();
    if (filename) return filename;
  } catch {
    // fall through
  }
  return `Model ${index + 1}`;
}

export function Models3DSection({ models3D }: { models3D: string[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (models3D.length === 0) return null;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={3}>3D Models</Title>

        {models3D.length > 1 && (
          <SegmentedControl
            data={models3D.map((url, i) => ({
              label: getModelLabel(url, i),
              value: String(i),
            }))}
            value={String(selectedIndex)}
            onChange={(v) => setSelectedIndex(Number(v))}
          />
        )}

        <div
          style={{
            height: 450,
            borderRadius: "var(--mantine-radius-md)",
            overflow: "hidden",
          }}
        >
          <ModelViewer url={models3D[selectedIndex]} />
        </div>
      </Stack>
    </Card>
  );
}
