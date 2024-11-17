"use client";

import { Button } from "~/components/ui/button";
import { RefreshCcwDot, ArrowDown } from "lucide-react";
import { useAtom } from "jotai";
import { cameraControlsAtom } from "~/atoms/camera";
import { useEffect } from "react";

export function CameraControls() {
  const [, setCameraControl] = useAtom(cameraControlsAtom);

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
      </div>
    </div>
  );
}
