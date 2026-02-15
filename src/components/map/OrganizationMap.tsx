"use client";

import { SegmentedControl, Stack } from "@mantine/core";
import { useState } from "react";

import { OrganizationResponse } from "@/libs/generated/custapi";

import { AllOrgMap } from "./AllOrg";
import { AreaModeMap } from "./AreaModeMap";
import { SearchModeMap } from "./SearchModeMap";

type OrganizationMapProps = {
  organizations: OrganizationResponse[];
};

const modeData = [
  { label: "All Organizations", value: "all" },
  { label: "By Area", value: "area" },
  { label: "Search", value: "search" },
] as const;
type Mode = (typeof modeData)[number]["value"];

export function OrganizationMap({ organizations }: OrganizationMapProps) {
  const [mode, setMode] = useState<Mode>("all");

  return (
    <Stack gap="md" pt="xl">
      <SegmentedControl
        style={{ alignSelf: "end", width: "fit" }}
        value={mode}
        // @ts-expect-error haiyaa
        onChange={setMode}
        // @ts-expect-error haiyaa
        data={modeData}
      />
      {mode === "all" && <AllOrgMap organizations={organizations} />}
      {mode === "area" && <AreaModeMap organizations={organizations} />}
      {mode === "search" && <SearchModeMap />}
    </Stack>
  );
}
