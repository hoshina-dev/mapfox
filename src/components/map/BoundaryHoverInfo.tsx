"use client";

import { Box } from "@mantine/core";

interface BoundaryHoverInfoProps {
  hoveredAreaName: string | null;
}

export function BoundaryHoverInfo({ hoveredAreaName }: BoundaryHoverInfoProps) {
  if (!hoveredAreaName) {
    return null;
  }

  return (
    <Box
      style={{
        position: "absolute",
        top: "12px",
        right: "12px",
        padding: "8px 12px",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        color: "white",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: 500,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        backdropFilter: "blur(4px)",
        zIndex: 10,
        maxWidth: "150px",
        wordBreak: "break-word",
      }}
    >
      {hoveredAreaName}
    </Box>
  );
}
