import React, { Suspense, lazy, useState, useEffect } from 'react';

// Lazy load the heavy Three.js canvas component
const GlobeCanvas = lazy(() => import('./GlobeCanvas'));

export const WireframeGlobe = ({ forceColor }: { forceColor?: string }) => {
  const [globeColor, setGlobeColor] = useState(forceColor || "#ffffff");

  useEffect(() => {
    if (forceColor) {
      setGlobeColor(forceColor);
      return;
    }
    
    const html = document.documentElement;
    const updateColor = () => {
      const isLight = html.getAttribute('data-theme') === 'light';
      setGlobeColor(isLight ? "#000000" : "#ffffff");
    };

    updateColor();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          updateColor();
        }
      });
    });

    observer.observe(html, { attributes: true });
    return () => observer.disconnect();
  }, [forceColor]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      <Suspense fallback={null}>
        <GlobeCanvas globeColor={globeColor} />
      </Suspense>
    </div>
  );
};

export default WireframeGlobe;
