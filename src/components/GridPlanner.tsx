"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import GridPlannerForm from "./GridPlannerForm";
import GridVisualizer from "./GridVisualizer";
import { calculateGridPlacements } from "../lib/gridPlacement";
import MaterialControls from "./MaterialControls";
import { gridDimensionsAtom, placedGridsAtom, freeSpacesAtom } from "~/atoms/grid";
import { formDimensionsAtom } from "~/atoms/form";
import { GridSummary } from "./GridSummary";
import { InfoIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";

export default function GridPlanner() {
  const [, setGridDimensions] = useAtom(gridDimensionsAtom);
  const [placedGrids, setPlacedGrids] = useAtom(placedGridsAtom);
  const [, setFreeSpaces] = useAtom(freeSpacesAtom);
  const [formDimensions] = useAtom(formDimensionsAtom);

  useEffect(() => {
    const { width, height, maxGridX, maxGridY } = formDimensions;
    console.log('Form dimensions:', formDimensions);

    setGridDimensions({
      width: width / 1000,
      height: height / 1000,
    });

    const result = calculateGridPlacements(width, height, maxGridX, maxGridY);
    console.log('Calculation result:', result);
    
    setPlacedGrids(result.placedGrids);
    setFreeSpaces(result.freeSpaces);
  }, [formDimensions, setGridDimensions, setPlacedGrids, setFreeSpaces]);

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row">
      <div className="w-full lg:w-1/3">
        <GridPlannerForm />
        {placedGrids.length > 0 && <GridSummary placedGrids={placedGrids} />}
      </div>
      <div className="w-full select-none lg:w-2/3">
        {placedGrids.length > 0 && (
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex w-full select-none flex-col gap-2">
              <GridVisualizer />
              <Alert>
                <InfoIcon className="h-5 w-5" />
                <AlertTitle>Visualizer Controls</AlertTitle>
                <AlertDescription>
                  Click and drag to rotate. Scroll to zoom. Hold shift while
                  dragging to pan.
                </AlertDescription>
              </Alert>
            </div>
            {/* <div className="w-full lg:w-1/3">
              <MaterialControls />
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}
