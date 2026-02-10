"use client";

import {
  ActionIcon,
  Alert,
  Button,
  Card,
  FileButton,
  Group,
  NumberInput,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconMapPin, IconPhoto, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { createOrganization } from "@/app/actions/createOrganization";
import type { CreateOrganizationRequest } from "@/libs/generated/custapi";

import { LocationPickerModal } from "./LocationPickerModal";

export function CreateOrganizationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const resetFileInputRef = useRef<() => void>(null);

  const [formData, setFormData] = useState<CreateOrganizationRequest>({
    name: "",
    lat: 13.7388,
    lng: 100.5322,
    address: "",
    description: "",
    imageUrls: [],
  });

  const handleInputChange = (
    field: keyof CreateOrganizationRequest,
    value: unknown,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

  const handleFilesChange = (files: File[]) => {
    setFileError(null);

    // Validate file sizes
    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFiles.length > 0) {
      const errorMsg = `The following files exceed 1MB: ${oversizedFiles.map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join(", ")}`;
      setFileError(errorMsg);
      return;
    }

    // Validate file types
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type),
    );

    if (invalidFiles.length > 0) {
      const errorMsg = `Invalid file types: ${invalidFiles.map((f) => f.name).join(", ")}. Only JPEG, PNG, and WebP are allowed.`;
      setFileError(errorMsg);
      return;
    }

    // Update selected files
    setSelectedFiles((prev) => [...prev, ...files]);

    // Create preview URLs
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input to allow re-selecting the same files
    resetFileInputRef.current?.();
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    handleInputChange("lat", lat);
    handleInputChange("lng", lng);
    setShowMapPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await createOrganization(
        formData,
        selectedFiles.length > 0 ? selectedFiles : undefined,
      );

      if (!result.success) {
        setError(result.error || "Failed to create organization");
        return;
      }

      // Redirect to organizations page on success
      router.push("/organizations");
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create organization";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert color="red" title="Error" mb="lg">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          {/* Organization Name */}
          <TextInput
            label="Organization Name"
            placeholder="Enter organization name"
            required
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.currentTarget.value)}
            description="The name of the organization"
          />

          {/* Location Coordinates */}
          <div>
            <Group justify="space-between" align="flex-end" mb="sm">
              <div>
                <Text fw={500} size="sm">
                  Location
                </Text>
                <Text size="xs" c="dimmed">
                  Click the map button to pick a location, or enter coordinates
                  manually
                </Text>
              </div>
              <Button
                size="sm"
                variant="light"
                leftSection={<IconMapPin size={16} />}
                onClick={() => setShowMapPicker(true)}
              >
                Pick on Map
              </Button>
            </Group>
            <Group grow>
              <NumberInput
                label="Latitude"
                placeholder="13.7388"
                required
                value={formData.lat}
                onChange={(val) => handleInputChange("lat", val)}
                description="Geographic latitude"
                decimalScale={6}
              />
              <NumberInput
                label="Longitude"
                placeholder="100.5322"
                required
                value={formData.lng}
                onChange={(val) => handleInputChange("lng", val)}
                description="Geographic longitude"
                decimalScale={6}
              />
            </Group>
          </div>

          {/* Address */}
          <TextInput
            label="Address"
            placeholder="e.g., 254 St, Bangkok, TH"
            value={formData.address || ""}
            onChange={(e) =>
              handleInputChange("address", e.currentTarget.value)
            }
            description="Physical address of the organization"
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Describe the organization, its mission, or key activities"
            value={formData.description || ""}
            onChange={(e) =>
              handleInputChange("description", e.currentTarget.value)
            }
            description="Additional details about the organization"
            minRows={4}
          />

          {/* Image Upload */}
          <div>
            <Text fw={500} size="sm" mb="xs">
              Images
            </Text>
            <Text size="xs" c="dimmed" mb="md">
              Upload images for the organization. Each image must be under 1MB.
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

          {/* Submit Button */}
          <Group justify="flex-end" pt="md">
            <Button
              variant="default"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Organization
            </Button>
          </Group>
        </Stack>
      </form>

      {/* Map Picker Modal */}
      <LocationPickerModal
        opened={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onLocationSelect={handleLocationSelect}
        initialLat={formData.lat}
        initialLng={formData.lng}
      />
    </>
  );
}
