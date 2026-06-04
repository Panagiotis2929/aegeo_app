import React from 'react'

export function SkeletonTimeline() {
  return (
    <div className="space-y-4 w-full p-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse bg-white/5 h-20 w-full rounded-xl" />
      ))}
    </div>
  )
}

export function SkeletonMap() {
  return (
    <div className="animate-pulse bg-white/5 w-full h-full rounded-3xl" />
  )
}