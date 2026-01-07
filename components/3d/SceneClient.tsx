"use client"

import dynamic from 'next/dynamic'

const Scene = dynamic(() => import('@/components/3d/Scene'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center">Chargement 3D...</div>
})

export default function SceneClient() {
    
  return <Scene />
}
