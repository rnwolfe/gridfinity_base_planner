import { useAtom } from "jotai";
import {
  availableModelsAtom,
  selectedModelsAtom,
  selectedCategoryAtom,
  type GridfinityModel,
  occupiedPositionsAtom,
  type OccupiedPosition,
  hoveredModelIdAtom,
} from "~/atoms/models";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ModelCard } from "./ModelCard";
import Image from "next/image";
import { X } from "lucide-react";

export const findValidPosition = (
  model: GridfinityModel,
  occupiedPositions: OccupiedPosition[],
) => {
  // Try positions within grid first
  for (let y = 0; y < 10; y++) {
    // Limit to reasonable grid size
    for (let x = 0; x < 10; x++) {
      // Check if position is valid
      const collision = occupiedPositions.some((pos) => {
        return !(
          x >= pos.x + pos.width ||
          x + model.dimensions.width <= pos.x ||
          y >= pos.y + pos.height ||
          y + model.dimensions.height <= pos.y
        );
      });

      if (!collision) {
        return { x, y };
      }
    }
  }
  return null;
};

export function ModelSelector() {
  const [availableModels] = useAtom(availableModelsAtom);
  const [selectedModels, setSelectedModels] = useAtom(selectedModelsAtom);
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [hoveredModelId, setHoveredModelId] = useAtom(hoveredModelIdAtom);

  const categories = ["bins", "bases", "lids", "other"] as const;
  const filteredModels = availableModels.filter(
    (model) => model.category === selectedCategory,
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Category</label>
        <Select
          value={selectedCategory}
          onValueChange={(value: (typeof categories)[number]) => {
            setSelectedCategory(value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a category..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Available Models</label>
        <div className="grid h-[430px] grid-cols-1 gap-2 overflow-y-auto px-2">
          {filteredModels.map((model) => {
            const instanceCount = selectedModels.filter(
              (m) => m.id === model.id,
            ).length;
            return (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={instanceCount > 0}
                selectedCount={instanceCount}
              />
            );
          })}
        </div>
      </div>

      {selectedModels.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Selected Models</label>
          <div className="space-y-1">
            {selectedModels.map((model) => (
              <div
                key={model.instanceId}
                className={`flex items-center justify-between rounded-md border p-2 text-sm ${
                  hoveredModelId === model.instanceId ? "bg-blue-50" : ""
                }`}
                onMouseEnter={() => setHoveredModelId(model.instanceId ?? null)}
                onMouseLeave={() => setHoveredModelId(null)}
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={`/previews/${model.id}.png`}
                    alt={model.name}
                    width={50}
                    height={50}
                  />
                  <span>{model.name}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedModels((prev) =>
                      prev.filter((m) => m.instanceId !== model.instanceId),
                    );
                  }}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-sm text-gray-600">
        Drag a model to add it to the grid
      </p>
    </div>
  );
}
