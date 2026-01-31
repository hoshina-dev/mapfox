"use client";

import { useMap } from "@hoshina/react-map";
import {
  Button,
  Group,
  Image,
  MantineProvider,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import maplibregl from "maplibre-gl";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { createRoot, type Root } from "react-dom/client";

import { OrganizationResponse } from "@/libs/generated/custapi";

interface MarkerProps {
  lat: number;
  lng: number;
  organizationInfo: OrganizationResponse;
}

export function Marker({ lat, lng, organizationInfo }: MarkerProps) {
  const map = useMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const rootRef = useRef<Root | null>(null);

  useEffect(() => {
    if (!map) return;

    // Add a marker at the specified coordinates with a popup
    const popupNode = document.createElement("div");

    // Create a React component for the popup content
    const PopupContent = () => {
      const imageUrl =
        organizationInfo.imageUrls && organizationInfo.imageUrls.length > 0
          ? organizationInfo.imageUrls[0]
          : undefined;

      return (
        <MantineProvider>
          <Stack gap="xs" p="sm" style={{ width: "250px" }}>
            {imageUrl && (
              <Image
                src={imageUrl}
                width={200}
                alt={organizationInfo.name || "Organization"}
                fallbackSrc="https://placehold.co/200x120?text=No+Image"
                radius="sm"
              />
            )}
            <Title order={4}>{organizationInfo.name}</Title>
            <Group gap="xs">
              <Text size="sm" fw={500}>
                🌐
              </Text>
              <Text size="sm" c="dimmed">
                {organizationInfo.lat!.toFixed(4)},{" "}
                {organizationInfo.lng!.toFixed(4)}
              </Text>
            </Group>
            <Text size="xs" c="dimmed">
              {organizationInfo.description || "No description available."}
            </Text>
            <Button
              component={Link}
              href={`/organization/${organizationInfo.id}`}
              size="xs"
              variant="light"
              fullWidth
            >
              View Details
            </Button>
          </Stack>
        </MantineProvider>
      );
    };

    rootRef.current = createRoot(popupNode);
    rootRef.current.render(<PopupContent />);

    const popup = new maplibregl.Popup({ offset: 25 }).setDOMContent(popupNode);

    markerRef.current = new maplibregl.Marker({ color: "#FF0000" })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    // Mark the marker element so ClickHandler can ignore it and set cursor style
    const markerElement = markerRef.current.getElement();
    markerElement.setAttribute("data-marker", "true");
    markerElement.style.cursor = "pointer";

    const rootToCleanup = rootRef.current;

    return () => {
      markerRef.current?.remove();

      setTimeout(() => {
        rootToCleanup.unmount();
      }, 0);
    };
  }, [map, lat, lng, organizationInfo]);

  return null;
}
