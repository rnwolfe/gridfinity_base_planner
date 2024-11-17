"use client";

import { useAtom } from "jotai";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { formDimensionsAtom, measurementUnitAtom } from "~/atoms/form";
import { Switch } from "~/components/ui/switch";

const MM_PER_INCH = 25.4;

export default function GridPlannerForm() {
  const [dimensions, setDimensions] = useAtom(formDimensionsAtom);
  const [unit, setUnit] = useAtom(measurementUnitAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const convertToDisplay = (value: number) => {
    return unit === "inches" ? Number((value / MM_PER_INCH).toFixed(3)) : value;
  };

  const convertToMM = (value: number) => {
    return unit === "inches" ? value * MM_PER_INCH : value;
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Base Dimensions</h2>
        <div className="flex items-center gap-2">
          <span
            className={unit === "mm" ? "font-medium" : "text-muted-foreground"}
          >
            mm
          </span>
          <Switch
            className="text-sm"
            checked={unit === "inches"}
            onCheckedChange={(checked) => setUnit(checked ? "inches" : "mm")}
          />
          <span
            className={
              unit === "inches" ? "font-medium" : "text-muted-foreground"
            }
          >
            inches
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="width">Width ({unit})</Label>
            <Input
              id="width"
              type="number"
              step={unit === "inches" ? "0.001" : "1"}
              value={convertToDisplay(dimensions.width)}
              onChange={(e) =>
                setDimensions({
                  ...dimensions,
                  width: convertToMM(Number(e.target.value)),
                })
              }
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500">Base width in {unit}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height ({unit})</Label>
            <Input
              id="height"
              type="number"
              step={unit === "inches" ? "0.001" : "1"}
              value={convertToDisplay(dimensions.height)}
              onChange={(e) =>
                setDimensions({
                  ...dimensions,
                  height: convertToMM(Number(e.target.value)),
                })
              }
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500">Base height in {unit}</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="maxGridX">Max Grid Width</Label>
            <Input
              id="maxGridX"
              type="number"
              min={1}
              max={10}
              value={dimensions.maxGridX}
              onChange={(e) =>
                setDimensions({
                  ...dimensions,
                  maxGridX: Number(e.target.value),
                })
              }
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500">
              Maximum grid units wide (1-10)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxGridY">Max Grid Height</Label>
            <Input
              id="maxGridY"
              type="number"
              min={1}
              max={10}
              value={dimensions.maxGridY}
              onChange={(e) =>
                setDimensions({
                  ...dimensions,
                  maxGridY: Number(e.target.value),
                })
              }
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500">
              Maximum grid units tall (1-10)
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
