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

const findValidPosition = (
  model: GridfinityModel,
  occupiedPositions: OccupiedPosition[],
) => {
  // Try positions within grid first
  for (let y = 0; y < 10; y++) {  // Limit to reasonable grid size
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
  const [occupiedPositions] = useAtom(occupiedPositionsAtom);
  const [, setHoveredModelId] = useAtom(hoveredModelIdAtom);

  const categories = ["bins", "bases", "lids", "other"] as const;
  const filteredModels = availableModels.filter(
    (model) => model.category === selectedCategory,
  );

  const handleModelClick = (model: GridfinityModel) => {
    const validPosition = findValidPosition(model, occupiedPositions);
    if (!validPosition) {
      // Show error message - no valid position found
      return;
    }

    setSelectedModels((prev) => {
      const newModel = {
        ...model,
        instanceId: `${model.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: validPosition,
      };
      return [...prev, newModel];
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Category</label>
        <Select
          value={selectedCategory}
          onValueChange={(value: (typeof categories)[number]) => {
            setSelectedCategory(value);
            setSelectedModels([]);
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
        <div className="grid max-h-[calc(100vh-850px)] grid-cols-1 gap-2 overflow-y-auto px-2">
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
                onClick={() => handleModelClick(model)}
              />
            );
          })}
        </div>
      </div>

      {selectedModels.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Selected Models ({selectedModels.length})
          </label>
          <div className="space-y-1">
            {selectedModels.map((model) => (
              <div
                key={model.instanceId}
                className="group flex items-center justify-between rounded-md p-2 hover:bg-gray-50 hover:cursor-pointer border border-gray-200"
                onMouseEnter={() => setHoveredModelId(model.instanceId ?? null)}
                onMouseLeave={() => setHoveredModelId(null)}
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 relative">
                    <Image
                      src={`/previews/${model.id}.png`}
                      alt={model.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm">{model.name}</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedModels((prev) =>
                      prev.filter((m) => m.instanceId !== model.instanceId)
                    );
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
