import { atom } from "jotai";

export interface GridSTL {
  id: string;
  file: File;
  gridPosition: {
    gridX: number;
    gridY: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
}

export const gridSTLsAtom = atom<GridSTL[]>([]);
export const isSTLDraggingOverAtom = atom(false);