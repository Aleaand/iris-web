"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import Link from "next/link";
import { Loader2, ChevronRight } from "lucide-react";
import { irisApi } from "@/lib/api";
import { Destination } from "@/types";

const NOISE_CHUNK = `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }
`;

interface VisualPreset {
  morph: number;
  compress: number;
  intensity: number;
  rotate: number;
  camY: number;
  camDist: number;
  orbit: number;
  color: string;
  colorMid: string;
  colorOuter: string;
  status: string;
  vel: string;
  mass: string;
  lensing: string;
  radiation: string;
}

const PRESETS: Record<string, VisualPreset> = {
  marte: {
    morph: 0.9,
    compress: 0.95,
    intensity: 1.4,
    rotate: 0.5,
    camY: 18,
    camDist: 78,
    orbit: 1.1,
    color: "#e60b0b",
    colorMid: "#c93434",
    colorOuter: "#b91515",
    status: "Topología: Órbita Estable",
    vel: "0.55c",
    mass: "0.107 M_T",
    lensing: "ATMÓSFERA TENUE",
    radiation: "SEGURA CON TRAJE",
  },
  jupiter: {
    morph: 3.8,
    compress: 1.35,
    intensity: 1.8,
    rotate: 1.5,
    camY: 35,
    camDist: 95,
    orbit: 2.5,
    color: "#f5b87f",
    colorMid: "#bd691c",
    colorOuter: "#8c4104",
    status: "Topología: Turbulencia Extrema",
    vel: "0.85c",
    mass: "317.8 M_T",
    lensing: "GRAVITACIÓN CRÍTICA",
    radiation: "ALTA ADVERTENCIA",
  },
  saturno: {
    morph: 0.03,
    compress: 0.48,
    intensity: 1.2,
    rotate: 0.3,
    camY: 12,
    camDist: 72,
    orbit: 0.6,
    color: "#fdff75",
    colorMid: "#a9ba6c",
    colorOuter: "#2f451b",
    status: "Topología: Resonancia Anular",
    vel: "0.32c",
    mass: "95.2 M_T",
    lensing: "DIVISIÓN CASSINI",
    radiation: "NOMINAL MÍNIMA",
  },
  neptuno: {
    morph: 4.5,
    compress: 1.05,
    intensity: 1.3,
    rotate: 0.4,
    camY: 28,
    camDist: 85,
    orbit: 0.8,
    color: "#3ba2ff",
    colorMid: "#1c5cbd",
    colorOuter: "#021747",
    status: "Topología: Vórtices Activos",
    vel: "0.19c",
    mass: "17.1 M_T",
    lensing: "CRIÓSFERA METANO",
    radiation: "NOMINAL BAJA",
  },
  tierra: {
    morph: 0.5,
    compress: 0.82,
    intensity: 1.1,
    rotate: 0.45,
    camY: 15,
    camDist: 70,
    orbit: 0.9,
    color: "#2bd5e8",
    colorMid: "#078659",
    colorOuter: "#541b0e",
    status: "Topología: Biósfera Nominal",
    vel: "0.05c",
    mass: "1.00 M_T",
    lensing: "MAGNETÓSFERA ÓPTIMA",
    radiation: "SEGURA CONTINUA",
  },
  venus: {
    morph: 2.2,
    compress: 0.78,
    intensity: 1.7,
    rotate: 0.7,
    camY: 22,
    camDist: 82,
    orbit: 1.3,
    color: "#ffa033",
    colorMid: "#e1810c",
    colorOuter: "#5d2105",
    status: "Topología: Presión Crítica",
    vel: "0.42c",
    mass: "0.815 M_T",
    lensing: "INVERNADERO DENSO",
    radiation: "ELEVADA PROTECCIÓN",
  },
  mercurio: {
    morph: 0.2,
    compress: 1.38,
    intensity: 1.5,
    rotate: 1.6,
    camY: 8,
    camDist: 60,
    orbit: 3.2,
    color: "#ad9282",
    colorMid: "#bca597",
    colorOuter: "#6b5950",
    status: "Topología: Escudo Expuesto",
    vel: "0.78c",
    mass: "0.055 M_T",
    lensing: "ANCLAJE DE MAREA",
    radiation: "MUY ALTA EXPOSICIÓN",
  },
  urano: {
    morph: 1.6,
    compress: 0.88,
    intensity: 1.1,
    rotate: 0.35,
    camY: -15,
    camDist: 80,
    orbit: 0.75,
    color: "#4dffc7",
    colorMid: "#2bb587",
    colorOuter: "#053d35",
    status: "Topología: Inclinación Axial",
    vel: "0.20c",
    mass: "14.5 M_T",
    lensing: "ROTACIÓN PERPENDICULAR",
    radiation: "MÍNIMA CONSTANTE",
  },
  default: {
    morph: 0.1,
    compress: 1.0,
    intensity: 1.0,
    rotate: 0.4,
    camY: 25,
    camDist: 85,
    orbit: 1.0,
    color: "#b63fdd",
    colorMid: "#aa01ff",
    colorOuter: "#9f1ca3",
    status: "Topología: Nominal",
    vel: "0.45c",
    mass: "4.2M SOL",
    lensing: "SCHWARZSCHILD",
    radiation: "DETECTION ON",
  }
};

const FALLBACK_DESTINATIONS: Destination[] = [
  {
    id: 1,
    name: "Marte",
    slug: "marte",
    description: "Explora el colosal Monte Olimpo y los Valles Marineris...",
    distance_au: "1.52 UA",
    temperature: "-63 °C",
    gravity: "0.38 g",
    image_query: "mars"
  },
  {
    id: 2,
    name: "Júpiter",
    slug: "jupiter",
    description: "Disfruta de la visión qperpetua de la Gran Mancha Roja...",
    distance_au: "5.20 UA",
    temperature: "-108 °C",
    gravity: "2.52 g",
    image_query: "jupiter"
  },
  {
    id: 3,
    name: "Saturno",
    slug: "saturno",
    description: "El rey de los anillos...",
    distance_au: "9.58 UA",
    temperature: "-139 °C",
    gravity: "1.06 g",
    image_query: "saturn"
  },
  {
    id: 4,
    name: "Neptuno",
    slug: "neptuno",
    description: "Un infinito océano teñido del azul metano más profundo...",
    distance_au: "30.05 UA",
    temperature: "-201 °C",
    gravity: "1.14 g",
    image_query: "neptune"
  },
  {
    id: 5,
    name: "Tierra",
    slug: "tierra",
    description: "Redescubre los continentes azules y la atmósfera vital...",
    distance_au: "1.00 UA",
    temperature: "15 °C",
    gravity: "1.00 g",
    image_query: "earth"
  },
  {
    id: 6,
    name: "Venus",
    slug: "venus",
    description: "Admira el manto de nubes perpetuas...",
    distance_au: "0.72 UA",
    temperature: "462 °C",
    gravity: "0.90 g",
    image_query: "venus"
  },
  {
    id: 7,
    name: "Mercurio",
    slug: "mercurio",
    description: "Experimenta amaneceres colosales...",
    distance_au: "0.39 UA",
    temperature: "167 °C",
    gravity: "0.37 g",
    image_query: "mercury"
  },
  {
    id: 8,
    name: "Urano",
    slug: "urano",
    description: "El gigante de hielo inclinado...",
    distance_au: "19.22 UA",
    temperature: "-197 °C",
    gravity: "0.89 g",
    image_query: "uranus"
  }
];

export default function HomeDestination() {
  const [loading, setLoading] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [webglSupported, setWebGLSupported] = useState(true);

  const mountRef = useRef<HTMLDivElement>(null);

  // References for WebGL dynamic animation & morphs
  const diskMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const auraMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const camControlRef = useRef({ distance: 85 });

  const mainTitleRef = useRef<HTMLDivElement>(null);
  const statusTextRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const destData = await irisApi.getDestinations();
        const dests = destData.datos || [];

        if (dests.length > 0) {
          const mergedDests = dests.map((dest: any) => {
            const fallback = FALLBACK_DESTINATIONS.find(f => f.name.toLowerCase() === dest.name.toLowerCase());
            return {
              ...dest,
              temperature: fallback?.temperature || "N/A",
              gravity: fallback?.gravity || "N/A",
              slug: fallback?.slug || dest.name.toLowerCase()
            };
          });
          setDestinations(mergedDests);
        } else {
          setDestinations(FALLBACK_DESTINATIONS);
        }
      } catch (err) {
        console.error("Error cargando destinos, usando fallback local:", err);
        setDestinations(FALLBACK_DESTINATIONS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeDest = destinations[selectedIndex] || FALLBACK_DESTINATIONS[0];
  const slugKey = activeDest?.slug?.toLowerCase() || "default";
  const currentPreset = PRESETS[slugKey] || PRESETS.default;

  // WebGL Accretion Disk Simulation Core
  useEffect(() => {
    if (loading || destinations.length === 0 || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let bhGeo: THREE.SphereGeometry;
    let bhMat: THREE.MeshBasicMaterial;
    let streakGeo: THREE.CylinderGeometry;
    let auraMat: THREE.ShaderMaterial;
    let diskMaterial: THREE.ShaderMaterial;
    let animationFrameId: number;

    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    try {
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      camera.position.set(60, 25, 60);
      cameraRef.current = camera;

      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance", alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.6;
      mountRef.current.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.03;
      controls.autoRotate = true;
      controls.autoRotateSpeed = currentPreset.rotate;
      controlsRef.current = controls;

      // 5. Singular Black Hole Core Mesh
      const coreGroup = new THREE.Group();
      scene.add(coreGroup);

      bhMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      bhGeo = new THREE.SphereGeometry(4, 64, 64);
      const coreMesh = new THREE.Mesh(bhGeo, bhMat);
      coreGroup.add(coreMesh);

      // 6. Aura Glow Shader Material
      const initialGlowColor = new THREE.Color(currentPreset.color);
      auraMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: currentPreset.intensity },
          uGlowColor: { value: initialGlowColor }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vView;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vView = normalize(-(modelViewMatrix * vec4(position, 1.0)).xyz);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uIntensity;
            uniform vec3 uGlowColor;
            varying vec3 vNormal;
            varying vec3 vView;
            void main() {
                float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 4.0);
                gl_FragColor = vec4(uGlowColor * rim * uIntensity * 5.0, 1.0);
            }
        `,
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      auraMaterialRef.current = auraMat;
      const auraMesh = new THREE.Mesh(new THREE.SphereGeometry(4.25, 64, 64), auraMat);
      coreGroup.add(auraMesh);

      const instanceCount = 4500;
      streakGeo = new THREE.CylinderGeometry(0.01, 0.12, 2.2, 3);
      streakGeo.rotateX(Math.PI / 2);

      const initialColorMid = new THREE.Color(currentPreset.colorMid);
      const initialColorOuter = new THREE.Color(currentPreset.colorOuter);

      diskMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMorph: { value: currentPreset.morph },
          uCompression: { value: currentPreset.compress },
          uIntensity: { value: currentPreset.intensity },
          uOrbitScale: { value: currentPreset.orbit },
          uColorMid: { value: initialColorMid },
          uColorOuter: { value: initialColorOuter }
        },
        vertexShader: `
            ${NOISE_CHUNK}
            uniform float uTime;
            uniform float uMorph;
            uniform float uCompression;
            uniform float uIntensity;
            uniform float uOrbitScale;
            uniform vec3 uColorMid;
            uniform vec3 uColorOuter;
            varying vec3 vColor;
            varying float vOpacity;
            void main() {
                vec4 instPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
                float rOriginal = length(instPos.xz);
                float r = rOriginal * uCompression;
                float initialAngle = atan(instPos.z, instPos.x);
                float orbitalVelocity = (1.5 / sqrt(rOriginal)) * uOrbitScale;
                float currentAngle = initialAngle + (uTime * orbitalVelocity);
                vec3 morphedWorldPos = vec3(cos(currentAngle) * r, instPos.y, sin(currentAngle) * r);
                float noise = snoise(vec3(morphedWorldPos.x * 0.08, morphedWorldPos.z * 0.08, uTime * 0.3));
                morphedWorldPos.y += noise * uMorph * 4.0;
                vec3 viewDir = normalize(cameraPosition - morphedWorldPos);
                vec3 orbitDir = normalize(vec3(-sin(currentAngle), 0.0, cos(currentAngle)));
                float doppler = dot(orbitDir, viewDir);
                
                vec3 hot = vec3(1.0, 0.96, 0.92);
                vec3 warm = uColorMid;
                vec3 cool = uColorOuter;
                vec3 color = mix(cool, warm, smoothstep(45.0, 12.0, r));
                color = mix(color, hot, smoothstep(10.0, 4.0, r));
                vColor = color * (1.3 + doppler * 0.7) * uIntensity;
                vOpacity = (smoothstep(3.8, 5.5, r) * (1.0 - smoothstep(38.0, 48.0, r))) * 0.85;
                
                float deltaAngle = currentAngle - initialAngle;
                float c = cos(deltaAngle);
                float s = sin(deltaAngle);
                mat3 rotY = mat3(
                    c, 0, s,
                    0, 1, 0,
                   -s, 0, c
                );
                vec3 localPos = (instanceMatrix * vec4(position, 0.0)).xyz;
                vec3 rotatedLocalPos = rotY * localPos;
                gl_Position = projectionMatrix * viewMatrix * vec4(morphedWorldPos + rotatedLocalPos, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            varying float vOpacity;
            void main() {
                gl_FragColor = vec4(vColor, vOpacity);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      diskMaterialRef.current = diskMaterial;

      const instancedDisk = new THREE.InstancedMesh(streakGeo, diskMaterial, instanceCount);
      const dummy = new THREE.Object3D();

      for (let i = 0; i < instanceCount; i++) {
        const r = 5 + Math.pow(Math.random(), 1.3) * 40;
        const angle = Math.random() * Math.PI * 2;
        dummy.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * (8 / r), Math.sin(angle) * r);
        dummy.lookAt(dummy.position.x + Math.sin(angle), dummy.position.y, dummy.position.z - Math.cos(angle));
        dummy.updateMatrix();
        instancedDisk.setMatrixAt(i, dummy.matrix);
      }
      scene.add(instancedDisk);
      camControlRef.current.distance = currentPreset.camDist;
      camera.position.y = currentPreset.camY;
      const startTime = performance.now();

      const animateScene = () => {
        const time = (performance.now() - startTime) / 1000;

        diskMaterial.uniforms.uTime.value = time;
        auraMat.uniforms.uTime.value = time;

        instancedDisk.rotation.y += 0.0005;

        const currentDir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
        camera.position.x = controls.target.x + currentDir.x * camControlRef.current.distance;
        camera.position.z = controls.target.z + currentDir.z * camControlRef.current.distance;

        controls.update();
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(animateScene);
      };

      animateScene();
      window.addEventListener("resize", handleResize);
      setWebGLSupported(true);

    } catch (err) {
      console.warn("WebGL not supported or failed to initialize, falling back to dynamic CSS canvas:", err);
      setWebGLSupported(false);
    }
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);

      if (mountRef.current && renderer?.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }

      if (bhGeo) bhGeo.dispose();
      if (bhMat) bhMat.dispose();
      if (streakGeo) streakGeo.dispose();
      if (auraMat) auraMat.dispose();
      if (diskMaterial) diskMaterial.dispose();
      if (renderer) renderer.dispose();
    };
  }, [loading, destinations]);

  useEffect(() => {
    if (!webglSupported || !diskMaterialRef.current || !auraMaterialRef.current || !controlsRef.current || !cameraRef.current) return;

    const targetPreset = PRESETS[slugKey] || PRESETS.default;

    const diskMat = diskMaterialRef.current;
    const auraMat = auraMaterialRef.current;
    const controls = controlsRef.current;
    const camera = cameraRef.current;

    const newGlow = new THREE.Color(targetPreset.color);
    const newMid = new THREE.Color(targetPreset.colorMid);
    const newOuter = new THREE.Color(targetPreset.colorOuter);

    const tl = gsap.timeline({ defaults: { duration: 3.5, ease: "power3.inOut" } });

    tl.to(diskMat.uniforms.uMorph, { value: targetPreset.morph }, 0);
    tl.to(diskMat.uniforms.uCompression, { value: targetPreset.compress }, 0);
    tl.to(diskMat.uniforms.uIntensity, { value: targetPreset.intensity }, 0);
    tl.to(diskMat.uniforms.uOrbitScale, { value: targetPreset.orbit }, 0);
    tl.to(auraMat.uniforms.uIntensity, { value: targetPreset.intensity }, 0);

    tl.to(auraMat.uniforms.uGlowColor.value, { r: newGlow.r, g: newGlow.g, b: newGlow.b }, 0);
    tl.to(diskMat.uniforms.uColorMid.value, { r: newMid.r, g: newMid.g, b: newMid.b }, 0);
    tl.to(diskMat.uniforms.uColorOuter.value, { r: newOuter.r, g: newOuter.g, b: newOuter.b }, 0);
    tl.to(controls, { autoRotateSpeed: targetPreset.rotate }, 0);
    tl.to(camera.position, { y: targetPreset.camY }, 0);
    tl.to(camControlRef.current, { distance: targetPreset.camDist }, 0);

  }, [selectedIndex, destinations, webglSupported, slugKey]);

  useEffect(() => {
    if (loading || destinations.length === 0) return;

    const handleTransition = () => {
      const elementsToFade: Element[] = [];
      if (mainTitleRef.current) elementsToFade.push(mainTitleRef.current);
      if (statusTextRef.current) elementsToFade.push(statusTextRef.current);
      if (descriptionRef.current) elementsToFade.push(descriptionRef.current);

      const metricVals = document.querySelectorAll(".hud-metric-val");
      metricVals.forEach((v) => elementsToFade.push(v));

      gsap.to(elementsToFade, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
          setSelectedIndex((prevIdx) => (prevIdx + 1) % destinations.length);
          gsap.to(elementsToFade, {
            opacity: 1,
            duration: 1.2,
            delay: 0.2
          });
        }
      });
    };

    const intervalId = setInterval(handleTransition, 10000);
    return () => clearInterval(intervalId);
  }, [loading, destinations]);

  if (loading) {
    return (
      <div className="w-full min-h-[85vh] bg-[#010103] flex flex-col items-center justify-center border-t border-white/5 relative z-30">
        <Loader2 size={40} className="text-purple-500 animate-spin mb-4" />
        <span className="mono-text text-[10px] tracking-[0.3em] text-slate-500 uppercase">
          Cargando...
        </span>
      </div>
    );
  }

  return (
    <section className="relative w-full h-screen bg-[#010103] overflow-hidden border-t border-white/5 z-30 flex flex-col justify-between select-none">

      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0 pointer-events-auto opacity-80" />

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.7; transform: scaleY(0.2) scale(1.0) rotate(45deg); }
          50% { opacity: 0.95; transform: scaleY(0.25) scale(1.1) rotate(45deg); }
        }
        .css-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        .css-spin-medium {
          animation: spin-slow 20s linear infinite;
        }
        .css-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        .css-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }
      `}</style>
      {!webglSupported && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden opacity-60">
          <div
            className="absolute w-[60vw] h-[60vw] rounded-full border border-dashed opacity-10 css-spin-slow"
            style={{ borderColor: currentPreset.color }}
          />

          <div className="absolute" style={{ transform: 'rotateX(75deg) rotateY(15deg)' }}>
            <div className="w-[450px] h-[450px] rounded-full border opacity-30 css-spin-medium" style={{ borderColor: currentPreset.color + "22" }} />
          </div>

          <div className="absolute" style={{ transform: 'rotateX(70deg) rotateY(-10deg)' }}>
            <div className="w-[350px] h-[350px] rounded-full border border-double opacity-40 css-spin-reverse" style={{ borderColor: currentPreset.color + "44" }} />
          </div>

          <div className="absolute" style={{ transform: 'rotateX(80deg) rotateY(5deg)' }}>
            <div className="w-[220px] h-[220px] rounded-full border opacity-50 blur-[1px] css-spin-medium" style={{ borderColor: currentPreset.color }} />
          </div>

          <div className="absolute css-pulse-glow w-[160px] h-[160px] rounded-full blur-[25px] opacity-80"
            style={{
              background: `radial-gradient(circle, ${currentPreset.color} 0%, ${currentPreset.colorMid} 50%, transparent 100%)`
            }}
          />

          <div
            className="absolute w-20 h-20 bg-black rounded-full z-10 border border-white/5"
            style={{
              boxShadow: `0 0 50px ${currentPreset.color}33, inset 0 0 20px rgba(0,0,0,0.9)`
            }}
          />
        </div>
      )}

      <div className="absolute inset-0 bg-radial-gradient(circle, transparent 30%, rgba(0,0,0,0.5) 100%) pointer-events-none z-10" />

      <div className="relative w-full text-center px-6 z-20 pointer-events-none">
        <div className="max-w-4xl mx-auto space-y-4">
          <div
            ref={mainTitleRef}
            className="text-white text-base md:text-6xl font-sans font-black uppercase tracking-[0.6em] transition-all duration-700"
          >
            {activeDest.name}
          </div>

          <div className="pointer-events-auto inline-block">
            <div className="relative mx-auto my-auto z-20 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
              <div className="max-w-7xl space-y-6 flex flex-col items-center">
                <p
                  ref={descriptionRef}
                  className="text-slate-400/80 text-md md:text-md uppercase font-light max-w-sm md:max-w-4xl leading-relaxed h-12 mb-0"
                >
                  {activeDest.description}
                </p>
                <Link
                  href={`/destinations/${activeDest.slug || activeDest.name.toLowerCase()}`}
                  className="pointer-events-auto px-8 py-4 md:px-10 md:py-5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all backdrop-blur-md hover:scale-105 active:scale-95"
                >
                  Conoce más
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full pb-16 px-10 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-between items-end font-mono text-[9px] text-slate-500 tracking-widest leading-relaxed">

          <div className="space-y-1.5 text-left">
            <div>
              DISTANCIA MÁXIMA: <span className="hud-metric-val font-bold transition-all duration-700" style={{ color: currentPreset.color }}>{activeDest.max_distance_au ? `${parseFloat(activeDest.max_distance_au).toFixed(2)} UA` : activeDest.distance_au}</span>
            </div>
            <div>
              DISTANCIA MÍNIMA: <span className="hud-metric-val font-bold transition-all duration-700" style={{ color: currentPreset.color }}>
                {activeDest.distance_au ? `${parseFloat(activeDest.distance_au).toFixed(2)} UA` : "N/A"}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <div>
              CLIMA: <span className="hud-metric-val font-bold transition-all duration-700" style={{ color: currentPreset.color }}>{activeDest.temperature}</span>
            </div>
            <div>
              GRAVEDAD: <span className="hud-metric-val font-bold transition-all duration-700" style={{ color: currentPreset.color }}>{activeDest.gravity}</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
