export interface Grid {
  x: number;
  y: number;
}

export interface PlacedGrid extends Grid {
  position: {
    x: number;
    y: number;
  };
}

export interface GridVisualizerProps {
  grids: PlacedGrid[];
  overallWidth: number;
  overallHeight: number;
  materialSettings: MaterialSettings;
}

export interface MaterialSettings {
  finish: "matte" | "semi-gloss" | "glossy";
  useRandomColors: boolean;
  selectedColors: string[];
  planeColor: string;
  planeTexture?: string;
  environment:
    | "apartment"
    | "city"
    | "dawn"
    | "forest"
    | "lobby"
    | "night"
    | "park"
    | "studio"
    | "sunset"
    | "warehouse"
    | undefined;
}

export interface MaterialControlsProps {
  settings: MaterialSettings;
  onSettingsChange: (settings: MaterialSettings) => void;
}

export interface GridCount {
  x: number;
  y: number;
  count: number;
}
