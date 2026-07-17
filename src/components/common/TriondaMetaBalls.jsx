import { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec3, Texture } from 'ogl';
import './TriondaMetaBalls.css';

const vertexShader = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform bool iPointerInside;
uniform sampler2D tBall;
out vec4 outColor;

// Returns the normalized icosahedron vertex based on index (cross-driver safe)
vec3 getIcosaVertex(int index) {
  float phi = 1.61803398875;
  if (index == 0) return normalize(vec3(0.0, 1.0, phi));
  if (index == 1) return normalize(vec3(0.0, 1.0, -phi));
  if (index == 2) return normalize(vec3(0.0, -1.0, phi));
  if (index == 3) return normalize(vec3(0.0, -1.0, -phi));
  if (index == 4) return normalize(vec3(1.0, phi, 0.0));
  if (index == 5) return normalize(vec3(1.0, -phi, 0.0));
  if (index == 6) return normalize(vec3(-1.0, phi, 0.0));
  if (index == 7) return normalize(vec3(-1.0, -phi, 0.0));
  if (index == 8) return normalize(vec3(phi, 0.0, 1.0));
  if (index == 9) return normalize(vec3(phi, 0.0, -1.0));
  if (index == 10) return normalize(vec3(-phi, 0.0, 1.0));
  return normalize(vec3(-phi, 0.0, -1.0));
}

// Helper to rotate a 2D vector
vec2 rotate2D(vec2 p, float a) {
  float c = cos(a), s = sin(a);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

// Rodrigues rotation formula to rotate point p around axis v by angle a
vec3 rotateAxis(vec3 p, vec3 v, float a) {
  vec3 w = cross(v, p);
  return p * cos(a) + w * sin(a) + v * dot(v, p) * (1.0 - cos(a));
}

// Polynomial smooth minimum for gooey blending of shapes
float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * h * k * (1.0 / 6.0);
}

float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Warps a point on the sphere around the closest vertex to create modern curved panels
vec3 warpSphereCoordinates(vec3 p) {
  vec3 pNorm = normalize(p);
  float maxDot = -2.0;
  vec3 closestV = vec3(0.0);
  for (int i = 0; i < 12; i++) {
    vec3 v = getIcosaVertex(i);
    float d = dot(pNorm, v);
    if (d > maxDot) {
      maxDot = d;
      closestV = v;
    }
  }
  float angle = (1.0 - maxDot) * 0.95;
  return rotateAxis(pNorm, closestV, angle);
}

// Computes the seam value (1.0 at seam center, tapering to 0.0)
float getSoccerBallSeamDistance(vec3 pLocal) {
  vec3 pNorm = normalize(pLocal);
  vec3 warpedP = warpSphereCoordinates(pNorm);
  
  float maxDot = -2.0;
  float secondDot = -2.0;
  for (int i = 0; i < 12; i++) {
    vec3 v = getIcosaVertex(i);
    float d = dot(warpedP, v);
    if (d > maxDot) {
      secondDot = maxDot;
      maxDot = d;
    } else if (d > secondDot) {
      secondDot = d;
    }
  }
  
  float pentagon_edge = 0.932;
  float dPent = abs(maxDot - pentagon_edge);
  float dHex = abs(maxDot - secondDot);
  
  if (maxDot > pentagon_edge) {
    return dPent;
  }
  return min(dPent, dHex);
}

// Maps 3D sphere coordinate to 2D equirectangular texture coordinate
vec2 getSphericalUV(vec3 p) {
  float u = atan(p.x, p.z) / (2.0 * 3.14159265359) + 0.5;
  float v = asin(clamp(p.y, -1.0, 1.0)) / 3.14159265359 + 0.5;
  return vec2(u, v);
}

// Blends texture color, debossed seams, and specular properties
vec4 getSoccerBallColor(vec3 pNorm, float seamVal) {
  // Sample the high-resolution texture canvas
  vec2 uv = getSphericalUV(pNorm);
  vec4 texVal = texture(tBall, uv);
  
  float seamMask = smoothstep(0.016, 0.0, seamVal);
  
  // Mix base texture with dark seam lines
  vec3 col = mix(texVal.rgb, vec3(0.04, 0.04, 0.06), seamMask);
  
  // Specular map: White leather is glossy, prints and seams are matte
  float specMask = 1.0;
  if (texVal.r < 0.92 || texVal.g < 0.92 || texVal.b < 0.92) {
    specMask = 0.65; // Matte graphic panels
  }
  specMask = mix(specMask, 0.15, seamMask); // Very matte seams
  
  // Leather texture micro-bump mapping
  float noise = sin(pNorm.x * 290.0) * sin(pNorm.y * 290.0) * sin(pNorm.z * 290.0);
  col += vec3(0.015) * noise * (1.0 - seamMask);
  
  return vec4(col, specMask);
}

// Optimized sceneMap: returns ONLY the ray distance for maximum execution performance
float sceneMap(vec3 p) {
  // Main rotating ball
  vec3 pBall = p;
  float angleY = iTime * 0.3;
  float angleX = iTime * 0.1;
  pBall.xz = rotate2D(pBall.xz, angleY);
  pBall.yz = rotate2D(pBall.yz, angleX);
  
  // Standard sphere distance
  float dBall = sdSphere(pBall, 1.35);
  
  // Debossed grooves: Indent the ball's surface slightly at the seam positions.
  float seamVal = getSoccerBallSeamDistance(pBall);
  float indent = smoothstep(0.022, 0.0, seamVal) * 0.018; 
  dBall += indent;
  
  // Cursor meta-ball
  vec3 pMouse = vec3(iMouse.xy * 4.95, 0.7);
  float dMouse = sdSphere(p - pMouse, 0.44);
  
  // Orbital metaballs (procedural orbits)
  float t = iTime * 0.75;
  vec3 orbit1 = vec3(sin(t * 1.5) * 1.85, cos(t * 1.2) * 1.35, sin(t * 0.95) * 1.15);
  vec3 orbit2 = vec3(cos(t * 1.05) * 1.75, sin(t * 1.65) * 1.55, cos(t * 1.35) * 1.35);
  vec3 orbit3 = vec3(sin(t * 1.15) * 1.55, sin(t * 0.85) * 1.75, cos(t * 1.55) * 1.45);
  
  float dOrb1 = sdSphere(p - orbit1, 0.26);
  float dOrb2 = sdSphere(p - orbit2, 0.3);
  float dOrb3 = sdSphere(p - orbit3, 0.24);
  
  // Blending
  float k = 0.42;
  float d = smin(dBall, dMouse, k);
  d = smin(d, dOrb1, k);
  d = smin(d, dOrb2, k);
  d = smin(d, dOrb3, k);
  
  return d;
}

// Evaluates colors, blending weights, and specular attributes ONLY ONCE at the hit position
void getShadingData(vec3 p, out vec3 hitColor, out float specMask) {
  vec3 pBall = p;
  float angleY = iTime * 0.3;
  float angleX = iTime * 0.1;
  pBall.xz = rotate2D(pBall.xz, angleY);
  pBall.yz = rotate2D(pBall.yz, angleX);
  
  float seamVal = getSoccerBallSeamDistance(pBall);
  float dBall = sdSphere(pBall, 1.35) + smoothstep(0.022, 0.0, seamVal) * 0.018;
  
  vec3 pMouse = vec3(iMouse.xy * 4.95, 0.7);
  float dMouse = sdSphere(p - pMouse, 0.44);
  
  float t = iTime * 0.75;
  vec3 orbit1 = vec3(sin(t * 1.5) * 1.85, cos(t * 1.2) * 1.35, sin(t * 0.95) * 1.15);
  vec3 orbit2 = vec3(cos(t * 1.05) * 1.75, sin(t * 1.65) * 1.55, cos(t * 1.35) * 1.35);
  vec3 orbit3 = vec3(sin(t * 1.15) * 1.55, sin(t * 0.85) * 1.75, cos(t * 1.55) * 1.45);
  
  float dOrb1 = sdSphere(p - orbit1, 0.26);
  float dOrb2 = sdSphere(p - orbit2, 0.3);
  float dOrb3 = sdSphere(p - orbit3, 0.24);
  
  float k = 0.42;
  float d = sceneMap(p);
  float wBall = max(0.0, 1.0 - abs(d - dBall)/k); wBall = wBall * wBall;
  float wMouse = max(0.0, 1.0 - abs(d - dMouse)/k); wMouse = wMouse * wMouse;
  float wOrb1 = max(0.0, 1.0 - abs(d - dOrb1)/k); wOrb1 = wOrb1 * wOrb1;
  float wOrb2 = max(0.0, 1.0 - abs(d - dOrb2)/k); wOrb2 = wOrb2 * wOrb2;
  float wOrb3 = max(0.0, 1.0 - abs(d - dOrb3)/k); wOrb3 = wOrb3 * wOrb3;
  
  float sum = wBall + wMouse + wOrb1 + wOrb2 + wOrb3 + 1e-5;
  
  vec3 pBallNorm = normalize(pBall);
  vec4 ballRes = getSoccerBallColor(pBallNorm, seamVal);
  vec3 cBall = ballRes.rgb;
  float bSpec = ballRes.a;
  
  // Cursor ball color (FIFA theme)
  vec3 cMouse = mix(vec3(0.0, 0.95, 1.0), vec3(0.0, 1.0, 0.5), sin(iTime * 1.5) * 0.5 + 0.5);
  if (!iPointerInside) {
    cMouse = mix(vec3(0.98, 0.75, 0.15), vec3(0.95, 0.95, 1.0), 0.25);
  }
  
  // Orbiting colors matching panel graphics: Red, Green, Blue
  vec3 cOrb1 = vec3(0.85, 0.08, 0.18);
  vec3 cOrb2 = vec3(0.0, 0.75, 0.35);
  vec3 cOrb3 = vec3(0.08, 0.35, 0.9);
  
  hitColor = (cBall * wBall + cMouse * wMouse + cOrb1 * wOrb1 + cOrb2 * wOrb2 + cOrb3 * wOrb3) / sum;
  specMask = (bSpec * wBall + 0.55 * wMouse + 0.65 * wOrb1 + 0.65 * wOrb2 + 0.65 * wOrb3) / sum;
}

vec3 getNormal(vec3 p) {
  vec2 e = vec2(0.002, 0.0);
  float d = sceneMap(p);
  vec3 n = d - vec3(
    sceneMap(p - e.xyy),
    sceneMap(p - e.yxy),
    sceneMap(p - e.yyx)
  );
  return normalize(n);
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = (fc - iResolution.xy * 0.5) / iResolution.y;
  
  // Camera
  vec3 ro = vec3(0.0, 0.0, 4.0);
  vec3 rd = normalize(vec3(uv * 1.5, -1.0));
  
  float t = 0.0;
  float maxT = 7.5;
  bool hit = false;
  
  for (int i = 0; i < 70; i++) {
    vec3 p = ro + rd * t;
    float d = sceneMap(p);
    if (d < 0.001) {
      hit = true;
      break;
    }
    t += d;
    if (t > maxT) break;
  }
  
  vec4 outCol = vec4(0.0);
  
  if (hit) {
    vec3 p = ro + rd * t;
    vec3 n = getNormal(p);
    vec3 lightPos = vec3(3.5, 4.5, 5.0);
    vec3 l = normalize(lightPos - p);
    vec3 v = normalize(ro - p);
    vec3 r = reflect(-l, n);
    
    float diff = max(0.0, dot(n, l));
    
    vec3 hitColor; float specMask;
    getShadingData(p, hitColor, specMask);
    
    float spec = pow(max(0.0, dot(r, v)), 38.0) * specMask;
    float amb = 0.16;
    
    float ao = clamp(sceneMap(p + n * 0.14) / 0.14, 0.0, 1.0);
    
    vec3 col = hitColor * (diff * 0.85 + amb) * ao + vec3(0.68) * spec;
    
    // Depth fog
    col = mix(col, vec3(0.0), 1.0 - exp(-0.045 * t * t));
    
    outCol = vec4(col, 1.0);
  } else {
    float glow = 0.14 / (0.12 + length(uv));
    vec3 bgGlow = vec3(0.015, 0.08, 0.22) * glow;
    outCol = vec4(bgGlow, 0.0);
  }
  
  outColor = outCol;
}
`;

export default function TriondaMetaBalls() {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer;
    let gl;
    let animationFrameId;

    try {
      const dpr = window.devicePixelRatio || 1;
      renderer = new Renderer({ dpr, alpha: true, premultipliedAlpha: false, webgl: 2 });
      gl = renderer.gl;
      
      if (!gl) {
        throw new Error("Could not initialize WebGL context.");
      }
      
      // ── GENERATE HIGH-FIDELITY BALL TEXTURE MAP ON 2D CANVAS ──
      const textureCanvas = document.createElement('canvas');
      textureCanvas.width = 1024;
      textureCanvas.height = 512;
      const ctx = textureCanvas.getContext('2d');

      // 1. Base White Leather background
      ctx.fillStyle = '#fafafc';
      ctx.fillRect(0, 0, 1024, 512);

      // Subtle background panel layout lines (light grey leather stitching outline)
      ctx.strokeStyle = '#e9eff4';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(256 * i + 128, 256, 170, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Reusable helper to draw a panel sweep path
      const drawPanelSweep = (cx, cy, scale, angle, baseColor, strokeColor) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.scale(scale, scale);
        
        ctx.beginPath();
        ctx.moveTo(-100, -60);
        ctx.bezierCurveTo(-60, -130, 30, -130, 65, -60);
        ctx.bezierCurveTo(80, -10, 30, 100, -10, 120);
        ctx.bezierCurveTo(-45, 100, -100, 10, -80, -45);
        ctx.closePath();

        const grad = ctx.createRadialGradient(0, -40, 15, 0, 0, 120);
        grad.addColorStop(0, baseColor);
        grad.addColorStop(1, '#0c0c11'); // Darkened edge border
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3.5;
        ctx.stroke();
        ctx.restore();
      };

      // Helper to draw text with explicit spacing
      const drawTextSpaced = (ctx, text, x, y, font, fillStyle, spacing) => {
        ctx.save();
        ctx.font = font;
        ctx.fillStyle = fillStyle;
        ctx.textAlign = 'left';
        
        let totalWidth = 0;
        for (let i = 0; i < text.length; i++) {
          totalWidth += ctx.measureText(text[i]).width + (i < text.length - 1 ? spacing : 0);
        }
        
        let startX = x - totalWidth / 2;
        for (let i = 0; i < text.length; i++) {
          ctx.fillText(text[i], startX, y);
          startX += ctx.measureText(text[i]).width + spacing;
        }
        ctx.restore();
      };

      const drawAdidasPanel = (cx, cy, scale, angle) => {
        drawPanelSweep(cx, cy, scale, angle, '#d31027', '#fbb03b');
        // Slanted white Adidas Performance stripes (perfect bottom alignment)
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle - 0.4); 
        ctx.scale(scale, scale);
        ctx.fillStyle = '#ffffff';
        
        const w = 10;
        const gap = 8;
        
        // Stripe 1 (Left, Short) - bottom at y = 12
        ctx.fillRect(-22, -10, w, 22);
        
        // Stripe 2 (Middle, Medium) - bottom at y = 12
        ctx.fillRect(-22 + w + gap, -24, w, 36);
        
        // Stripe 3 (Right, Tall) - bottom at y = 12
        ctx.fillRect(-22 + (w + gap) * 2, -38, w, 50);
        
        ctx.restore();
      };

      const drawTriondaPanel = (cx, cy, scale, angle) => {
        drawPanelSweep(cx, cy, scale, angle, '#00a859', '#39ff14');
        // Capsule badge
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.scale(scale, scale);
        
        ctx.fillStyle = '#06060a';
        ctx.beginPath();
        const r = 10;
        ctx.moveTo(-55 + r, -18);
        ctx.lineTo(55 - r, -18);
        ctx.arcTo(55, -18, 55, 18, r);
        ctx.lineTo(55, 18 - r);
        ctx.arcTo(55, 18, -55, 18, r);
        ctx.lineTo(-55 + r, 18);
        ctx.arcTo(-55, 18, -55, -18, r);
        ctx.lineTo(-55, -18 + r);
        ctx.arcTo(-55, -18, 55, -18, r);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#00a859';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Bold italic spaced TRIONDA typography
        drawTextSpaced(ctx, 'TRIONDA', 0, 1, 'italic 900 12px sans-serif', '#ffffff', 2.2);

        ctx.fillStyle = '#00a859';
        ctx.font = '800 5px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('OFFICIAL MATCH BALL', 0, 10);
        ctx.restore();
      };

      const drawFifaPanel = (cx, cy, scale, angle) => {
        drawPanelSweep(cx, cy, scale, angle, '#0054b4', '#00f2fe');
        // White rounded card badge
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.scale(scale, scale);
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        const br = 6;
        ctx.moveTo(-32 + br, -35);
        ctx.lineTo(32 - br, -35);
        ctx.arcTo(32, -35, 32, 35, br);
        ctx.lineTo(32, 35 - br);
        ctx.arcTo(32, 35, -32, 35, br);
        ctx.lineTo(-32 + br, 35);
        ctx.arcTo(-32, 35, -32, -35, br);
        ctx.lineTo(-32, -35 + br);
        ctx.arcTo(-32, -35, 32, -35, br);
        ctx.closePath();
        ctx.fill();

        // Stylized "26" background
        ctx.fillStyle = '#ebedf3';
        ctx.font = '900 28px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('26', 0, 10);

        // Highly recognizable FIFA World Cup Trophy Silhouette
        ctx.fillStyle = '#d4af37';
        ctx.beginPath();
        // Base
        ctx.moveTo(-10, 20);
        ctx.lineTo(10, 20);
        ctx.lineTo(7, 13);
        ctx.lineTo(-7, 13);
        ctx.closePath();
        ctx.fill();

        // Body and Globe
        ctx.beginPath();
        ctx.moveTo(-5, 13);
        ctx.bezierCurveTo(-2.5, 6, -2, 0, -4, -5); // waist
        ctx.bezierCurveTo(-7, -9, -9, -12, -7, -16); // left hand
        ctx.arc(0, -17, 8, Math.PI - 0.4, -0.4); // globe circle
        ctx.bezierCurveTo(7, -12, 5, -9, 3, -5); // right hand
        ctx.bezierCurveTo(1.5, 0, 2, 6, 4, 13);
        ctx.closePath();
        ctx.fill();

        // Green malachite bands on trophy base
        ctx.fillStyle = '#00a859';
        ctx.fillRect(-8.5, 16.5, 17, 1.8);
        ctx.fillRect(-7.5, 14, 15, 1.8);

        // "FIFA" text
        ctx.fillStyle = '#0054b4';
        ctx.font = '900 10px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('FIFA', 0, 30);
        ctx.restore();
      };

      // ── LAYOUT PANEL SETS SYMMETRICALLY AROUND SPHERE MAP ──
      // 3 Adidas Red Panels
      drawAdidasPanel(170, 130, 0.95, 0.2);
      drawAdidasPanel(512, 382, 0.95, -0.4);
      drawAdidasPanel(854, 130, 0.95, 0.2);

      // 3 Trionda Green Panels
      drawTriondaPanel(170, 382, 0.95, -0.2);
      drawTriondaPanel(512, 130, 0.95, 0.4);
      drawTriondaPanel(854, 382, 0.95, -0.2);

      // 2 FIFA Blue Panels
      drawFifaPanel(340, 256, 0.95, 0.0);
      drawFifaPanel(680, 256, 0.95, 0.0);

      // ── DECORATIVE LOGO PRINTS & ACCENT LINES ──
      const drawDecal = (x, y, rotation) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        ctx.fillStyle = '#475569';
        ctx.font = '800 6px "Space Grotesk", sans-serif';
        ctx.fillText('APEXARENA MATCH BALL', 0, 0);
        ctx.font = '5px "Space Grotesk", sans-serif';
        ctx.fillText('FIFA PRO SPEC // ART. 2026', 0, 7);
        
        // Barcode lines
        ctx.fillStyle = '#1e293b';
        for (let i = 0; i < 10; i++) {
          const wStripe = (i % 3 === 0) ? 2 : 1;
          ctx.fillRect(i * 3 - 15, 12, wStripe, 10);
        }
        ctx.restore();
      };

      drawDecal(80, 256, 0.5);
      drawDecal(420, 256, -0.3);
      drawDecal(760, 256, 0.3);
      drawDecal(940, 256, -0.5);

      // ── UPLOAD CANVAS TEXTURE ──
      const texture = new Texture(gl, {
        image: textureCanvas,
        generateMipmaps: true,
        minFilter: gl.LINEAR_MIPMAP_LINEAR
      });
      
      gl.clearColor(0, 0, 0, 0);
      container.appendChild(gl.canvas);

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new Vec3(0, 0, 0) },
          iMouse: { value: new Vec3(0, 0, 0) },
          iPointerInside: { value: false },
          tBall: { value: texture }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });

      let pointerInside = false;
      let targetMouseX = 0;
      let targetMouseY = 0;
      let currentMouseX = 0;
      let currentMouseY = 0;

      function resize() {
        if (!container || !renderer || !gl || !program) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        gl.canvas.style.width = '100%';
        gl.canvas.style.height = '100%';
        program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 0);
      }

      window.addEventListener('resize', resize);
      resize();

      function onPointerMove(e) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const aspect = rect.width / rect.height;
        
        targetMouseX = ((x / rect.width) - 0.5) * aspect;
        targetMouseY = 0.5 - (y / rect.height);
      }

      function onPointerEnter() {
        pointerInside = true;
        program.uniforms.iPointerInside.value = true;
      }

      function onPointerLeave() {
        pointerInside = false;
        program.uniforms.iPointerInside.value = false;
      }

      window.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerenter', onPointerEnter);
      container.addEventListener('pointerleave', onPointerLeave);

      const startTime = performance.now();

      function update(time) {
        animationFrameId = requestAnimationFrame(update);
        const elapsed = (time - startTime) * 0.001;
        program.uniforms.iTime.value = elapsed;

        if (pointerInside) {
          currentMouseX += (targetMouseX - currentMouseX) * 0.12;
          currentMouseY += (targetMouseY - currentMouseY) * 0.12;
        } else {
          const orbitX = Math.cos(elapsed * 1.1) * 0.45;
          const orbitY = Math.sin(elapsed * 1.1) * 0.45;
          currentMouseX += (orbitX - currentMouseX) * 0.08;
          currentMouseY += (orbitY - currentMouseY) * 0.08;
        }

        program.uniforms.iMouse.value.set(currentMouseX, currentMouseY, 0);
        renderer.render({ scene: mesh });
      }

      animationFrameId = requestAnimationFrame(update);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerenter', onPointerEnter);
        container.removeEventListener('pointerleave', onPointerLeave);
        
        if (gl && gl.canvas && gl.canvas.parentNode === container) {
          container.removeChild(gl.canvas);
        }
        gl?.getExtension('WEBGL_lose_context')?.loseContext();
      };
    } catch (err) {
      console.error("WebGL initialization error:", err);
      setError(err.message || "Failed to initialize WebGL.");
    }
  }, []);

  if (error) {
    return (
      <div className="trionda-metaballs-error" style={{ color: '#ff4d4d', padding: '20px', textAlign: 'center', fontFamily: 'monospace', zIndex: 100, position: 'relative' }}>
        <p>⚠️ WebGL Error: {error}</p>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>Please check that WebGL2 is enabled in your browser settings.</p>
      </div>
    );
  }

  return <div ref={containerRef} className="trionda-metaballs-canvas-wrapper" />;
}
