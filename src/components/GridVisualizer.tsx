"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import GridfinityBase from "./GridfinityBase";
import { useAtom } from "jotai";
import { materialSettingsAtom, gridDimensionsAtom, placedGridsAtom } from "~/atoms/grid";
import { GridOutline } from "./GridOutline";
import { GridLabel } from "./GridLabel";
import { CameraControls } from "./CameraControls";
import { CameraController } from "~/components/CameraController";

export default function GridVisualizer() {
  const [materialSettings] = useAtom(materialSettingsAtom);
  const [{ width: overallWidth, height: overallHeight }] = useAtom(gridDimensionsAtom);
  const [grids] = useAtom(placedGridsAtom);

  const cellSize = 0.042; // 42mm in meters

  const getMaterialProperties = (finish: "matte" | "semi-gloss" | "glossy") => {
    switch (finish) {
      case "matte":
        return { roughness: 0.9, metalness: 0.1, clearcoat: 0 };
      case "semi-gloss":
        return { roughness: 0.5, metalness: 0.3, clearcoat: 0.5 };
      case "glossy":
        return { roughness: 0.1, metalness: 0.5, clearcoat: 1 };
    }
  };

  const materialProps = getMaterialProperties(materialSettings.finish);

  return (
    <div className="aspect-square w-full overflow-hidden rounded-lg border bg-white shadow-sm relative">
      <CameraControls />
      <Canvas
        shadows
        camera={{
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
      >
        <Suspense fallback={null}>
          <CameraController />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
          <directionalLight position={[-5, 6, -3]} intensity={0.4} castShadow />

          {materialSettings.environment && (
            <Environment preset={materialSettings.environment} />
          )}

          <Suspense fallback={null}>
            {/* Background plane */}
            <mesh
              position={[overallWidth / 2, -0.001, overallHeight / 2 - cellSize]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[overallWidth, overallHeight]} />
              <meshStandardMaterial
                color={materialSettings.planeColor}
                map={
                  materialSettings.planeTexture
                    ? new THREE.TextureLoader().load(
                        materialSettings.planeTexture,
                      )
                    : null
                }
                {...getMaterialProperties("matte")}
              />
            </mesh>
            {grids.map((grid, index) => {
              const baseX = grid.position.x * cellSize;
              const baseZ = grid.position.y * cellSize;
              const gridWidth = grid.x * cellSize;
              const gridHeight = grid.y * cellSize;
              const color = materialSettings.useRandomColors
                ? new THREE.Color(`hsl(${(index * 80) % 360}, 70%, 50%)`)
                : materialSettings.selectedColors[
                    index % materialSettings.selectedColors.length
                  ];

              return (
                <group key={`grid-group-${index}`}>
                  <GridfinityBase
                    position={[baseX, 0, baseZ]}
                    width={grid.x}
                    height={grid.y}
                    color={color ?? "#ca2929"}
                    materialProps={materialProps}
                  />
                  <GridOutline
                    position={[baseX, 0, baseZ - cellSize]}
                    width={gridWidth}
                    height={gridHeight}
                    color={color ?? "#ca2929"}
                  />
                  <GridLabel
                    position={[
                      baseX + gridWidth / 2,
                      0.01,
                      baseZ + gridHeight / 2 - cellSize,
                    ]}
                    text={`${grid.x}x${grid.y}`}
                  />
                </group>
              );
            })}
          </Suspense>
        </Suspense>
      </Canvas>
    </div>
  );
}
