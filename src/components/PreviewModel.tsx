/* eslint-disable react-hooks/exhaustive-deps */
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { TextureLoader } from "three";
import type { GridfinityModel, OccupiedPosition } from "~/atoms/models";
import { type BufferGeometry, type NormalBufferAttributes } from "three";
import {
  TransformControls,
  type TransformControls as TransformControlsImpl,
} from "@react-three/drei";
import { useAtom } from "jotai";
import { occupiedPositionsAtom } from "~/atoms/models";
import { useState, useRef, useEffect } from "react";
import { gridDimensionsAtom } from "~/atoms/grid";
import { hoveredModelIdAtom, selectedModelsAtom } from "~/atoms/models";
import { Vector2 } from "three";
import * as THREE from "three";

interface PreviewModelProps {
  model: GridfinityModel;
}

export function PreviewModel({ model }: PreviewModelProps) {
  const geometry = useLoader(STLLoader, model.path);
  const scale = 0.001; // Convert mm to meters
  const cellSize = 0.042; // 42mm in meters
  const [, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const transformRef = useRef<typeof TransformControlsImpl | null>(null);
  const rotateRef = useRef<typeof TransformControlsImpl | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [occupiedPositions, setOccupiedPositions] = useAtom(
    occupiedPositionsAtom,
  );
  const [gridDimensions] = useAtom(gridDimensionsAtom);
  const [hoveredModelId, setHoveredModelId] = useAtom(hoveredModelIdAtom);
  const [, setSelectedModels] = useAtom(selectedModelsAtom);
  const isHighlighted =
    model.instanceId === hoveredModelId || hovered || showControls;
  // const pivotRef = useRef<THREE.Group>(null);

  const checkCollision = (x: number, z: number) => {
    if (!model.instanceId) return false;

    return occupiedPositions.some((pos) => {
      if (pos.modelId === model.instanceId) return false;

      const overlap = !(
        x >= pos.x + pos.width ||
        x + model.dimensions.width <= pos.x ||
        z >= pos.y + pos.height ||
        z + model.dimensions.height <= pos.y
      );

      return overlap;
    });
  };

  const findValidSpawnPosition = (): [number, number, number] => {
    let layer = 0;
    const baseY = 0.004;
    const gridWidth = Math.floor(gridDimensions.width * 10);
    const gridHeight = Math.floor(gridDimensions.height * 10);

    if (
      model.instanceId &&
      model.position?.x !== undefined &&
      model.position?.z !== undefined &&
      model.position?.x !== 0 &&
      model.position?.z !== 0
    ) {
      return [model.position.x, baseY, model.position.z];
    }

    console.log("Finding spawn position");
    console.log("Grid units:", { width: gridWidth, height: gridHeight });
    console.log("Occupied positions:", occupiedPositions);

    while (layer < Math.max(gridWidth, gridHeight)) {
      for (let z = 0; z < gridHeight; z++) {
        for (let x = 0; x < gridWidth; x++) {
          if (!checkCollision(x, z)) {
            return [x * cellSize, baseY, z * cellSize];
          }
        }
      }
      layer++;
    }
    return [0, baseY, 0];
  };

  const [position, setPosition] = useState<[number, number, number]>([
    0, 0.004, 0,
  ]);

  const initRotation = () => {
    if (
      !meshRef.current ||
      !model.instanceId ||
      !model.rotation ||
      model.rotation === 0
    )
      return;
    meshRef.current.rotation.set(
      -Math.PI / 2,
      0,
      ((model.rotation ?? 0) * Math.PI) / 180,
    );
  };

  useEffect(() => {
    if (!model.instanceId) return;

    const initialPosition = findValidSpawnPosition()
    setPosition(initialPosition);

    // Update the model's position in the global state when it changes
    setSelectedModels((prev) =>
      prev.map((m) =>
        m.instanceId === model.instanceId
          ? {
              ...m,
              position: new THREE.Vector3(...initialPosition),
              gridPosition: {
                x: Math.round(initialPosition[0] / cellSize),
                y: Math.round(initialPosition[2] / cellSize),
              },
            }
          : m,
      ),
    );
    initRotation();
  }, [model.instanceId]);

  useEffect(() => {
    if (!model.instanceId) return;

    setOccupiedPositions((prev) => {
      const filtered = prev.filter((pos) => pos.modelId !== model.instanceId);
      return [
        ...filtered,
        {
          x: Math.round(position[0] / cellSize),
          y: Math.round(position[2] / cellSize),
          width: model.dimensions.width,
          height: model.dimensions.height,
          modelId: model.instanceId,
        },
      ] as OccupiedPosition[];
    });

    return () => {
      setOccupiedPositions((prev) =>
        prev.filter((pos) => pos.modelId !== model.instanceId),
      );
    };
  }, [model.instanceId, position]);

  useEffect(() => {
    if (geometry) {
      (
        geometry as BufferGeometry<NormalBufferAttributes>
      ).computeVertexNormals();
      (geometry as BufferGeometry<NormalBufferAttributes>).normalizeNormals();
    }
  }, [geometry]);

  const handleTransformChange = () => {
    if (!meshRef.current) return;
    setIsTranslating(true);

    const pos = meshRef.current.position;
    const newX = Math.round(pos.x / cellSize);
    const newZ = Math.round(pos.z / cellSize);

    // if (checkCollision(newX, newZ)) {
    //   meshRef.current.position.set(...position);
    //   return;
    // }

    const newPosition: [number, number, number] = [
      newX * cellSize,
      0.004,
      newZ * cellSize,
    ];

    meshRef.current.position.set(...newPosition);
    setPosition(newPosition);

    // Update both occupied positions and the model's position in global state
    if (model.instanceId) {
      setOccupiedPositions((prev) => {
        const filtered = prev.filter((pos) => pos.modelId !== model.instanceId);
        return [
          ...filtered,
          {
            x: newX,
            y: newZ,
            width: model.dimensions.width,
            height: model.dimensions.height,
            modelId: model.instanceId,
          },
        ] as OccupiedPosition[];
      });

      // Update the model's position in the global state
      setSelectedModels((prev) =>
        prev.map((m) =>
          m.instanceId === model.instanceId
            ? {
                ...m,
                position: new THREE.Vector3(...newPosition),
                gridPosition: {
                  x: newX,
                  y: newZ,
                },
              }
            : m,
        ),
      );
    }
  };

  const handleTransformEnd = () => {
    setIsDragging(false);
    if (meshRef.current) {
      const pos = meshRef.current.position;
      const newX = Math.round(pos.x / cellSize);
      const newZ = Math.round(pos.z / cellSize);

      // if (checkCollision(newX, newZ)) {
      //   meshRef.current.position.set(...position);
      //   return;
      // }

      const newPosition: [number, number, number] = [
        newX * cellSize,
        0.004,
        newZ * cellSize,
      ];

      meshRef.current.position.set(...newPosition);
      setPosition(newPosition);
      setIsTranslating(false);
    }
  };

  const handleRotate = () => {
    if (!meshRef.current || !model.instanceId) return;
    setIsRotating(true);

    // Calculate rotation in degrees (rounded to nearest 90)
    const radians = meshRef.current.rotation.z;
    const degrees = (radians * 180) / Math.PI;
    const snappedDegrees = Math.round(degrees / 90) * 90;

    // Update the model's rotation in global state
    setSelectedModels((prev) =>
      prev.map((m) =>
        m.instanceId === model.instanceId
          ? {
              ...m,
              rotation: snappedDegrees,
            }
          : m,
      ),
    );

    // Update mesh rotation to snapped value
    meshRef.current.rotation.set(
      -Math.PI / 2, // Keep X rotation constant
      meshRef.current.rotation.y, // Keep Y rotation
      (snappedDegrees * Math.PI) / 180, // Apply Z rotation
    );
    setIsRotating(false);
  };

  // Updated texture loaders to include aoMap
  const [normalMap, heightMap, roughnessMap, aoMap] = useLoader(TextureLoader, [
    "/materials/Plastic_Rough_001_normal.jpg",
    "/materials/Plastic_Rough_001_height.png",
    "/materials/Plastic_Rough_001_roughness.jpg",
    "/materials/Plastic_Rough_001_ambientOcclusion.jpg",
  ]);

  return (
    <>
      <mesh
        ref={meshRef}
        geometry={geometry as BufferGeometry<NormalBufferAttributes>}
        scale={[scale, scale, scale]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          setShowControls(true);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setHoveredModelId(model.instanceId ?? null);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          setHoveredModelId(null);
        }}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={isHighlighted ? "#82c1ff" : "#4b6a8e"}
          roughness={20}
          roughnessMap={roughnessMap}
          normalMap={normalMap}
          normalScale={new Vector2(10, 10)}
          displacementMap={heightMap}
          displacementScale={1}
          aoMap={aoMap}
          aoMapIntensity={10}
          clearcoat={0}
          clearcoatRoughness={0.1}
          transparent
          opacity={1}
          envMapIntensity={1.5}
          emissive={isHighlighted ? "#82c1ff" : "#4b5320"}
          emissiveIntensity={0}
        />
      </mesh>
      {showControls && !isRotating && (
        <TransformControls
          ref={transformRef as never}
          object={meshRef as never}
          mode="translate"
          showX
          showY={false}
          showZ
          size={1}
          onObjectChange={handleTransformChange}
          onMouseUp={handleTransformEnd}
          onPointerMissed={() => setShowControls(false)}
          space="world"
        />
      )}
      {showControls && !isTranslating && (
        <TransformControls
          ref={rotateRef as never}
          object={meshRef as never}
          mode="rotate"
          showX={false}
          showY={true}
          showZ={false}
          size={1}
          rotationSnap={Math.PI / 2}
          onObjectChange={handleRotate}
          onMouseUp={handleTransformEnd}
          onPointerMissed={() => setShowControls(false)}
          space="world"
          position={[
            position[0] + (model.dimensions.width * cellSize) / 2,
            position[1],
            position[2] + (model.dimensions.height * cellSize) / 2,
          ]}
        />
      )}
    </>
  );
}
