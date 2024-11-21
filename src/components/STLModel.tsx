import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { useAtom } from "jotai";
import { gridSTLsAtom, isSTLDraggingOverAtom, type GridSTL } from "~/atoms/stl";
import { DragControls } from "@react-three/drei";
import { useDrag } from "@use-gesture/react";
import { useState, useRef } from "react";
import type * as THREE from "three";

interface STLModelProps {
  stl: GridSTL;
  cellSize: number;
}

export function STLModel({ stl, cellSize }: STLModelProps) {
  const geometry = useLoader(STLLoader, URL.createObjectURL(stl.file));
  const [, setGridSTLs] = useAtom(gridSTLsAtom);
  const [, setIsDragging] = useAtom(isSTLDraggingOverAtom);
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const bind = useDrag(({ active, movement: [x, z], last }) => {
    setIsDragging(active);

    if (last) {
      // Snap to grid
      const newX = Math.round(x / cellSize);
      const newZ = Math.round(z / cellSize);
      
      setGridSTLs((prev) =>
        prev.map((item) =>
          item.id === stl.id
            ? {
                ...item,
                gridPosition: {
                  gridX: newX,
                  gridY: newZ,
                },
              }
            : item
        )
      );
    }
  });

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      <mesh
        ref={meshRef}
        position={[
          stl.gridPosition.gridX * cellSize,
          0.001,
          stl.gridPosition.gridY * cellSize
        ]}
        geometry={geometry as THREE.BufferGeometry}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        {...(bind() as any)}
      >
        <meshStandardMaterial 
          color={hovered ? "#666" : "#888"}
          transparent
          opacity={0.9}
        />
      </mesh>
      {meshRef.current && (
        <DragControls
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <primitive object={meshRef.current} />
        </DragControls>
      )}
    </>
  );
}
