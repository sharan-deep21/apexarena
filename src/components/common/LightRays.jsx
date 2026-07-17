import { useRef, useEffect } from 'react';
import { Renderer, Program, Triangle, Mesh } from 'ogl';
import './LightRays.css';

const DEFAULT_COLOR = '#ffffff';

const hexToRgb = hex => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

const getAnchorAndDir = (origin) => {
  const outside = 0.2;
  switch (origin) {
    case 'top-left':
      return { anchor: [0.0, -outside], dir: [0.0, 1.0] };
    case 'top-right':
      return { anchor: [1.0, -outside], dir: [0.0, 1.0] };
    case 'left':
      return { anchor: [-outside, 0.5], dir: [1.0, 0.0] };
    case 'right':
      return { anchor: [1.0 + outside, 0.5], dir: [-1.0, 0.0] };
    case 'bottom-left':
      return { anchor: [0.0, 1.0 + outside], dir: [0.0, -1.0] };
    case 'bottom-center':
      return { anchor: [0.5, 1.0 + outside], dir: [0.0, -1.0] };
    case 'bottom-right':
      return { anchor: [1.0, 1.0 + outside], dir: [0.0, -1.0] };
    default: // "top-center"
      return { anchor: [0.5, -outside], dir: [0.0, 1.0] };
  }
};

const LightRays = ({
  raysOrigin = 'top-center',
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  className = ''
}) => {
  const containerRef = useRef(null);
  const uniformsRef = useRef(null);
  const rendererRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationIdRef = useRef(null);
  const meshRef = useRef(null);
  const cleanupFunctionRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      cleanupFunctionRef.current = null;
    }

    const initializeWebGL = async () => {
      if (!containerRef.current) return;

      // Small tick to ensure container style bounds are set in DOM
      await new Promise(resolve => setTimeout(resolve, 10));

      if (!containerRef.current) return;

      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true
      });
      rendererRef.current = renderer;

      const gl = renderer.gl;
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';

      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      containerRef.current.appendChild(gl.canvas);

      const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

      const frag = `precision highp float;

varying vec2 vUv;
uniform float iTime;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  // coord space: y = 0 at top, 1 at bottom
  vec2 coord = vec2(vUv.x, 1.0 - vUv.y);
  
  // Vector from light source
  vec2 sourceToCoord = coord - rayPos;
  float dist = length(sourceToCoord);
  vec2 dirNorm = normalize(sourceToCoord);
  
  // Calculate polar angle relative to ray reference direction
  float cosAngle = dot(dirNorm, rayDir);
  
  // Apply mouse tilt influence if enabled
  if (mouseInfluence > 0.0) {
    vec2 blendedDir = normalize(mix(rayDir, normalize(mousePos - rayPos), mouseInfluence));
    cosAngle = dot(dirNorm, blendedDir);
  }

  // Polar angle for frequency wave calculation
  float angle = atan(dirNorm.x, dirNorm.y);
  
  // Apply wavy distortion to polar rays based on distance
  float angleOffset = distortion > 0.0 ? distortion * sin(dist * 12.0 - iTime * 2.0) * 0.15 : 0.0;
  float distortedAngle = angle + angleOffset;
  
  // Shimmering light ray calculations using layered frequencies
  float baseSpread = max(lightSpread, 0.05);
  float wave1 = sin(distortedAngle * (8.0 / baseSpread) + iTime * raysSpeed * 1.5) * 0.25 + 0.25;
  float wave2 = cos(distortedAngle * (4.5 / baseSpread) - iTime * raysSpeed * 0.9) * 0.20 + 0.20;
  float wave3 = sin(distortedAngle * (15.0 / baseSpread) + iTime * raysSpeed * 2.3) * 0.15 + 0.15;
  
  float rays = wave1 + wave2 + wave3;
  
  // Restrict rays to a forward cone (based on cosAngle and spread)
  float coneFalloff = pow(max(cosAngle, 0.0), 1.0 / max(lightSpread, 0.01));
  
  // Distance falloffs (normalized coordinate units)
  float maxDistance = rayLength;
  float lengthFalloff = clamp((maxDistance - dist) / maxDistance, 0.0, 1.0);
  float fadeFalloff = clamp((fadeDistance - dist) / fadeDistance, 0.0, 1.0);
  
  // Pulse
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * raysSpeed * 3.0)) : 1.0;
  
  float strength = rays * coneFalloff * lengthFalloff * fadeFalloff * pulse;
  
  // Build final RGB color (preserves pure white raysColor!)
  vec3 col = raysColor * strength * 1.6;

  // Add noise grain
  if (noiseAmount > 0.0) {
    float n = noise(vUv * 20.0 + iTime * 0.1);
    col *= (1.0 - noiseAmount + noiseAmount * n);
  }

  // Soft atmospheric gradient (brightest at top near source, fades out naturally)
  float brightness = vUv.y;
  col *= 0.3 + brightness * 0.7;

  // Apply saturation
  if (saturation != 1.0) {
    float gray = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(gray), col, saturation);
  }

  gl_FragColor = vec4(col, strength * 0.85);
}`;

      const { anchor, dir } = getAnchorAndDir(raysOrigin);

      const uniforms = {
        iTime: { value: 0 },
        rayPos: { value: anchor },
        rayDir: { value: dir },
        raysColor: { value: hexToRgb(raysColor) },
        raysSpeed: { value: raysSpeed },
        lightSpread: { value: lightSpread },
        rayLength: { value: rayLength },
        pulsating: { value: pulsating ? 1.0 : 0.0 },
        fadeDistance: { value: fadeDistance },
        saturation: { value: saturation },
        mousePos: { value: [0.5, 0.5] },
        mouseInfluence: { value: mouseInfluence },
        noiseAmount: { value: noiseAmount },
        distortion: { value: distortion }
      };
      uniformsRef.current = uniforms;

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms
      });
      const mesh = new Mesh(gl, { geometry, program });
      meshRef.current = mesh;

      const updatePlacement = () => {
        if (!containerRef.current || !renderer) return;

        renderer.dpr = Math.min(window.devicePixelRatio, 2);

        const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
        renderer.setSize(wCSS, hCSS);

        const { anchor: a, dir: d } = getAnchorAndDir(raysOrigin);
        uniforms.rayPos.value = a;
        uniforms.rayDir.value = d;
      };

      const loop = t => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current) {
          return;
        }

        uniforms.iTime.value = t * 0.001;

        if (followMouse && mouseInfluence > 0.0) {
          const smoothing = 0.92;

          smoothMouseRef.current.x = smoothMouseRef.current.x * smoothing + mouseRef.current.x * (1 - smoothing);
          smoothMouseRef.current.y = smoothMouseRef.current.y * smoothing + mouseRef.current.y * (1 - smoothing);

          uniforms.mousePos.value = [smoothMouseRef.current.x, smoothMouseRef.current.y];
        }

        try {
          renderer.render({ scene: mesh });
          animationIdRef.current = requestAnimationFrame(loop);
        } catch (error) {
          console.warn('WebGL rendering error:', error);
          return;
        }
      };

      window.addEventListener('resize', updatePlacement);
      updatePlacement();
      animationIdRef.current = requestAnimationFrame(loop);

      cleanupFunctionRef.current = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = null;
        }

        window.removeEventListener('resize', updatePlacement);

        if (renderer) {
          try {
            const canvas = renderer.gl.canvas;
            const loseContextExt = renderer.gl.getExtension('WEBGL_lose_context');
            if (loseContextExt) {
              loseContextExt.loseContext();
            }

            if (canvas && canvas.parentNode) {
              canvas.parentNode.removeChild(canvas);
            }
          } catch (error) {
            console.warn('Error during WebGL cleanup:', error);
          }
        }

        rendererRef.current = null;
        uniformsRef.current = null;
        meshRef.current = null;
      };
    };

    initializeWebGL();

    return () => {
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current();
        cleanupFunctionRef.current = null;
      }
    };
  }, [
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion
  ]);

  useEffect(() => {
    if (!uniformsRef.current || !containerRef.current || !rendererRef.current) return;

    const u = uniformsRef.current;
    u.raysColor.value = hexToRgb(raysColor);
    u.raysSpeed.value = raysSpeed;
    u.lightSpread.value = lightSpread;
    u.rayLength.value = rayLength;
    u.pulsating.value = pulsating ? 1.0 : 0.0;
    u.fadeDistance.value = fadeDistance;
    u.saturation.value = saturation;
    u.mouseInfluence.value = mouseInfluence;
    u.noiseAmount.value = noiseAmount;
    u.distortion.value = distortion;

    const { anchor, dir } = getAnchorAndDir(raysOrigin);
    u.rayPos.value = anchor;
    u.rayDir.value = dir;
  }, [
    raysColor,
    raysSpeed,
    lightSpread,
    raysOrigin,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    mouseInfluence,
    noiseAmount,
    distortion
  ]);

  useEffect(() => {
    const handleMouseMove = e => {
      if (!containerRef.current || !rendererRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    if (followMouse) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [followMouse]);

  return <div ref={containerRef} className={`light-rays-container ${className}`.trim()} />;
};

export default LightRays;
