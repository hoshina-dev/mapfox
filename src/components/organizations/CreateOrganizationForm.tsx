"use client";

import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconMapPin, IconTrash, IconUpload } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createOrganization } from "@/app/actions/createOrganization";
import type { CreateOrganizationRequest } from "@/libs/generated/custapi";

import { LocationPickerModal } from "./LocationPickerModal";

export function CreateOrganizationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [showMapPicker, setShowMapPicker] = useState(false);

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

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImageUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
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
      const payload: CreateOrganizationRequest = {
        ...formData,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      };

      const result = await createOrganization(payload);

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

          {/* Image URLs */}
          <div>
            <Text fw={500} size="sm" mb="xs">
              Image URLs
            </Text>
            <Text size="xs" c="dimmed" mb="md">
              Add image URLs for the organization (we&apos;ll add upload
              functionality later)
            </Text>

            <Stack gap="sm" mb="lg">
              <Group gap="xs">
                <TextInput
                  placeholder="https://example.com/image.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.currentTarget.value)}
                  style={{ flex: 1 }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                />
                <Button
                  onClick={handleAddImageUrl}
                  variant="default"
                  leftSection={<IconUpload size={16} />}
                >
                  Add
                </Button>
              </Group>

              {imageUrls.length > 0 && (
                <Stack gap="xs">
                  {imageUrls.map((url, index) => (
                    <Group
                      key={index}
                      justify="space-between"
                      p="sm"
                      bg="gray.1"
                      style={{ borderRadius: "4px" }}
                    >
                      <div style={{ flex: 1 }}>
                        <Text size="sm" truncate>
                          {url}
                        </Text>
                      </div>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => handleRemoveImageUrl(index)}
                        title="Remove image"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              )}

              {imageUrls.length > 0 && (
                <div>
                  <Text size="xs" fw={500} mb="xs">
                    Preview ({imageUrls.length} image
                    {imageUrls.length !== 1 ? "s" : ""})
                  </Text>
                  <Group gap="sm">
                    {imageUrls.map((url, index) => (
                      <Card
                        key={index}
                        p="xs"
                        withBorder
                        style={{ width: 100, height: 100 }}
                      >
                        <Card.Section
                          component="img"
                          src={url}
                          alt={`Preview ${index}`}
                        />
                      </Card>
                    ))}
                  </Group>
                </div>
              )}
            </Stack>
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
