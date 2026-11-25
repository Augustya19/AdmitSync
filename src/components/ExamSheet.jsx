import { ArrowSquareOut, Check, Plus, X } from '@phosphor-icons/react'
import { STREAMS } from '../data/exams'
import { applyStatus, isPast } from '../lib/dates'
import { AddToCalendar, Countdown, Drawer, When } from './bits'

const streamLabel = Object.fromEntries(STREAMS.map((s) => [s.id, s.label]))

export default function ExamSheet({ exam, inPlan, onToggle, onClose }) {
  const status = applyStatus(exam)
  const hasEstimates = exam.deadlines.some((d) => !d.sure && !isPast(d))
  return (
    <Drawer label={exam.full} onClose={onClose}>
      <header className="sheet-head">
        <div>
          <p className="caption-1 muted">{streamLabel[exam.stream]}, {exam.level === 'ug' ? 'after Class 12' : 'after graduation'}</p>
          <h2 className="heading-4">{exam.name}</h2>
          <p className="body-6 muted">{exam.full}, run by {exam.body}</p>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
          <X size={20} weight="bold" aria-hidden="true" />
        </button>
      </header>

      <p className="body-3 sheet-about">{exam.about}</p>

      <div className="sheet-actions">
        <button type="button" className={`btn ${inPlan ? 'btn-secondary' : 'btn-primary'} button-md`} aria-pressed={inPlan} onClick={() => onToggle(exam.id)}>
          {inPlan ? <Check size={18} weight="bold" aria-hidden="true" /> : <Plus size={18} weight="bold" aria-hidden="true" />}
          {inPlan ? 'In your plan' : 'Add to my plan'}
        </button>
        <a className="btn btn-quiet button-md" href={exam.link} target="_blank" rel="noreferrer">
          Official site <ArrowSquareOut size={18} aria-hidden="true" />
        </a>
      </div>

      <p className={`body-5 status status-${status.id}`}>{status.label}</p>

      <ol className="dates">
        {exam.deadlines.map((dl) => {
          const done = isPast(dl)
          const withExam = { ...dl, exam }
          return (
            <li key={`${dl.kind}-${dl.date}-${dl.label}`} className={`date-row ${done ? 'is-done' : ''}`}>
              <div className="date-main">
                <span className="title-3">{dl.label}</span>
                <span className="body-6"><When dl={dl} /></span>
                {dl.note && <span className="caption-2 muted">{dl.note}</span>}
              </div>
              <div className="date-side">
                {done ? <span className="caption-4 muted">done</span> : <Countdown dl={dl} />}
                {!done && <AddToCalendar deadlines={[withExam]} compact />}
              </div>
            </li>
          )
        })}
      </ol>

      {hasEstimates && (
        <p className="caption-2 muted sheet-foot">Expected dates are not announced yet; they follow last year’s pattern.</p>
      )}
    </Drawer>
  )
}
