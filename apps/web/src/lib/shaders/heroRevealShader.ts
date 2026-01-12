// Hero Video Reveal Shader - Strong/Trippy Effect
// Creates a glitchy, liquid chromatic aberration reveal

export const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
uniform float uTime;
uniform float uProgress;
uniform sampler2D uTexture;
uniform vec2 uResolution;
varying vec2 vUv;

// Permute function for simplex noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

// Simplex 2D noise
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Random hash function for glitch blocks
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  vec2 uv = vUv;
  
  // Calculate effect intensity based on progress
  // progress: 0 = full effect, 1 = fully revealed (no effect)
  float intensity = 1.0 - uProgress;
  intensity = pow(intensity, 0.5); // Faster falloff at end for snappier reveal
  
  // ========================
  // GLITCH BLOCK DISPLACEMENT
  // ========================
  float blockSize = 0.05 + 0.1 * intensity;
  vec2 blockPos = floor(uv / blockSize);
  float blockRand = random(blockPos + floor(uTime * 10.0));
  
  // Horizontal glitch offset (VHS style)
  float glitchOffset = 0.0;
  if (blockRand > 0.7 && intensity > 0.2) {
    glitchOffset = (random(blockPos + uTime) - 0.5) * 0.2 * intensity;
  }
  
  // ========================
  // LIQUID/WAVE DISTORTION
  // ========================
  float noise1 = snoise(uv * 3.0 + uTime * 2.0);
  float noise2 = snoise(uv * 8.0 - uTime * 1.5);
  float noise3 = snoise(uv * 15.0 + uTime * 3.0);
  
  // Multi-frequency wave displacement
  vec2 waveOffset = vec2(
    noise1 * 0.08 + noise2 * 0.04 + noise3 * 0.02,
    noise1 * 0.06 + noise2 * 0.03 + noise3 * 0.015
  ) * intensity;
  
  // ========================
  // SCANLINES + VHS NOISE
  // ========================
  float scanline = sin(uv.y * uResolution.y * 2.0 + uTime * 50.0) * 0.05 * intensity;
  float vhsNoise = random(vec2(uv.y * 100.0, uTime * 100.0)) * 0.1 * intensity;
  
  // ========================
  // APPLY DISTORTIONS TO UV
  // ========================
  vec2 distortedUv = uv + waveOffset;
  distortedUv.x += glitchOffset + vhsNoise;
  
  // ========================
  // STRONG CHROMATIC ABERRATION
  // ========================
  float aberrationStrength = 0.05 * intensity;
  
  // Radial chromatic aberration (stronger at edges)
  vec2 center = vec2(0.5, 0.5);
  vec2 dir = uv - center;
  float dist = length(dir);
  
  vec2 redOffset = distortedUv + dir * aberrationStrength * (1.0 + noise1 * 0.5);
  vec2 greenOffset = distortedUv;
  vec2 blueOffset = distortedUv - dir * aberrationStrength * (1.0 + noise2 * 0.5);
  
  // Additional horizontal RGB split
  float rgbSplitH = 0.02 * intensity * sin(uTime * 5.0 + uv.y * 10.0);
  redOffset.x += rgbSplitH;
  blueOffset.x -= rgbSplitH;
  
  // Sample texture with chromatic splits
  float r = texture2D(uTexture, redOffset).r;
  float g = texture2D(uTexture, greenOffset).g;
  float b = texture2D(uTexture, blueOffset).b;
  
  vec3 color = vec3(r, g, b);
  
  // ========================
  // GLITCH COLOR OVERLAY
  // ========================
  // Occasional color flash blocks
  if (blockRand > 0.9 && intensity > 0.3) {
    vec3 glitchColor = vec3(
      random(blockPos + 1.0),
      random(blockPos + 2.0),
      random(blockPos + 3.0)
    );
    color = mix(color, glitchColor, 0.4 * intensity);
  }
  
  // ========================
  // CYBERPUNK COLOR GRADE
  // ========================
  // Add subtle cyan/magenta tint during reveal
  vec3 tint = vec3(0.0, 0.8, 1.0) * noise1 + vec3(1.0, 0.0, 0.6) * noise2;
  color = mix(color, color + tint * 0.15, intensity * 0.5);
  
  // ========================
  // SCANLINE DARKENING
  // ========================
  color *= 1.0 - scanline * 0.5;
  
  // ========================
  // VIGNETTE PULSE
  // ========================
  float vignette = 1.0 - dist * 0.5;
  float vignettePulse = 1.0 + sin(uTime * 8.0) * 0.1 * intensity;
  color *= vignette * vignettePulse;
  
  // ========================
  // FINAL OUTPUT
  // ========================
  gl_FragColor = vec4(color, 1.0);
}
`;
