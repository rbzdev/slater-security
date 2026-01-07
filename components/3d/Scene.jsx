'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'
import { Model } from './Model' // Ton code généré

export default function Scene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 5], fov: 35 }}>
      <Suspense fallback={null}>
        {/* Stage gère la lumière et le centrage automatiquement */}
        <Stage intensity={0.5} environment="city" adjustCamera={1.5}>
          <Model />
        </Stage>
      </Suspense>
      <OrbitControls makeDefault />
    </Canvas>
  )
}