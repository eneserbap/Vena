"use client";
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';

function DNAHelix() {
  const ref = useRef<THREE.Points>(null);

  // Generate DNA particle positions
  const [positions, colors] = useMemo(() => {
    const numPoints = 8000; // Dense point cloud
    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);
    const color1 = new THREE.Color('#a855f7'); // purple
    const color2 = new THREE.Color('#ec4899'); // pink/magenta

    for (let i = 0; i < numPoints; i++) {
      // Create a double helix structure with random scatter for realism
      const t = i * 0.02; 
      const isFirstStrand = i % 2 === 0;
      const radius = 2.5 + (Math.random() * 0.4); // scatter width
      
      const angle = isFirstStrand ? t : t + Math.PI;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const y = (i / numPoints) * 30 - 15; // height distribution

      // Add connecting bridges occasionally
      const isBridge = Math.random() > 0.85;
      let finalX = x;
      let finalZ = z;
      if (isBridge) {
         const bridgeT = (Math.random() * 2 - 1); // between -1 and 1
         finalX = Math.sin(t) * radius * bridgeT;
         finalZ = Math.cos(t) * radius * bridgeT;
      }

      // Add noise to particles
      positions[i * 3] = finalX + (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = finalZ + (Math.random() - 0.5) * 0.5;

      // Mix colors based on position
      const mixedColor = color1.clone().lerp(color2, Math.random() > 0.5 ? 1 : 0);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false} rotation={[0.2, 0, 0.2]}>
      <PointMaterial 
        transparent 
        vertexColors 
        size={0.08} 
        sizeAttenuation={true} 
        depthWrite={false} 
        blending={THREE.AdditiveBlending} 
      />
    </Points>
  );
}

export default function DNA() {
  return (
    <div className="absolute right-0 top-0 w-[55vw] h-[100vh] pointer-events-none z-0 opacity-90">
      <Canvas camera={{ position: [0, 0, 18], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <DNAHelix />
        </Float>
      </Canvas>
    </div>
  );
}
