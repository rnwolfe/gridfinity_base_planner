import { Html } from '@react-three/drei';

export function GridLabel({
  position,
  text,
}: {
  position: [number, number, number];
  text: string;
}) {
  return (
    <group position={position}>
      <Html
        center
        style={{
          color: 'black',
          fontSize: '14px',
          fontFamily: 'monospace',
          background: 'rgba(255, 255, 255, 0.7)',
          padding: '2px 6px',
          borderRadius: '4px',
          userSelect: 'none',
        }}
        distanceFactor={0.6}
      >
        {text}
      </Html>
    </group>
  );
}
