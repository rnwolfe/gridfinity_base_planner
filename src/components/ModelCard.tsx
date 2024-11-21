import type { GridfinityModel } from "~/atoms/models";
import { Card } from "./ui/card";
import Image from "next/image";

interface ModelCardProps {
  model: GridfinityModel;
  isSelected: boolean;
  selectedCount?: number;
  onClick: () => void;
}

export function ModelCard({ model, isSelected, selectedCount = 0, onClick }: ModelCardProps) {
  return (
    <Card
      className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex gap-3">
        <div className="w-[100px] h-[100px] bg-gray-50 rounded flex items-center justify-center relative">
          <Image
            src={`/previews/${model.id}.png`}
            alt={model.name}
            width={100}
            height={100}
            className="object-contain"
            onError={(e) => {
              console.error('Failed to load image for model:', model.id);
              e.currentTarget.src = '';
              e.currentTarget.parentElement!.innerHTML = `
                <div class="w-8 h-8 text-gray-400">
                  <CuboidIcon />
                </div>
              `;
            }}
          />
          {selectedCount > 0 && (
            <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {selectedCount}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">{model.name}</div>
          {model.description && (
            <div className="text-xs text-gray-500">{model.description}</div>
          )}
          <div className="text-xs text-gray-400 mt-1">
            {model.dimensions.width}x{model.dimensions.height}
            {model.dimensions.depth ? `x${model.dimensions.depth}` : ""}
          </div>
        </div>
      </div>
    </Card>
  );
}
