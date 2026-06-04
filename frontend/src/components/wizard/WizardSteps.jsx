import React from 'react'
import { motion } from 'framer-motion'
import { ISLANDS, TRIP_STYLES, DURATIONS } from '../../constants'

const containerVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.08 } }
}

export function StepDestination({ selections, setSelections, onNext }) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      <h2 className="text-2xl font-bold mb-4">Πού θα ταξιδέψεις;</h2>
      <div className="space-y-2">
        {ISLANDS.map((island) => (
          <button
            key={island.id}
            onClick={() => setSelections({ ...selections, island })}
            className={`w-full p-4 rounded-xl border transition-all ${selections.island?.id === island.id ? 'bg-gold/20 border-gold' : 'bg-white/5'}`}
          >
            {island.emoji} {island.name}
          </button>
        ))}
      </div>
      <button disabled={!selections.island} onClick={onNext} className="mt-4 w-full bg-gold p-3 rounded-lg disabled:opacity-50">Συνέχεια</button>
    </motion.div>
  )
}

export function StepStyle({ selections, setSelections, onNext }) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      <h2 className="text-2xl font-bold mb-4">Στυλ Ταξιδιού</h2>
      <div className="grid grid-cols-2 gap-2">
        {TRIP_STYLES.map((style) => (
          <button key={style.id} onClick={() => setSelections({ ...selections, style })} className={`p-4 rounded-xl border ${selections.style?.id === style.id ? 'bg-gold/20 border-gold' : 'bg-white/5'}`}>
            {style.icon} {style.label}
          </button>
        ))}
      </div>
      <button onClick={onNext} className="mt-4 w-full bg-gold p-3 rounded-lg">Συνέχεια</button>
    </motion.div>
  )
}

export function StepDuration({ selections, setSelections, onNext }) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      <h2 className="text-2xl font-bold mb-4">Διάρκεια (Μέρες)</h2>
      <div className="flex gap-2">
        {DURATIONS.map((d) => (
          <button key={d} onClick={() => setSelections({ ...selections, duration: d })} className={`p-4 rounded-lg flex-1 ${selections.duration === d ? 'bg-gold' : 'bg-white/5'}`}>
            {d}
          </button>
        ))}
      </div>
      <button onClick={onNext} className="mt-4 w-full bg-gold p-3 rounded-lg">Δημιουργία Πλάνου</button>
    </motion.div>
  )
}