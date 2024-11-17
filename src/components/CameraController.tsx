"use client";

import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { gridDimensionsAtom } from "~/atoms/grid";
import { cameraControlsAtom } from "~/atoms/camera";
import { useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export function CameraController() {
  const { camera } = useThree();
  const [{ width, height }] = useAtom(gridDimensionsAtom);
  const [cameraControl] = useAtom(cameraControlsAtom);
  const [, setUserHasInteracted] = useState(false);

  // Camera position calculation helper
  const calculateCameraPosition = (isTopView = false) => {
    const maxDimension = Math.max(width, height);
    const distance = maxDimension * 1.5;
    const altitude = distance * 0.7;

    return isTopView
      ? {
          position: { x: width / 2, y: distance, z: height / 2 },
          target: { x: width / 2, y: 0, z: height / 2 },
        }
      : {
          position: { x: width / 2, y: altitude, z: height + distance },
          target: { x: width / 2, y: 0, z: height / 2 },
        };
  };

  const animateCamera = (
    targetPosition: THREE.Vector3Like,
    targetLookAt: THREE.Vector3Like,
  ) => {
    let frame: number;
    let progress = 0;

    const startPosition = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };

    const animate = () => {
      progress += 0.03;
      const t = Math.min(1, progress);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      camera.position.x = THREE.MathUtils.lerp(
        startPosition.x,
        targetPosition.x,
        ease,
      );
      camera.position.y = THREE.MathUtils.lerp(
        startPosition.y,
        targetPosition.y,
        ease,
      );
      camera.position.z = THREE.MathUtils.lerp(
        startPosition.z,
        targetPosition.z,
        ease,
      );

      camera.lookAt(targetLookAt.x, targetLookAt.y, targetLookAt.z);
      camera.updateProjectionMatrix();

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  };

  useEffect(() => {
    if (cameraControl.action === "reset") {
      const { position, target } = calculateCameraPosition();
      animateCamera(position, target);
      setUserHasInteracted(false);
    } else if (cameraControl.action === "topView") {
      const { position, target } = calculateCameraPosition(true);
      animateCamera(position, target);
      setUserHasInteracted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraControl.timestamp]);

  return (
    <OrbitControls
      makeDefault
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2}
      target={[width / 2, 0, height / 2]}
      onChange={() => setUserHasInteracted(true)}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
}
