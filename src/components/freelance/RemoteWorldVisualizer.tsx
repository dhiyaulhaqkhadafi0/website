"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Globe, Sparkles, ArrowRight, Laptop, Briefcase, Layers, Compass } from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  orbitRadius: number; // relative to sphere radius
  orbitSpeed: number;
  initialAngle: number;
  inclination: number; // tilt of the orbital plane in radians
  color: string;
  glowColor: string;
  targetId: string;
  filterKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ORBITAL_NODES: NodeData[] = [
  {
    id: "jobs",
    name: "Lowongan Remote",
    category: "Peluang Kerja",
    shortDesc: "Pilihan lowongan remote dan freelance dari berbagai platform global",
    orbitRadius: 1.38,
    orbitSpeed: 0.004,
    initialAngle: 0.2,
    inclination: 0.25,
    color: "#A5AC91",
    glowColor: "rgba(165, 172, 145, 0.4)",
    targetId: "card-lowongan",
    filterKey: "Lowongan",
    icon: Briefcase,
  },
  {
    id: "resources",
    name: "Sumber Daya",
    category: "Template · Panduan · Prompt",
    shortDesc: "Template kontrak, checklist, invoice, dan prompt AI siap pakai",
    orbitRadius: 1.45,
    orbitSpeed: -0.0035,
    initialAngle: 1.5,
    inclination: -0.3,
    color: "#AAA686",
    glowColor: "rgba(170, 166, 134, 0.4)",
    targetId: "card-resources",
    filterKey: "Sumber Daya",
    icon: Layers,
  },
  {
    id: "freelance",
    name: "Mulai Freelance",
    category: "Panduan & Belajar",
    shortDesc: "Pondasi, mindset, workflow, klien, dan pricing untuk freelancer",
    orbitRadius: 1.32,
    orbitSpeed: 0.0045,
    initialAngle: 2.8,
    inclination: 0.4,
    color: "#B1AE8D",
    glowColor: "rgba(177, 174, 141, 0.4)",
    targetId: "card-belajar",
    filterKey: "Panduan",
    icon: Compass,
  },
  {
    id: "direktori",
    name: "Direktori",
    category: "Platform & Komunitas",
    shortDesc: "Situs kerja remote, platform freelance, dan komunitas terpercaya",
    orbitRadius: 1.42,
    orbitSpeed: -0.003,
    initialAngle: 4.1,
    inclination: -0.2,
    color: "#9E9E82",
    glowColor: "rgba(158, 158, 130, 0.4)",
    targetId: "card-direktori",
    filterKey: "Direktori",
    icon: Laptop,
  },
  {
    id: "work-with-me",
    name: "Kerja Bersama",
    category: "Kolaborasi",
    shortDesc: "Terbuka untuk project produk digital, website, dan AI workflow",
    orbitRadius: 1.5,
    orbitSpeed: 0.0028,
    initialAngle: 5.3,
    inclination: 0.15,
    color: "#C4C1A0",
    glowColor: "rgba(196, 193, 160, 0.45)",
    targetId: "card-work-with-me",
    filterKey: "Semua",
    icon: Sparkles,
  },
];

// Sample global points (lat, lon in degrees) representing major remote hub cities
const HUB_COORDINATES = [
  { name: "Jakarta", lat: -6.2, lon: 106.8, primary: true },
  { name: "Singapore", lat: 1.35, lon: 103.8, primary: true },
  { name: "Tokyo", lat: 35.67, lon: 139.65 },
  { name: "Sydney", lat: -33.86, lon: 151.2 },
  { name: "Dubai", lat: 25.2, lon: 55.27 },
  { name: "London", lat: 51.5, lon: -0.12, primary: true },
  { name: "Berlin", lat: 52.52, lon: 13.4 },
  { name: "Amsterdam", lat: 52.36, lon: 4.9 },
  { name: "New York", lat: 40.71, lon: -74.0, primary: true },
  { name: "San Francisco", lat: 37.77, lon: -122.41, primary: true },
  { name: "Toronto", lat: 43.65, lon: -79.38 },
  { name: "Buenos Aires", lat: -34.6, lon: -58.38 },
  { name: "Cape Town", lat: -33.92, lon: 18.42 },
];

interface RemoteWorldVisualizerProps {
  onSelectCategory?: (category: string) => void;
  onOpenInquiry?: () => void;
}

export function RemoteWorldVisualizer({
  onSelectCategory,
  onOpenInquiry,
}: RemoteWorldVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeNode, setActiveNode] = useState<NodeData | null>(null);
  const [nodePositions, setNodePositions] = useState<
    { id: string; x: number; y: number; z: number; visible: boolean }[]
  >([]);
  const [isInteracting, setIsInteracting] = useState(false);

  // Rotation state in ref to avoid re-renders on every animation frame
  const stateRef = useRef({
    rotX: 0.18,
    rotY: 0.35,
    targetRotX: 0.18,
    targetRotY: 0.35,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    autoRotate: true,
    hoveredNodeId: null as string | null,
    angles: ORBITAL_NODES.map((n) => n.initialAngle),
    spherePoints: [] as { x: number; y: number; z: number; alpha: number }[],
    hubPoints: [] as { x: number; y: number; z: number; name: string; primary?: boolean }[],
  });

  // Initialize sphere points using Fibonacci lattice
  useEffect(() => {
    const numPoints = 420;
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    const pts: { x: number; y: number; z: number; alpha: number }[] = [];
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Slight density variations for organic feel
      const alpha = 0.25 + Math.random() * 0.45;
      pts.push({ x, y, z, alpha });
    }
    stateRef.current.spherePoints = pts;

    // Convert coordinates to 3D Cartesian coordinates (R = 1)
    const hubs = HUB_COORDINATES.map((hub) => {
      const phiRad = (90 - hub.lat) * (Math.PI / 180);
      const thetaRad = (hub.lon + 180) * (Math.PI / 180);
      const x = -(Math.sin(phiRad) * Math.cos(thetaRad));
      const z = Math.sin(phiRad) * Math.sin(thetaRad);
      const y = Math.cos(phiRad);
      return { x, y, z, name: hub.name, primary: hub.primary };
    });
    stateRef.current.hubPoints = hubs;
  }, []);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    const render = (time: number) => {
      // Keep the decorative canvas quiet while it is outside the reading viewport.
      const visibleRect = containerRef.current?.getBoundingClientRect();
      if (time - lastTime < 33 || document.hidden || (visibleRect && (visibleRect.bottom < 0 || visibleRect.top > window.innerHeight))) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      const dt = Math.min((time - lastTime) / 1000, .1);
      lastTime = time;

      const state = stateRef.current;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      // Responsive sphere radius (increased by ~50% per user request)
      const sphereRadius = Math.min(width * 0.48, height * 0.55, 260);

      // Handle auto rotation when not dragging
      if (state.autoRotate && !state.isDragging && !reduceMotion && !document.hidden) {
        state.targetRotY += 0.22 * dt;
      }

      // Smooth interpolation
      state.rotX += (state.targetRotX - state.rotX) * 0.08;
      state.rotY += (state.targetRotY - state.rotY) * 0.08;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // 3D rotation matrix calculation
      const cosX = Math.cos(state.rotX);
      const sinX = Math.sin(state.rotX);
      const cosY = Math.cos(state.rotY);
      const sinY = Math.sin(state.rotY);

      const project = (x: number, y: number, z: number, scale = 1) => {
        // Rotate around Y axis
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotate around X axis
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective factor
        const distance = 4.2;
        const fov = distance / (distance + z2);

        return {
          px: centerX + x1 * sphereRadius * scale * fov,
          py: centerY + y2 * sphereRadius * scale * fov,
          pz: z2,
          fov,
          visible: z2 > -0.65,
        };
      };

      // 1. Draw subtle background atmosphere glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        sphereRadius * 0.4,
        centerX,
        centerY,
        sphereRadius * 1.55
      );
      glowGrad.addColorStop(0, "rgba(165, 172, 145, 0.07)"); // Sage warm
      glowGrad.addColorStop(0.5, "rgba(177, 174, 141, 0.03)"); // Warm olive
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Latitude & Longitude Wireframe Rings
      ctx.lineWidth = 1;
      const numLatLines = 6;
      for (let i = 1; i <= numLatLines; i++) {
        const lat = -Math.PI / 2 + (Math.PI / (numLatLines + 1)) * i;
        const ringRadius = Math.cos(lat);
        const ringY = Math.sin(lat);

        ctx.beginPath();
        let first = true;
        const segments = 48;
        for (let j = 0; j <= segments; j++) {
          const theta = (j / segments) * Math.PI * 2;
          const x = Math.cos(theta) * ringRadius;
          const z = Math.sin(theta) * ringRadius;
          const proj = project(x, ringY, z);
          if (first) {
            ctx.moveTo(proj.px, proj.py);
            first = false;
          } else {
            ctx.lineTo(proj.px, proj.py);
          }
        }
        ctx.strokeStyle =
          i === 3 || i === 4
            ? "rgba(165, 172, 145, 0.14)"
            : "rgba(255, 255, 255, 0.04)";
        ctx.stroke();
      }

      // 3. Draw Rotating Sphere Fibonacci Dots
      for (const pt of state.spherePoints) {
        const proj = project(pt.x, pt.y, pt.z);
        if (proj.pz > -0.2) {
          // Front hemisphere is brighter
          const intensity = Math.max(0.1, (proj.pz + 1) / 2);
          ctx.beginPath();
          const dotSize = (proj.pz > 0.4 ? 1.6 : 1.1) * proj.fov;
          ctx.arc(proj.px, proj.py, Math.max(0.8, dotSize), 0, Math.PI * 2);

          if (proj.pz > 0.6) {
            ctx.fillStyle = `rgba(196, 193, 160, ${0.38 * intensity})`;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${pt.alpha * 0.3 * intensity})`;
          }
          ctx.fill();
        }
      }

      // 4. Draw Hub Cities & Connecting Arcs
      const hubProjected: { px: number; py: number; pz: number; name: string; primary?: boolean }[] = [];
      for (const hub of state.hubPoints) {
        const proj = project(hub.x, hub.y, hub.z);
        if (proj.pz > -0.1) {
          hubProjected.push({
            px: proj.px,
            py: proj.py,
            pz: proj.pz,
            name: hub.name,
            primary: hub.primary,
          });

          // Draw city pulse point
          ctx.beginPath();
          const radius = (hub.primary ? 4.5 : 2.8) * proj.fov;
          ctx.arc(proj.px, proj.py, radius, 0, Math.PI * 2);
          ctx.fillStyle = hub.primary ? "#A5AC91" : "#B1AE8D";
          ctx.fill();

          if (hub.primary && proj.pz > 0.4) {
            ctx.beginPath();
            ctx.arc(proj.px, proj.py, radius * 2.2, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(165, 172, 145, 0.3)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw connection lines between primary hubs
      for (let i = 0; i < hubProjected.length; i++) {
        for (let j = i + 1; j < hubProjected.length; j++) {
          const h1 = hubProjected[i];
          const h2 = hubProjected[j];
          if ((h1.primary || h2.primary) && h1.pz > 0.1 && h2.pz > 0.1) {
            const dist = Math.hypot(h1.px - h2.px, h1.py - h2.py);
            if (dist < sphereRadius * 1.4) {
              ctx.beginPath();
              // Curved arc through center bias
              const midX = (h1.px + h2.px) / 2 + (centerX - (h1.px + h2.px) / 2) * -0.18;
              const midY = (h1.py + h2.py) / 2 + (centerY - (h1.py + h2.py) / 2) * -0.18;
              ctx.moveTo(h1.px, h1.py);
              ctx.quadraticCurveTo(midX, midY, h2.px, h2.py);
              ctx.strokeStyle = "rgba(165, 172, 145, 0.18)";
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      // 5. Calculate and Update Orbiting Nodes
      const updatedNodePositions: {
        id: string;
        x: number;
        y: number;
        z: number;
        visible: boolean;
      }[] = [];

      ORBITAL_NODES.forEach((node, idx) => {
        // Advance angle
        if (!reduceMotion) state.angles[idx] += node.orbitSpeed * dt * 60;
        const currentAngle = state.angles[idx];

        // Position on inclined circle
        const cosInc = Math.cos(node.inclination);
        const sinInc = Math.sin(node.inclination);
        const rawX = Math.cos(currentAngle) * node.orbitRadius;
        const rawZ = Math.sin(currentAngle) * node.orbitRadius;
        const rawY = rawZ * sinInc;
        const flatZ = rawZ * cosInc;

        const proj = project(rawX, rawY, flatZ, 1);

        updatedNodePositions.push({
          id: node.id,
          x: proj.px,
          y: proj.py,
          z: proj.pz,
          visible: proj.pz > -0.7,
        });

        // Draw faint orbital trace line around sphere
        ctx.beginPath();
        const traceSegments = 40;
        let traceFirst = true;
        for (let s = 0; s <= traceSegments; s++) {
          const traceAngle = (s / traceSegments) * Math.PI * 2;
          const tx = Math.cos(traceAngle) * node.orbitRadius;
          const tz = Math.sin(traceAngle) * node.orbitRadius;
          const ty = tz * sinInc;
          const tfz = tz * cosInc;
          const tproj = project(tx, ty, tfz, 1);
          if (traceFirst) {
            ctx.moveTo(tproj.px, tproj.py);
            traceFirst = false;
          } else {
            ctx.lineTo(tproj.px, tproj.py);
          }
        }
        ctx.strokeStyle =
          state.hoveredNodeId === node.id
            ? node.glowColor
            : "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = state.hoveredNodeId === node.id ? 1.5 : 1;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw connecting ray from sphere surface to node
        if (proj.pz > -0.2) {
          ctx.beginPath();
          const sphereSurfaceX = rawX * 0.72;
          const sphereSurfaceY = rawY * 0.72;
          const sphereSurfaceZ = flatZ * 0.72;
          const surfProj = project(sphereSurfaceX, sphereSurfaceY, sphereSurfaceZ);
          ctx.moveTo(surfProj.px, surfProj.py);
          ctx.lineTo(proj.px, proj.py);
          ctx.strokeStyle =
            state.hoveredNodeId === node.id
              ? node.glowColor
              : "rgba(255, 255, 255, 0.12)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Update state for DOM overlay elements
      setNodePositions(updatedNodePositions);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  // Pointer interactions (drag to spin, hover parallax)
  const handlePointerDown = (e: React.PointerEvent) => {
    stateRef.current.isDragging = true;
    stateRef.current.autoRotate = false;
    stateRef.current.lastMouseX = e.clientX;
    stateRef.current.lastMouseY = e.clientY;
    setIsInteracting(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (stateRef.current.isDragging) {
      const dx = e.clientX - stateRef.current.lastMouseX;
      const dy = e.clientY - stateRef.current.lastMouseY;
      stateRef.current.targetRotY += dx * 0.007;
      stateRef.current.targetRotX = Math.max(
        -0.85,
        Math.min(0.85, stateRef.current.targetRotX + dy * 0.007)
      );
      stateRef.current.lastMouseX = e.clientX;
      stateRef.current.lastMouseY = e.clientY;
    } else {
      // Subtle parallax tilt when hovering
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        stateRef.current.targetRotX = 0.18 + normY * 0.12;
      }
    }
  };

  const handlePointerUp = () => {
    stateRef.current.isDragging = false;
    setIsInteracting(false);
    // Resume auto-rotation after brief pause
    setTimeout(() => {
      stateRef.current.autoRotate = true;
    }, 1500);
  };

  const handleNodeClick = useCallback(
    (node: NodeData) => {
      if (node.id === "work-with-me" && onOpenInquiry) {
        onOpenInquiry();
        return;
      }

      if (onSelectCategory && node.filterKey) {
        onSelectCategory(node.filterKey);
      }

      const target = document.getElementById(node.targetId);
      if (target) {
        target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "center" });
      }
    },
    [onSelectCategory, onOpenInquiry]
  );

  return (
    <section className="relative w-full py-20 md:py-28 overflow-hidden border-y border-[rgba(255,255,255,0.07)] bg-[#292A27]">
      {/* Warm atmospheric glow — very subtle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[520px] bg-[#A5AC91]/[0.05] blur-[160px] rounded-full pointer-events-none" />

      {/* Header and Micro-copy */}
      <div className="container mx-auto px-6 max-w-[1240px] relative z-10 mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-5"
        >
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-[#898B84] inline-flex items-center gap-2">
            <Globe className="w-3 h-3" />
            Dunia Freelance
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="text-[28px] sm:text-[36px] md:text-[44px] font-black tracking-[-0.03em] text-[#ECEDE7] leading-tight max-w-xl"
        >
          Satu dunia kerja tanpa batas kantor.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="text-[14px] md:text-[15px] text-[#898B84] max-w-lg mt-3 font-normal leading-relaxed"
        >
          Jelajahi berbagai jalur, peluang, dan cara bekerja secara independen dari mana saja di dunia.
        </motion.p>
      </div>

      {/* Interactive 3D Canvas Sphere & HTML Overlay Nodes */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`relative w-full h-[460px] sm:h-[520px] md:h-[580px] max-w-5xl mx-auto cursor-grab select-none touch-none ${
          isInteracting ? "cursor-grabbing" : ""
        }`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ imageRendering: "auto" }}
        />

        {/* DOM Nodes positioned dynamically in 3D projection */}
        {nodePositions.map((pos) => {
          const node = ORBITAL_NODES.find((n) => n.id === pos.id);
          if (!node || !pos.visible) return null;

          const isHovered = activeNode?.id === node.id;
          const zDepthOpacity = Math.max(0.35, Math.min(1, (pos.z + 1.2) / 2));
          const zScale = Math.max(0.78, Math.min(1.08, 0.9 + pos.z * 0.18));

          return (
            <div
              key={node.id}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: `translate(-50%, -50%) scale(${zScale})`,
                opacity: zDepthOpacity,
                zIndex: Math.round((pos.z + 2) * 10),
              }}
              className="absolute pointer-events-auto transition-transform duration-100 ease-out"
              onMouseEnter={() => {
                stateRef.current.hoveredNodeId = node.id;
                setActiveNode(node);
              }}
              onMouseLeave={() => {
                stateRef.current.hoveredNodeId = null;
                setActiveNode(null);
              }}
            >
              <button
                onClick={() => handleNodeClick(node)}
                type="button"
                className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-[6px] backdrop-blur-xl border transition-all duration-300 text-left ${
                  isHovered
                    ? "bg-[#343531]/90 border-[rgba(255,255,255,0.2)] -translate-y-1"
                    : "bg-[#2E2F2B]/90 border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.14)]"
                }`}
                style={{
                  boxShadow: isHovered
                    ? `0 4px 20px rgba(0,0,0,0.5)`
                    : "0 2px 12px rgba(0,0,0,0.4)",
                }}
              >
                {/* Node icon dot */}
                <span
                  className="flex-shrink-0 w-2 h-2 rounded-full"
                  style={{ backgroundColor: node.color }}
                />

                {/* Node label */}
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#ECEDE7] tracking-wide leading-tight flex items-center gap-1">
                    {node.name}
                    <ArrowRight className="w-3 h-3 text-[#898B84] group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-[10px] text-[#898B84] font-medium leading-none mt-0.5 line-clamp-1">
                    {node.category}
                  </span>
                </div>
              </button>

              {/* Tooltip detail on hover */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 p-3 rounded-[6px] bg-[#2E2F2B]/98 border border-[rgba(255,255,255,0.14)] shadow-2xl backdrop-blur-2xl pointer-events-none text-center z-50"
                >
                  <p className="text-[11px] text-[#B6B8B0] font-medium leading-relaxed">
                    {node.shortDesc}
                  </p>
                  <span className="inline-block mt-1.5 text-[10px] font-semibold text-[#A5AC91]">
                    Klik untuk menjelajahi ↓
                  </span>
                </motion.div>
              )}
            </div>
          );
        })}

        {/* Drag Hint at bottom */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <span className="text-[11px] text-[#898B84]/60 tracking-wider uppercase bg-[#2E2F2B]/60 px-3 py-1 rounded-[4px] border border-[rgba(255,255,255,0.05)] backdrop-blur-md">
            Geser untuk memutar · Klik node untuk menjelajahi
          </span>
        </div>
      </div>
    </section>
  );
}
