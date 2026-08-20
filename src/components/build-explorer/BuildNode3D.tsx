"use client";

import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Step3DNode } from "./types";

interface BuildNode3DProps {
  node: Step3DNode;
  isSelected: boolean;
  reducedMotion: boolean;
  onSelect: (index: number) => void;
}

export default function BuildNode3D({
  node,
  isSelected,
  reducedMotion,
  onSelect,
}: BuildNode3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  const initialY = node.position[1];

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (!reducedMotion) {
      // Gentle idle rotation
      meshRef.current.rotation.y += delta * (isSelected ? 0.7 : 0.35);
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8 + node.index) * 0.08;

      // Subtle vertical floating cadence
      const floatOffset = Math.sin(state.clock.elapsedTime * 1.8 + node.index * 1.2) * 0.04;
      meshRef.current.position.y = initialY + floatOffset;

      // Pulse the selection halo if selected
      if (ringRef.current && isSelected) {
        ringRef.current.rotation.z += delta * 0.8;
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
        ringRef.current.scale.set(pulse, pulse, pulse);
      }
    }

    // Smooth spring scale interpolation on hover/select
    const targetScale = isSelected ? 1.16 : isHovered ? 1.08 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      Math.min(1, delta * 12),
    );
  });

  const renderGeometry = () => {
    switch (node.config.geometry) {
      case "torus":
        return <torusGeometry args={[0.42, 0.14, 16, 32]} />;
      case "box":
        return <boxGeometry args={[0.7, 0.7, 0.7]} />;
      case "sphere":
        return <sphereGeometry args={[0.48, 24, 24]} />;
      case "octahedron":
        return <octahedronGeometry args={[0.54, 0]} />;
      case "cylinder":
        return <cylinderGeometry args={[0.42, 0.42, 0.72, 24]} />;
      case "diamond":
        return <octahedronGeometry args={[0.54, 0]} />;
      case "dodecahedron":
        return <dodecahedronGeometry args={[0.48, 0]} />;
      default:
        return <sphereGeometry args={[0.48, 20, 20]} />;
    }
  };

  const isDiamond = node.config.geometry === "diamond";

  return (
    <group
      ref={meshRef}
      position={node.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.index);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        if (typeof document !== "undefined") {
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        setIsHovered(false);
        if (typeof document !== "undefined") {
          document.body.style.cursor = "auto";
        }
      }}
    >
      {/* ─── PRIMARY GEOMETRIC MESH ────────────────────────────────────────── */}
      <mesh scale={isDiamond ? [0.75, 1.15, 0.75] : [1, 1, 1]} castShadow receiveShadow>
        {renderGeometry()}
        <meshStandardMaterial
          color={isSelected ? "#1e2433" : isHovered ? "#161b26" : "#0d111a"}
          roughness={0.25}
          metalness={0.5}
          emissive={isSelected ? node.config.accentColor : isHovered ? node.config.emissiveColor : "#090d14"}
          emissiveIntensity={isSelected ? 0.85 : isHovered ? 0.45 : 0.08}
        />
      </mesh>

      {/* ─── INNER WIREFRAME ACCENT CORE ─────────────────────────────────── */}
      <mesh scale={isDiamond ? [0.78, 1.18, 0.78] : [1.04, 1.04, 1.04]}>
        {renderGeometry()}
        <meshBasicMaterial
          color={node.config.accentColor}
          wireframe
          transparent
          opacity={isSelected ? 0.75 : isHovered ? 0.35 : 0.12}
        />
      </mesh>

      {/* ─── SELECTION ACCENT HALO RING ───────────────────────────────────── */}
      {isSelected && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
          <ringGeometry args={[0.65, 0.72, 32]} />
          <meshBasicMaterial
            color={node.config.accentColor}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* ─── SUBTLE POINT LIGHT ON SELECTED NODE ─────────────────────────── */}
      {isSelected && (
        <pointLight
          color={node.config.accentColor}
          intensity={1.2}
          distance={3.5}
          decay={2}
        />
      )}

      {/* ─── ACCESSIBLE HTML BADGE OVERLAY (LEGIBLE 3D LABEL) ─────────────── */}
      <Html
        center
        position={[0, 0.85, 0]}
        distanceFactor={9}
        zIndexRange={[50, 0]}
        className="pointer-events-none select-none"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node.index);
          }}
          className={`pointer-events-auto cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-semibold border backdrop-blur-md transition-all duration-200 whitespace-nowrap shadow-lg ${
            isSelected
              ? `${node.config.tailwindBgColor} ${node.config.tailwindBorderColor} ${node.config.tailwindTextColor} ring-2 ring-violet-400/40 scale-105`
              : isHovered
              ? "bg-[#0c101d]/90 border-white/25 text-white scale-100"
              : "bg-[#07090e]/80 border-white/10 text-white/70 scale-95"
          }`}
        >
          <span className="font-bold opacity-80">{node.stepNumber}</span>
          <span className="w-1 h-1 rounded-full bg-current opacity-60" />
          <span className="font-sans font-medium">{node.title}</span>
        </div>
      </Html>
    </group>
  );
}
