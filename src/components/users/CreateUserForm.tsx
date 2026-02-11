"use client";

import {
  Alert,
  Autocomplete,
  Badge,
  Button,
  FileInput,
  Group,
  Image,
  Paper,
  PasswordInput,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { createUser } from "@/app/actions/createUser";
import { searchOrganizations } from "@/app/actions/searchOrganizations";

interface OrganizationOption {
  id: string;
  name: string;
}

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

export function CreateUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [researchCategories, setResearchCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");

  // Organization autocomplete
  const [orgSearch, setOrgSearch] = useState("");
  const [orgOptions, setOrgOptions] = useState<OrganizationOption[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Search organizations as user types
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (orgSearch.length < 1) {
      setOrgOptions([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      const result = await searchOrganizations(orgSearch, 10);
      if (result.success && result.data) {
        const options = (result.data as OrganizationOption[]).map((org) => ({
          id: org.id,
          name: org.name,
        }));
        setOrgOptions(options);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [orgSearch]);

  const handleOrgSelect = (value: string) => {
    setOrgSearch(value);
    const matched = orgOptions.find((o) => o.name === value);
    setSelectedOrgId(matched ? matched.id : null);
  };

  const handleAvatarChange = (file: File | null) => {
    setFileError(null);

    if (!file) {
      setAvatarFile(null);
      setAvatarPreview(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError(
        "Invalid file type. Only JPEG, PNG, and WebP are allowed (no GIFs).",
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setFileError(
        `File exceeds 1MB limit. Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );
      return;
    }

    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
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

    if (!selectedOrgId) {
      setError("Please select a valid organization from the list.");
      setLoading(false);
      return;
    }

    try {
      const result = await createUser(
        {
          name,
          email,
          password,
          organizationId: selectedOrgId,
          phoneNumber: phoneNumber || undefined,
          description: description || undefined,
          socialMedia: socialMedia || undefined,
          researchCategories:
            researchCategories.length > 0 ? researchCategories : undefined,
        },
        avatarFile ?? undefined,
      );

      if (!result.success) {
        setError(result.error || "Failed to create user");
        return;
      }

      setSuccess(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create user";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Paper p="xl" withBorder>
        <Stack align="center" gap="md">
          <Alert color="green" title="User Created Successfully">
            The user has been created. You can create another user or go back to
            the home page.
          </Alert>
          <Group>
            <Button
              variant="light"
              onClick={() => {
                setSuccess(false);
                setName("");
                setEmail("");
                setPassword("");
                setPhoneNumber("");
                setDescription("");
                setSocialMedia("");
                setResearchCategories([]);
                setOrgSearch("");
                setSelectedOrgId(null);
                setAvatarFile(null);
                setAvatarPreview(null);
              }}
            >
              Create Another User
            </Button>
            <Button onClick={() => router.push("/")}>Back to Home</Button>
          </Group>
        </Stack>
      </Paper>
    );
  }

  // Filter suggested categories to exclude already selected ones
  const filteredSuggestions = SUGGESTED_CATEGORIES.filter(
    (c) =>
      !researchCategories.includes(c) &&
      c.toLowerCase().includes(categoryInput.toLowerCase()),
  );

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
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

        <TextInput
          label="Name"
          placeholder="John Doe"
          required
          maxLength={255}
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          disabled={loading}
        />

        <TextInput
          label="Email"
          placeholder="user@example.com"
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          disabled={loading}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter a strong password"
          required
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          disabled={loading}
        />

        <Autocomplete
          label="Organization"
          placeholder="Search for an organization..."
          required
          value={orgSearch}
          onChange={handleOrgSelect}
          data={orgOptions.map((o) => o.name)}
          disabled={loading}
          description={
            selectedOrgId
              ? `Selected: ${selectedOrgId}`
              : "Type to search for organizations"
          }
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
          placeholder="Senior researcher specializing in quantum computing"
          autosize
          minRows={2}
          maxRows={4}
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          disabled={loading}
        />

        <TextInput
          label="Social Media"
          placeholder="@john on Twitter, linkedin.com/in/john"
          value={socialMedia}
          onChange={(e) => setSocialMedia(e.currentTarget.value)}
          disabled={loading}
        />

        {/* Research Categories as Tags/Chips */}
        <div>
          <Autocomplete
            label="Research Categories"
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
            <Group gap="xs" mt="xs">
              {researchCategories.map((category) => (
                <Badge
                  key={category}
                  variant="light"
                  color="blue"
                  size="lg"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRemoveCategory(category)}
                  rightSection="×"
                >
                  {category}
                </Badge>
              ))}
            </Group>
          )}
        </div>

        {/* Avatar Upload */}
        <div>
          <FileInput
            label="Avatar"
            placeholder="Choose an image (max 1MB)"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            value={avatarFile}
            onChange={handleAvatarChange}
            disabled={loading}
            clearable
            description="JPEG, PNG, or WebP only. Max 1MB. No animated images."
          />

          {fileError && (
            <Text c="red" size="sm" mt="xs">
              {fileError}
            </Text>
          )}

          {avatarPreview && (
            <Paper withBorder p="xs" mt="xs" w={120} h={120}>
              <Image
                src={avatarPreview}
                alt="Avatar preview"
                fit="cover"
                w={100}
                h={100}
                radius="md"
              />
            </Paper>
          )}
        </div>

        <Group justify="flex-end" mt="md">
          <Button
            variant="default"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create User
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
