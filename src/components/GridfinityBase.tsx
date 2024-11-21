"use client";

import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { type Color } from "three";
import { useMemo } from "react";
import type * as THREE from "three";
import { TextureLoader, Vector2 } from 'three';

interface GridfinityBaseProps {
  position: [number, number, number];
  color: Color | string;
  width: number;
  height: number;
  materialProps: {
    roughness: number;
    metalness: number;
    clearcoat: number;
  };
}

export default function GridfinityBase({
  position,
  color,
  width,
  height,
}: GridfinityBaseProps) {
  const geometry = useLoader(STLLoader, "/frame-1x1.stl");
  const scale = 0.001; // Convert mm to meters
  const cellSize = 0.042; // 42mm in meters

  // Create an array of cell positions for the grid
  const cells = useMemo(() => {
    const cellPositions: [number, number, number][] = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        cellPositions.push([
          position[0] + x * cellSize,
          position[1],
          position[2] + y * cellSize,
        ]);
      }
    }
    return cellPositions;
  }, [position, width, height]);

  // Add texture loaders
  const [normalMap, heightMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
    '/materials/Plastic_Rough_001_normal.jpg',
    '/materials/Plastic_Rough_001_height.png',
    '/materials/Plastic_Rough_001_roughness.jpg',
    '/materials/Plastic_Rough_001_ambientOcclusion.jpg',
  ]);

  return (
    <group>
      {cells.map((cellPosition, index) =>
        geometry ? (
          <mesh
            key={index}
            position={cellPosition}
            geometry={geometry as THREE.BufferGeometry}
            scale={[scale, scale, scale]}
            rotation={[-Math.PI / 2, 0, 0]}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial
              color={color}
              roughness={20}
              roughnessMap={roughnessMap}
              normalMap={normalMap}
              normalScale={new Vector2(10, 10)}
              displacementMap={heightMap}
              displacementScale={1}
              aoMap={aoMap}
              aoMapIntensity={1.5}
              metalness={0.1}
              clearcoat={0}
              clearcoatRoughness={0.2}
              envMapIntensity={0.8}
            />
          </mesh>
        ) : null,
      )}
    </group>
  );
}
