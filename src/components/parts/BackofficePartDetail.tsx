"use client";

import {
  ActionIcon,
  Alert,
  Button,
  Card,
  FileButton,
  Group,
  MultiSelect,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconEdit, IconPhoto, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { updatePart } from "@/app/actions/parts";
import type {
  GetPartQuery,
  GetPartsInventoryByPartQuery,
} from "@/libs/api/papi/generated/graphql";

import { PartDetailSection } from "./PartDetailSection";
import { PartImageCarousel } from "./PartImageCarousel";

type PartData = NonNullable<GetPartQuery["part"]>;
type PartsInventoryRow =
  GetPartsInventoryByPartQuery["partsInventoryByPart"][number];

interface CategoryOption {
  id: string;
  name: string;
}

interface BackofficePartDetailProps {
  part: PartData;
  partsInventory: PartsInventoryRow[];
  categories: CategoryOption[];
}

function formatSpecifications(spec: unknown): string {
  if (spec == null) return "";
  if (typeof spec === "string") return spec;
  try {
    return JSON.stringify(spec, null, 2);
  } catch {
    return String(spec);
  }
}

export function BackofficePartDetail({
  part,
  partsInventory,
  categories,
}: BackofficePartDetailProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [name, setName] = useState(part.name);
  const [description, setDescription] = useState(part.description ?? "");
  const [temperatureStage, setTemperatureStage] = useState(
    part.temperatureStage ?? "",
  );
  const [specifications, setSpecifications] = useState(
    formatSpecifications(part.specifications),
  );
  const [categoryIds, setCategoryIds] = useState<string[]>(
    part.categories?.map((c) => c.id) ?? [],
  );

  const [existingImages, setExistingImages] = useState<string[]>(
    part.images ?? [],
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);
  const resetFileInputRef = useRef<() => void>(null);

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const handleFilesChange = (files: File[]) => {
    setFileError(null);

    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setFileError(
        `The following files exceed 1MB: ${oversizedFiles.map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join(", ")}`,
      );
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type),
    );
    if (invalidFiles.length > 0) {
      setFileError(
        `Invalid file types: ${invalidFiles.map((f) => f.name).join(", ")}. Only JPEG, PNG, and WebP are allowed.`,
      );
      return;
    }

    setNewFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    resetFileInputRef.current?.();
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    if (specifications.trim()) {
      try {
        JSON.parse(specifications);
      } catch {
        setError("Specifications must be valid JSON");
        setLoading(false);
        return;
      }
    }

    try {
      const parsedSpec = specifications.trim()
        ? JSON.parse(specifications)
        : undefined;

      const result = await updatePart(
        part.id,
        {
          name: name || undefined,
          description: description || undefined,
          temperatureStage: temperatureStage || undefined,
          specifications: parsedSpec,
          categoryIds,
        },
        existingImages,
        newFiles.length > 0 ? newFiles : undefined,
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update part");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(part.name);
    setDescription(part.description ?? "");
    setTemperatureStage(part.temperatureStage ?? "");
    setSpecifications(formatSpecifications(part.specifications));
    setCategoryIds(part.categories?.map((c) => c.id) ?? []);
    setExistingImages(part.images ?? []);
    setNewFiles([]);
    setNewPreviewUrls([]);
    setFileError(null);
    setError(null);
    setEditing(false);
  };

  return (
    <Stack gap="xl">
      {!editing && part.images.length > 0 && (
        <PartImageCarousel imageUrls={part.images} partName={part.name} />
      )}

      {!editing ? (
        <>
          <Group justify="flex-end">
            <Button
              variant="light"
              leftSection={<IconEdit size={16} />}
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          </Group>
          <PartDetailSection part={part} partsInventory={partsInventory} />
        </>
      ) : (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>Edit Part</Title>
              <Button
                variant="subtle"
                color="gray"
                size="compact-sm"
                leftSection={<IconX size={14} />}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            </Group>

            {error && (
              <Alert color="red" title="Error">
                {error}
              </Alert>
            )}

            <TextInput
              label="Name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              required
            />

            <TextInput
              label="Part Number"
              value={part.partNumber}
              disabled
              description="Part number cannot be changed after creation."
            />

            <TextInput
              label="Manufacturer"
              value={part.manufacturer?.name ?? "—"}
              disabled
              description="Manufacturer cannot be changed after creation."
            />

            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              minRows={3}
            />

            <TextInput
              label="Temperature Stage"
              placeholder="e.g., -40°C to 85°C"
              value={temperatureStage}
              onChange={(e) => setTemperatureStage(e.currentTarget.value)}
            />

            <MultiSelect
              label="Categories"
              data={categoryOptions}
              value={categoryIds}
              onChange={setCategoryIds}
              searchable
            />

            <Textarea
              label="Specifications (JSON)"
              value={specifications}
              onChange={(e) => setSpecifications(e.currentTarget.value)}
              minRows={3}
              styles={{ input: { fontFamily: "monospace" } }}
            />

            {/* Image Upload */}
            <div>
              <Text fw={500} size="sm" mb="xs">
                Images
              </Text>
              <Text size="xs" c="dimmed" mb="md">
                Upload images for the part. Each image must be under 1MB.
                Supported formats: JPEG, PNG, WebP.
              </Text>

              {fileError && (
                <Alert
                  color="red"
                  title="Upload Error"
                  mb="md"
                  withCloseButton
                  onClose={() => setFileError(null)}
                >
                  {fileError}
                </Alert>
              )}

              <FileButton
                onChange={handleFilesChange}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                resetRef={resetFileInputRef}
              >
                {(props) => (
                  <Button
                    {...props}
                    variant="light"
                    leftSection={<IconPhoto size={16} />}
                    disabled={loading}
                  >
                    Select Images
                  </Button>
                )}
              </FileButton>

              {(existingImages.length > 0 || newFiles.length > 0) && (
                <div style={{ marginTop: "1rem" }}>
                  <Text size="sm" fw={500} mb="xs">
                    Images ({existingImages.length + newFiles.length})
                  </Text>
                  <Group gap="sm">
                    {existingImages.map((url, index) => (
                      <Tooltip
                        key={`existing-${index}`}
                        label="Existing image"
                        withArrow
                      >
                        <Card
                          p={0}
                          withBorder
                          style={{
                            width: 120,
                            height: 120,
                            overflow: "hidden",
                            position: "relative",
                            cursor: "pointer",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`Image ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0,
                              transition: "opacity 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = "1";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "0";
                            }}
                          >
                            <ActionIcon
                              color="red"
                              variant="filled"
                              size="lg"
                              onClick={() => handleRemoveExistingImage(index)}
                              disabled={loading}
                              style={{ pointerEvents: "auto" }}
                            >
                              <IconX size={20} />
                            </ActionIcon>
                          </div>
                        </Card>
                      </Tooltip>
                    ))}
                    {newPreviewUrls.map((url, index) => (
                      <Tooltip
                        key={`new-${index}`}
                        label={`${newFiles[index].name} (${(newFiles[index].size / 1024).toFixed(2)} KB)`}
                        withArrow
                      >
                        <Card
                          p={0}
                          withBorder
                          style={{
                            width: 120,
                            height: 120,
                            overflow: "hidden",
                            position: "relative",
                            cursor: "pointer",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt={`New ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0,
                              transition: "opacity 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = "1";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "0";
                            }}
                          >
                            <ActionIcon
                              color="red"
                              variant="filled"
                              size="lg"
                              onClick={() => handleRemoveNewFile(index)}
                              disabled={loading}
                              style={{ pointerEvents: "auto" }}
                            >
                              <IconX size={20} />
                            </ActionIcon>
                          </div>
                        </Card>
                      </Tooltip>
                    ))}
                  </Group>
                </div>
              )}
            </div>

            <Group justify="flex-end" pt="sm">
              <Button
                variant="default"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} loading={loading}>
                Save Changes
              </Button>
            </Group>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
