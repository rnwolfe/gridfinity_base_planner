"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import GridfinityBase from "./GridfinityBase";
import { useAtom } from "jotai";
import {
  materialSettingsAtom,
  gridDimensionsAtom,
  placedGridsAtom,
} from "~/atoms/grid";
// import { GridOutline } from "./GridOutline";
import { GridLabel } from "./GridLabel";
import { CameraControls } from "./CameraControls";
import { CameraController } from "~/components/CameraController";
import { isSTLDraggingOverAtom } from "~/atoms/stl";
import { STLDropOverlay } from "./STLDropOverlay";
import { PreviewModel } from "./PreviewModel";
import { showGridLabelsAtom, showPlaneAtom } from "~/atoms/camera";
import { occupiedPositionsAtom, type GridfinityModel } from "~/atoms/models";
import { selectedModelsAtom } from "~/atoms/models";
import { findValidPosition } from "~/components/ModelSelector";

export default function GridVisualizer() {
  const [materialSettings] = useAtom(materialSettingsAtom);
  const [{ width: overallWidth, height: overallHeight }] =
    useAtom(gridDimensionsAtom);
  const [grids] = useAtom(placedGridsAtom);
  const [isSTLDraggingOver] = useAtom(isSTLDraggingOverAtom);
  const [selectedModels, setSelectedModels] = useAtom(selectedModelsAtom);
  const [showGridLabels] = useAtom(showGridLabelsAtom);
  const [showPlane] = useAtom(showPlaneAtom);
  const [occupiedPositions] = useAtom(occupiedPositionsAtom);

  const cellSize = 0.042; // 42mm in meters

  const getMaterialProperties = (finish: "matte" | "semi-gloss" | "glossy") => {
    switch (finish) {
      case "matte":
        return { 
          roughness: 0.9, 
          metalness: 0.1, 
          clearcoat: 0,
          envMapIntensity: 0.5 
        };
      case "semi-gloss":
        return { 
          roughness: 0.4, 
          metalness: 0.3, 
          clearcoat: 0.6,
          envMapIntensity: 0.8 
        };
      case "glossy":
        return { 
          roughness: 0.1, 
          metalness: 0.5, 
          clearcoat: 1,
          envMapIntensity: 1 
        };
    }
  };

  const materialProps = getMaterialProperties(materialSettings.finish);

  const getBackground = () => {
    switch (materialSettings.backgroundStyle) {
      case "simple":
        return <color attach="background" args={["#f8f9fa"]} />;
      case "environment":
        return (
          <Environment
            preset={materialSettings.environment}
            background={false}
            blur={0.8}
            resolution={256}
          >
            <ContactShadows 
              opacity={0.4}
              scale={10}
              blur={2}
              far={10}
              resolution={256}
              color="#000000"
            />
          </Environment>
        );
      case "gradient":
        return (
          <>
            <color attach="background" args={["#ffffff"]} />
            <mesh scale={100}>
              <sphereGeometry args={[1, 64, 64]} />
              <meshBasicMaterial>
                <Gradient
                  stops={[0, 1]} 
                  colors={['#ffffff', '#e5e7eb']}
                  attach="map"
                />
              </meshBasicMaterial>
            </mesh>
          </>
        );
      default:
        return <color attach="background" args={["#f8f9fa"]} />;
    }
  };

  // Helper component for gradient
  function Gradient({ stops, colors, attach }: { 
    stops: number[]; 
    colors: string[]; 
    attach: string;
  }) {
    const canvas = useMemo(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 2;
      canvas.height = 128;
      const context = canvas.getContext('2d');
      if (context) {
        const gradient = context.createLinearGradient(0, 0, 0, 128);
        stops.forEach((stop, index) => {
          gradient.addColorStop(stop, colors[index] ?? '#ffffff');
        });
        context.fillStyle = gradient;
        context.fillRect(0, 0, 2, 128);
      }
      return canvas;
    }, [stops, colors]);

    return <canvasTexture attach={attach} args={[canvas]} />;
  }

  return (
    <div className="relative aspect-square max-h-[400px] lg:max-h-[670px] w-full overflow-hidden rounded-lg border bg-white shadow-sm">
      <STLDropOverlay />
      <CameraControls />
      <Canvas
        shadows
        camera={{
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{ 
          alpha: false,
          antialias: true 
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
            const modelData = JSON.parse(e.dataTransfer.getData("application/json")) as GridfinityModel;
            const validPosition = findValidPosition(modelData, occupiedPositions);
            if (!validPosition) {
              console.warn("No valid position found for model");
              return;
            }

            setSelectedModels((prev) => {
              const newModel = {
                ...modelData,
                instanceId: `${modelData.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                position: validPosition,
              };
              return [...prev, newModel as GridfinityModel];
            });
          } catch (error) {
            console.error("Error handling model drop:", error);
          }
        }}
      >
        {getBackground()}
        <Suspense fallback={null}>
          <CameraController />
          <ambientLight intensity={0.2} />
          <directionalLight 
            position={[5, 8, 3]} 
            intensity={0.6} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <directionalLight 
            position={[-3, 4, -2]}
            intensity={0.3}
            castShadow
          />
          <directionalLight 
            position={[-2, 3, 5]}
            intensity={0.2}
            color="#b0c4de"
          />
          <hemisphereLight 
            color="#ffffff"
            groundColor="#d9d9d9"
            intensity={0.2}
          />

          {materialSettings.environment && (
            <Environment
              preset={materialSettings.environment}
              background={false}
              blur={0.8}
              resolution={256}
            >
              <ContactShadows 
                opacity={0.4}
                scale={10}
                blur={2}
                far={10}
                resolution={256}
                color="#000000"
              />
            </Environment>
          )}

          <fog attach="fog" args={["#f0f2f5", 8, 20]} />

          <Suspense fallback={null}>
            {/* Background plane */}
            {showPlane && (
              <mesh
                position={[
                  overallWidth / 2,
                  -0.004,
                  overallHeight / 2 - cellSize,
                ]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <boxGeometry args={[overallWidth, overallHeight, 0.004]} />
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
            )}
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
                  {/* <GridOutline
                    position={[baseX, 0, baseZ - cellSize]}
                    width={gridWidth}
                    height={gridHeight}
                    color={color ?? "#ca2929"}
                  /> */}
                  {showGridLabels && (
                    <GridLabel
                      position={[
                        baseX + gridWidth / 2,
                        0.01,
                        baseZ + gridHeight / 2 - cellSize,
                      ]}
                      text={`${grid.x}x${grid.y}`}
                    />
                  )}
                </group>
              );
            })}
          </Suspense>
        </Suspense>
        
        {/* {gridSTLs.map((stl) => (
          <STLModel 
            key={stl.id}
            stl={stl}
            cellSize={cellSize}
          />
        ))} */}

        {selectedModels.map((model) => (
          <PreviewModel key={model.instanceId} model={model} />
        ))}
      </Canvas>
      
      {isSTLDraggingOver && (
        <div className="absolute inset-0 cursor-move bg-black/10" />
      )}
    </div>
  );
}
