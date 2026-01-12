import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fragmentShader, vertexShader } from '../lib/shaders/glitchShader';

const TransitionPlane = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    }),
    []
  );

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      
      // Update uProgress based on window global if available (set by transition manager)
      // We use a global variable or custom event to drive this from outside React 
      // since the transition is triggered by Astro's router
      const progress = (window as any).transitionProgress || 0;
      
      // Smooth lerp for nicer feel
      material.uniforms.uProgress.value = THREE.MathUtils.lerp(
        material.uniforms.uProgress.value,
        progress,
        0.1
      );
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

export const TransitionCanvas = () => {
  useEffect(() => {
    // Transition Manager Logic
    let progress = 0;
    
    const startTransition = () => {
      console.log('Transition START');
      progress = 1;
      (window as any).transitionProgress = 1;
    };

    const endTransition = () => {
      console.log('Transition END');
      progress = 0;
      (window as any).transitionProgress = 0;
    };

    const handleBeforePreparation = () => {
      startTransition();
    };

    const handlePageLoad = () => {
      // Small delay to allow the "cover" to hold for a moment
      setTimeout(endTransition, 500); 
    };

    document.addEventListener('astro:before-preparation', handleBeforePreparation);
    document.addEventListener('astro:page-load', handlePageLoad);

    return () => {
      document.removeEventListener('astro:before-preparation', handleBeforePreparation);
      document.removeEventListener('astro:page-load', handlePageLoad);
    };
  }, []);

  return (
    <div id="transition-canvas" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 100000, // On top of everything
      pointerEvents: 'none', // Click through
    }}>
      <Canvas
        camera={{ position: [0, 0, 1], orthographic: true }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        events={null} // Disable all R3F event listeners
        style={{ pointerEvents: 'none' }} // Force CSS pointer-events none on the canvas element
      >
        <TransitionPlane />
      </Canvas>
    </div>
  );
};

export default TransitionCanvas;
