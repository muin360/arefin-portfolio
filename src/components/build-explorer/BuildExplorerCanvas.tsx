"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import BuildNode3D from "./BuildNode3D";
import BuildConnection3D from "./BuildConnection3D";
import type { Step3DNode, Step3DConnection } from "./types";

interface BuildExplorerCanvasProps {
  nodes: Step3DNode[];
  connections: Step3DConnection[];
  selectedIndex: number;
  onSelectNode: (index: number) => void;
  resetTrigger: number;
  reducedMotion: boolean;
}

function SceneContent({
  nodes,
  connections,
  selectedIndex,
  onSelectNode,
  resetTrigger,
  reducedMotion,
}: BuildExplorerCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  // Reset Camera View handler
  useEffect(() => {
    if (resetTrigger > 0 && controlsRef.current) {
      controlsRef.current.reset();
      camera.position.set(0, 2.6, 8.5);
      camera.lookAt(0, 0, 0);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [resetTrigger, camera]);

  return (
    <>
      {/* ─── STUDIO LIGHTING (RESTRAINED & SOFT) ─────────────────────────── */}
      <ambientLight intensity={0.65} color="#e2e8f0" />
      <directionalLight
        position={[5, 8, 6]}
        intensity={1.2}
        color="#ede9fe"
        castShadow={false}
      />
      <pointLight position={[-6, -3, 2]} intensity={0.4} color="#38bdf8" />

      {/* ─── GROUNDING SPATIAL REFERENCE GRID ─────────────────────────────── */}
      <group position={[0, -1.2, 0]}>
        <gridHelper
          args={[18, 18, "#334155", "#1e293b"]}
          rotation={[0, 0, 0]}
        />
        {/* Subtle radial ground gradient ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <ringGeometry args={[0.5, 7.5, 32]} />
          <meshBasicMaterial
            color="#8b5cf6"
            transparent
            opacity={0.03}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ─── 3D CONNECTIONS & ANIMATED SIGNALS ─────────────────────────────── */}
      <group>
        {connections.map((connection) => (
          <BuildConnection3D
            key={connection.id}
            connection={connection}
            reducedMotion={reducedMotion}
          />
        ))}
      </group>

      {/* ─── 3D NODES ─────────────────────────────────────────────────────── */}
      <group>
        {nodes.map((node) => (
          <BuildNode3D
            key={node.id}
            node={node}
            isSelected={node.index === selectedIndex}
            reducedMotion={reducedMotion}
            onSelect={onSelectNode}
          />
        ))}
      </group>

      {/* ─── CONSTRAINED ORBIT CONTROLS ───────────────────────────────────── */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        panSpeed={0.5}
        zoomSpeed={0.7}
        minDistance={4.5}
        maxDistance={14}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.15} // Prevents flipping under the floor
        maxAzimuthAngle={Math.PI / 2.5}
        minAzimuthAngle={-Math.PI / 2.5}
      />
    </>
  );
}

export default function BuildExplorerCanvas(props: BuildExplorerCanvasProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 2.6, 8.5], fov: 42 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]} // Crisp rendering up to 2x DPR
      >
        <SceneContent {...props} />
      </Canvas>
    </div>
  );
}
