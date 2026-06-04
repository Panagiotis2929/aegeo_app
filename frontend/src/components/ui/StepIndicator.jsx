import React from 'react'

export default function StepIndicator({ current, total }) {
  return (
    <div className="flex gap-2">
      {[...Array(total)].map((_, i) => (
        <div 
          key={i} 
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i <= current ? 'w-8 bg-gold' : 'w-4 bg-white/20'
          }`}
        />
      ))}
    </div>
  )
}