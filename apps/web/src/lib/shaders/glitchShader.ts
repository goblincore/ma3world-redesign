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
uniform vec2 uResolution;
varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  
  // Create a liquid wave effect based on progress
  // Progress goes 0 -> 1 (cover) -> 0 (reveal)
  // We want the peak intensity at progress = 0.5
  
  // Smoothstep for enter/exit phases
  float p = uProgress;
  
  // Noise flow
  float noise = snoise(uv * 3.0 + uTime * 0.5);
  float noise2 = snoise(uv * 10.0 - uTime * 0.2);
  
  // Distortion intensity derived from progress
  // Bell curve-ish shape: 0 at start, 1 at mid, 0 at end
  float intensity = sin(p * 3.14159);
  
  // Liquid displacement
  float displacement = noise * 0.2 * intensity;
  
  // Chromatic aberration / Liquid colors
  vec3 color1 = vec3(0.0, 1.0, 0.83); // Cyan (Brand)
  vec3 color2 = vec3(1.0, 0.0, 0.61); // Magenta (Brand)
  vec3 color3 = vec3(1.0, 1.0, 1.0); // White highlights
  
  // Complex mixing based on noise
  vec3 mixColor = mix(color1, color2, noise + uProgress);
  mixColor = mix(mixColor, color3, noise2 * intensity);

  // Alpha: Strict bell curve 0 -> 1 -> 0
  // Sine gives us exactly that: sin(0) = 0, sin(PI/2) = 1, sin(PI) = 0
  float baseAlpha = sin(uProgress * 3.14159);
  
  // Make it fully opaque in the middle (0.4 to 0.6)
  float opacity = smoothstep(0.0, 0.2, baseAlpha);
  
  // Add some texture to the alpha (liquid edges)
  opacity *= (0.8 + 0.2 * noise);

  gl_FragColor = vec4(mixColor, opacity);
}
`;
