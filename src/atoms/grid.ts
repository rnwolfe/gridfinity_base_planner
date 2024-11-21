import { atom } from "jotai";
import type { MaterialSettings, PlacedGrid, Spacer } from "~/types";

// Material settings atom
export const materialSettingsAtom = atom<MaterialSettings>({
  finish: "semi-gloss",
  useRandomColors: true,
  selectedColors: ["#ff0000"],
  planeColor: "#DCDFE0",
  environment: "warehouse",
});

// Grid dimensions atom
export const gridDimensionsAtom = atom({
  width: 0,
  height: 0,
});

// Placed grids atom
export const placedGridsAtom = atom<PlacedGrid[]>([]);

// Free spaces atom
export const freeSpacesAtom = atom<Spacer[]>([]);
