import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { fragmentShader, vertexShader } from '../lib/shaders/heroRevealShader';

interface RevealPlaneProps {
  videoSrc: string;
  isRevealing: boolean;
  onRevealComplete?: () => void;
}

const RevealPlane = ({ videoSrc, isRevealing, onRevealComplete }: RevealPlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const progressRef = useRef(0);
  const revealCompleteRef = useRef(false);
  const { size, viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uTexture: { value: null as THREE.Texture | null },
      uResolution: { value: new THREE.Vector2(size.width, size.height) }
    }),
    []
  );

  // Create video element and texture
  useEffect(() => {
    const video = document.createElement('video');
    video.src = videoSrc;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    
    video.play().catch(err => {
      console.log('Autoplay blocked, waiting for interaction');
      const enableVideo = () => {
        video.play();
        document.removeEventListener('click', enableVideo);
        document.removeEventListener('touchstart', enableVideo);
      };
      document.addEventListener('click', enableVideo, { once: true });
      document.addEventListener('touchstart', enableVideo, { once: true });
    });

    videoRef.current = video;

    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBAFormat;
    textureRef.current = texture;

    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTexture.value = texture;
    }

    return () => {
      video.pause();
      video.src = '';
      texture.dispose();
    };
  }, [videoSrc]);

  // Update resolution on resize
  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.getElapsedTime();

    // Update texture each frame
    if (textureRef.current && videoRef.current && !videoRef.current.paused) {
      textureRef.current.needsUpdate = true;
    }

    // Animate progress: 0 -> 1 (trippy effect fades out)
    const targetProgress = isRevealing ? 0 : 1;
    const lerpSpeed = isRevealing ? 0.05 : 0.02; // Slower reveal for more trippy feel
    
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, targetProgress, lerpSpeed);
    material.uniforms.uProgress.value = progressRef.current;

    // Trigger callback when reveal is complete
    if (progressRef.current > 0.98 && !revealCompleteRef.current && !isRevealing) {
      revealCompleteRef.current = true;
      onRevealComplete?.();
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={false}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
};

interface HeroRevealEffectProps {
  darkVideoSrc: string;
  lightVideoSrc: string;
  onRevealComplete?: () => void;
}

export const HeroRevealEffect = ({ 
  darkVideoSrc, 
  lightVideoSrc,
  onRevealComplete 
}: HeroRevealEffectProps) => {
  const [isRevealing, setIsRevealing] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');

  // Detect initial theme and watch for changes
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setCurrentTheme(theme === 'light' ? 'light' : 'dark');
    };

    checkTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  // Start reveal animation after a short delay and hide the loader
  useEffect(() => {
    // Hide the loader overlay
    const loader = document.getElementById('video-loader');
    if (loader) {
      loader.classList.add('opacity-0');
      setTimeout(() => loader.style.display = 'none', 700);
    }

    const timer = setTimeout(() => {
      setIsRevealing(false);
    }, 500); // Start revealing after 500ms

    return () => clearTimeout(timer);
  }, []);

  const handleRevealComplete = () => {
    onRevealComplete?.();
    // Dispatch custom event for any external listeners
    window.dispatchEvent(new CustomEvent('hero-reveal-complete'));
  };

  const videoSrc = currentTheme === 'light' ? lightVideoSrc : darkVideoSrc;

  return (
    <div 
      id="hero-reveal-effect"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 15, // Above fallback image, below overlays
        pointerEvents: 'none',
      }}
    >
      <Canvas
        gl={{ alpha: false, antialias: true }}
        dpr={[1, 2]}
        style={{ pointerEvents: 'none' }}
      >
        <OrthographicCamera makeDefault position={[0, 0, 1]} />
        <RevealPlane 
          videoSrc={videoSrc}
          isRevealing={isRevealing}
          onRevealComplete={handleRevealComplete}
        />
      </Canvas>
    </div>
  );
};

export default HeroRevealEffect;

