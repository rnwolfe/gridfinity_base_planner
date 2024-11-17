import { atom } from "jotai";

export const cameraControlsAtom = atom<{
  action: "reset" | "topView" | null;
  timestamp: number;
}>({
  action: null,
  timestamp: 0,
});
