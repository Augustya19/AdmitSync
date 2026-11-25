import { useMemo, useState } from 'react'
import { ArrowLeft, X } from '@phosphor-icons/react'
import { EXAMS, STREAMS } from '../data/exams'
import { nextStep } from '../lib/dates'
import { Drawer, When } from './bits'

const LEVELS = [
  { id: 'ug', label: 'After Class 12', hint: 'BTech, MBBS, BDes, law, BA and BSc' },
  { id: 'pg', label: 'After graduation', hint: 'MBA, MTech, MSc, MDes, MD and MS' },
]

/** Three short questions that fill the plan: level, streams, then the exams themselves. */
export default function Onboarding({ plan, onDone, onClose }) {
  const [step, setStep] = useState(0)
  const [level, setLevel] = useState(null)
  const [streams, setStreams] = useState([])
  const [picked, setPicked] = useState(plan)

  const options = useMemo(
    () => EXAMS.filter((e) => e.level === level && streams.includes(e.stream)),
    [level, streams],
  )
  const toggle = (list, setList, id) => setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id])
  const availableStreams = STREAMS.filter((s) => EXAMS.some((e) => e.level === level && e.stream === s.id))

  return (
    <Drawer label="Build your exam plan" onClose={onClose} wide>
      <header className="sheet-head">
        <div>
          <p className="caption-1 muted num">Step {step + 1} of 3</p>
          <h2 className="heading-4">
            {step === 0 && 'What are you applying for?'}
            {step === 1 && 'Which fields?'}
            {step === 2 && 'Pick your exams'}
          </h2>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
          <X size={20} weight="bold" aria-hidden="true" />
        </button>
      </header>

      {step === 0 && (
        <div className="choice-list" role="radiogroup" aria-label="Level">
          {LEVELS.map((l) => (
            <button key={l.id} type="button" role="radio" aria-checked={level === l.id} className="choice"
              onClick={() => { setLevel(l.id); setStreams([]); setStep(1) }}>
              <span className="title-2">{l.label}</span>
              <span className="body-6 muted">{l.hint}</span>
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <>
          <p className="body-6 muted">Choose one or more.</p>
          <div className="choice-grid">
            {availableStreams.map((s) => (
              <button key={s.id} type="button" className="choice" aria-pressed={streams.includes(s.id)}
                onClick={() => toggle(streams, setStreams, s.id)}>
                <span className="title-3">{s.label}</span>
                <span className="caption-2 muted num">
                  {EXAMS.filter((e) => e.level === level && e.stream === s.id).length} exams
                </span>
              </button>
            ))}
          </div>
          <div className="sheet-actions">
            <button type="button" className="btn btn-quiet button-md" onClick={() => setStep(0)}>
              <ArrowLeft size={18} weight="bold" aria-hidden="true" /> Back
            </button>
            <button type="button" className="btn btn-primary button-md" disabled={!streams.length} onClick={() => setStep(2)}>
              Show exams
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <p className="body-6 muted">Tick the ones you are taking. You can change this any time.</p>
          <ul className="pick-list">
            {options.map((e) => {
              const n = nextStep(e)
              return (
                <li key={e.id}>
                  <label className="pick">
                    <input type="checkbox" checked={picked.includes(e.id)} onChange={() => toggle(picked, setPicked, e.id)} />
                    <span className="pick-text">
                      <span className="title-3">{e.name}</span>
                      <span className="caption-2 muted">{n ? <>{n.label}, <When dl={n} /></> : 'This cycle is over'}</span>
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
          <div className="sheet-actions">
            <button type="button" className="btn btn-quiet button-md" onClick={() => setStep(1)}>
              <ArrowLeft size={18} weight="bold" aria-hidden="true" /> Back
            </button>
            <button type="button" className="btn btn-primary button-md" disabled={!picked.length} onClick={() => onDone(picked)}>
              {picked.length ? `Save ${picked.length} ${picked.length === 1 ? 'exam' : 'exams'} to my plan` : 'Tick at least one exam'}
            </button>
          </div>
        </>
      )}
    </Drawer>
  )
}
