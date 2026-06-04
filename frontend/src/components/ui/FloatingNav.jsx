import React from 'react'

export default function FloatingNav({ activeId, onChange }) {
  const tabs = [
    { id: 'explore', label: 'Explore', icon: '🌍' },
    { id: 'saved', label: 'Saved', icon: '❤️' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ]

  return (
    <div className="fixed bottom-6 left-6 right-6 flex justify-center z-50">
      <div className="glass-dark flex gap-2 p-2 rounded-2xl border border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeId === tab.id ? 'bg-gold text-aegean-950 font-bold' : 'text-white/60 hover:bg-white/5'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}