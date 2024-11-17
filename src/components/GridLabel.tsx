import { Html } from "@react-three/drei";

export function GridLabel({
  position,
  text,
}: {
  position: [number, number, number];
  text: string;
}) {
  return (
    <Html
      position={position}
      center
      style={{
        background: "rgba(0,0,0,0.8)",
        padding: "4px 8px",
        borderRadius: "4px",
        color: "white",
        fontSize: "68px",
      }}
      distanceFactor={0.15}
    >
      {text}
    </Html>
  );
}
