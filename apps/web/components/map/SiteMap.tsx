"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import Map, {
  type MapLayerMouseEvent,
  type MapRef,
} from "react-map-gl/maplibre";

import { loadAdminBoundaries, loadWorldMap } from "@/libs/map/geoDataProvider";
import { calculateBounds } from "@/libs/map/geoUtils";
import {
  type FocusedEntity,
  type GeoJSONFeatureCollection,
  INITIAL_VIEW_STATE,
  type LevelConfigWithLoader,
  type MapViewState,
} from "@/libs/map/types";

import { GeoLayer } from "./GeoLayer";

// Level configurations for drill-down navigation
const LEVEL_CONFIGS: Record<number, LevelConfigWithLoader> = {
  0: {
    layerId: "world-countries",
    highlightProperty: "name",
    variant: "country",
    getDataLoader: async () => loadWorldMap(),
  },
  1: {
    layerId: "admin-boundaries-1",
    highlightProperty: "name",
    variant: "default",
    getDataLoader: async (isoCode) =>
      isoCode ? loadAdminBoundaries(isoCode) : null,
  },
};

const MAX_LEVEL = 1;

export interface SiteMapHandle {
  goBack: () => void;
  exitFocus: () => void;
}

interface SiteMapProps {
  onEntityChange?: (entity: FocusedEntity | null) => void;
  onHover?: (featureName: string | null) => void;
  onFeatureSelect?: (feature: {
    name: string;
    isoCode?: string;
    level: number;
  }) => void;
}

export const SiteMap = forwardRef<SiteMapHandle, SiteMapProps>(function SiteMap(
  { onEntityChange, onHover, onFeatureSelect },
  ref,
) {
  const mapRef = useRef<MapRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // View state
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE);

  // Layer data cache
  const [layerData, setLayerData] = useState<
    Record<number, GeoJSONFeatureCollection>
  >({});

  // Focus tracking
  const [focusLevel, setFocusLevel] = useState(0);
  const [entityStack, setEntityStack] = useState<FocusedEntity[]>([]);
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(
    null,
  );
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // Loading and transition states
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Current level config
  const currentConfig = LEVEL_CONFIGS[focusLevel];

  // Current data to display
  const currentData = layerData[focusLevel];

  // Load initial world map
  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const worldData = await LEVEL_CONFIGS[0]!.getDataLoader();
        if (worldData) {
          setLayerData({ 0: worldData });
        }
      } catch (error) {
        console.error("Failed to load world map:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Fit map to bounds with smooth animation
  const fitToBounds = useCallback((data: GeoJSONFeatureCollection) => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const bounds = calculateBounds(data);
    const [minLon, minLat, maxLon, maxLat] = bounds;

    map.fitBounds(
      [
        [minLon, minLat],
        [maxLon, maxLat],
      ],
      {
        padding: 50,
        duration: 500,
        maxZoom: 10,
      },
    );
  }, []);

  // Zoom to a specific feature with smooth animation
  const zoomToFeature = useCallback(
    (featureName: string) => {
      const map = mapRef.current?.getMap();
      if (!map || !currentData) return;

      const feature = currentData.features.find(
        (f) => f.properties.name === featureName,
      );

      if (!feature) return;

      const singleFeatureCollection: GeoJSONFeatureCollection = {
        type: "FeatureCollection",
        features: [feature],
      };

      const bounds = calculateBounds(singleFeatureCollection);
      const [minLon, minLat, maxLon, maxLat] = bounds;

      map.fitBounds(
        [
          [minLon, minLat],
          [maxLon, maxLat],
        ],
        {
          padding: 100,
          duration: 500,
          maxZoom: 10,
        },
      );
    },
    [currentData],
  );

  // Handle click on a feature
  const handleClick = useCallback(
    async (event: MapLayerMouseEvent) => {
      // Block interactions during transitions or loading
      if (isTransitioning || isLoading) return;

      const features = event.features;
      if (!features?.length) return;

      const feature = features[0]!;
      const featureProps = feature.properties as Record<string, unknown> | null;
      const name = featureProps?.["name"] as string | undefined;
      const isoCode = featureProps?.["isoCode"] as string | undefined;

      if (!name) return;

      // If at max level, just select the feature without drilling down
      if (focusLevel >= MAX_LEVEL) {
        setIsTransitioning(true);
        setSelectedFeature(name);
        zoomToFeature(name);
        onFeatureSelect?.({
          name,
          isoCode,
          level: focusLevel,
        });
        setTimeout(() => setIsTransitioning(false), 500);
        return;
      }

      const nextLevel = focusLevel + 1;
      const nextConfig = LEVEL_CONFIGS[nextLevel];

      if (!nextConfig) return;

      setIsTransitioning(true);
      setIsLoading(true);
      try {
        // Load data for the next level using isoCode
        const data = await nextConfig.getDataLoader(isoCode);

        if (data && data.features.length > 0) {
          // Update layer data
          setLayerData((prev) => ({ ...prev, [nextLevel]: data }));

          // Update entity stack with new focused entity
          const newEntity: FocusedEntity = { name, level: nextLevel, isoCode };
          setEntityStack((prev) => [...prev, newEntity]);
          setFocusLevel(nextLevel);

          // Notify parent
          onEntityChange?.(newEntity);

          // Fit map to new bounds with smooth animation
          fitToBounds(data);
          setTimeout(() => setIsTransitioning(false), 300);
        } else {
          setIsTransitioning(false);
        }
      } catch (error) {
        console.error(`Failed to load level ${nextLevel} data:`, error);
        setIsTransitioning(false);
      } finally {
        setIsLoading(false);
      }
    },
    [
      isTransitioning,
      isLoading,
      focusLevel,
      fitToBounds,
      onEntityChange,
      onFeatureSelect,
      zoomToFeature,
    ],
  );

  // Handle mouse move for hover highlighting
  const handleMouseMove = useCallback(
    (event: MapLayerMouseEvent) => {
      // Block hover changes during transitions
      if (isTransitioning) return;

      const features = event.features;
      const featureName = features?.[0]?.properties?.name as string | undefined;

      setHighlightedFeature(featureName ?? null);
      onHover?.(featureName ?? null);
    },
    [isTransitioning, onHover],
  );

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (isTransitioning) return;
    setHighlightedFeature(null);
    onHover?.(null);
  }, [isTransitioning, onHover]);

  // Navigate back one level
  const goBack = useCallback(() => {
    if (focusLevel === 0 || isTransitioning) return;

    setIsTransitioning(true);

    const newStack = entityStack.slice(0, -1);
    const newLevel = focusLevel - 1;

    setEntityStack(newStack);
    setFocusLevel(newLevel);
    setSelectedFeature(null);
    setHighlightedFeature(null);

    // Clear the data for the level we're leaving
    setLayerData((prev) => {
      const updated = { ...prev };
      delete updated[focusLevel];
      return updated;
    });

    // Notify parent
    const newEntity = newStack[newStack.length - 1] ?? null;
    onEntityChange?.(newEntity);

    // Animate to new view
    const map = mapRef.current?.getMap();
    if (newLevel === 0) {
      // Fly back to world view
      map?.flyTo({
        center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
        zoom: INITIAL_VIEW_STATE.zoom,
        duration: 500,
      });
    } else if (newLevel > 0 && layerData[newLevel]) {
      // Fit to parent level bounds
      fitToBounds(layerData[newLevel]!);
    }

    setTimeout(() => setIsTransitioning(false), 500);
  }, [
    focusLevel,
    isTransitioning,
    entityStack,
    layerData,
    fitToBounds,
    onEntityChange,
  ]);

  // Exit all focus (return to world view)
  const exitFocus = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setEntityStack([]);
    setFocusLevel(0);
    setSelectedFeature(null);
    setHighlightedFeature(null);
    setLayerData((prev) => ({ 0: prev[0]! }));

    // Fly back to default world view
    const map = mapRef.current?.getMap();
    map?.flyTo({
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      duration: 500,
    });

    onEntityChange?.(null);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, onEntityChange]);

  // Expose methods via ref
  useImperativeHandle(
    ref,
    () => ({
      goBack,
      exitFocus,
    }),
    [goBack, exitFocus],
  );

  // Get interactive layer IDs for hover/click detection
  const interactiveLayerIds = useMemo(() => {
    const ids: string[] = [];
    if (currentConfig) {
      ids.push(`${currentConfig.layerId}-fill`);
    }
    return ids;
  }, [currentConfig]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        interactiveLayerIds={interactiveLayerIds}
        style={{ width: "100%", height: "100%" }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        cursor={
          isTransitioning ? "default" : highlightedFeature ? "pointer" : "grab"
        }
      >
        {currentConfig && currentData && (
          <GeoLayer
            key={currentConfig.layerId}
            id={currentConfig.layerId}
            data={currentData}
            variant={currentConfig.variant}
            highlightedFeature={highlightedFeature}
            selectedFeature={selectedFeature}
          />
        )}
      </Map>

      {/* Loading overlay */}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.7)",
            zIndex: 10,
          }}
        >
          <div>Loading...</div>
        </div>
      )}
    </div>
  );
});

// Export navigation functions for external use
export type { SiteMapProps };
export { LEVEL_CONFIGS, MAX_LEVEL };
