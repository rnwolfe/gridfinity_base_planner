"use client";
import { Button } from "~/components/ui/button";
import {
  RefreshCcwDot,
  ArrowDown,
  SquareMinusIcon,
  SquarePlusIcon,
  TagIcon,
} from "lucide-react";
import { useAtom } from "jotai";
import {
  cameraControlsAtom,
  showGridLabelsAtom,
  showPlaneAtom,
} from "~/atoms/camera";
import { useEffect } from "react";

export function CameraControls() {
  const [, setCameraControl] = useAtom(cameraControlsAtom);
  const [showGridLabels, setShowGridLabels] = useAtom(showGridLabelsAtom);
  const [showPlane, setShowPlane] = useAtom(showPlaneAtom);

  const handleReset = () => {
    setCameraControl({ action: "reset", timestamp: Date.now() });
  };

  const handleTopView = () => {
    setCameraControl({ action: "topView", timestamp: Date.now() });
  };

  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute right-4 top-4 z-50">
      <div className="flex items-center gap-2 rounded-md bg-slate-300 p-2">
        <span className="flex items-center gap-2 text-sm text-slate-800">
          Camera Controls
        </span>
        <Button
          onClick={handleReset}
          size={"sm"}
          variant={"secondary"}
          title="Reset Camera"
        >
          <RefreshCcwDot className="h-4 w-4" /> Reset
        </Button>
        <Button
          onClick={handleTopView}
          size={"sm"}
          variant={"secondary"}
          title="Top View"
        >
          <ArrowDown className="h-4 w-4" /> Top
        </Button>
        <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowGridLabels(!showGridLabels)}
              variant={"secondary"}
              title="Show Grid Labels"
            >
              <TagIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setShowPlane(!showPlane)}
              variant={"secondary"}
              title="Show Base Plane"
            >
              {showPlane ? (
                <SquareMinusIcon className="h-4 w-4" />
              ) : (
                <SquarePlusIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
      </div>
    </div>
  );
}
