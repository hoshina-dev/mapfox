"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { updateOrganization } from "@/app/actions/updateOrganization";
import type {
  OrganizationResponse,
  UpdateOrganizationRequest,
} from "@/libs/generated/custapi";

import { OrganizationFormFields } from "./OrganizationFormFields";

interface OrganizationEditFormProps {
  organization: OrganizationResponse;
  onCancel: () => void;
}

export function OrganizationEditForm({
  organization,
  onCancel,
}: OrganizationEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    organization.imageUrls || [],
  );
  const [showMapPicker, setShowMapPicker] = useState(false);
  const resetFileInputRef = useRef<() => void>(null);

  const [formData, setFormData] = useState<UpdateOrganizationRequest>({
    name: organization.name || "",
    lat: organization.lat || 13.7388,
    lng: organization.lng || 100.5322,
    address: organization.address || "",
    description: organization.description || "",
  });

  const handleInputChange = (
    field: keyof UpdateOrganizationRequest,
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

  const handleRemoveNewFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  };

  const handleRemoveExistingImage = (url: string) => {
    setExistingImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    handleInputChange("lat", lat);
    handleInputChange("lng", lng);
    setShowMapPicker(false);
  };

  // Check if any data has changed
  const hasDataChanged =
    formData.name !== (organization.name || "") ||
    formData.lat !== (organization.lat || 13.7388) ||
    formData.lng !== (organization.lng || 100.5322) ||
    formData.address !== (organization.address || "") ||
    formData.description !== (organization.description || "") ||
    selectedFiles.length > 0 ||
    existingImageUrls.length !== (organization.imageUrls?.length || 0) ||
    !existingImageUrls.every(
      (url, idx) => url === organization.imageUrls?.[idx],
    );

  // Validation: must have at least one image and data must have changed
  const hasImages = existingImageUrls.length > 0 || selectedFiles.length > 0;
  const isSubmitDisabled = !hasImages || !hasDataChanged;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    // Validate that at least one image exists
    if (existingImageUrls.length === 0 && selectedFiles.length === 0) {
      setError("Organization must have at least one image");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await updateOrganization(
        organization.id!,
        formData,
        selectedFiles.length > 0 ? selectedFiles : undefined,
        existingImageUrls,
        organization.imageUrls,
      );

      if (!result.success) {
        setError(result.error || "Failed to update organization");
        return;
      }

      // Refresh the page on success
      router.refresh();
      onCancel(); // Close the edit form

      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update organization";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrganizationFormFields
      formData={formData}
      onInputChange={handleInputChange}
      loading={loading}
      error={error}
      fileError={fileError}
      onFileErrorClose={() => setFileError(null)}
      selectedFiles={selectedFiles}
      imagePreviewUrls={imagePreviewUrls}
      onFilesChange={handleFilesChange}
      onRemoveNewFile={handleRemoveNewFile}
      existingImageUrls={existingImageUrls}
      onRemoveExistingImage={handleRemoveExistingImage}
      showMapPicker={showMapPicker}
      onShowMapPicker={setShowMapPicker}
      onLocationSelect={handleLocationSelect}
      resetFileInputRef={resetFileInputRef}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      submitButtonText="Update Organization"
      imageUploadLabel="Add More Images"
      imageDescription="Upload images for the organization. Each image must be under 1MB. Supported formats: JPEG, PNG, WebP. At least one image is required."
      isSubmitDisabled={isSubmitDisabled}
    />
  );
}
