import { useMemo } from "react";
import type { GridCount, PlacedGrid } from "~/types";
import { useAtom } from "jotai";
import { freeSpacesAtom } from "~/atoms/grid";
import { measurementUnitAtom } from "~/atoms/form";


export function GridSummary({ placedGrids }: { placedGrids: PlacedGrid[] }) {
  const [freeSpaces] = useAtom(freeSpacesAtom);
  const [measurementUnit] = useAtom(measurementUnitAtom);
  const gridCounts = useMemo(() => {
    const counts: GridCount[] = [];

    placedGrids.forEach((grid) => {
      // Sort dimensions to normalize orientation (smaller dimension first)
      const [smallerDim, largerDim] = [grid.x, grid.y].sort((a, b) => a - b);

      // Look for existing grid with either orientation
      const existing = counts.find(
        (g) =>
          (g.x === smallerDim && g.y === largerDim) ||
          (g.x === largerDim && g.y === smallerDim),
      );

      if (existing) {
        existing.count++;
      } else {
        // Always store with smaller dimension as x for consistency
        counts.push({ x: smallerDim ?? 0, y: largerDim ?? 0, count: 1 });
      }
    });

    // Sort by area (largest first)
    return counts.sort((a, b) => b.x * b.y - a.x * a.y);
  }, [placedGrids]);

  const spacerSummary = useMemo(() => {
    const GRID_SIZE = 42; // mm

    const horizontalSpaces = freeSpaces
      .filter((space) => space.width > space.height)
      .map((space) => ({
        width: Math.round(space.width * GRID_SIZE),
        height: Math.round(space.height * GRID_SIZE),
      }));

    const verticalSpaces = freeSpaces
      .filter((space) => space.height >= space.width)
      .map((space) => ({
        width: Math.round(space.width * GRID_SIZE),
        height: Math.round(space.height * GRID_SIZE),
      }));

    return { horizontalSpaces, verticalSpaces };
  }, [freeSpaces]);

  const measurementUnitLabel = measurementUnit === "mm" ? "mm" : "in";
  const mmToIn = (mm: number) => mm / 25.4;

  return (
    <div className="mt-6 rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Grid Summary</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-500">
          <div>Size</div>
          <div className="text-center">Count</div>
          <div className="text-right">Area</div>
        </div>
        {gridCounts.map((grid, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-4 text-sm text-gray-900"
          >
            <div>{`${grid.x}x${grid.y}`}</div>
            <div className="text-center">{grid.count}</div>
            <div className="text-right">{`${grid.x * grid.y} units`}</div>
          </div>
        ))}
        {(spacerSummary.horizontalSpaces.length > 0 ||
          spacerSummary.verticalSpaces.length > 0) && (
          <div className="mt-4 border-t pt-4">
            <h3 className="mb-2 font-medium text-gray-900">Required Spacers</h3>

            {spacerSummary.horizontalSpaces.map((space, index) => (
              <div
                key={`h${index}`}
                className="grid grid-cols-3 gap-4 text-sm text-gray-900"
              >
                <div>Horizontal Spacer {index + 1}</div>
                <div className="text-center">1×</div>
                <div className="text-right">
                  {measurementUnit === "mm"
                    ?   space.width
                    : mmToIn(space.width)}
                  ×
                  {measurementUnit === "mm"
                    ? space.height
                    : mmToIn(space.height)}
                  {measurementUnit}
                </div>
              </div>
            ))}
            {spacerSummary.verticalSpaces.map((space, index) => (
              <div
                key={`v${index}`}
                className="grid grid-cols-3 gap-4 text-sm text-gray-900"
              >
                <div>Corner Spacer {index + 1}</div>
                <div className="text-center">1×</div>
                <div className="text-right">
                  {measurementUnit === "mm"
                    ? space.width
                    : mmToIn(space.width)}
                  ×
                  {measurementUnit === "mm"
                    ? space.height
                    : mmToIn(space.height)}
                  {measurementUnit}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 border-t pt-4">
          <div className="grid grid-cols-3 gap-4 text-sm font-medium">
            <div>Total</div>
            <div className="text-center">
              {gridCounts.reduce((sum, grid) => sum + grid.count, 0)} grids
            </div>
            <div className="text-right">
              {gridCounts.reduce(
                (sum, grid) => sum + grid.x * grid.y * grid.count,
                0,
              )}{" "}
              units
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
