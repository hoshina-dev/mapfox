"use client";

import { Group, Paper, Slider, Text } from "@mantine/core";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";

interface MeshData {
  object: THREE.Mesh;
  originalPosition: THREE.Vector3;
  direction: THREE.Vector3;
}

function Model({ url, explode }: { url: string; explode: number }) {
  const { scene } = useGLTF(url);
  const clonedScene = useRef<THREE.Group | null>(null);
  const meshDataRef = useRef<MeshData[]>([]);
  const groupRef = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const clone = scene.clone(true);
    clonedScene.current = clone;

    const box = new THREE.Box3().setFromObject(clone);
    const center = box.getCenter(new THREE.Vector3());

    const meshes: MeshData[] = [];
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const meshCenter = new THREE.Box3()
          .setFromObject(child)
          .getCenter(new THREE.Vector3());
        const direction = meshCenter.sub(center).normalize();

        meshes.push({
          object: child,
          originalPosition: child.position.clone(),
          direction,
        });
      }
    });

    meshDataRef.current = meshes;

    if (groupRef.current) {
      groupRef.current.clear();
      groupRef.current.add(clone);
      groupRef.current.position.set(-center.x, -center.y, -center.z);
    }
  }, [scene]);

  useEffect(() => {
    for (const { object, originalPosition, direction } of meshDataRef.current) {
      object.position.copy(
        originalPosition.clone().add(direction.clone().multiplyScalar(explode)),
      );
    }
  }, [explode]);

  return <group ref={groupRef} />;
}

export function ModelViewer({ url }: { url: string }) {
  const [explode, setExplode] = useState(0);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model key={url} url={url} explode={explode} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>

      <Paper
        shadow="sm"
        p="sm"
        radius="md"
        withBorder
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(360px, calc(100% - 32px))",
        }}
      >
        <Group gap="xs" wrap="nowrap">
          <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
            Assembled
          </Text>
          <Slider
            value={explode}
            onChange={setExplode}
            min={0}
            max={3}
            step={0.01}
            label={null}
            style={{ flex: 1 }}
          />
          <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
            Exploded
          </Text>
        </Group>
      </Paper>
    </div>
  );
}
