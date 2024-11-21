export interface GridfinityConfig {
  dimensions: {
    width: number;
    height: number;
    maxGridX: number;
    maxGridY: number;
  };
  measurementUnit: "mm" | "inches";
  materialSettings: {
    finish: "matte" | "semi-gloss" | "glossy";
    useRandomColors: boolean;
    selectedColors: string[];
    planeColor: string;
    environment?: string;
    backgroundStyle: "simple" | "environment" | "gradient";
  };
  modelPlacements: {
    modelId: string;
    instanceId: string;
    position: {
      x: number;
      y: number;
      z: number;
    };
    gridPosition: {
      x: number;
      y: number;
    };
    rotation?: number;
  }[];
}
