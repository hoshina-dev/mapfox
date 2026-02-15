"use client";

import { Map } from "@hoshina/react-map";
import {
  Badge,
  Box,
  Button,
  Flex,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { FeatureCollection as GeoJsonFeatureCollection } from "geojson";
import { useCallback, useEffect, useState } from "react";

import { filterOrganizationsByBoundary } from "@/app/actions/filterOrganizations";
import { ADMIN_LEVELS, LEVEL_STYLES } from "@/libs/areaDetail";
import { OrganizationResponse } from "@/libs/generated/custapi";

import { BoundaryHoverInfo } from "./BoundaryHoverInfo";
import { BoundaryLayer } from "./BoundaryLayer";
import { ClickHandler } from "./ClickHandler";
import { Marker } from "./Marker";

type AreaModeMapProps = {
  organizations: OrganizationResponse[];
};

// Default tolerance values
const DEFAULT_TOLERANCE = {
  level0: 0.01,
  level1: 0,
  level2: 0,
  level3: 0,
  level4: 0,
};

export function AreaModeMap({ organizations }: AreaModeMapProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedAreaName, setSelectedAreaName] = useState<string | null>(null);
  const [parentHierarchy, setParentHierarchy] = useState<string[]>([]);
  const [maxLevel, setMaxLevel] = useState(4);
  const [selectedForFinal, setSelectedForFinal] = useState(false);
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    OrganizationResponse[]
  >([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [hoveredAreaName, setHoveredAreaName] = useState<string | null>(null);

  const [countriesData, setCountriesData] =
    useState<GeoJsonFeatureCollection | null>(null);
  const [childrenData, setChildrenData] =
    useState<GeoJsonFeatureCollection | null>(null);
  const [loading, setLoading] = useState(false);

  const parentArea = parentHierarchy[currentLevel - 1] || null;

  // Fetch countries (level 0) initially
  useEffect(() => {
    if (currentLevel === 0) {
      setLoading(true);
      fetch(
        `/api/admin-areas?adminLevel=0&tolerance=${DEFAULT_TOLERANCE.level0}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setCountriesData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching countries:", error);
          setLoading(false);
        });
    }
  }, [currentLevel]);

  // Fetch children when drilling down
  useEffect(() => {
    if (currentLevel > 0 && parentArea) {
      setLoading(true);
      const toleranceKey =
        `level${currentLevel}` as keyof typeof DEFAULT_TOLERANCE;
      const tolerance = DEFAULT_TOLERANCE[toleranceKey];

      fetch(
        `/api/admin-areas/children/${encodeURIComponent(parentArea)}?childLevel=${currentLevel}&tolerance=${tolerance}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setChildrenData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching children:", error);
          setLoading(false);
        });
    }
  }, [currentLevel, parentArea]);

  const handleAreaClick = useCallback(
    async (areaCode: string, areaName: string) => {
      // Check if we've reached max level
      if (currentLevel >= maxLevel) {
        setSelectedForFinal(true);
        setSelectedArea(areaCode);
        setSelectedAreaName(areaName);

        // Filter organizations by this boundary
        setIsFiltering(true);
        try {
          const filtered = await filterOrganizationsByBoundary(
            organizations,
            areaCode,
          );
          setFilteredOrganizations(filtered);
        } catch (error) {
          console.error("Error filtering organizations:", error);
          setFilteredOrganizations([]);
        } finally {
          setIsFiltering(false);
        }
        return;
      }

      // Check if next level has sufficient data
      const nextLevel = currentLevel + 1;
      const toleranceKey =
        `level${nextLevel}` as keyof typeof DEFAULT_TOLERANCE;
      const nextTolerance = DEFAULT_TOLERANCE[toleranceKey];

      try {
        const response = await fetch(
          `/api/admin-areas/children/${encodeURIComponent(areaCode)}?childLevel=${nextLevel}&tolerance=${nextTolerance}`,
        );

        if (response.ok) {
          const data = await response.json();
          const featureCount = data?.features?.length || 0;

          // If next level has 0 or 1 features, treat this as a final selection
          if (featureCount <= 1) {
            setSelectedForFinal(true);
            setSelectedArea(areaCode);
            setSelectedAreaName(areaName);

            // Filter organizations by this boundary
            setIsFiltering(true);
            try {
              const filtered = await filterOrganizationsByBoundary(
                organizations,
                areaCode,
              );
              setFilteredOrganizations(filtered);
            } catch (error) {
              console.error("Error filtering organizations:", error);
              setFilteredOrganizations([]);
            } finally {
              setIsFiltering(false);
            }
            return;
          }
        }
      } catch (error) {
        console.error("Error checking children:", error);
        setSelectedForFinal(true);
        setSelectedArea(areaCode);
        setSelectedAreaName(areaName);

        // Filter organizations by this boundary
        setIsFiltering(true);
        try {
          const filtered = await filterOrganizationsByBoundary(
            organizations,
            areaCode,
          );
          setFilteredOrganizations(filtered);
        } catch (error) {
          console.error("Error filtering organizations:", error);
          setFilteredOrganizations([]);
        } finally {
          setIsFiltering(false);
        }
        return;
      }

      // Normal drill down
      setSelectedForFinal(false);
      setSelectedArea(areaCode);
      setSelectedAreaName(areaName);
      setFilteredOrganizations([]);
      setParentHierarchy((prev) => [...prev, areaCode]);
      setCurrentLevel((prev) => prev + 1);
    },
    [currentLevel, maxLevel, organizations],
  );

  const handleZoomOut = useCallback(() => {
    setCurrentLevel((prev) => {
      const newLevel = prev - 1;
      setParentHierarchy((hierarchy) => hierarchy.slice(0, newLevel));
      return newLevel;
    });
    setSelectedArea(null);
    setSelectedAreaName(null);
    setSelectedForFinal(false);
    setFilteredOrganizations([]);
  }, []);

  const currentData = currentLevel === 0 ? countriesData : childrenData;
  const levelStyle = LEVEL_STYLES[currentLevel] || LEVEL_STYLES[0];
  const levelInfo = ADMIN_LEVELS[currentLevel] || ADMIN_LEVELS[0];

  return (
    <Flex
      w="full"
      h="full"
      style={{ minHeight: "500px", position: "relative" }}
    >
      <Box style={{ position: "relative", flex: 1 }}>
        <Map style={{ width: "100%", height: "100%" }}>
          <BoundaryLayer
            data={currentData}
            style={levelStyle}
            selectedAreaCode={selectedArea}
            isSelectedForFinal={selectedForFinal}
            currentLevel={currentLevel}
            onHoveredAreaChange={setHoveredAreaName}
          />
          <ClickHandler
            currentLevel={currentLevel}
            onGeometryClick={handleAreaClick}
            onZoomOut={handleZoomOut}
          />
          {filteredOrganizations.map((org) => (
            <Marker
              key={org.id}
              lat={org.lat}
              lng={org.lng}
              organizationInfo={org}
            />
          ))}
        </Map>

        <BoundaryHoverInfo hoveredAreaName={hoveredAreaName} />
      </Box>

      <Paper shadow="md" p="md" style={{ width: "300px", overflowY: "auto" }}>
        <Stack gap="md">
          <Title order={4}>Area Selection</Title>

          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Max Selection Level
            </Text>
            <NumberInput
              value={maxLevel}
              onChange={(val) => setMaxLevel(typeof val === "number" ? val : 4)}
              min={0}
              max={4}
              description={`Select up to ${ADMIN_LEVELS[maxLevel]?.label || "Level " + maxLevel}`}
            />
          </Stack>

          <Stack gap="xs">
            <Text size="sm" fw={500}>
              Current Level
            </Text>
            <Badge size="lg" color={levelInfo.color}>
              Level {currentLevel}: {levelInfo.label}
            </Badge>
            <Text size="xs" c="dimmed">
              {levelInfo.description}
            </Text>
          </Stack>

          {selectedAreaName && (
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Selected Area
              </Text>
              <Badge size="lg" color="blue" variant="dot">
                {selectedAreaName}
              </Badge>
              {selectedForFinal && (
                <Badge size="sm" color="green">
                  ✓ Final Selection
                </Badge>
              )}
            </Stack>
          )}

          {selectedForFinal && (
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Organizations in Area
              </Text>
              {isFiltering ? (
                <Text size="sm" c="dimmed">
                  Filtering...
                </Text>
              ) : (
                <Badge size="lg" color="teal">
                  {filteredOrganizations.length} organizations
                </Badge>
              )}
            </Stack>
          )}

          {currentLevel > 0 && (
            <Group gap="xs">
              <Button
                onClick={handleZoomOut}
                size="sm"
                variant="light"
                fullWidth
              >
                ← Zoom Out
              </Button>
            </Group>
          )}

          <Stack gap="xs">
            <Text size="xs" c="dimmed">
              {loading
                ? "Loading boundaries..."
                : currentData
                  ? `${currentData.features.length} areas loaded`
                  : "No data"}
            </Text>
            <Text size="xs" c="dimmed">
              Click on an area to drill down. Right-click to zoom out.
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </Flex>
  );
}
