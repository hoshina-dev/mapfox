"use client";

import { Map } from "@hoshina/react-map";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useState } from "react";

import { LocationPicker } from "@/components/map/LocationPicker";

interface LocationPickerModalProps {
  opened: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

export function LocationPickerModal({
  opened,
  onClose,
  onLocationSelect,
  initialLat = 13.7388,
  initialLng = 100.5322,
}: LocationPickerModalProps) {
  const [selectedLat, setSelectedLat] = useState<number>(initialLat);
  const [selectedLng, setSelectedLng] = useState<number>(initialLng);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
  };

  const handleConfirm = () => {
    onLocationSelect(selectedLat, selectedLng);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Pick Location on Map"
      size="xl"
      centered
    >
      <Stack gap="md" style={{ height: "600px", display: "flex" }}>
        <Map style={{ flex: 1 }}>
          <LocationPicker
            lat={selectedLat}
            lng={selectedLng}
            onChange={handleLocationSelect}
          />
        </Map>

        <Stack gap="md">
          <div>
            <Text fw={500} size="sm" mb="xs">
              Click on the map to place a marker
            </Text>
            <Text size="sm" c="dimmed">
              Selected: {selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}
            </Text>
          </div>

          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm Location</Button>
          </Group>
        </Stack>
      </Stack>
    </Modal>
  );
}
