"use client";

import { Map, useMap } from "@hoshina/react-map";
import {
  Autocomplete,
  Box,
  Flex,
  Loader,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconBuilding, IconSearch, IconUser } from "@tabler/icons-react";
import maplibregl from "maplibre-gl";
import {
  type MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getUserOrganizations } from "@/app/actions/getUserOrganizations";
import { searchOrganizations } from "@/app/actions/searchOrganizations";
import { searchUsers } from "@/app/actions/searchUsers";
import { OrganizationResponse, UserResponse } from "@/libs/api/custapi";

import { MapController } from "../map/MapController";
import { Marker } from "../map/Marker";
import styles from "./LandingHero.module.css";

function MapRefCapture({
  mapRef,
}: {
  mapRef: MutableRefObject<maplibregl.Map | null>;
}) {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

type SearchMode = "org" | "user";

type LandingHeroProps = {
  organizations: OrganizationResponse[];
};

export function LandingHero({ organizations }: LandingHeroProps) {
  const [searchMode, setSearchMode] = useState<SearchMode>("org");
  const [searchValue, setSearchValue] = useState("");
  const [orgResults, setOrgResults] = useState<OrganizationResponse[]>([]);
  const [userResults, setUserResults] = useState<UserResponse[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationResponse | null>(
    null,
  );
  const [userOrgs, setUserOrgs] = useState<OrganizationResponse[]>([]);
  const [isLoadingUserOrgs, setIsLoadingUserOrgs] = useState(false);

  const debouncing = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchValueRef = useRef(searchValue);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Keep ref in sync
  useEffect(() => {
    searchValueRef.current = searchValue;
  }, [searchValue]);

  // Reset search when mode changes
  useEffect(() => {
    setSearchValue("");
    setOrgResults([]);
    setUserResults([]);
    setSelectedOrg(null);
    setUserOrgs([]);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    debouncing.current = false;
  }, [searchMode]);

  // Debounced search
  useEffect(() => {
    if (!searchValue || searchValue.trim().length < 2) {
      if (searchMode === "org") setOrgResults([]);
      else setUserResults([]);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      debouncing.current = false;
      return;
    }

    if (debouncing.current) return;

    debouncing.current = true;

    timeoutRef.current = setTimeout(async () => {
      try {
        if (searchMode === "org") {
          const result = await searchOrganizations(searchValueRef.current, 10);
          if (result.success) setOrgResults(result.data);
        } else {
          const result = await searchUsers(searchValueRef.current, 10);
          if (result.success) setUserResults(result.data);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        debouncing.current = false;
      }
    }, 300);
  }, [searchValue, searchMode]);

  // Handle org selection
  const handleOrgSelect = useCallback(
    (value: string) => {
      const selected = orgResults.find((org) => org.name === value);
      if (selected) {
        setSelectedOrg(selected);
        setUserOrgs([]);
        setSearchValue(value);
      }
    },
    [orgResults],
  );

  // Handle user selection
  const handleUserSelect = useCallback(
    async (value: string) => {
      const selected = userResults.find(
        (u) => `${u.name} (${u.email})` === value,
      );
      if (!selected) return;

      setSelectedOrg(null);
      setSearchValue(value);
      setIsLoadingUserOrgs(true);

      try {
        const result = await getUserOrganizations(selected.id);
        if (result.success) {
          setUserOrgs(result.data);

          // Fit map to show all user's organizations
          if (result.data.length > 0 && mapRef.current) {
            const bounds = new maplibregl.LngLatBounds();
            result.data.forEach((org) => {
              bounds.extend([org.lng, org.lat]);
            });
            mapRef.current.fitBounds(bounds, {
              padding: 80,
              duration: 1200,
              maxZoom: 14,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user organizations:", error);
      } finally {
        setIsLoadingUserOrgs(false);
      }
    },
    [userResults],
  );

  // Determine which markers to show
  const displayedMarkers = useMemo(() => {
    if (selectedOrg) return [selectedOrg];
    if (userOrgs.length > 0) return userOrgs;
    return organizations;
  }, [selectedOrg, userOrgs, organizations]);

  // Map center/zoom for org selection
  const mapCenter = useMemo(() => {
    if (selectedOrg)
      return [selectedOrg.lng, selectedOrg.lat] as [number, number];
    return undefined;
  }, [selectedOrg]);

  const mapZoom = useMemo(() => {
    return selectedOrg ? 14 : undefined;
  }, [selectedOrg]);

  // Autocomplete data
  const autocompleteData = useMemo(() => {
    if (searchMode === "org") {
      return orgResults.map((org) => org.name);
    }
    return userResults.map((u) => `${u.name} (${u.email})`);
  }, [searchMode, orgResults, userResults]);

  const statusText = useMemo(() => {
    if (isLoadingUserOrgs) return "Loading user's organizations...";
    if (selectedOrg) return `Showing ${selectedOrg.name}`;
    if (userOrgs.length > 0)
      return `Showing ${userOrgs.length} organization${userOrgs.length !== 1 ? "s" : ""} for this user`;
    return `Showing all ${organizations.length} organizations`;
  }, [isLoadingUserOrgs, selectedOrg, userOrgs, organizations]);

  return (
    <div className={styles.heroWrapper}>
      {/* Hero section */}
      <div className={styles.heroContent}>
        <div className={styles.shimmer} />
        <Stack align="center" gap="lg" className={styles.heroStack}>
          <div className={styles.titleGroup}>
            <Title order={1} className={styles.title}>
              Map
              <Text
                component="span"
                inherit
                variant="gradient"
                gradient={{ from: "blue", to: "cyan", deg: 90 }}
              >
                fox
              </Text>
            </Title>
            <Text className={styles.subtitle}>
              Discover organizations and researchers across the globe
            </Text>
          </div>

          {/* Search controls */}
          <div className={styles.searchContainer}>
            <SegmentedControl
              value={searchMode}
              onChange={(v) => setSearchMode(v as SearchMode)}
              data={[
                {
                  label: (
                    <Flex align="center" gap={6}>
                      <IconBuilding size={14} />
                      <span>Organization</span>
                    </Flex>
                  ),
                  value: "org",
                },
                {
                  label: (
                    <Flex align="center" gap={6}>
                      <IconUser size={14} />
                      <span>User</span>
                    </Flex>
                  ),
                  value: "user",
                },
              ]}
              className={styles.segmentedControl}
              size="md"
            />

            <Autocomplete
              placeholder={
                searchMode === "org"
                  ? "Search organizations by name..."
                  : "Search users by name or email..."
              }
              value={searchValue}
              onChange={setSearchValue}
              onOptionSubmit={
                searchMode === "org" ? handleOrgSelect : handleUserSelect
              }
              data={autocompleteData}
              leftSection={<IconSearch size={18} />}
              rightSection={isLoadingUserOrgs ? <Loader size={16} /> : null}
              limit={10}
              maxDropdownHeight={300}
              size="lg"
              className={styles.searchInput}
              comboboxProps={{ withinPortal: false }}
            />
          </div>
        </Stack>
      </div>

      {/* Map section */}
      <div className={styles.mapContainer}>
        <Box className={styles.mapStatusBar}>
          <Text size="sm" c="dimmed">
            {statusText}
          </Text>
        </Box>

        <Flex className={styles.mapWrapper}>
          <Map>
            <MapRefCapture mapRef={mapRef} />
            <MapController center={mapCenter} zoom={mapZoom} />
            {displayedMarkers.map((org) => (
              <Marker
                key={org.id}
                lat={org.lat}
                lng={org.lng}
                organizationInfo={org}
              />
            ))}
          </Map>
        </Flex>
      </div>
    </div>
  );
}
