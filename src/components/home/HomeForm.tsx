"use client";

import {
  Alert,
  Autocomplete,
  Avatar,
  Badge,
  Button,
  FileButton,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  Transition,
} from "@mantine/core";
import { IconAlertTriangle, IconCamera } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { updateCurrentUser } from "@/app/actions/updateCurrentUser";
import { type UserDetailResponse, UserRole } from "@/libs/api/custapi";

import { AvatarCropModal } from "./AvatarCropModal";

const SUGGESTED_CATEGORIES = [
  "Quantum Computing",
  "Machine Learning",
  "Data Science",
  "Bioinformatics",
  "Robotics",
  "Cybersecurity",
  "Climate Science",
  "Neuroscience",
  "Genomics",
  "Materials Science",
  "Astrophysics",
  "Economics",
  "Social Sciences",
  "Computer Vision",
  "Natural Language Processing",
];

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface HomeFormProps {
  user: UserDetailResponse;
}

export function HomeForm({ user }: HomeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState(user.name);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");
  const [description, setDescription] = useState(user.description ?? "");
  const [socialMedia, setSocialMedia] = useState(user.socialMedia ?? "");
  const [researchCategories, setResearchCategories] = useState<string[]>(
    user.researchCategories,
  );
  const [categoryInput, setCategoryInput] = useState("");

  // Avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user.avatarUrl ?? null,
  );
  const [fileError, setFileError] = useState<string | null>(null);

  // Crop modal
  const [cropModalOpened, setCropModalOpened] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  // Clear success message after a few seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleFileSelect = (file: File | null) => {
    setFileError(null);

    if (!file) {
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError(
        `File exceeds 1MB limit. Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );
      return;
    }

    // Open crop modal
    const reader = new FileReader();
    reader.onloadend = () => {
      setRawImageSrc(reader.result as string);
      setCropModalOpened(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedFile: File) => {
    setAvatarFile(croppedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(croppedFile);
  };

  const handleAddCategory = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !researchCategories.includes(trimmed)) {
      setResearchCategories((prev) => [...prev, trimmed]);
    }
    setCategoryInput("");
  };

  const handleRemoveCategory = (category: string) => {
    setResearchCategories((prev) => prev.filter((c) => c !== category));
  };

  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory(categoryInput);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateCurrentUser(
        {
          name,
          phoneNumber: phoneNumber || undefined,
          description: description || undefined,
          socialMedia: socialMedia || undefined,
          researchCategories,
        },
        avatarFile ?? undefined,
      );

      if (!result.success) {
        setError(result.error || "Failed to update profile");
        return;
      }

      setSuccess(true);
      setAvatarFile(null); // Reset file since it's been uploaded
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Detect unsaved changes
  const hasUnsavedChanges =
    name !== user.name ||
    phoneNumber !== (user.phoneNumber ?? "") ||
    description !== (user.description ?? "") ||
    socialMedia !== (user.socialMedia ?? "") ||
    avatarFile !== null ||
    JSON.stringify(researchCategories) !==
      JSON.stringify(user.researchCategories);

  const filteredSuggestions = SUGGESTED_CATEGORIES.filter(
    (c) =>
      !researchCategories.includes(c) &&
      c.toLowerCase().includes(categoryInput.toLowerCase()),
  );

  const initials = (() => {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
    return (
      (parts[0][0]?.toUpperCase() ?? "") +
      (parts[parts.length - 1][0]?.toUpperCase() ?? "")
    );
  })();

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          {error && (
            <Alert
              color="red"
              title="Error"
              withCloseButton
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              color="green"
              title="Success"
              withCloseButton
              onClose={() => setSuccess(false)}
            >
              Profile updated successfully.
            </Alert>
          )}

          {/* Avatar Section */}
          <Paper withBorder p="lg" radius="md">
            <Group>
              <div style={{ position: "relative" }}>
                <Avatar
                  src={avatarPreview}
                  alt={user.name}
                  size={100}
                  radius="50%"
                  color="blue"
                >
                  {initials}
                </Avatar>
                <FileButton
                  onChange={handleFileSelect}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                >
                  {(props) => (
                    <Button
                      {...props}
                      variant="filled"
                      size="compact-xs"
                      radius="xl"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                      }}
                    >
                      <IconCamera size={14} />
                    </Button>
                  )}
                </FileButton>
              </div>
              <Stack gap={4}>
                <Group gap="xs" wrap="wrap" align="center">
                  <Text size="lg" fw={600}>
                    {user.name}
                  </Text>
                  {user.role === UserRole.UserRoleAdmin && (
                    <Badge color="blue" variant="light" size="sm">
                      Mapfox Admin
                    </Badge>
                  )}
                </Group>
                <Text size="sm" c="dimmed">
                  {user.email}
                </Text>
              </Stack>
            </Group>

            {fileError && (
              <Text c="red" size="sm" mt="xs">
                {fileError}
              </Text>
            )}
          </Paper>

          {/* Editable Fields */}
          <Paper withBorder p="lg" radius="md">
            <Stack gap="md">
              <Text size="md" fw={600}>
                Profile Information
              </Text>

              <TextInput
                label="Name"
                placeholder="Your name"
                required
                maxLength={255}
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                disabled={loading}
              />

              <TextInput
                label="Email"
                value={user.email}
                disabled
                description="Email cannot be changed"
              />

              <TextInput
                label="Phone Number"
                placeholder="+1234567890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.currentTarget.value)}
                disabled={loading}
              />

              <Textarea
                label="Description"
                placeholder="Tell us about yourself"
                autosize
                minRows={2}
                maxRows={4}
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
                disabled={loading}
              />

              <TextInput
                label="Social Media"
                placeholder="@username on Twitter, linkedin.com/in/you"
                value={socialMedia}
                onChange={(e) => setSocialMedia(e.currentTarget.value)}
                disabled={loading}
              />
            </Stack>
          </Paper>

          {/* Research Categories */}
          <Paper withBorder p="lg" radius="md">
            <Stack gap="md">
              <Text size="md" fw={600}>
                Research Categories
              </Text>

              <Autocomplete
                placeholder="Type a category and press Enter"
                value={categoryInput}
                onChange={setCategoryInput}
                onKeyDown={handleCategoryKeyDown}
                onOptionSubmit={handleAddCategory}
                data={filteredSuggestions}
                disabled={loading}
                description="Press Enter or select a suggestion to add a category"
              />

              {researchCategories.length > 0 && (
                <Group gap="xs">
                  {researchCategories.map((category) => (
                    <Badge
                      key={category}
                      variant="light"
                      color="blue"
                      size="lg"
                      style={{ cursor: "pointer" }}
                      onClick={() => !loading && handleRemoveCategory(category)}
                      rightSection="×"
                    >
                      {category}
                    </Badge>
                  ))}
                </Group>
              )}

              {researchCategories.length === 0 && (
                <Text size="sm" c="dimmed">
                  No research categories added yet.
                </Text>
              )}
            </Stack>
          </Paper>

          <Group justify="flex-end">
            <Button type="submit" loading={loading}>
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>

      {rawImageSrc && (
        <AvatarCropModal
          opened={cropModalOpened}
          onClose={() => setCropModalOpened(false)}
          imageSrc={rawImageSrc}
          onCropComplete={handleCropComplete}
        />
      )}

      <Transition
        mounted={hasUnsavedChanges}
        transition="slide-up"
        duration={300}
      >
        {(styles) => (
          <Alert
            color="yellow"
            title="Unsaved Changes"
            icon={<IconAlertTriangle size={18} />}
            style={{
              ...styles,
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 1000,
              maxWidth: 360,
              boxShadow: "var(--mantine-shadow-md)",
            }}
          >
            You have unsaved changes. Click &quot;Save Changes&quot; to apply
            them.
          </Alert>
        )}
      </Transition>
    </>
  );
}
