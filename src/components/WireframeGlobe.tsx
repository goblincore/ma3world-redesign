import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CurveLine = ({ points, color, radius = 0.005 }: { points: THREE.Vector3[], color: string, radius?: number }) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points, true), [points]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 64, radius, 8, true]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

const GlobeMesh = ({ color = "#ffffff" }: { color?: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  const yScale = 1.2;

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const { latitudes, longitudes, equator } = useMemo(() => {
    const radius = 0.5;
    const latLines: THREE.Vector3[][] = [];
    const longLines: THREE.Vector3[][] = [];
    
    // Latitudes (horizontal rings) avoiding the poles
    const latCount = 10; 
    for (let i = 1; i < latCount; i++) {
      const phi = (i / latCount) * (Math.PI / 2);
      const y = radius * Math.sin(phi) * yScale;
      const r = radius * Math.cos(phi);
      
      // Top and bottom rings
      [y, -y].forEach((h) => {
        const points = [];
        for (let j = 0; j <= 64; j++) {
          const theta = (j / 64) * Math.PI * 2;
          points.push(new THREE.Vector3(r * Math.cos(theta), h, r * Math.sin(theta)));
        }
        latLines.push(points);
      });
    }

    // Equator
    const eqPoints = [];
    for (let j = 0; j <= 64; j++) {
        const theta = (j / 64) * Math.PI * 2;
        eqPoints.push(new THREE.Vector3(radius * Math.cos(theta), 0, radius * Math.sin(theta)));
    }

    // Longitudes (vertical full circles)
    const longCount = 12; // 12 meridians = 24 lines
    for (let i = 0; i < longCount; i++) {
        const theta = (i / longCount) * Math.PI;
        const points = [];
        for (let j = 0; j <= 64; j++) {
            const phi = (j / 64) * Math.PI * 2;
            const x = radius * Math.sin(phi) * Math.sin(theta);
            const y = radius * Math.cos(phi) * yScale;
            const z = radius * Math.sin(phi) * Math.cos(theta);
            points.push(new THREE.Vector3(x, y, z));
        }
        longLines.push(points);
    }

    return { latitudes: latLines, longitudes: longLines, equator: eqPoints };
  }, []);

  return (
    <group ref={groupRef} rotation={[0.6, 0, 0]}>
      {/* Occlusion Sphere to hide back lines */}
      <mesh scale={[1, yScale, 1]}>
        <sphereGeometry args={[0.495, 32, 32]} />
        <meshBasicMaterial colorWrite={false} />
      </mesh>

      {/* Equator */}
      <CurveLine points={equator} color={color} radius={0.006} />
      
      {/* Latitudes */}
      {latitudes.map((points, i) => (
        <CurveLine key={`lat-${i}`} points={points} color={color} />
      ))}

      {/* Longitudes */}
      {longitudes.map((points, i) => (
        <CurveLine key={`long-${i}`} points={points} color={color} />
      ))}
    </group>
  );
};

export const WireframeGlobe = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }} alpha={true}>
        <ambientLight intensity={0.5} />
        <GlobeMesh color="#ffffff" />
      </Canvas>
    </div>
  );
};

export default WireframeGlobe;
