import { useMemo } from 'react'
import { X } from '@phosphor-icons/react'
import { EXAMS } from '../data/exams'
import { ahead, monthKey, monthLabel, nextConfirmed, timeline } from '../lib/dates'
import Colonnade from './Colonnade'
import { AddToCalendar, Countdown, When } from './bits'

export default function Plan({ plan, onRemove, onOpen, onBuild }) {
  const exams = useMemo(() => EXAMS.filter((e) => plan.includes(e.id)), [plan])
  const items = useMemo(() => timeline(exams), [exams])
  const months = useMemo(() => {
    const m = new Map()
    for (const it of items) {
      const k = monthKey(it.date)
      if (!m.has(k)) m.set(k, [])
      m.get(k).push(it)
    }
    return [...m.entries()]
  }, [items])

  if (!exams.length) {
    return (
      <section className="container plan-empty" aria-labelledby="plan-h">
        <h1 id="plan-h" className="heading-2">Your plan is empty</h1>
        <p className="body-3">Pick your exams and every date lands here, soonest first.</p>
        <button type="button" className="btn btn-primary button-md" onClick={onBuild}>Build my exam plan</button>
      </section>
    )
  }

  const confirmed = ahead(exams)
  const first = nextConfirmed(exams)

  return (
    <div className="container plan">
      <header className="plan-head">
        <div>
          <h1 className="heading-2">Your plan</h1>
          <p className="body-3 muted num">
            {exams.length} {exams.length === 1 ? 'exam' : 'exams'}, {items.length} dates to come
            {first ? `. Next: ${first.exam.name}, ${first.label.toLowerCase()}.` : '.'}
          </p>
        </div>
        <div className="plan-tools">
          <AddToCalendar deadlines={items} label="Add all dates to my calendar" filename="admitsync-my-plan.ics" />
          <button type="button" className="btn btn-quiet button-md" onClick={onBuild}>Edit exams</button>
        </div>
      </header>
      <p className="caption-2 muted plan-note">Your calendar will remind you a week and a day before each confirmed date.</p>

      {confirmed.length > 0 && <Colonnade items={confirmed.slice(0, 4)} onOpen={onOpen} />}

      <section className="plan-timeline" aria-labelledby="tl-h">
        <h2 id="tl-h" className="heading-5">Every date, month by month</h2>
        {months.map(([k, list]) => (
          <div key={k} className="month">
            <h3 className="title-2 month-name">{monthLabel(k)}</h3>
            <ul className="month-list">
              {list.map((dl) => (
                <li key={`${dl.exam.id}-${dl.kind}-${dl.date}-${dl.label}`} className={`tl-box ${dl.sure ? '' : 'is-estimate-row'}`}>
                  <span className="tl-top">
                    <span className="title-2 num"><When dl={dl} /></span>
                    <Countdown dl={dl} />
                  </span>
                  <button type="button" className="tl-what" onClick={() => onOpen(dl.exam.id)}>
                    <span className="title-3">{dl.exam.name}</span>
                    <span className="body-6 muted">{dl.label}</span>
                  </button>
                  <span className="tl-side">
                    <AddToCalendar deadlines={[dl]} compact />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="plan-exams" aria-labelledby="pe-h">
        <h2 id="pe-h" className="heading-5">Exams in your plan</h2>
        <ul className="plan-chips">
          {exams.map((e) => (
            <li key={e.id} className="plan-chip">
              <button type="button" className="body-5 plan-chip-name" onClick={() => onOpen(e.id)}>{e.name}</button>
              <button type="button" className="icon-btn icon-btn-sm" aria-label={`Remove ${e.name} from your plan`} onClick={() => onRemove(e.id)}>
                <X size={16} weight="bold" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
