"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { createOrganization } from "@/app/actions/createOrganization";
import type { CreateOrganizationRequest } from "@/libs/generated/custapi";

import { OrganizationFormFields } from "./OrganizationFormFields";

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

  // Validation: must have at least one image
  const isSubmitDisabled = selectedFiles.length === 0;

  const handleSubmit = async (e: React.SubmitEvent) => {
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
      onRemoveNewFile={handleRemoveFile}
      showMapPicker={showMapPicker}
      onShowMapPicker={setShowMapPicker}
      onLocationSelect={handleLocationSelect}
      resetFileInputRef={resetFileInputRef}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
      submitButtonText="Create Organization"
      imageUploadLabel="Select Images"
      isSubmitDisabled={isSubmitDisabled}
    />
  );
}
