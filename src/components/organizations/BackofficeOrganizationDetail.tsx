"use client";

import { Alert, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { deleteOrganization } from "@/app/actions/organizations";
import type { OrganizationResponse } from "@/libs/api/custapi";

import { OrganizationEditForm } from "./OrganizationEditForm";

interface BackofficeOrganizationDetailProps {
  organization: OrganizationResponse;
}

export function BackofficeOrganizationDetail({
  organization,
}: BackofficeOrganizationDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    const result = await deleteOrganization(organization.id);
    if (result.success) {
      router.push("/backoffice/organizations");
      router.refresh();
    } else {
      setError(result.error ?? "Failed to delete organization");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <Stack gap="xl">
      {error && (
        <Alert color="red" title="Error">
          {error}
        </Alert>
      )}

      {isEditing ? (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>Edit Organization</Title>
            <OrganizationEditForm
              organization={organization}
              onCancel={() => setIsEditing(false)}
            />
          </Stack>
        </Card>
      ) : (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Title order={3}>Details</Title>

            {organization.imageUrls.length > 0 && (
              <Group gap="sm">
                {organization.imageUrls.map((url, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={index}
                    src={url}
                    alt={`${organization.name} ${index + 1}`}
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                ))}
              </Group>
            )}

            <Group gap="xs">
              <Text size="sm" fw={500}>
                Name:
              </Text>
              <Text size="sm">{organization.name}</Text>
            </Group>

            {organization.description && (
              <Group gap="xs">
                <Text size="sm" fw={500}>
                  Description:
                </Text>
                <Text size="sm">{organization.description}</Text>
              </Group>
            )}

            {organization.address && (
              <Group gap="xs">
                <Text size="sm" fw={500}>
                  Address:
                </Text>
                <Text size="sm">{organization.address}</Text>
              </Group>
            )}

            <Group gap="xs">
              <Text size="sm" fw={500}>
                Coordinates:
              </Text>
              <Text size="sm" c="dimmed">
                {organization.lat.toFixed(6)}, {organization.lng.toFixed(6)}
              </Text>
            </Group>

            <Group gap="xs">
              <Text size="sm" fw={500}>
                Created:
              </Text>
              <Text size="sm" c="dimmed">
                {new Date(organization.createdAt).toLocaleString()}
              </Text>
            </Group>

            <Group gap="xs">
              <Text size="sm" fw={500}>
                Updated:
              </Text>
              <Text size="sm" c="dimmed">
                {new Date(organization.updatedAt).toLocaleString()}
              </Text>
            </Group>

            <Group justify="flex-end" pt="sm">
              <Button variant="light" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
              {!confirmDelete ? (
                <Button
                  variant="light"
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete
                </Button>
              ) : (
                <Group gap="xs">
                  <Button
                    variant="default"
                    size="compact-md"
                    onClick={() => setConfirmDelete(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="red"
                    size="compact-md"
                    onClick={handleDelete}
                    loading={deleting}
                  >
                    Confirm Delete
                  </Button>
                </Group>
              )}
            </Group>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
