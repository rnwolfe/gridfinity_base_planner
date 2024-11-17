import { useMemo } from "react";
import type { GridCount, PlacedGrid } from "~/types";

export function GridSummary({ placedGrids }: { placedGrids: PlacedGrid[] }) {
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
