import { useEffect, useRef, useState } from 'react'
import { CalendarPlus, GoogleLogo, DownloadSimple } from '@phosphor-icons/react'
import { countdown, urgency, when } from '../lib/dates'
import { downloadIcs, googleLink } from '../lib/calendar'

/** A countdown tag, only for confirmed dates in the next 30 days; further out, the date says enough. */
export function Countdown({ dl }) {
  const u = urgency(dl)
  if (u !== 'urgent' && u !== 'soon') return null
  return <span className={`chip chip-${u} caption-3 num`}>{countdown(dl)}</span>
}

/** One deadline's date in words, with "expected" spelled out for estimates. */
export function When({ dl }) {
  return (
    <span className="num">
      {dl.sure || dl.approx === 'week' ? when(dl) : `Expected ${when(dl)}`}
    </span>
  )
}

/** Add one deadline (or several) to a calendar: Google Calendar, or an .ics file for any app. */
export function AddToCalendar({ deadlines, label = 'Add to calendar', compact = false, filename }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const single = deadlines.length === 1 ? deadlines[0] : null

  useEffect(() => {
    if (!open) return
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc) }
  }, [open])

  if (!single) {
    return (
      <button type="button" className="btn btn-secondary button-md" onClick={() => downloadIcs(deadlines, filename)}>
        <DownloadSimple size={18} weight="bold" aria-hidden="true" />
        {label}
      </button>
    )
  }
  return (
    <div className="cal" ref={ref}>
      <button
        type="button"
        className={compact ? 'cal-link button-sm' : 'btn btn-quiet button-sm'}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <CalendarPlus size={16} weight="bold" aria-hidden="true" />
        {label}
        {compact && <span className="visually-hidden">: {single.exam.name}, {single.label}</span>}
      </button>
      {open && (
        <div className="cal-menu" role="menu">
          <a role="menuitem" className="cal-item body-5" href={googleLink(single)} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            <GoogleLogo size={18} aria-hidden="true" /> Google Calendar
          </a>
          <button role="menuitem" type="button" className="cal-item body-5" onClick={() => { downloadIcs([single], `${single.exam.id}-${single.kind}.ics`); setOpen(false) }}>
            <DownloadSimple size={18} aria-hidden="true" /> Apple or Outlook (.ics)
          </button>
        </div>
      )}
    </div>
  )
}

/** Drawer shell shared by the exam panel and onboarding. */
export function Drawer({ label, onClose, children, wide = false }) {
  const ref = useRef(null)
  useEffect(() => {
    const prev = document.activeElement
    ref.current?.focus()
    const key = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', key)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; prev?.focus?.() }
  }, [onClose])
  return (
    <div className="drawer-layer" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`drawer ${wide ? 'drawer-wide' : ''}`} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} ref={ref}>
        {children}
      </div>
    </div>
  )
}
