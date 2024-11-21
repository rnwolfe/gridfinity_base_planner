import { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { gridSTLsAtom } from "~/atoms/stl";
import { useDropzone } from "react-dropzone";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";

export function STLDropOverlay() {
  const [, setGridSTLs] = useAtom(gridSTLsAtom);
  const [isProcessing, setIsProcessing] = useState(false);

  const processSTL = async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const loader = new STLLoader();
        try {
          const geometry = loader.parse(event.target?.result as ArrayBuffer);
          const bbox = new THREE.Box3().setFromObject(new THREE.Mesh(geometry));
          const dimensions = bbox.getSize(new THREE.Vector3());

          // Convert to grid units (42mm = 1 grid unit)
          const gridWidth = Math.ceil(dimensions.x / 42);
          const gridHeight = Math.ceil(dimensions.z / 42);

          resolve({
            width: gridWidth,
            height: gridHeight,
          });
        } catch {
          reject(new Error("Error processing STL file"));
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsProcessing(true);
      try {
        const newSTLs = await Promise.all(
          acceptedFiles.map(async (file) => {
            const dimensions = await processSTL(file);
            return {
              id: Math.random().toString(36).substr(2, 9),
              file,
              gridPosition: { gridX: 0, gridY: 0 },
              dimensions: dimensions as { width: number; height: number },
            };
          }),
        );

        setGridSTLs((prev) => [...prev, ...newSTLs]);
      } catch (error) {
        console.error("Error processing STL files:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [setGridSTLs],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop as never,
    accept: {
      "model/stl": [".stl"],
      "application/sla": [".stl"],
    },
    noClick: true, // Only accept drag and drop
  });

  if (!isDragActive && !isProcessing) return null;

  return (
    <div
      {...getRootProps()}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <input {...getInputProps()} />
      <div className="rounded-lg bg-white p-8 text-center shadow-lg">
        {isProcessing ? (
          <p>Processing STL files...</p>
        ) : (
          <p>Drop STL files here to add them to your grid</p>
        )}
      </div>
    </div>
  );
}
