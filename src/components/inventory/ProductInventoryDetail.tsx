"use client";

import {
  Alert,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Select,
  Stack,
  Switch,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCheck,
  IconEdit,
  IconLink,
  IconTrash,
  IconUnlink,
  IconX,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  deleteProductInventoryItem,
  linkPartToProductUnit,
  unlinkPartFromProductUnit,
  updateProductInventoryItem,
} from "@/app/actions/products";
import type {
  GetPartsInventoryQuery,
  GetProductInventoryItemQuery,
} from "@/libs/api/papi/generated/graphql";

type InventoryItem = NonNullable<
  GetProductInventoryItemQuery["productInventoryItem"]
>;
type AvailablePartUnit = GetPartsInventoryQuery["partsInventory"][number];

interface ProductInventoryDetailProps {
  item: InventoryItem;
  availablePartUnits: AvailablePartUnit[];
}

export function ProductInventoryDetail({
  item,
  availablePartUnits,
}: ProductInventoryDetailProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkOpened, { open: openLink, close: closeLink }] =
    useDisclosure(false);

  const [serialNumber, setSerialNumber] = useState(item.serialNumber);
  const [isAvailable, setIsAvailable] = useState(item.isAvailable);
  const [notes, setNotes] = useState(item.notes ?? "");

  const [selectedPartUnitId, setSelectedPartUnitId] = useState<string | null>(
    null,
  );
  const [linkLoading, setLinkLoading] = useState(false);

  // Filter available parts: only show isAvailable=true and not already linked
  const linkedPartIds = new Set(item.partsUsed?.map((p) => p.id) ?? []);
  const linkableUnits = availablePartUnits.filter(
    (u) => u.isAvailable && !linkedPartIds.has(u.id),
  );

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const result = await updateProductInventoryItem(item.id, {
      serialNumber: serialNumber.trim() || undefined,
      isAvailable,
      notes: notes.trim() || undefined,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setEditing(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product unit?")) return;

    setLoading(true);
    const result = await deleteProductInventoryItem(item.id);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/backoffice/inventory/products");
  };

  const handleLink = async () => {
    if (!selectedPartUnitId) return;

    setLinkLoading(true);
    const result = await linkPartToProductUnit(selectedPartUnitId, item.id);
    setLinkLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSelectedPartUnitId(null);
    closeLink();
    router.refresh();
  };

  const handleUnlink = async (partsInventoryId: string) => {
    if (!confirm("Unlink this part unit from this product?")) return;

    setLoading(true);
    const result = await unlinkPartFromProductUnit(partsInventoryId, item.id);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.refresh();
  };

  return (
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

      {/* Detail card */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={3}>Unit Details</Title>
            <Group>
              {editing ? (
                <Button
                  variant="subtle"
                  size="compact-sm"
                  leftSection={<IconX size={14} />}
                  onClick={() => {
                    setEditing(false);
                    setSerialNumber(item.serialNumber);
                    setIsAvailable(item.isAvailable);
                    setNotes(item.notes ?? "");
                  }}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  variant="subtle"
                  size="compact-sm"
                  leftSection={<IconEdit size={14} />}
                  onClick={() => setEditing(true)}
                >
                  Edit
                </Button>
              )}
              <Button
                variant="subtle"
                color="red"
                size="compact-sm"
                leftSection={<IconTrash size={14} />}
                onClick={handleDelete}
                loading={loading && !editing}
              >
                Delete
              </Button>
            </Group>
          </Group>

          <div>
            <Text size="sm" c="dimmed">
              Product
            </Text>
            <Text fw={500}>
              {item.product?.name ?? "Unknown"}{" "}
              {item.product?.version && (
                <Text span c="dimmed" size="sm">
                  (v{item.product.version})
                </Text>
              )}
            </Text>
          </div>

          {editing ? (
            <>
              <TextInput
                label="Serial Number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.currentTarget.value)}
                required
              />

              <Switch
                label="Available"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.currentTarget.checked)}
              />

              <Textarea
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.currentTarget.value)}
                autosize
                minRows={2}
              />

              <Group>
                <Button onClick={handleSave} loading={loading}>
                  Save
                </Button>
              </Group>
            </>
          ) : (
            <>
              <div>
                <Text size="sm" c="dimmed">
                  Serial Number
                </Text>
                <Text fw={500} ff="monospace">
                  {item.serialNumber}
                </Text>
              </div>

              <div>
                <Text size="sm" c="dimmed">
                  Status
                </Text>
                <Badge
                  color={item.isAvailable ? "green" : "red"}
                  variant="light"
                >
                  {item.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>

              {item.notes && (
                <div>
                  <Text size="sm" c="dimmed">
                    Notes
                  </Text>
                  <Text>{item.notes}</Text>
                </div>
              )}
            </>
          )}
        </Stack>
      </Card>

      {/* Parts Used card */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={3}>Parts Used</Title>
            <Button
              size="compact-sm"
              leftSection={<IconLink size={14} />}
              onClick={openLink}
              disabled={linkableUnits.length === 0}
            >
              Link Part Unit
            </Button>
          </Group>

          <Text size="sm" c="dimmed">
            Physical part units linked to this assembled product.
          </Text>

          {!item.partsUsed || item.partsUsed.length === 0 ? (
            <Text size="sm" c="dimmed">
              No parts linked to this product unit yet.
            </Text>
          ) : (
            <TableScrollContainer minWidth={400}>
              <Table striped highlightOnHover withTableBorder>
                <TableThead>
                  <TableTr>
                    <TableTh>Part</TableTh>
                    <TableTh>Serial</TableTh>
                    <TableTh>Status</TableTh>
                    <TableTh style={{ width: 80 }} />
                  </TableTr>
                </TableThead>
                <TableTbody>
                  {item.partsUsed.map((pu) => (
                    <TableTr key={pu.id}>
                      <TableTd>
                        <Text size="sm" fw={500}>
                          {pu.part?.name ?? "Unknown"}
                        </Text>
                        {pu.part?.partNumber && (
                          <Text size="xs" c="dimmed">
                            {pu.part.partNumber}
                          </Text>
                        )}
                      </TableTd>
                      <TableTd>
                        <Text size="sm" ff="monospace">
                          {pu.serialNumber}
                        </Text>
                      </TableTd>
                      <TableTd>
                        <Badge
                          color={pu.isAvailable ? "green" : "red"}
                          variant="light"
                          size="sm"
                          leftSection={
                            pu.isAvailable ? (
                              <IconCheck size={12} />
                            ) : (
                              <IconX size={12} />
                            )
                          }
                        >
                          {pu.isAvailable ? "Available" : "In use"}
                        </Badge>
                      </TableTd>
                      <TableTd>
                        <Button
                          variant="subtle"
                          color="red"
                          size="compact-xs"
                          leftSection={<IconUnlink size={12} />}
                          onClick={() => handleUnlink(pu.id)}
                        >
                          Unlink
                        </Button>
                      </TableTd>
                    </TableTr>
                  ))}
                </TableTbody>
              </Table>
            </TableScrollContainer>
          )}
        </Stack>
      </Card>

      {/* Link Part Modal */}
      <Modal
        opened={linkOpened}
        onClose={closeLink}
        title="Link Part Unit"
        centered
      >
        <Stack gap="md">
          <Text size="sm" c="dimmed">
            Select an available part unit to link to this product.
          </Text>

          <Select
            label="Part Unit"
            placeholder="Search part units"
            data={linkableUnits.map((u) => ({
              value: u.id,
              label: `${u.part?.name ?? "Unknown"} — ${u.serialNumber}`,
            }))}
            value={selectedPartUnitId}
            onChange={setSelectedPartUnitId}
            searchable
          />

          <Group justify="flex-end">
            <Button variant="subtle" onClick={closeLink}>
              Cancel
            </Button>
            <Button
              onClick={handleLink}
              loading={linkLoading}
              disabled={!selectedPartUnitId}
            >
              Link
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
