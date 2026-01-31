"use client";

import { useMap } from "@hoshina/react-map";
import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

interface LocationPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => unknown;
}

/**
 * Component for selecting a location on a map
 * Places a draggable marker when user clicks, updates coordinates on drag
 */
export function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  const map = useMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);

  // Add or update marker when coordinates change
  useEffect(() => {
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = new maplibregl.Marker({
      color: "#3b82f6",
      scale: 1.2,
      draggable: true,
    })
      .setLngLat([lng, lat])
      .addTo(map);

    // Update coordinates when marker is dragged
    markerRef.current.on("dragend", () => {
      const lngLatAfterDrag = markerRef.current?.getLngLat();
      if (lngLatAfterDrag) {
        onChange(lngLatAfterDrag.lat, lngLatAfterDrag.lng);
      }
    });

    return () => {
      markerRef.current?.remove();
    };
  }, [map, lat, lng, onChange]);

  // Handle map click to place marker
  useEffect(() => {
    if (!map) return;

    const handleMapClick = (e: maplibregl.MapLayerMouseEvent) => {
      const { lng: newLng, lat: newLat } = e.lngLat;
      onChange(newLat, newLng);
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, onChange]);

  return null;
}
