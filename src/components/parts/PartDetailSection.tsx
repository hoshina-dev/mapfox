"use client";

import {
  ActionIcon,
  Alert,
  Badge,
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
  Title,
  Tooltip,
  useCombobox,
} from "@mantine/core";
import { IconCheck, IconPencil, IconPhoto, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { createCategory } from "@/app/actions/categories";
import { deletePart, updatePart } from "@/app/actions/parts";
import type {
  GetCategoriesQuery,
  GetPartQuery,
} from "@/libs/api/pasta/generated/graphql";

type PartData = NonNullable<GetPartQuery["part"]>;
type CategoryItem = GetCategoriesQuery["categories"][number];

interface PartDetailSectionProps {
  part: PartData;
  categories: CategoryItem[];
}

export function PartDetailSection({
  part,
  categories,
}: PartDetailSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={3}>Edit Part</Title>
          <PartEditForm
            part={part}
            categories={categories}
            onCancel={() => setIsEditing(false)}
          />
        </Stack>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={3}>Details</Title>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={() => setIsEditing(true)}
            aria-label="Edit part"
          >
            <IconPencil size={20} />
          </ActionIcon>
        </Group>

        <Stack gap="sm">
          <div>
            <Text size="sm" c="dimmed">
              Part Number
            </Text>
            <Text fw={500}>{part.partNumber}</Text>
          </div>

          {part.description && (
            <div>
              <Text size="sm" c="dimmed">
                Description
              </Text>
              <Text>{part.description}</Text>
            </div>
          )}

          {part.manufacturer && (
            <div>
              <Text size="sm" c="dimmed">
                Manufacturer
              </Text>
              <Text fw={500}>{part.manufacturer.name}</Text>
              {part.manufacturer.countryOfOrigin && (
                <Badge variant="light" size="sm" mt={4}>
                  {part.manufacturer.countryOfOrigin}
                </Badge>
              )}
            </div>
          )}

          <div>
            <Text size="sm" c="dimmed">
              Condition
            </Text>
            <Badge variant="light" color="blue">
              {part.condition}
            </Badge>
          </div>

          <div>
            <Text size="sm" c="dimmed">
              Availability
            </Text>
            <Badge
              color={part.isAvailable ? "green" : "red"}
              variant="light"
              leftSection={
                part.isAvailable ? <IconCheck size={12} /> : <IconX size={12} />
              }
            >
              {part.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>

          {part.temperatureStage && (
            <div>
              <Text size="sm" c="dimmed">
                Temperature Stage
              </Text>
              <Text>{part.temperatureStage}</Text>
            </div>
          )}

          {part.categories && part.categories.length > 0 && (
            <div>
              <Text size="sm" c="dimmed">
                Categories
              </Text>
              <Group gap="xs" mt={4}>
                {part.categories.map((cat) => (
                  <Badge key={cat.id} variant="outline">
                    {cat.name}
                  </Badge>
                ))}
              </Group>
            </div>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}

export function PartDeleteButton({ partId }: { partId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this part?")) return;

    setLoading(true);
    setError(null);

    try {
      const result = await deletePart(partId);
      if (!result.success) {
        setError(result.error || "Failed to delete part");
        return;
      }
      router.push("/parts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete part");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert color="red" title="Error" mb="md">
          {error}
        </Alert>
      )}
      <Button
        color="red"
        variant="outline"
        loading={loading}
        onClick={handleDelete}
      >
        Delete Part
      </Button>
    </>
  );
}

// Edit Form
const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function PartEditForm({
  part,
  categories: allCategories,
  onCancel,
}: {
  part: PartData;
  categories: CategoryItem[];
  onCancel: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [name, setName] = useState(part.name);
  const [description, setDescription] = useState(part.description || "");
  const [condition, setCondition] = useState(part.condition);
  const [isAvailable, setIsAvailable] = useState(part.isAvailable);
  const [temperatureStage, setTemperatureStage] = useState(
    part.temperatureStage || "",
  );

  // Categories
  const [categories, setCategories] = useState<CategoryItem[]>(allCategories);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    part.categories?.map((c) => c.id) || [],
  );
  const [categorySearch, setCategorySearch] = useState("");
  const categoryCombobox = useCombobox({
    onDropdownClose: () => categoryCombobox.resetSelectedOption(),
  });

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

  // Images
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(
    part.images,
  );
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const resetFileInputRef = useRef<() => void>(null);

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

  const handleRemoveNewFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  };

  const handleRemoveExistingImage = (url: string) => {
    setExistingImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const originalCategoryIds = part.categories?.map((c) => c.id) || [];
  const hasChanged =
    name !== part.name ||
    description !== (part.description || "") ||
    condition !== part.condition ||
    isAvailable !== part.isAvailable ||
    temperatureStage !== (part.temperatureStage || "") ||
    selectedFiles.length > 0 ||
    existingImageUrls.length !== part.images.length ||
    !existingImageUrls.every((url, idx) => url === part.images[idx]) ||
    selectedCategoryIds.length !== originalCategoryIds.length ||
    !selectedCategoryIds.every((id) => originalCategoryIds.includes(id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await updatePart(
        part.id,
        {
          name,
          description: description || undefined,
          condition,
          isAvailable,
          temperatureStage: temperatureStage || undefined,
          categoryIds: selectedCategoryIds,
        },
        selectedFiles.length > 0 ? selectedFiles : undefined,
        existingImageUrls,
        part.images,
      );

      if (!result.success) {
        setError(result.error || "Failed to update part");
        return;
      }

      router.refresh();
      onCancel();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update part");
    } finally {
      setLoading(false);
    }
  };

  const totalImages = existingImageUrls.length + selectedFiles.length;

  return (
    <>
      {error && (
        <Alert color="red" title="Error" mb="md">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Part Name"
            required
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            minRows={3}
          />

          {/* Category Selection */}
          <div>
            <Text size="sm" fw={500} mb={4}>
              Categories
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
            />
            <TextInput
              label="Temperature Stage"
              placeholder="e.g., High, Low, Room"
              value={temperatureStage}
              onChange={(e) => setTemperatureStage(e.currentTarget.value)}
            />
          </Group>

          <Checkbox
            label="Available"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.currentTarget.checked)}
          />

          {/* Image Upload */}
          <div>
            <Text fw={500} size="sm" mb="xs">
              Images
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
                  Add More Images
                </Button>
              )}
            </FileButton>

            {totalImages > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <Text size="sm" fw={500} mb="xs">
                  Images ({totalImages})
                </Text>
                <Group gap="sm">
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
                            onClick={() => handleRemoveExistingImage(url)}
                            disabled={loading}
                            style={{ pointerEvents: "auto" }}
                          >
                            <IconX size={20} />
                          </ActionIcon>
                        </div>
                      </Card>
                    </Tooltip>
                  ))}
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

          <Group justify="flex-end">
            <Button variant="default" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!hasChanged || !name.trim()}
            >
              Update Part
            </Button>
          </Group>
        </Stack>
      </form>
    </>
  );
}
