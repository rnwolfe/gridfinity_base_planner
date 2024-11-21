/* eslint-disable @typescript-eslint/no-misused-promises */
import { useCallback, useState } from "react";
import { useAtom } from "jotai";
import { type GridSTL, gridSTLsAtom } from "~/atoms/stl";
import { useDropzone } from "react-dropzone";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import * as THREE from "three";

export function STLDropZone() {
  const [, setGridSTLs] = useAtom(gridSTLsAtom);
  const [loading, setLoading] = useState(false);

  const processSTL = async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const loader = new STLLoader();
        try {
          const geometry = loader.parse(event.target?.result as ArrayBuffer);
          const bbox = new THREE.Box3().setFromObject(
            new THREE.Mesh(geometry)
          );
          const dimensions = bbox.getSize(new THREE.Vector3());
          
          // Convert to grid units (42mm = 1 grid unit)
          const gridWidth = Math.ceil(dimensions.x / 42);
          const gridHeight = Math.ceil(dimensions.z / 42);

          resolve({
            width: gridWidth,
            height: gridHeight
          });
        } catch (error) {
          reject(error as Error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);
    try {
      const newSTLs = await Promise.all(
        acceptedFiles.map(async (file) => {
          const dimensions = await processSTL(file);
          return {
            id: Math.random().toString(36).substr(2, 9),
            file,
            position: { x: 0, y: 0 },
            dimensions: dimensions as { width: number; height: number },
          };
        })
      );

      setGridSTLs((prev) => [...prev, ...newSTLs as unknown as GridSTL[]]);
    } catch (error) {
      console.error("Error processing STL files:", error);
    } finally {
      setLoading(false);
    }
  }, [setGridSTLs]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/stl': ['.stl'],
      'application/sla': ['.stl'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      {loading ? (
        <p>Processing STL files...</p>
      ) : isDragActive ? (
        <p>Drop STL files here...</p>
      ) : (
        <p>Drag and drop STL files here, or click to select files</p>
      )}
    </div>
  );
} 