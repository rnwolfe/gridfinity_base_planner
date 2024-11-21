/* eslint-disable react-hooks/exhaustive-deps */
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import type { GridfinityModel, OccupiedPosition } from "~/atoms/models";
import { type BufferGeometry, type NormalBufferAttributes } from "three";
import { TransformControls, type TransformControls as TransformControlsImpl } from "@react-three/drei";
import { useAtom } from "jotai";
import { occupiedPositionsAtom } from "~/atoms/models";
import { useState, useRef, useEffect } from "react";
import type * as THREE from "three";
import { gridDimensionsAtom } from "~/atoms/grid";
import { hoveredModelIdAtom } from "~/atoms/models";

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
  const [occupiedPositions, setOccupiedPositions] = useAtom(occupiedPositionsAtom);
  const [gridDimensions] = useAtom(gridDimensionsAtom);
  const [hoveredModelId, setHoveredModelId] = useAtom(hoveredModelIdAtom);

  const isHighlighted = model.instanceId === hoveredModelId || hovered || showControls;

  const checkCollision = (x: number, z: number) => {
    if (!model.instanceId) return false;
    
    return occupiedPositions.some(pos => {
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
    
    console.log('Finding spawn position');
    console.log('Grid units:', { width: gridWidth, height: gridHeight });
    console.log('Occupied positions:', occupiedPositions);
    
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

  const [position, setPosition] = useState<[number, number, number]>([0, 0.004, 0]);

  useEffect(() => {
    if (!model.instanceId) return;
    const initialPosition = findValidSpawnPosition();
    setPosition(initialPosition);
  }, [model.instanceId]);

  useEffect(() => {
    if (!model.instanceId) return;

    setOccupiedPositions(prev => {
      const filtered = prev.filter(pos => pos.modelId !== model.instanceId);
      return [...filtered, {
        x: Math.round(position[0] / cellSize),
        y: Math.round(position[2] / cellSize),
        width: model.dimensions.width,
        height: model.dimensions.height,
        modelId: model.instanceId
      }] as OccupiedPosition[];
    });

    return () => {
      setOccupiedPositions(prev => 
        prev.filter(pos => pos.modelId !== model.instanceId)
      );
    };
  }, [model.instanceId, position]);

  useEffect(() => {
    if (geometry) {
      (geometry as BufferGeometry<NormalBufferAttributes>).computeVertexNormals();
      (geometry as BufferGeometry<NormalBufferAttributes>).normalizeNormals();
    }
  }, [geometry]);

  const handleTransformChange = () => {
    if (!meshRef.current) return;
    
    const pos = meshRef.current.position;
    const newX = Math.round(pos.x / cellSize);
    const newZ = Math.round(pos.z / cellSize);

    if (checkCollision(newX, newZ)) {
      // Revert to previous position if collision detected
      meshRef.current.position.set(...position);
      return;
    }

    const newPosition: [number, number, number] = [
      newX * cellSize,
      0.004,
      newZ * cellSize
    ];
    
    meshRef.current.position.set(...newPosition);
    setPosition(newPosition);

    // Update occupied position
    if (model.instanceId) {
      setOccupiedPositions(prev => {
        const filtered = prev.filter(pos => pos.modelId !== model.instanceId);
        return [...filtered, {
          x: newX,
          y: newZ,
          width: model.dimensions.width,
          height: model.dimensions.height,
          modelId: model.instanceId
        }] as OccupiedPosition[];
      });
    }
  };

  const handleTransformEnd = () => {
    setIsDragging(false);
    if (meshRef.current) {
      const pos = meshRef.current.position;
      const newX = Math.round(pos.x / cellSize);
      const newZ = Math.round(pos.z / cellSize);

      if (checkCollision(newX, newZ)) {
        meshRef.current.position.set(...position);
        return;
      }

      const newPosition: [number, number, number] = [
        newX * cellSize,
        0.004,
        newZ * cellSize
      ];
      
      meshRef.current.position.set(...newPosition);
      setPosition(newPosition);
    }
  };

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
          color={isHighlighted ? "#82c1ff" : "#f0efef"}
          roughness={0.2}
          metalness={0.3}
          clearcoat={0.1}
          clearcoatRoughness={0.1}
          transparent
          opacity={1}
          envMapIntensity={1.5}
          emissive={isHighlighted ? "#82c1ff" : "#efefef"}
          emissiveIntensity={0.4}
        />
      </mesh>
      {showControls  && (
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
    </>
  );
}
