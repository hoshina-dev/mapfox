"use client";

import { useMap } from "@hoshina/react-map";
import { useEffect } from "react";

interface MapControllerProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
}

export function MapController({ center, zoom }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (!map || !center) return;

    // Fly to the specified location with zoom
    map.flyTo({
      center: center,
      zoom: zoom || 14,
      essential: true,
    });
  }, [map, center, zoom]);

  return null;
}
