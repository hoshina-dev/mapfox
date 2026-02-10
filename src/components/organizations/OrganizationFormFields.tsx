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
import { RefObject } from "react";

import { LocationPickerModal } from "./LocationPickerModal";

interface FormData {
  name?: string;
  lat?: number;
  lng?: number;
  address?: string;
  description?: string;
}

interface OrganizationFormFieldsProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: unknown) => void;
  loading: boolean;
  error: string | null;
  fileError: string | null;
  onFileErrorClose: () => void;
  selectedFiles: File[];
  imagePreviewUrls: string[];
  onFilesChange: (files: File[]) => void;
  onRemoveNewFile: (index: number) => void;
  existingImageUrls?: string[];
  onRemoveExistingImage?: (url: string) => void;
  showMapPicker: boolean;
  onShowMapPicker: (show: boolean) => void;
  onLocationSelect: (lat: number, lng: number) => void;
  resetFileInputRef: RefObject<(() => void) | null>;
  onSubmit: (e: React.SubmitEvent) => void;
  onCancel: () => void;
  submitButtonText: string;
  cancelButtonText?: string;
  imageUploadLabel?: string;
  imageDescription?: string;
  isSubmitDisabled?: boolean;
}

export function OrganizationFormFields({
  formData,
  onInputChange,
  loading,
  error,
  fileError,
  onFileErrorClose,
  selectedFiles,
  imagePreviewUrls,
  onFilesChange,
  onRemoveNewFile,
  existingImageUrls = [],
  onRemoveExistingImage,
  showMapPicker,
  onShowMapPicker,
  onLocationSelect,
  resetFileInputRef,
  onSubmit,
  onCancel,
  submitButtonText,
  cancelButtonText = "Cancel",
  imageUploadLabel = "Select Images",
  imageDescription = "Upload images for the organization. Each image must be under 1MB. Supported formats: JPEG, PNG, WebP.",
  isSubmitDisabled = false,
}: OrganizationFormFieldsProps) {
  const totalImages = existingImageUrls.length + selectedFiles.length;

  return (
    <>
      {error && (
        <Alert color="red" title="Error" mb="lg">
          {error}
        </Alert>
      )}

      <form onSubmit={onSubmit}>
        <Stack gap="lg">
          {/* Organization Name */}
          <TextInput
            label="Organization Name"
            placeholder="Enter organization name"
            required
            value={formData.name || ""}
            onChange={(e) => onInputChange("name", e.currentTarget.value)}
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
                onClick={() => onShowMapPicker(true)}
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
                onChange={(val) => onInputChange("lat", val)}
                description="Geographic latitude"
                decimalScale={6}
              />
              <NumberInput
                label="Longitude"
                placeholder="100.5322"
                required
                value={formData.lng}
                onChange={(val) => onInputChange("lng", val)}
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
            onChange={(e) => onInputChange("address", e.currentTarget.value)}
            description="Physical address of the organization"
          />

          {/* Description */}
          <Textarea
            label="Description"
            placeholder="Describe the organization, its mission, or key activities"
            value={formData.description || ""}
            onChange={(e) =>
              onInputChange("description", e.currentTarget.value)
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
              {imageDescription}
            </Text>

            {fileError && (
              <Alert
                color="red"
                title="Upload Error"
                mb="md"
                withCloseButton
                onClose={onFileErrorClose}
              >
                {fileError}
              </Alert>
            )}

            <FileButton
              onChange={onFilesChange}
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
                  {imageUploadLabel}
                </Button>
              )}
            </FileButton>

            {totalImages > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <Text size="sm" fw={500} mb="xs">
                  {existingImageUrls.length > 0
                    ? `Images (${totalImages})`
                    : `Selected Images (${totalImages})`}
                </Text>

                <Group gap="sm">
                  {/* Existing images */}
                  {existingImageUrls.map((url, index) => (
                    <Tooltip key={`existing-${index}`} label={url} withArrow>
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
                          alt={`Existing ${index + 1}`}
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
                            onClick={() => onRemoveExistingImage?.(url)}
                            disabled={loading}
                            style={{ pointerEvents: "auto" }}
                          >
                            <IconX size={20} />
                          </ActionIcon>
                        </div>
                      </Card>
                    </Tooltip>
                  ))}

                  {/* New images to be uploaded */}
                  {imagePreviewUrls.map((url, index) => (
                    <Tooltip
                      key={`new-${index}`}
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
                            onClick={() => onRemoveNewFile(index)}
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
            <Button variant="default" onClick={onCancel} disabled={loading}>
              {cancelButtonText}
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={isSubmitDisabled || loading}
            >
              {submitButtonText}
            </Button>
          </Group>
        </Stack>
      </form>

      {/* Map Picker Modal */}
      <LocationPickerModal
        opened={showMapPicker}
        onClose={() => onShowMapPicker(false)}
        onLocationSelect={onLocationSelect}
        initialLat={formData.lat || 13.7388}
        initialLng={formData.lng || 100.5322}
      />
    </>
  );
}
