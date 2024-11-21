import { atom } from "jotai";

export const cameraControlsAtom = atom<{
  action: "reset" | "topView" | null;
  timestamp: number;
}>({
  action: null,
  timestamp: 0,
});

export const showGridLabelsAtom = atom(true);
export const showPlaneAtom = atom(true);
