"use client";

import { Map } from "@hoshina/react-map";
import { Autocomplete, Flex, Stack, Text } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { searchOrganizations } from "@/app/actions/searchOrganizations";
import { OrganizationResponse } from "@/libs/generated/custapi";

import { MapController } from "./MapController";
import { Marker } from "./Marker";

export function SearchModeMap() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<OrganizationResponse[]>(
    [],
  );
  const [selectedOrg, setSelectedOrg] = useState<OrganizationResponse | null>(
    null,
  );
  const debouncing = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchValueRef = useRef(searchValue);

  // Keep ref in sync with current search value
  useEffect(() => {
    searchValueRef.current = searchValue;
  }, [searchValue]);

  // Fetch search results with throttling - updates every 300ms while typing
  useEffect(() => {
    if (!searchValue || searchValue.trim().length < 2) {
      setSearchResults([]);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      debouncing.current = false;
      return;
    }

    if (debouncing.current) {
      return;
    }

    debouncing.current = true;

    // Set new timeout to fetch results
    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await searchOrganizations(searchValueRef.current, 10);
        if (result.success) {
          setSearchResults(result.data);
        } else {
          console.error("Search error:", result.error);
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        debouncing.current = false;
      }
    }, 300);
  }, [searchValue]);

  // Handle organization selection
  const handleSelect = (value: string) => {
    const selected = searchResults.find((org) => org.name === value);
    if (selected) {
      setSelectedOrg(selected);
      setSearchValue(value);
    }
  };

  // Memoize center and zoom to prevent unnecessary map updates
  const mapCenter = useMemo(() => {
    if (selectedOrg) {
      return [selectedOrg.lng, selectedOrg.lat] as [number, number];
    }
    return undefined;
  }, [selectedOrg]);

  const mapZoom = useMemo(() => {
    return selectedOrg ? 14 : undefined;
  }, [selectedOrg]);

  return (
    <Stack gap="md">
      <Autocomplete
        placeholder="Search organizations by name..."
        value={searchValue}
        onChange={setSearchValue}
        onOptionSubmit={handleSelect}
        data={searchResults.map((org) => org.name)}
        leftSection={<IconSearch size={16} />}
        limit={10}
        maxDropdownHeight={300}
        comboboxProps={{ withinPortal: false }}
      />

      <Flex w="full" h="full" style={{ minHeight: "500px" }}>
        <Map>
          <MapController center={mapCenter} zoom={mapZoom} />
          {selectedOrg && (
            <Marker
              key={selectedOrg.id}
              lat={selectedOrg.lat}
              lng={selectedOrg.lng}
              organizationInfo={selectedOrg}
            />
          )}
        </Map>
      </Flex>

      {selectedOrg && (
        <Text size="sm" c="dimmed" ta="center">
          Showing {selectedOrg.name}
        </Text>
      )}
    </Stack>
  );
}
