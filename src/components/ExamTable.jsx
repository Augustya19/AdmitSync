import { useEffect, useMemo, useState } from 'react'
import { MagnifyingGlass, Plus, Check, X } from '@phosphor-icons/react'
import { EXAMS, STREAMS } from '../data/exams'
import { applyStatus, nextStep, urgency } from '../lib/dates'
import { Countdown, When } from './bits'

const LEVELS = [
  { id: 'all', label: 'Any level' },
  { id: 'ug', label: 'After 12th' },
  { id: 'pg', label: 'Graduates' },
]
const streamLabel = Object.fromEntries(STREAMS.map((s) => [s.id, s.label]))

function readFilters() {
  const q = new URLSearchParams(location.hash.split('?')[1] || '')
  return { stream: q.get('stream') || 'all', level: q.get('level') || 'all', q: q.get('q') || '' }
}

export default function ExamTable({ plan, onToggle, onOpen }) {
  const [f, setF] = useState(readFilters)
  const [all, setAll] = useState(false)

  // Keep filters in the address so a filtered list can be shared or bookmarked.
  useEffect(() => {
    const p = new URLSearchParams()
    if (f.stream !== 'all') p.set('stream', f.stream)
    if (f.level !== 'all') p.set('level', f.level)
    if (f.q) p.set('q', f.q)
    const base = (location.hash.replace(/^#/, '') || '/').split('?')[0]
    const next = `#${base}${p.size ? '?' + p : ''}`
    if (next !== location.hash) history.replaceState(null, '', next || '#/')
  }, [f])

  const rows = useMemo(() => {
    const q = f.q.trim().toLowerCase()
    return EXAMS.filter((e) =>
      (f.stream === 'all' || e.stream === f.stream) &&
      (f.level === 'all' || e.level === f.level) &&
      (!q || `${e.name} ${e.full} ${e.body} ${streamLabel[e.stream]}`.toLowerCase().includes(q)),
    ).map((e) => ({ e, next: nextStep(e), status: applyStatus(e) }))
      .sort((a, b) => (a.next?.date || '9999').localeCompare(b.next?.date || '9999'))
  }, [f])

  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }))
  const filtered = f.stream !== 'all' || f.level !== 'all' || f.q
    const shown = all || filtered ? rows : rows.slice(0, 12)

  return (
    <div className="exams">
      <div className="filters" role="search">
        <label className="search">
          <MagnifyingGlass size={18} aria-hidden="true" />
          <span className="visually-hidden">Search exams</span>
          <input
            className="body-6"
            type="search"
            placeholder="Search by exam, college or body"
            value={f.q}
            onChange={(e) => set('q')(e.target.value)}
          />
        </label>
        <div className="segmented" role="radiogroup" aria-label="Level">
          {LEVELS.map((l) => (
            <button key={l.id} type="button" role="radio" aria-checked={f.level === l.id} className="seg button-sm" onClick={() => set('level')(l.id)}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="stream-chips" role="radiogroup" aria-label="Stream">
          {[{ id: 'all', label: 'All streams' }, ...STREAMS].map((s) => (
            <button key={s.id} type="button" role="radio" aria-checked={f.stream === s.id} className="pill button-sm" onClick={() => set('stream')(s.id)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <p className="caption-2 result-count" aria-live="polite">
        {filtered ? `${rows.length} ${rows.length === 1 ? 'match' : 'matches'}, soonest first` : 'Soonest next date first'}
      </p>

      {rows.length === 0 ? (
        <div className="empty">
          <p className="title-2">No exam matches “{f.q}”.</p>
          <p className="body-6">Check the spelling, clear the filters, or ask the assistant about an exam we do not list yet.</p>
          <button type="button" className="btn btn-secondary button-md" onClick={() => setF({ stream: 'all', level: 'all', q: '' })}>
            <X size={18} weight="bold" aria-hidden="true" /> Clear filters
          </button>
        </div>
      ) : (
        <ul className="exam-grid">
          {shown.map(({ e, next, status }) => {
            const inPlan = plan.includes(e.id)
            return (
              <li key={e.id} className={`exam-card exam-${next ? urgency(next) : 'over'} ${inPlan ? 'is-in-plan' : ''}`}>
                <div className="card-top">
                  <button type="button" className="exam-link" onClick={() => onOpen(e.id)}>
                    <span className="heading-6">{e.name}</span>
                    <span className="caption-2 exam-full">{e.full}</span>
                  </button>
                  <button
                    type="button"
                    className={`save ${inPlan ? 'is-saved' : ''} button-sm`}
                    aria-pressed={inPlan}
                    aria-label={inPlan ? `Remove ${e.name} from your plan` : `Add ${e.name} to your plan`}
                    onClick={() => onToggle(e.id)}
                  >
                    {inPlan ? <Check size={16} weight="bold" aria-hidden="true" /> : <Plus size={16} weight="bold" aria-hidden="true" />}
                    <span>{inPlan ? 'In plan' : 'Add'}</span>
                  </button>
                </div>
                <div className="card-next">
                  {next ? (
                    <>
                      <span className="caption-1 muted">{next.label}</span>
                      <span className="card-when"><span className="title-2"><When dl={next} /></span> <Countdown dl={next} /></span>
                    </>
                  ) : <span className="body-6 muted">This cycle is over</span>}
                </div>
                <div className="card-foot">
                  {status.id !== 'soon' ? <span className={`caption-1 status status-${status.id}`}>{status.label}</span> : <span />}
                  <span className="caption-4 stream-tag">{streamLabel[e.stream]}</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {shown.length < rows.length && (
        <button type="button" className="btn btn-quiet button-md show-all" onClick={() => setAll(true)}>
          Show {rows.length - shown.length} more
        </button>
      )}
    </div>
  )
}
