"use client";

import {
  ActionIcon,
  Alert,
  Button,
  Card,
  FileButton,
  Group,
  MultiSelect,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconPhoto, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { createPart } from "@/app/actions/parts";

interface ManufacturerOption {
  id: string;
  name: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface CreatePartFormProps {
  manufacturers: ManufacturerOption[];
  categories: CategoryOption[];
}

export function CreatePartForm({
  manufacturers,
  categories,
}: CreatePartFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const resetFileInputRef = useRef<() => void>(null);

  const [name, setName] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [description, setDescription] = useState("");
  const [manufacturerId, setManufacturerId] = useState<string | null>(null);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState("");
  const [temperatureStage, setTemperatureStage] = useState("");

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

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

    setSelectedFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    resetFileInputRef.current?.();
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  };

  const parseSpecifications = (): Record<string, unknown> | undefined => {
    if (!specifications.trim()) return undefined;
    try {
      return JSON.parse(specifications);
    } catch {
      return undefined;
    }
  };

  const isFormValid = name && partNumber && manufacturerId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const result = await createPart(
        {
          name,
          partNumber,
          description: description || undefined,
          manufacturerId: manufacturerId!,
          categoryIds,
          specifications: parseSpecifications(),
          temperatureStage: temperatureStage || undefined,
        },
        selectedFiles.length > 0 ? selectedFiles : undefined,
      );

      if (!result.success) {
        setError(result.error || "Failed to create part");
        return;
      }

      router.push("/backoffice/parts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create part");
    } finally {
      setLoading(false);
    }
  };

  const manufacturerOptions = manufacturers.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <>
      {error && (
        <Alert color="red" title="Error" mb="lg">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          <TextInput
            label="Part Name"
            placeholder="Enter part name"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            description="The name of the part"
          />

          <TextInput
            label="Part Number"
            placeholder="e.g., PT-001"
            required
            value={partNumber}
            onChange={(e) => setPartNumber(e.currentTarget.value)}
            description="A unique identifier for this part"
          />

          <Textarea
            label="Description"
            placeholder="Describe the part"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            description="Optional description of the part"
            minRows={3}
          />

          <Select
            label="Manufacturer"
            placeholder="Select a manufacturer"
            required
            data={manufacturerOptions}
            value={manufacturerId}
            onChange={setManufacturerId}
            searchable
            description="The manufacturer of this part"
          />

          <MultiSelect
            label="Categories"
            placeholder="Select categories"
            data={categoryOptions}
            value={categoryIds}
            onChange={setCategoryIds}
            searchable
            description="Optional categories to classify this part"
          />

          <TextInput
            label="Temperature Stage"
            placeholder="e.g., -40°C to 85°C"
            value={temperatureStage}
            onChange={(e) => setTemperatureStage(e.currentTarget.value)}
            description="Operating temperature range"
          />

          <Textarea
            label="Specifications (JSON)"
            placeholder='e.g., {"voltage": "3.3V", "current": "500mA"}'
            value={specifications}
            onChange={(e) => setSpecifications(e.currentTarget.value)}
            description="Technical specifications as a JSON object"
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

            {selectedFiles.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <Text size="sm" fw={500} mb="xs">
                  Selected Images ({selectedFiles.length})
                </Text>
                <Group gap="sm">
                  {imagePreviewUrls.map((url, index) => (
                    <Tooltip
                      key={index}
                      label={`${selectedFiles[index].name} (${(selectedFiles[index].size / 1024).toFixed(2)} KB)`}
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
                          alt={`Preview ${index + 1}`}
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
                            onClick={() => handleRemoveFile(index)}
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

          <Group justify="flex-end" pt="md">
            <Button
              variant="default"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!isFormValid || loading}
            >
              Create Part
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  );
}
