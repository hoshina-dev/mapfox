"use client";

import { useMap } from "@hoshina/react-map";
import type { StyleSpecification } from "maplibre-gl";
import { useEffect } from "react";

function rasterStyle(
  id: string,
  tiles: string[],
  attribution: string,
  maxzoom: number,
): StyleSpecification {
  return {
    version: 8,
    sources: {
      [id]: { type: "raster", tiles, tileSize: 256, attribution, maxzoom },
    },
    layers: [{ id, type: "raster", source: id }],
  };
}

// Keyless providers, tried in order. Replaces the library default (CARTO),
// which now answers with "api key required".
const TILE_PROVIDERS: StyleSpecification[] = [
  rasterStyle(
    "osm",
    ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
    "&copy; OpenStreetMap contributors",
    19,
  ),
  rasterStyle(
    "esri",
    [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    ],
    "Tiles &copy; Esri",
    19,
  ),
  rasterStyle(
    "opentopo",
    ["https://tile.opentopomap.org/{z}/{x}/{y}.png"],
    "&copy; OpenStreetMap contributors, SRTM | &copy; OpenTopoMap",
    17,
  ),
];

/** Replaces the default basemap and moves to the next provider on tile errors. */
export function TileProviderFallback() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    let index = -1;
    let switching = false;

    const next = () => {
      if (switching || index + 1 >= TILE_PROVIDERS.length) return;
      switching = true;
      index += 1;
      map.setStyle(TILE_PROVIDERS[index]);
      map.once("idle", () => {
        switching = false;
      });
    };

    const onError = (e: { error?: Error; sourceId?: string }) => {
      if (e.sourceId || e.error) next();
    };

    next();
    map.on("error", onError);
    return () => {
      map.off("error", onError);
    };
  }, [map]);

  return null;
}
