"use client";

import { MapLevelStyle, useMap } from "@hoshina/react-map";
import type { FeatureCollection as GeoJsonFeatureCollection } from "geojson";
import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

interface BoundaryLayerProps {
  data: GeoJsonFeatureCollection | null;
  style: MapLevelStyle;
  layerId?: string;
  selectedAreaCode?: string | null;
  isSelectedForFinal?: boolean;
  currentLevel?: number;
  onHoveredAreaChange?: (areaName: string | null) => void;
}

export function BoundaryLayer({
  data,
  style,
  layerId = "admin-boundaries",
  selectedAreaCode = null,
  isSelectedForFinal = false,
  currentLevel = 0,
  onHoveredAreaChange,
}: BoundaryLayerProps) {
  const map = useMap();
  const hoveredFeatureIdRef = useRef<string | number | undefined>(undefined);

  useEffect(() => {
    if (!map || !data || data.features.length === 0) {
      return;
    }

    const sourceId = layerId;
    const fillLayerId = `${layerId}-fill`;
    const outlineLayerId = `${layerId}-outline`;

    // Remove existing layers and source if they exist
    if (map.getLayer(fillLayerId)) {
      map.removeLayer(fillLayerId);
    }
    if (map.getLayer(outlineLayerId)) {
      map.removeLayer(outlineLayerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    // Add new source
    map.addSource(sourceId, {
      type: "geojson",
      data,
    });

    // Add fill layer
    map.addLayer({
      id: fillLayerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": style.fillColor,
        "fill-opacity": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          0.8,
          ["boolean", ["feature-state", "hover"], false],
          currentLevel === 0 ? 0.7 : 0.7, // At level 0, only show hovered
          currentLevel === 0 ? 0 : 0.4, // At level 0, hide non-hovered
        ],
      },
    });

    // Add outline layer with thicker line for selected area
    map.addLayer({
      id: outlineLayerId,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          "#22c55e",
          style.lineColor,
        ],
        "line-width": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          style.lineWidth * 2,
          style.lineWidth,
        ],
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "selected"], false],
          1,
          ["boolean", ["feature-state", "hover"], false],
          1,
          currentLevel === 0 ? 0 : 1, // At level 0, hide non-hovered outlines
        ],
      },
    });

    // Event handlers
    const onMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const onMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    const onMouseMove = (e: maplibregl.MapLayerMouseEvent) => {
      if (e.features && e.features.length > 0) {
        if (hoveredFeatureIdRef.current !== undefined) {
          map.setFeatureState(
            { source: sourceId, id: hoveredFeatureIdRef.current },
            { hover: false },
          );
        }
        const featureId = e.features[0]?.id;
        if (featureId !== undefined) {
          hoveredFeatureIdRef.current = featureId;
          map.setFeatureState(
            { source: sourceId, id: hoveredFeatureIdRef.current },
            { hover: true },
          );
        }

        // Notify parent component of hovered area
        const feature = e.features[0];
        const areaName = feature.properties?.name || "Unknown Area";
        onHoveredAreaChange?.(areaName);
      }
    };

    const onMouseLeaveForHover = () => {
      if (hoveredFeatureIdRef.current !== undefined) {
        map.setFeatureState(
          { source: sourceId, id: hoveredFeatureIdRef.current },
          { hover: false },
        );
      }
      hoveredFeatureIdRef.current = undefined;

      // Notify parent component that we're no longer hovering
      onHoveredAreaChange?.(null);
    };

    // Setup hover effects
    map.on("mouseenter", fillLayerId, onMouseEnter);
    map.on("mouseleave", fillLayerId, onMouseLeave);
    map.on("mousemove", fillLayerId, onMouseMove);
    map.on("mouseleave", fillLayerId, onMouseLeaveForHover);

    // Set selected state on the selected feature
    if (isSelectedForFinal && selectedAreaCode && data.features.length > 0) {
      const selectedFeature = data.features.find(
        (f) =>
          f.properties?.isoCode === selectedAreaCode ||
          f.properties?.id === selectedAreaCode,
      );
      if (selectedFeature && selectedFeature.id !== undefined) {
        map.setFeatureState(
          { source: sourceId, id: selectedFeature.id },
          { selected: true },
        );
      }
    }

    return () => {
      // Remove event listeners
      map.off("mouseenter", fillLayerId, onMouseEnter);
      map.off("mouseleave", fillLayerId, onMouseLeave);
      map.off("mousemove", fillLayerId, onMouseMove);
      map.off("mouseleave", fillLayerId, onMouseLeaveForHover);

      if (!map.style) {
        return;
      }

      // Remove layers and source
      if (map.getLayer(fillLayerId)) {
        map.removeLayer(fillLayerId);
      }
      if (map.getLayer(outlineLayerId)) {
        map.removeLayer(outlineLayerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    };
  }, [
    map,
    data,
    style,
    layerId,
    selectedAreaCode,
    isSelectedForFinal,
    currentLevel,
    onHoveredAreaChange,
  ]);

  return null;
}
