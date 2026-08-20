"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { Step3DConnection } from "./types";

interface BuildConnection3DProps {
  connection: Step3DConnection;
  reducedMotion: boolean;
}

export default function BuildConnection3D({
  connection,
  reducedMotion,
}: BuildConnection3DProps) {
  const signalRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.PointLight>(null);

  // Construct a smooth 3D Quadratic Bezier Curve between Start, MidPoint, and End
  const { curve, tubeGeometry, midPointVector, tangentDirection } = useMemo(() => {
    const vStart = new THREE.Vector3(...connection.start);
    const vMid = new THREE.Vector3(...connection.midPoint);
    const vEnd = new THREE.Vector3(...connection.end);

    const bezCurve = new THREE.QuadraticBezierCurve3(vStart, vMid, vEnd);
    const geom = new THREE.TubeGeometry(bezCurve, 32, 0.018, 8, false);

    const midPt = bezCurve.getPoint(0.5);
    const tangent = bezCurve.getTangent(0.5).normalize();

    return {
      curve: bezCurve,
      tubeGeometry: geom,
      midPointVector: midPt,
      tangentDirection: tangent,
    };
  }, [connection.start, connection.midPoint, connection.end]);

  // Timing: 2.0s travel + 0.8s pause = 2.8s cycle. Staggered per step index.
  const CYCLE_DURATION = 2.8;
  const TRAVEL_DURATION = 2.0;
  const staggerOffset = connection.fromIndex * 0.7;

  useFrame((state) => {
    if (!signalRef.current) return;

    if (reducedMotion) {
      signalRef.current.visible = false;
      if (glowRef.current) glowRef.current.intensity = 0;
      return;
    }

    const elapsed = state.clock.elapsedTime + staggerOffset;
    const cycleTime = elapsed % CYCLE_DURATION;

    if (cycleTime < TRAVEL_DURATION) {
      // Progress from 0 to 1 with smooth cubic ease
      const rawT = cycleTime / TRAVEL_DURATION;
      const t = rawT * rawT * (3 - 2 * rawT); // smoothstep ease

      const point = curve.getPoint(t);
      signalRef.current.position.copy(point);
      signalRef.current.visible = true;

      // Pulse signal opacity at start & end for soft fade
      const fade = Math.sin(rawT * Math.PI);
      signalRef.current.scale.setScalar(0.7 + fade * 0.4);

      if (glowRef.current) {
        glowRef.current.position.copy(point);
        glowRef.current.intensity = fade * 0.8;
      }
    } else {
      // Pause interval
      signalRef.current.visible = false;
      if (glowRef.current) glowRef.current.intensity = 0;
    }
  });

  return (
    <group>
      {/* ─── BASE CONNECTION TUBE ─────────────────────────────────────────── */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color="#334155"
          emissive="#1e293b"
          emissiveIntensity={0.2}
          roughness={0.4}
          metalness={0.3}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* ─── MIDPOINT DIRECTIONAL ARROW / CHEVRON ─────────────────────────── */}
      <mesh
        position={midPointVector}
        quaternion={
          new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            tangentDirection,
          )
        }
      >
        <coneGeometry args={[0.06, 0.16, 8]} />
        <meshBasicMaterial
          color={connection.color || "#818cf8"}
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* ─── TRAVELLING SIGNAL PACKET ─────────────────────────────────────── */}
      <mesh ref={signalRef} visible={!reducedMotion}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={connection.color || "#a78bfa"}
          emissiveIntensity={2.0}
          roughness={0.1}
        />
      </mesh>

      {/* ─── TRAVELLING SIGNAL POINT GLOW ─────────────────────────────────── */}
      {!reducedMotion && (
        <pointLight
          ref={glowRef}
          color={connection.color || "#a78bfa"}
          distance={1.5}
          decay={2}
          intensity={0}
        />
      )}
    </group>
  );
}
