import React from 'react'

export default function Stars({ count = 100 }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-30 animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2}px`,
            height: `${Math.random() * 2}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  )
}