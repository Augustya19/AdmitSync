import { daysUntil, fmt, today } from '../lib/dates'

function big(dl) {
  const now = today()
  const start = daysUntil(dl.date, now)
  if (dl.end && start <= 0) return { n: 'Now', unit: `until ${fmt(dl.end, { year: false })}` }
  if (start === 0) return { n: 'Today', unit: '' }
  return { n: String(start), unit: start === 1 ? 'day left' : 'days left' }
}

/**
 * The signature: one arch per upcoming deadline, soonest on the left.
 * Every exam is a door with a closing date; the first door is the one to act on.
 */
export default function Colonnade({ items, onOpen, caption }) {
  if (!items.length) return null
  return (
    <figure className="colonnade">
      <ol className="arches" aria-label={caption}>
        {items.map((dl, i) => {
          const { n, unit } = big(dl)
          return (
            <li key={`${dl.exam.id}-${dl.kind}-${dl.date}`} className={`arch ${i === 0 ? 'arch-first' : ''} ${i === 0 && n === 'Today' ? 'is-today' : ''}`}>
              <button type="button" className="arch-door" onClick={() => onOpen(dl.exam.id)}>
                <span className="arch-count">
                  <span className={`num ${i === 0 ? 'arch-n-first' : 'arch-n'} ${/^\d+$/.test(n) ? '' : 'is-word'}`}>{n}</span>
                  {unit && <span className="caption-4 arch-unit">{unit}</span>}
                </span>
                <span className="arch-what">
                  <span className={i === 0 ? 'title-1' : 'title-3'}>{dl.exam.name}</span>
                  <span className={i === 0 ? 'body-6 arch-label' : 'caption-2 arch-label'}>{dl.label}</span>
                  <span className="caption-4 num arch-date">{fmt(dl.date)}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      {caption && <figcaption className="caption-2 colonnade-caption">{caption}</figcaption>}
    </figure>
  )
}
