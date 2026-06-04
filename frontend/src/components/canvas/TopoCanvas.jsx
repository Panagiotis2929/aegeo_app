import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Terrain() {
  const meshRef = useRef()

  // Generate a procedural island shape using simple math
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(14, 14, 64, 64)
    const pos = geo.attributes.position
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      // Center distance to create an island shape dropping off at edges
      const dist = Math.sqrt(x*x + y*y)
      let z = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 0.6
      z += Math.sin(x * 1.5) * 0.2
      
      // Flatten edges to create the ocean boundary
      if (dist > 4) {
        z *= Math.max(0, 1 - (dist - 4) * 0.4)
      }
      pos.setZ(i, Math.max(-0.2, z))
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.04
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.8, 0, 0]} position={[0, -1, -2]}>
      <meshStandardMaterial 
        color="#154A65"
        wireframe={true}
        transparent={true}
        opacity={0.18}
        roughness={0.6}
      />
    </mesh>
  )
}

export default function TopoCanvas() {
  return (
    <div aria-hidden="true" className="absolute inset-0 z-0 bg-gradient-to-b from-[#050F1E] to-[#0A2540]">
      <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} color="#FCE38A" />
        <pointLight position={[-5, 3, -2]} intensity={0.4} color="#3DA3C4" />
        <Terrain />
      </Canvas>
    </div>
  )
}