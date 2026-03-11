"use client";

import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Checkbox,
  Combobox,
  ComboboxDropdown,
  ComboboxEmpty,
  ComboboxOption,
  ComboboxOptions,
  ComboboxTarget,
  FileButton,
  Group,
  InputBase,
  Pill,
  PillGroup,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
  useCombobox,
} from "@mantine/core";
import { IconPhoto, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { createCategory } from "@/app/actions/categories";
import { createPart } from "@/app/actions/parts";
import type {
  GetCategoriesQuery,
  GetManufacturersQuery,
} from "@/libs/api/pasta/generated/graphql";

type ManufacturerItem = GetManufacturersQuery["manufacturers"][number];
type CategoryItem = GetCategoriesQuery["categories"][number];

interface CreatePartFormProps {
  manufacturers: ManufacturerItem[];
  categories: CategoryItem[];
  organizationId: string;
  userId: string;
}

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function CreatePartForm({
  manufacturers,
  categories: initialCategories,
  organizationId,
  userId,
}: CreatePartFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("New");
  const [isAvailable, setIsAvailable] = useState(true);
  const [temperatureStage, setTemperatureStage] = useState("");

  // Manufacturer selection
  const [manufacturerId, setManufacturerId] = useState<string | null>(null);
  const [manufacturerSearch, setManufacturerSearch] = useState("");

  // Category selection with autocomplete + create
  const [categories, setCategories] =
    useState<CategoryItem[]>(initialCategories);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const categoryCombobox = useCombobox({
    onDropdownClose: () => categoryCombobox.resetSelectedOption(),
  });

  // Image upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const resetFileInputRef = useRef<() => void>(null);

  // Manufacturer filtering
  const filteredManufacturers = manufacturers.filter((m) =>
    m.name.toLowerCase().includes(manufacturerSearch.toLowerCase()),
  );

  // Category filtering
  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase()) &&
      !selectedCategoryIds.includes(c.id),
  );

  const exactCategoryMatch = categories.some(
    (c) => c.name.toLowerCase() === categorySearch.toLowerCase(),
  );

  const handleSelectCategory = async (categoryId: string) => {
    if (categoryId === "$create") {
      // Create new category
      const result = await createCategory(categorySearch.trim());
      if (result.success) {
        setCategories((prev) => [...prev, result.data]);
        setSelectedCategoryIds((prev) => [...prev, result.data.id]);
      }
    } else {
      setSelectedCategoryIds((prev) => [...prev, categoryId]);
    }
    setCategorySearch("");
    categoryCombobox.closeDropdown();
  };

  const handleRemoveCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
  };

  // Image handling
  const handleFilesChange = (files: File[]) => {
    setFileError(null);

    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      setFileError(
        `The following files exceed 1MB: ${oversizedFiles.map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join(", ")}`,
      );
      return;
    }

    const invalidFiles = files.filter(
      (file) => !ALLOWED_TYPES.includes(file.type),
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

  const isSubmitDisabled =
    !name.trim() ||
    !partNumber.trim() ||
    !manufacturerId ||
    selectedCategoryIds.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manufacturerId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await createPart(
        {
          name,
          partNumber,
          description: description || undefined,
          condition,
          isAvailable,
          temperatureStage: temperatureStage || undefined,
          manufacturerId,
          categoryIds: selectedCategoryIds,
          organizationId,
          userId,
        },
        selectedFiles.length > 0 ? selectedFiles : undefined,
      );

      if (!result.success) {
        setError(result.error || "Failed to create part");
        return;
      }

      router.push("/parts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create part");
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
            placeholder="e.g., ABC-12345"
            required
            value={partNumber}
            onChange={(e) => setPartNumber(e.currentTarget.value)}
            description="Unique part identifier number"
          />

          <Textarea
            label="Description"
            placeholder="Describe the part"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            description="Additional details about the part"
            minRows={3}
          />

          {/* Manufacturer Selection */}
          <Select
            label="Manufacturer"
            placeholder="Search manufacturer..."
            required
            searchable
            value={manufacturerId}
            onChange={setManufacturerId}
            onSearchChange={setManufacturerSearch}
            searchValue={manufacturerSearch}
            data={filteredManufacturers.map((m) => ({
              value: m.id,
              label: m.name,
            }))}
            description="Select the manufacturer of this part"
            nothingFoundMessage="No manufacturers found"
          />

          {/* Category Selection with Autocomplete */}
          <div>
            <Text size="sm" fw={500} mb={4}>
              Categories{" "}
              <span style={{ color: "var(--mantine-color-red-6)" }}>*</span>
            </Text>
            <Text size="xs" c="dimmed" mb="xs">
              Select categories or type a new one to create it
            </Text>

            {selectedCategoryIds.length > 0 && (
              <PillGroup mb="xs">
                {selectedCategoryIds.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  return (
                    <Pill
                      key={catId}
                      withRemoveButton
                      onRemove={() => handleRemoveCategory(catId)}
                    >
                      {cat?.name || catId}
                    </Pill>
                  );
                })}
              </PillGroup>
            )}

            <Combobox
              store={categoryCombobox}
              onOptionSubmit={handleSelectCategory}
            >
              <ComboboxTarget>
                <InputBase
                  placeholder="Search or create category..."
                  value={categorySearch}
                  onChange={(e) => {
                    setCategorySearch(e.currentTarget.value);
                    categoryCombobox.openDropdown();
                    categoryCombobox.updateSelectedOptionIndex();
                  }}
                  onClick={() => categoryCombobox.openDropdown()}
                  onFocus={() => categoryCombobox.openDropdown()}
                  onBlur={() => categoryCombobox.closeDropdown()}
                  rightSection={
                    categorySearch ? (
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        onClick={() => setCategorySearch("")}
                      >
                        <IconX size={14} />
                      </ActionIcon>
                    ) : null
                  }
                />
              </ComboboxTarget>

              <ComboboxDropdown>
                <ComboboxOptions>
                  {filteredCategories.map((cat) => (
                    <ComboboxOption key={cat.id} value={cat.id}>
                      {cat.name}
                    </ComboboxOption>
                  ))}
                  {categorySearch.trim() && !exactCategoryMatch && (
                    <ComboboxOption value="$create">
                      + Create &quot;{categorySearch.trim()}&quot;
                    </ComboboxOption>
                  )}
                  {filteredCategories.length === 0 &&
                    !categorySearch.trim() && (
                      <ComboboxEmpty>No categories available</ComboboxEmpty>
                    )}
                </ComboboxOptions>
              </ComboboxDropdown>
            </Combobox>
          </div>

          <Group grow>
            <Select
              label="Condition"
              required
              value={condition}
              onChange={(val) => setCondition(val || "New")}
              data={["New", "Used", "Refurbished"]}
              description="The condition of the part"
            />

            <TextInput
              label="Temperature Stage"
              placeholder="e.g., High, Low, Room"
              value={temperatureStage}
              onChange={(e) => setTemperatureStage(e.currentTarget.value)}
              description="Temperature classification"
            />
          </Group>

          <Checkbox
            label="Available"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.currentTarget.checked)}
            description="Whether this part is currently available"
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

            {imagePreviewUrls.length > 0 && (
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
            <Button type="submit" loading={loading} disabled={isSubmitDisabled}>
              Create Part
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  );
}
