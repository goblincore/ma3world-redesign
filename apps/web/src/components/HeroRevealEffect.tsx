import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';
import { fragmentShader, vertexShader } from '../lib/shaders/heroRevealShader';

interface RevealPlaneProps {
  mediaSrc: string;
  fallbackSrc: string;
  isVideo: boolean;
  isRevealing: boolean;
  mousePos: { x: number; y: number };
  mouseActive: boolean;
  onRevealComplete?: () => void;
}

const RevealPlane = ({ 
  mediaSrc, 
  fallbackSrc,
  isVideo, 
  isRevealing, 
  mousePos,
  mouseActive,
  onRevealComplete 
}: RevealPlaneProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const progressRef = useRef(0);
  const revealCompleteRef = useRef(false);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const mouseActiveRef = useRef(0);
  const { size, viewport } = useThree();

  // Calculate aspect-ratio-correct plane dimensions
  const planeSize = useMemo(() => {
    // Default to 16:9 video aspect ratio
    const mediaAspect = 16 / 9;
    const viewportAspect = viewport.width / viewport.height;
    
    // Cover behavior: fill the viewport while maintaining aspect ratio
    if (viewportAspect > mediaAspect) {
      // Viewport is wider than media - match width
      return { width: viewport.width, height: viewport.width / mediaAspect };
    } else {
      // Viewport is taller than media - match height
      return { width: viewport.height * mediaAspect, height: viewport.height };
    }
  }, [viewport.width, viewport.height]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uTexture: { value: null as THREE.Texture | null },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseActive: { value: 0 },
      uTextureSize: { value: new THREE.Vector2(1920, 1080) }
    }),
    []
  );

  // Create media element and texture
  useEffect(() => {
    let texture: THREE.Texture;
    
    if (isVideo) {
      const video = document.createElement('video');
      video.src = mediaSrc;
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;
      
      // Try to play, with fallback to image on failure
      video.play().catch(err => {
        console.log('Autoplay blocked, waiting for interaction');
        const enableVideo = () => {
          video.play().catch(() => {
            // If still fails, switch to fallback image handled by parent
          });
          document.removeEventListener('click', enableVideo);
          document.removeEventListener('touchstart', enableVideo);
        };
        document.addEventListener('click', enableVideo, { once: true });
        document.addEventListener('touchstart', enableVideo, { once: true });
      });

      mediaRef.current = video;
      texture = new THREE.VideoTexture(video);
      
      // Update texture size when video metadata loads
      video.addEventListener('loadedmetadata', () => {
        uniforms.uTextureSize.value.set(video.videoWidth, video.videoHeight);
      });
    } else {
      // Use static image
      const loader = new THREE.TextureLoader();
      texture = loader.load(mediaSrc, (tex) => {
        uniforms.uTextureSize.value.set(tex.image.width, tex.image.height);
      });
    }
    
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    textureRef.current = texture;

    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTexture.value = texture;
    }

    return () => {
      if (isVideo && mediaRef.current) {
        (mediaRef.current as HTMLVideoElement).pause();
        (mediaRef.current as HTMLVideoElement).src = '';
      }
      texture.dispose();
    };
  }, [mediaSrc, isVideo, uniforms]);

  // Update resolution on resize
  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  // Smoothly interpolate mouse position
  useEffect(() => {
    mousePosRef.current = { x: mousePos.x, y: mousePos.y };
    mouseActiveRef.current = mouseActive ? 1 : 0;
  }, [mousePos, mouseActive]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.getElapsedTime();

    // Update texture each frame for video
    if (isVideo && textureRef.current && mediaRef.current) {
      const video = mediaRef.current as HTMLVideoElement;
      if (!video.paused) {
        (textureRef.current as THREE.VideoTexture).needsUpdate = true;
      }
    }

    // Smoothly interpolate mouse position
    const currentMouse = material.uniforms.uMouse.value;
    currentMouse.x = THREE.MathUtils.lerp(currentMouse.x, mousePosRef.current.x, 0.1);
    currentMouse.y = THREE.MathUtils.lerp(currentMouse.y, mousePosRef.current.y, 0.1);
    
    // Smoothly interpolate mouse active state
    // Use slower fade-out (0.02) vs faster fade-in (0.15) for gentle dissipation
    const currentActive = material.uniforms.uMouseActive.value;
    const targetActive = mouseActiveRef.current;
    const lerpFactor = targetActive > currentActive ? 0.15 : 0.02; // fade-out is slower
    material.uniforms.uMouseActive.value = THREE.MathUtils.lerp(
      currentActive,
      targetActive,
      lerpFactor
    );

    // Animate progress: 0 -> 1 (trippy effect fades out)
    const targetProgress = isRevealing ? 0 : 1;
    const lerpSpeed = isRevealing ? 0.05 : 0.02;
    
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
      <planeGeometry args={[planeSize.width, planeSize.height]} />
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
  darkFallbackSrc?: string;
  lightFallbackSrc?: string;
  /** Enable interactive hover/touch ripple effect. Default: false */
  enableHoverEffect?: boolean;
  onRevealComplete?: () => void;
}

export const HeroRevealEffect = ({ 
  darkVideoSrc, 
  lightVideoSrc,
  darkFallbackSrc,
  lightFallbackSrc,
  enableHoverEffect = false,
  onRevealComplete 
}: HeroRevealEffectProps) => {
  const [isRevealing, setIsRevealing] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light'>('dark');
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [mouseActive, setMouseActive] = useState(false);
  const [useVideoFailed, setUseVideoFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Mouse/touch event handlers
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height; // Flip Y for shader coords
    
    setMousePos({ x, y });
    setMouseActive(true);
  }, []);

  const handlePointerEnter = useCallback(() => {
    setMouseActive(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setMouseActive(false);
  }, []);

  // Touch support
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = 1 - (touch.clientY - rect.top) / rect.height;
    
    setMousePos({ x, y });
    setMouseActive(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setMouseActive(false);
  }, []);

  // Start reveal animation after a short delay and hide the loader
  useEffect(() => {
    const loader = document.getElementById('video-loader');
    if (loader) {
      loader.classList.add('opacity-0');
      setTimeout(() => loader.style.display = 'none', 700);
    }

    const timer = setTimeout(() => {
      setIsRevealing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleRevealComplete = () => {
    onRevealComplete?.();
    window.dispatchEvent(new CustomEvent('hero-reveal-complete'));
  };

  // Determine media source based on theme
  const videoSrc = currentTheme === 'light' ? lightVideoSrc : darkVideoSrc;
  const fallbackSrc = currentTheme === 'light' 
    ? (lightFallbackSrc || lightVideoSrc.replace('.mp4', '.jpg'))
    : (darkFallbackSrc || darkVideoSrc.replace('.mp4', '.jpg'));

  return (
    <div 
      ref={containerRef}
      id="hero-reveal-effect"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 15,
        pointerEvents: 'auto', // Enable pointer events for interactivity
        touchAction: 'none', // Prevent touch scrolling while interacting
      }}
      onPointerMove={enableHoverEffect ? handlePointerMove : undefined}
      onPointerEnter={enableHoverEffect ? handlePointerEnter : undefined}
      onPointerLeave={enableHoverEffect ? handlePointerLeave : undefined}
      onTouchMove={enableHoverEffect ? handleTouchMove : undefined}
      onTouchEnd={enableHoverEffect ? handleTouchEnd : undefined}
    >
      <Canvas
        gl={{ alpha: false, antialias: true }}
        dpr={[1, 2]}
        style={{ pointerEvents: 'none' }}
      >
        <OrthographicCamera makeDefault position={[0, 0, 1]} />
        <RevealPlane 
          mediaSrc={useVideoFailed ? fallbackSrc : videoSrc}
          fallbackSrc={fallbackSrc}
          isVideo={!useVideoFailed}
          isRevealing={isRevealing}
          mousePos={mousePos}
          mouseActive={enableHoverEffect && mouseActive}
          onRevealComplete={handleRevealComplete}
        />
      </Canvas>
    </div>
  );
};

export default HeroRevealEffect;
