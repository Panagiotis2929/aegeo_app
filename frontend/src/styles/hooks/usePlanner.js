import { useState, useCallback, useRef } from 'react'
import { MOCK_ITINERARIES, FALLBACK_ITINERARY } from '../../constants';

const USE_MOCK = false // Set to false to prioritize your running Python backend!
const MOCK_DELAY_MS = 2400

export function usePlanner() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const fetchPlan = useCallback(async ({ island, style, duration }) => {
    if (!island || !style) return

    setLoading(true)
    setError(null)

    if (abortRef.current) abortRef.current.abort()
    abortRef.current = new AbortController()

    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, MOCK_DELAY_MS))
      const mock = MOCK_ITINERARIES[island.id] ?? FALLBACK_ITINERARY(island.name)
      setData(mock)
      setLoading(false)
      return
    }

    try {
      const params = new URLSearchParams({
        destination: island.name,
        style: style.label,
        days: String(duration),
      })

      const res = await fetch(`/api/v1/planner?${params}`, {
        signal: abortRef.current.signal,
        headers: { Accept: 'application/json' },
      })

      if (!res.ok) throw new Error(`API error ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      if (err.name === 'AbortError') return
      console.warn('[usePlanner] Backend failed, trying local data...', err)
      
      // Fallback seamlessly to local premium data if backend has an issue
      await new Promise((r) => setTimeout(r, 1000))
      const mock = MOCK_ITINERARIES[island.id] ?? FALLBACK_ITINERARY(island.name)
      setData(mock)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort()
    setData(null)
    setLoading(false)
    setError(null)
  }, [])

  return { data, loading, error, fetchPlan, reset }
}