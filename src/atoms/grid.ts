import { atom } from "jotai";
import type { MaterialSettings, PlacedGrid } from "~/types";

// Material settings atom
export const materialSettingsAtom = atom<MaterialSettings>({
  finish: "semi-gloss",
  useRandomColors: true,
  selectedColors: ["#ff0000"],
  planeColor: "#f5f5f5",
  environment: "warehouse",
});

// Grid dimensions atom
export const gridDimensionsAtom = atom({
  width: 0,
  height: 0,
});

// Placed grids atom
export const placedGridsAtom = atom<PlacedGrid[]>([]);
