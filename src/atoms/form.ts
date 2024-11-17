import { atom } from "jotai";

export interface FormDimensions {
  width: number;
  height: number;
  maxGridX: number;
  maxGridY: number;
}

export type MeasurementUnit = "mm" | "inches";

export const measurementUnitAtom = atom<MeasurementUnit>("mm");

export const formDimensionsAtom = atom<FormDimensions>({
  width: 500,
  height: 400,
  maxGridX: 5,
  maxGridY: 5,
});
