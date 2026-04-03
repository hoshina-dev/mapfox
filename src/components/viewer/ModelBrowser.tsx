"use client";

import {
  Badge,
  Box,
  Center,
  Group,
  Loader,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconFile3d, IconFolder, IconFolderOpen } from "@tabler/icons-react";
import { useState, useTransition } from "react";

import { getModelUrl } from "@/app/actions/models";
import type { S3Part } from "@/libs/s3Client";

import { ModelViewer } from "./ModelViewer";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileName(key: string): string {
  const parts = key.split("/");
  return parts[parts.length - 1] || key;
}

export function ModelBrowser({ parts }: { parts: S3Part[] }) {
  const [selectedPart, setSelectedPart] = useState<string | null>(
    parts[0]?.part ?? null,
  );
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileClick(key: string) {
    setSelectedKey(key);
    setSignedUrl(null);
    startTransition(async () => {
      const result = await getModelUrl(key);
      if (result.success) {
        setSignedUrl(result.url);
      }
    });
  }

  return (
    <Group
      wrap="nowrap"
      gap={0}
      align="stretch"
      style={{ height: "calc(100vh - 72px)" }}
    >
      {/* Sidebar */}
      <Box
        style={{
          width: 280,
          flexShrink: 0,
          borderRight:
            "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))",
        }}
      >
        <ScrollArea h="100%" p="xs">
          <Stack gap={2}>
            {parts.map((group) => (
              <NavLink
                key={group.part}
                label={group.part}
                leftSection={
                  <ThemeIcon variant="light" size="sm" color="blue">
                    {selectedPart === group.part ? (
                      <IconFolderOpen size={14} />
                    ) : (
                      <IconFolder size={14} />
                    )}
                  </ThemeIcon>
                }
                rightSection={
                  <Badge variant="light" size="xs" color="gray">
                    {group.files.length}
                  </Badge>
                }
                opened={selectedPart === group.part}
                onClick={() =>
                  setSelectedPart(
                    selectedPart === group.part ? null : group.part,
                  )
                }
              >
                {group.files.map((file) => (
                  <NavLink
                    key={file.key}
                    label={getFileName(file.key)}
                    description={formatFileSize(file.size)}
                    leftSection={
                      <ThemeIcon variant="light" size="sm" color="teal">
                        <IconFile3d size={14} />
                      </ThemeIcon>
                    }
                    active={selectedKey === file.key}
                    onClick={() => handleFileClick(file.key)}
                  />
                ))}
              </NavLink>
            ))}
          </Stack>
        </ScrollArea>
      </Box>

      {/* Canvas area */}
      <Box style={{ flex: 1, position: "relative" }}>
        {signedUrl ? (
          <ModelViewer url={signedUrl} />
        ) : isPending ? (
          <Center h="100%">
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text c="dimmed" size="sm">
                Loading model…
              </Text>
            </Stack>
          </Center>
        ) : (
          <Center h="100%">
            <Stack align="center" gap="xs">
              <ThemeIcon variant="light" size={64} radius="xl" color="gray">
                <IconFile3d size={32} />
              </ThemeIcon>
              <Text c="dimmed" size="lg">
                Select a model to view
              </Text>
              <Text c="dimmed" size="xs">
                Choose a folder and file from the sidebar
              </Text>
            </Stack>
          </Center>
        )}
      </Box>
    </Group>
  );
}
