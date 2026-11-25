import { useEffect, useState } from 'react'

/** useState that survives a reload. Storage can be missing or full; the app still works without it. */
export function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw == null ? initial : JSON.parse(raw)
    } catch { return initial }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* private mode or quota: keep in memory */ }
  }, [key, value])
  return [value, setValue]
}

/** Hash routes: #/, #/plan, #/ask, #/exam/<id>, #/privacy, #/terms. */
export function useRoute() {
  const read = () => (location.hash.replace(/^#/, '') || '/').split('?')[0]
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const on = () => { setRoute(read()); }
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])
  return route
}

export const go = (path) => { location.hash = path }
