import { atom } from "jotai";

export interface GridfinityModel {
  id: string;
  instanceId?: string;
  name: string;
  path: string;
  category: string;
  dimensions: {
    width: number;
    height: number;
    depth?: number;
  };
  description?: string;
}

// Pre-defined models in public/stl
export const availableModelsAtom = atom<GridfinityModel[]>([
  // 1x1 Bins
  {
    id: "bin-1x1x12-pmcquay",
    name: "1x1x12 Bin",
    path: "/stl/Bin/Bin - 1x1x12 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 1, height: 1, depth: 12 }
  },
  {
    id: "bin-1x1x2-zackfreedman",
    name: "1x1x2 Bin",
    path: "/stl/Bin/Bin - 1x1x2 - ZackFreedman.stl",
    category: "bins",
    dimensions: { width: 1, height: 1, depth: 2 }
  },
  {
    id: "bin-1x1x3-pmcquay",
    name: "1x1x3 Bin",
    path: "/stl/Bin/Bin - 1x1x3 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 1, height: 1, depth: 3 }
  },
  {
    id: "bin-1x1x5-pinballgeek",
    name: "1x1x5 Bin",
    path: "/stl/Bin/Bin - 1x1x5 - pinballgeek.stl",
    category: "bins",
    dimensions: { width: 1, height: 1, depth: 5 }
  },
  {
    id: "bin-1x1x6-pmcquay",
    name: "1x1x6 Bin",
    path: "/stl/Bin/Bin - 1x1x6 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 1, height: 1, depth: 6 }
  },

  // 1x2 Bins
  {
    id: "bin-1x2x1-eirenliel",
    name: "1x2x1 Bin",
    path: "/stl/Bin/Bin - 1x2x1 - Eirenliel.stl",
    category: "bins",
    dimensions: { width: 1, height: 2, depth: 1 }
  },
  {
    id: "bin-1x2x12-pmcquay",
    name: "1x2x12 Bin",
    path: "/stl/Bin/Bin - 1x2x12 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 1, height: 2, depth: 12 }
  },
  {
    id: "bin-1x2x2-zackfreedman",
    name: "1x2x2 Bin",
    path: "/stl/Bin/Bin - 1x2x2 - ZackFreedman.stl",
    category: "bins",
    dimensions: { width: 1, height: 2, depth: 2 }
  },
  {
    id: "bin-1x2x3-pmcquay",
    name: "1x2x3 Bin",
    path: "/stl/Bin/Bin - 1x2x3 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 1, height: 2, depth: 3 }
  },
  {
    id: "bin-1x2x6-pmcquay",
    name: "1x2x6 Bin",
    path: "/stl/Bin/Bin - 1x2x6 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 1, height: 2, depth: 6 }
  },

  // 1x3 Bins
  {
    id: "bin-1x3x2-zackfreedman",
    name: "1x3x2 Bin",
    path: "/stl/Bin/Bin - 1x3x2 - ZackFreedman.stl",
    category: "bins",
    dimensions: { width: 1, height: 3, depth: 2 }
  },
  {
    id: "bin-1x3x3-pmcquay",
    name: "1x3x3 Bin",
    path: "/stl/Bin/Bin - 1x3x3 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 1, height: 3, depth: 3 }
  },
  {
    id: "bin-1x3x6-pmcquay",
    name: "1x3x6 Bin",
    path: "/stl/Bin/Bin - 1x3x6 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 1, height: 3, depth: 6 }
  },

  // 1x4 Bins
  {
    id: "bin-1x4x2-zackfreedman",
    name: "1x4x2 Bin",
    path: "/stl/Bin/Bin - 1x4x2 - ZackFreedman.stl",
    category: "bins",
    dimensions: { width: 1, height: 4, depth: 2 }
  },
  {
    id: "bin-1x4x3-pmcquay",
    name: "1x4x3 Bin",
    path: "/stl/Bin/Bin - 1x4x3- pmcquay.stl",
    category: "bins",
    dimensions: { width: 1, height: 4, depth: 3 }
  },
  {
    id: "bin-1x4x6-pmcquay",
    name: "1x4x6 Bin",
    path: "/stl/Bin/Bin - 1x4x6 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 1, height: 4, depth: 6 }
  },

  // 1x5 Bins
  {
    id: "bin-1x5x2-zackfreedman",
    name: "1x5x2 Bin",
    path: "/stl/Bin/Bin - 1x5x2 - ZackFreedman.stl",
    category: "bins",
    dimensions: { width: 1, height: 5, depth: 2 }
  },
  {
    id: "bin-1x5x3-pmcquay",
    name: "1x5x3 Bin",
    path: "/stl/Bin/Bin - 1x5x3 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 1, height: 5, depth: 3 }
  },
  {
    id: "bin-1x5x6-pmcquay",
    name: "1x5x6 Bin",
    path: "/stl/Bin/Bin - 1x5x6 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 1, height: 5, depth: 6 }
  },

  // 2x2 Bins
  {
    id: "bin-2x2x12-pmcquay",
    name: "2x2x12 Bin",
    path: "/stl/Bin/Bin - 2x2x12 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 2, height: 2, depth: 12 }
  },
  {
    id: "bin-2x2x3-pmcquay",
    name: "2x2x3 Bin",
    path: "/stl/Bin/Bin - 2x2x3 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 2, height: 2, depth: 3 }
  },
  {
    id: "bin-2x2x6-zackfreedman",
    name: "2x2x6 Bin",
    path: "/stl/Bin/Bin - 2x2x6 - ZackFreedman.stl",
    category: "bins",
    dimensions: { width: 2, height: 2, depth: 6 }
  },
  {
    id: "bin-2x2x6-pmcquay",
    name: "2x2x6 Bin (PMcQuay)",
    path: "/stl/Bin/Bin - 2x2x6 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 2, height: 2, depth: 6 }
  },

  // 2x3+ Bins
  {
    id: "bin-2x3x3-pmcquay",
    name: "2x3x3 Bin",
    path: "/stl/Bin/Bin - 2x3x3 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 2, height: 3, depth: 3 }
  },
  {
    id: "bin-2x3x6-pmcquay",
    name: "2x3x6 Bin",
    path: "/stl/Bin/Bin - 2x3x6 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 2, height: 3, depth: 6 }
  },
  {
    id: "bin-2x4x3-pmcquay",
    name: "2x4x3 Bin",
    path: "/stl/Bin/Bin - 2x4x3 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 2, height: 4, depth: 3 }
  },
  {
    id: "bin-2x4x6-pmcquay",
    name: "2x4x6 Bin",
    path: "/stl/Bin/Bin - 2x4x6 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 2, height: 4, depth: 6 }
  },
  {
    id: "bin-2x5x3-pmcquay",
    name: "2x5x3 Bin",
    path: "/stl/Bin/Bin - 2x5x3 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 2, height: 5, depth: 3 }
  },
  {
    id: "bin-2x5x6-pmcquay",
    name: "2x5x6 Bin",
    path: "/stl/Bin/Bin - 2x5x6 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 2, height: 5, depth: 6 }
  },
  {
    id: "bin-2x7x6-glitchstitcher",
    name: "2x7x6 Bin",
    path: "/stl/Bin/Bin-2x7x6-glitchstitcher.stl",
    category: "bins",
    dimensions: { width: 2, height: 7, depth: 6 }
  },

  // 3x3+ Bins
  {
    id: "bin-3x3x3-pmcquay",
    name: "3x3x3 Bin",
    path: "/stl/Bin/Bin - 3x3x3 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 3, height: 3, depth: 3 }
  },
  {
    id: "bin-3x3x6-pmcquay",
    name: "3x3x6 Bin",
    path: "/stl/Bin/Bin - 3x3x6 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 3, height: 3, depth: 6 }
  },
  {
    id: "bin-3x4x2-pmcquay",
    name: "3x4x2 Bin",
    path: "/stl/Bin/Bin - 3x4x2 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 3, height: 4, depth: 2 }
  },
  {
    id: "bin-3x4x3-pmcquay",
    name: "3x4x3 Bin",
    path: "/stl/Bin/Bin - 3x4x3 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 3, height: 4, depth: 3 }
  },
  {
    id: "bin-3x4x6-pmcquay",
    name: "3x4x6 Bin",
    path: "/stl/Bin/Bin - 3x4x6 - pmcquay.stl",
    category: "bins",
    dimensions: { width: 3, height: 4, depth: 6 }
  },
  {
    id: "bin-3x5x6-duckers",
    name: "3x5x6 Bin",
    path: "/stl/Bin/Bin - 3x5x6 - Duckers.stl",
    category: "bins",
    dimensions: { width: 3, height: 5, depth: 6 }
  },
  {
    id: "bin-3x6x12-robert-paisley",
    name: "3x6x12 Bin",
    path: "/stl/Bin/Bin - 3x6x12 - robert.j.paisley.stl",
    category: "bins",
    dimensions: { width: 3, height: 6, depth: 12 }
  },
  {
    id: "bin-3x6x6-robert-paisley",
    name: "3x6x6 Bin",
    path: "/stl/Bin/Bin - 3x6x6 - robert.j.paisley.stl",
    category: "bins",
    dimensions: { width: 3, height: 6, depth: 6 }
  },

  // 7x7 Bin
  {
    id: "bin-7x7x3-smikutsky",
    name: "7x7x3 Bin",
    path: "/stl/Bin/Bin - 7x7x3 - smikutsky.stl",
    category: "bins",
    dimensions: { width: 7, height: 7, depth: 3 }
  },
]);

export const selectedModelAtom = atom<GridfinityModel | null>(null);
export const selectedCategoryAtom = atom<"bins" | "bases" | "lids" | "other">("bins");
export const selectedModelsAtom = atom<GridfinityModel[]>([]);

export interface OccupiedPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  modelId: string;
}

export const occupiedPositionsAtom = atom<OccupiedPosition[]>([]);

export const hoveredModelIdAtom = atom<string | null>(null);
