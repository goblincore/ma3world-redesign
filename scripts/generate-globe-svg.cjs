/**
 * Generate SVG animation frames for the wireframe globe
 * Run with: node scripts/generate-globe-svg.cjs
 */

const fs = require('fs');
const path = require('path');

// Globe parameters (matching the Three.js version)
const GLOBE_RADIUS = 50;
const Y_SCALE = 1.2; // Oval stretch
const TILT = 0.6; // Radians, tilt toward viewer
const FRAMES = 48; // Number of frames in the animation
const LAT_COUNT = 10; // Number of latitude rings per hemisphere
const LONG_COUNT = 12; // Number of longitude meridians

// 3D to 2D projection (simplified orthographic with tilt)
function project3D(x, y, z, tilt) {
  // Apply tilt rotation around X axis
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);
  const newY =  y * cosT -  z * sinT;
  const newZ =  y * sinT +  z * cosT;
  
  // Orthographic projection - negate Y to flip right-side up
  return { x, y: -newY, z: newZ };
}

// Generate latitude ellipse points
function generateLatitude(phi, yScale, radius) {
  const y = radius * Math.sin(phi) * yScale;
  const r = radius * Math.cos(phi);
  
  const points = [];
  for (let j = 0; j <= 64; j++) {
    const theta = (j / 64) * Math.PI * 2;
    points.push({
      x: r * Math.cos(theta),
      y: y,
      z: r * Math.sin(theta)
    });
  }
  return points;
}

// Generate longitude ellipse points
function generateLongitude(theta, yScale, radius) {
  const points = [];
  for (let j = 0; j <= 64; j++) {
    const phi = (j / 64) * Math.PI * 2;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi) * yScale;
    const z = radius * Math.sin(phi) * Math.cos(theta);
    points.push({ x, y, z });
  }
  return points;
}

// Convert points to SVG path, filtering out back-facing segments
function pointsToPath(points3D, tilt, rotationY) {
  // Apply Y rotation and project
  const projected = points3D.map(p => {
    // Rotate around Y axis
    const cosR = Math.cos(rotationY);
    const sinR = Math.sin(rotationY);
    const rx = p.x * cosR + p.z * sinR;
    const rz = -p.x * sinR + p.z * cosR;
    
    return project3D(rx, p.y, rz, tilt);
  });
  
  // Build path segments, only including front-facing parts
  let pathD = '';
  let inPath = false;
  
  for (let i = 0; i < projected.length; i++) {
    const p = projected[i];
    const isFrontFacing = p.z > -GLOBE_RADIUS * 0.1; // Small tolerance
    
    if (isFrontFacing) {
      if (!inPath) {
        pathD += `M ${p.x.toFixed(2)} ${p.y.toFixed(2)} `;
        inPath = true;
      } else {
        pathD += `L ${p.x.toFixed(2)} ${p.y.toFixed(2)} `;
      }
    } else {
      inPath = false;
    }
  }
  
  return pathD;
}

// Generate a single frame's SVG content
function generateFrame(rotationY) {
  const paths = [];
  
  // Generate latitudes
  for (let i = 1; i < LAT_COUNT; i++) {
    const phi = (i / LAT_COUNT) * (Math.PI / 2);
    
    // Top hemisphere
    const topPoints = generateLatitude(phi, Y_SCALE, GLOBE_RADIUS);
    const topPath = pointsToPath(topPoints, TILT, rotationY);
    if (topPath) paths.push(topPath);
    
    // Bottom hemisphere
    const bottomPoints = generateLatitude(-phi, Y_SCALE, GLOBE_RADIUS);
    const bottomPath = pointsToPath(bottomPoints, TILT, rotationY);
    if (bottomPath) paths.push(bottomPath);
  }
  
  // Equator
  const eqPoints = generateLatitude(0, Y_SCALE, GLOBE_RADIUS);
  const eqPath = pointsToPath(eqPoints, TILT, rotationY);
  if (eqPath) paths.push(eqPath);
  
  // Generate longitudes
  for (let i = 0; i < LONG_COUNT; i++) {
    const theta = (i / LONG_COUNT) * Math.PI;
    const longPoints = generateLongitude(theta, Y_SCALE, GLOBE_RADIUS);
    const longPath = pointsToPath(longPoints, TILT, rotationY);
    if (longPath) paths.push(longPath);
  }
  
  return paths;
}

// Generate the complete animated SVG
function generateAnimatedSVG() {
  const allFrames = [];
  
  // Generate all frames (don't include final frame as it equals frame 0)
  for (let f = 0; f < FRAMES; f++) {
    const rotationY = (f / FRAMES) * Math.PI * 2;
    allFrames.push(generateFrame(rotationY));
  }
  
  // Calculate animation duration
  const duration = 10; // seconds for one full rotation
  const frameDuration = 100 / FRAMES; // percentage each frame takes
  
  // Build SVG with CSS animation using a simpler approach
  let svg = `<svg viewBox="-60 -70 120 140" xmlns="http://www.w3.org/2000/svg" class="globe-animation">
  <style>
    .globe-animation { overflow: visible; }
    .globe-frame { opacity: 0; }
    .globe-frame path { fill: none; stroke: currentColor; stroke-width: 0.8; }
`;

  // Single keyframe animation using animation-delay for staggering
  svg += `    @keyframes showFrame {
      0% { opacity: 1; }
      ${frameDuration.toFixed(4)}% { opacity: 1; }
      ${(frameDuration + 0.001).toFixed(4)}% { opacity: 0; }
      100% { opacity: 0; }
    }
`;
  
  // Each frame gets the same animation but with different delay
  for (let f = 0; f < FRAMES; f++) {
    const delay = (f / FRAMES) * duration;
    svg += `    .frame-${f} { animation: showFrame ${duration}s linear infinite; animation-delay: ${delay.toFixed(4)}s; }
`;
  }
  
  svg += `  </style>
`;
  
  // Add frame groups
  for (let f = 0; f < FRAMES; f++) {
    const paths = allFrames[f];
    svg += `  <g class="globe-frame frame-${f}">
`;
    for (const pathD of paths) {
      svg += `    <path d="${pathD}" />
`;
    }
    svg += `  </g>
`;
  }
  
  svg += `</svg>`;
  
  return svg;
}

// Write the SVG file
const svg = generateAnimatedSVG();
const outputPath = path.join(__dirname, '..', 'public', 'globe-animation.svg');
fs.writeFileSync(outputPath, svg);
console.log(`Generated ${outputPath}`);
console.log(`Frames: ${FRAMES}, File size: ${(svg.length / 1024).toFixed(2)} KB`);
