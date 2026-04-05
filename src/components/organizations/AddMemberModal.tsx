"use client";

import {
  Alert,
  Avatar,
  Button,
  Group,
  Loader,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalRoot,
  ModalTitle,
  Radio,
  RadioGroup,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconSearch, IconUserPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { addOrganizationMember } from "@/app/actions/addOrganizationMember";
import { searchUsers } from "@/app/actions/searchUsers";
import type { MemberRole, UserResponse } from "@/libs/api/custapi";

interface AddMemberModalProps {
  opened: boolean;
  onClose: () => void;
  organizationId: string;
  existingMemberIds: string[];
}

export function AddMemberModal({
  opened,
  onClose,
  organizationId,
  existingMemberIds,
}: AddMemberModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<UserResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [role, setRole] = useState<MemberRole>("user");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const resetState = useCallback(() => {
    setQuery("");
    setResults([]);
    setSelectedUser(null);
    setRole("user");
    setError(null);
    setSearching(false);
    setSubmitting(false);
    setSearchPerformed(false);
  }, []);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearching(true);
    setError(null);
    setSelectedUser(null);
    setSearchPerformed(true);

    const result = await searchUsers(trimmed, 10);

    if (result.success) {
      // Filter out users who are already members
      const filtered = result.data.filter(
        (u) => !existingMemberIds.includes(u.id),
      );
      setResults(filtered);
    } else {
      setError(result.error ?? "Search failed");
      setResults([]);
    }

    setSearching(false);
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    setError(null);

    const result = await addOrganizationMember(
      organizationId,
      selectedUser.id,
      role,
    );

    if (result.success) {
      handleClose();
      router.refresh();
    } else {
      setError(result.error ?? "Failed to add member");
      setSubmitting(false);
    }
  };

  return (
    <ModalRoot opened={opened} onClose={handleClose} size="md" zIndex={1100}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle fw={600}>Add Member</ModalTitle>
        </ModalHeader>
        <ModalBody pb="lg">
          <Stack gap="md">
            {/* Search input */}
            <TextInput
              label="Search by name or email"
              placeholder="Enter name or email..."
              leftSection={<IconSearch size={16} />}
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              rightSection={
                searching ? (
                  <Loader size="xs" />
                ) : (
                  <Button
                    variant="subtle"
                    size="compact-xs"
                    onClick={handleSearch}
                    disabled={!query.trim()}
                  >
                    Search
                  </Button>
                )
              }
              rightSectionWidth={70}
            />

            {/* Search results */}
            {searchPerformed && !searching && results.length === 0 && (
              <Text size="sm" c="dimmed" ta="center">
                No users found (or all matches are already members).
              </Text>
            )}

            {results.length > 0 && (
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Select a user
                </Text>
                {results.map((user) => (
                  <Button
                    key={user.id}
                    variant={selectedUser?.id === user.id ? "light" : "default"}
                    color={selectedUser?.id === user.id ? "blue" : "gray"}
                    fullWidth
                    justify="flex-start"
                    h="auto"
                    py="xs"
                    onClick={() => setSelectedUser(user)}
                  >
                    <Group gap="sm" wrap="nowrap">
                      <Avatar
                        src={user.avatarUrl}
                        alt={user.name}
                        radius="xl"
                        size="sm"
                      />
                      <div style={{ textAlign: "left" }}>
                        <Text size="sm" fw={500} lineClamp={1}>
                          {user.name}
                        </Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {user.email}
                        </Text>
                      </div>
                    </Group>
                  </Button>
                ))}
              </Stack>
            )}

            {/* Role selection - shown when a user is selected */}
            {selectedUser && (
              <RadioGroup
                label="Role"
                value={role}
                onChange={(v) => setRole(v as "manager" | "user")}
              >
                <Stack gap="xs" mt="xs">
                  <Radio
                    value="user"
                    label="User"
                    description="Can view organization details and participate as a member."
                  />
                  <Radio
                    value="manager"
                    label="Manager"
                    description="Can manage organization settings, add or remove members, and change roles."
                  />
                </Stack>
              </RadioGroup>
            )}

            {error && (
              <Alert color="red" variant="light">
                {error}
              </Alert>
            )}

            {/* Actions */}
            <Group justify="flex-end" mt="xs">
              <Button variant="default" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                leftSection={<IconUserPlus size={16} />}
                onClick={handleSubmit}
                disabled={!selectedUser}
                loading={submitting}
              >
                Add Member
              </Button>
            </Group>
          </Stack>
        </ModalBody>
      </ModalContent>
    </ModalRoot>
  );
}
