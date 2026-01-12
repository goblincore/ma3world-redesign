import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Tunnel = ({ isActive }: { isActive: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const blockerRef = useRef<THREE.Mesh>(null);
  const blockerMatRef = useRef<THREE.MeshBasicMaterial>(null);
  
  // Tunnel parameters
  const speed = useRef(0.2);
  const targetSpeed = isActive ? 80.0 : 0.5; // Much faster warp
  const opacity = useRef(0);
  const targetOpacity = isActive ? 1.0 : 0.0;
  
  // Create a long straight cylinder
  const geometry = useMemo(() => {
    // Radius 10, Height 100, Radial 32, Height 20
    const geo = new THREE.CylinderGeometry(10, 10, 200, 24, 40, true);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
        // Lerp values
        speed.current = THREE.MathUtils.lerp(speed.current, targetSpeed, delta * 2);
        opacity.current = THREE.MathUtils.lerp(opacity.current, targetOpacity, delta * 5);

        // Move the tunnel geometry z position
        // We travel "forward" (negative Z in camera space, but here we move tunnel positive Z)
        meshRef.current.position.z += speed.current * delta;
        if (meshRef.current.position.z > 5) {
             // Reset loop
            meshRef.current.position.z = -5; // Loop tightly
        }
        
        // Sync blocker with wireframe
        if (blockerRef.current) {
            blockerRef.current.position.copy(meshRef.current.position);
        }

        // Visuals
        if (materialRef.current) {
            materialRef.current.opacity = opacity.current;
            materialRef.current.transparent = true;
            // Classic Neon Green
            materialRef.current.color.setHex(0x00ff00);
        }
        
        // Background Blocker Opacity - needs to be solid to hide the page
        if (blockerMatRef.current) {
            blockerMatRef.current.opacity = opacity.current;
            blockerMatRef.current.transparent = true;
        }
    }
  });

  return (
    <>
      {/* Wireframe Tunnel */}
      <mesh ref={meshRef} geometry={geometry}>
        <meshBasicMaterial 
          ref={materialRef} 
          wireframe={true} 
          side={THREE.DoubleSide}
          fog={true}
        />
      </mesh>
      
      {/* Black Blocker Tunnel (slightly smaller radius to sit behind wireframe) */}
      <mesh ref={blockerRef}>
        <cylinderGeometry args={[9.9, 9.9, 200, 24, 1, true]} /> 
        {/* Rotate X matches parent? No, we need to rotate geometry manually or mesh */}
        <meshBasicMaterial 
            ref={blockerMatRef}
            color="#000000" 
            side={THREE.DoubleSide}
            fog={true}
        />
      </mesh>
    </>
  );
};

export const WormholeCanvas = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleStart = () => {
        console.log('Wormhole START');
        setIsActive(true);
    };
    
    const handleEnd = () => {
        console.log('Wormhole END');
         // Delay ending slightly to ensure cover
         setTimeout(() => setIsActive(false), 500);
    };

    document.addEventListener('astro:before-preparation', handleStart);
    document.addEventListener('astro:page-load', handleEnd);

    return () => {
      document.removeEventListener('astro:before-preparation', handleStart);
      document.removeEventListener('astro:page-load', handleEnd);
    };
  }, []);

  return (
    <div id="wormhole-canvas" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 100000,
      pointerEvents: 'none',
    }}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ pointerEvents: 'none' }}
      >
        <fog attach="fog" args={['#000000', 10, 50]} />
        <Tunnel isActive={isActive} />
      </Canvas>
    </div>
  );
};

export default WormholeCanvas;
