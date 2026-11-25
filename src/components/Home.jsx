import { useMemo, useState } from 'react'
import { CaretDown } from '@phosphor-icons/react'
import { EXAMS, VERIFIED_ON } from '../data/exams'
import { ahead, fmt } from '../lib/dates'
import Colonnade from './Colonnade'
import ExamTable from './ExamTable'
import { AddToCalendar, When } from './bits'

const FAQ = [
  ['Can I sit CLAT and AILET?', 'Yes. They are separate exams with separate forms. AILET is the only way into NLU Delhi, which does not take CLAT scores. This cycle CLAT is on 6 Dec and AILET on 13 Dec, so you can sit both.'],
  ['Is JEE Main enough for IIT?', 'No. JEE Main gets you into NITs, IIITs and other central institutes. The IITs admit through JEE Advanced, which only the top 2.5 lakh JEE Main candidates can take. JEE Advanced 2027 is on 23 May.'],
  ['What does expected mean?', 'The exam body has not announced them yet. We place them where they fell last year so you can plan around them. When the notice comes out, the date is confirmed here.'],
  ['Where are dates from?', 'From the notice published by whoever runs the exam: NTA, the IITs, the NLU consortium, the IIMs and others. Each exam links to its official site so you can check.'],
  ['Will I get reminders?', 'Add a date to Google Calendar, or download one file with your whole plan for Apple Calendar or Outlook. Your calendar then alerts you a week before and a day before.'],
  ['Is my plan saved?', 'Yes, on this device and browser. There is no account yet, so it does not follow you to your phone.'],
  ['A date looks wrong?', 'Tell us on GitHub with the exam name and a link to the official notice, and we will fix it.'],
]

export default function Home({ plan, onToggle, onOpen, onBuild }) {
  const next = useMemo(() => ahead(EXAMS), [])
  const example = next[0]
  const [open, setOpen] = useState(0)

  return (
    <>
      <section className="hero container" aria-labelledby="hero-h">
        <div className="hero-copy">
          <h1 id="hero-h" className="heading-1 hero-title">Track every entrance exam deadline</h1>
          <p className="body-3 hero-sub">
            JEE, NEET, CUET, CAT, CLAT, NID and {EXAMS.length - 6} more. Pick your exams and get reminded before each date.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary button-md" onClick={onBuild}>Build my exam plan</button>
            <a className="btn btn-quiet button-md" href="#exams">Browse exams <CaretDown size={18} weight="bold" aria-hidden="true" /></a>
          </div>
        </div>
        <Colonnade items={next.slice(0, 5)} onOpen={onOpen} caption={`Next deadlines across all exams. Dates checked against official notices on ${fmt(VERIFIED_ON)}.`} />
      </section>

      <section id="exams" className="container section" aria-labelledby="exams-h">
        <div className="section-head">
          <h2 id="exams-h" className="heading-2">All exams</h2>
          <p className="body-3 muted">Open an exam for its full timeline. Add the ones you are taking.</p>
        </div>
        <ExamTable plan={plan} onToggle={onToggle} onOpen={onOpen} />
      </section>

      {example && (
        <section className="container section reminders" aria-labelledby="rem-h">
          <div className="section-head">
            <h2 id="rem-h" className="heading-2">A reminder before every deadline</h2>
            <p className="body-3 muted">Send a date to Google Calendar, or download your whole plan for Apple Calendar or Outlook. Alerts arrive a week and a day before.</p>
          </div>
          <div className="reminder-demo">
            <div className="reminder-row">
              <div>
                <p className="title-2">{example.exam.name}: {example.label}</p>
                <p className="body-6 muted"><When dl={example} /></p>
              </div>
              <AddToCalendar deadlines={[example]} />
            </div>
          </div>
        </section>
      )}

      <section className="container section faq" aria-labelledby="faq-h">
        <h2 id="faq-h" className="heading-2">What students ask</h2>
        <div className="faq-list">
          {FAQ.map(([q, a], i) => (
            <div key={q} className="faq-item">
              <h3 className="title-3">
                <button type="button" className="faq-q" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
                  {q}
                  <CaretDown size={20} weight="bold" aria-hidden="true" className="faq-caret" />
                </button>
              </h3>
              <div id={`faq-${i}`} className="faq-a body-3" hidden={open !== i}>
                <p>
                  {a}
                  {i === FAQ.length - 1 && <> <a href="https://github.com/Augustya19/AdmitSync/issues" target="_blank" rel="noreferrer">Open an issue on GitHub</a>.</>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
