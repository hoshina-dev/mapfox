import { Map } from "@hoshina/react-map";
import { Flex } from "@mantine/core";

import { OrganizationResponse } from "@/libs/generated/custapi";

import { Marker } from "./Marker";

type AllOrgMapProps = {
  organizations: OrganizationResponse[];
};

export function AllOrgMap({ organizations }: AllOrgMapProps) {
  return (
    <Flex w="full" h="full" style={{ minHeight: "500px" }}>
      <Map>
        {organizations.map((org) => (
          <Marker
            key={org.id}
            lat={org.lat ?? 0}
            lng={org.lng ?? 0}
            organizationInfo={org}
          />
        ))}
      </Map>
    </Flex>
  );
}
