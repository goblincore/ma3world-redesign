# Creative Three.js Transition Concepts

Since we already have Three.js installed, we can leverage it for immersive, "trippy" full-page transitions. To do this seamlessly, we will need to enable **Astro's Client Router** (formerly View Transitions), which allows a 3D canvas to persist while the page content changes underneath.

Here are three distinct concepts for "weird/trippy" transitions:

## 1. The "Liquid Glitch" (Selected for Implementation)
**Effect**: When a user clicks a link, the entire screen ripples and distorts like liquid mercury or a glitching VHS tape before the new page snaps into view.
- **Vibe**: Cyberpunk, fluid, raw.
- **Tech**: A full-screen plane with a custom GLSL shader that takes the current page as a texture and distorts UV coordinates based on noise functions.
- **"Trippy" Factor**: High. The world feels unstable for a split second.

## 2. The "Wireframe Wormhole"
**Effect**: A dormant wireframe grid (hidden in the background) suddenly wakes up. The camera flies rapidly into an infinite tunnel of glowing lines. The old page fades into the distance, and the new page rushes towards the camera.
- **Vibe**: Tron-esque, high-speed, spatial.
- **Tech**: `TubeGeometry` or `InstancedMesh` tunnel that animates camera `z` position.
- **"Trippy" Factor**: Medium/High. Gives a sense of traveling through digital space.

## 3. The "Particle Disintegration"
**Effect**: Structurally similar to the globe. The page content itself seems to break apart into thousands of tiny floating particles (like dust or stars) that swirl chaotically and then reform into the new page structure.
- **Vibe**: Ethereal, magical, complex.
- **Tech**: `PointsMaterial` and GPU-based particle systems.
- **"Trippy" Factor**: Very High. Reality dissolving.
