import { useEffect, useRef, useState } from 'react'
import { PaperPlaneRight, ArrowClockwise, Plus, Check, ArrowRight } from '@phosphor-icons/react'
import { EXAMS } from '../data/exams'
import { nextStep } from '../lib/dates'
import { useStored } from '../lib/store'
import { Countdown, When } from './bits'

const byId = Object.fromEntries(EXAMS.map((e) => [e.id, e]))

const STARTERS = [
  'Which design exams can I still apply for?',
  'I want to do an MBA. Which exams should I take?',
  'CLAT or AILET: what is the difference?',
  'Which engineering exams are there besides JEE?',
]

/** One exam, as a card inside an answer: next date, add to plan, open details. */
function ExamChip({ exam, inPlan, onToggle, onOpen }) {
  const next = nextStep(exam)
  return (
    <div className={`chat-exam ${inPlan ? 'is-in-plan' : ''}`}>
      <button type="button" className="chat-exam-main" onClick={() => onOpen(exam.id)}>
        <span className="title-3">{exam.name}</span>
        <span className="caption-2 muted">{next ? <>{next.label}, <When dl={next} /></> : 'This cycle is over'}</span>
        {next && <Countdown dl={next} />}
      </button>
      <div className="chat-exam-actions">
        <button type="button" className={`save ${inPlan ? 'is-saved' : ''} button-sm`} aria-pressed={inPlan}
          aria-label={inPlan ? `Remove ${exam.name} from your plan` : `Add ${exam.name} to your plan`} onClick={() => onToggle(exam.id)}>
          {inPlan ? <Check size={16} weight="bold" aria-hidden="true" /> : <Plus size={16} weight="bold" aria-hidden="true" />}
          <span>{inPlan ? 'In plan' : 'Add'}</span>
        </button>
        <button type="button" className="cal-link button-sm" onClick={() => onOpen(exam.id)}>
          Details<span className="visually-hidden">: {exam.name}</span> <ArrowRight size={14} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/** A structured answer: one-line lead, short points, exam cards, one tip. */
function Answer({ answer, plan, onToggle, onOpen }) {
  return (
    <div className="answer">
      {answer.lead && <p className="title-2 answer-lead">{answer.lead}</p>}
      {answer.points.length > 0 && (
        <ul className="answer-points">
          {answer.points.map((p, i) => {
            const exam = p.examId && byId[p.examId]
            const rest = exam ? p.text.replace(new RegExp(`^${exam.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}( \\d{4})?[:,]?\\s*`, 'i'), '') : p.text
            return (
              <li key={i} className="body-3">
                {exam ? <><button type="button" className="point-exam" onClick={() => onOpen(exam.id)}>{exam.name}</button> {rest}</> : p.text}
              </li>
            )
          })}
        </ul>
      )}
      {answer.exams.length > 0 && (
        <div className="chat-exams">
          {answer.exams.map((id) => byId[id] && (
            <ExamChip key={id} exam={byId[id]} inPlan={plan.includes(id)} onToggle={onToggle} onOpen={onOpen} />
          ))}
        </div>
      )}
      {answer.tip && <p className="caption-2 answer-tip">{answer.tip}</p>}
    </div>
  )
}

/** Older saved chats were plain text: show them as short lines. */
function PlainReply({ text }) {
  return <div className="answer">{text.split(/\n+/).filter(Boolean).map((l, i) => <p key={i} className="body-3">{l.replace(/^[-*•]\s+/, '')}</p>)}</div>
}

export default function Ask({ plan, onToggle, onOpen }) {
  const [messages, setMessages] = useStored('admitsync.chat', [])
  const [input, setInput] = useState('')
  const [state, setState] = useState({ busy: false, error: '' })
  const end = useRef(null)

  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) }, [messages, state.busy])

  async function send(history) {
    setState({ busy: true, error: '' })
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history.map(({ role, text }) => ({ role, text })) }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.answer) throw new Error(data.error || 'The assistant could not answer. Try again in a minute.')
      setMessages([...history, { role: 'model', text: data.text, answer: data.answer }])
      setState({ busy: false, error: '' })
    } catch (e) {
      setState({ busy: false, error: e.message === 'Failed to fetch' ? 'No connection to the assistant. Check your internet and try again.' : e.message })
    }
  }

  function ask(text) {
    const q = text.trim()
    if (!q || state.busy) return
    const history = [...messages, { role: 'user', text: q.slice(0, 600) }]
    setMessages(history)
    setInput('')
    send(history)
  }

  const last = messages.at(-1)
  const lastAnswer = [...messages].reverse().find((m) => m.role === 'model' && m.answer)
  const suggestions = lastAnswer?.answer.followups?.length ? lastAnswer.answer.followups : STARTERS

  return (
    <div className="container ask">
      <header className="ask-head">
        <h1 className="heading-2">Ask about any exam</h1>
        <p className="body-3 muted">Answers use the same checked dates. Confirm close deadlines officially.</p>
      </header>

      <div className="chat" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`msg msg-${m.role}`}>
            <span className="visually-hidden">{m.role === 'user' ? 'You asked:' : 'AdmitSync answered:'}</span>
            {m.role === 'user'
              ? <div className="msg-body body-3">{m.text}</div>
              : <div className="msg-body">{m.answer ? <Answer answer={m.answer} plan={plan} onToggle={onToggle} onOpen={onOpen} /> : <PlainReply text={m.text} />}</div>}
          </div>
        ))}

        {state.busy && (
          <div className="msg msg-model" aria-label="Writing an answer">
            <div className="msg-body skeleton-lines"><span /><span /><span /></div>
          </div>
        )}

        {state.error && (
          <div className="chat-error" role="alert">
            <p className="body-5">{state.error}</p>
            {last?.role === 'user' && (
              <button type="button" className="btn btn-secondary button-sm" onClick={() => send(messages)}>
                <ArrowClockwise size={16} weight="bold" aria-hidden="true" /> Try again
              </button>
            )}
          </div>
        )}
        <div ref={end} />
      </div>

      <div className="composer-wrap">
        {!state.busy && (
          <div className="suggestions" role="group" aria-label={lastAnswer ? 'Ask next' : 'Try one of these'}>
            {suggestions.map((s) => (
              <button key={s} type="button" className="suggestion button-sm" onClick={() => ask(s)}>{s}</button>
            ))}
          </div>
        )}
        <form className="composer" onSubmit={(e) => { e.preventDefault(); ask(input) }}>
          <label className="visually-hidden" htmlFor="q">Your question</label>
          <textarea
            id="q"
            className="body-3"
            rows={2}
            maxLength={600}
            placeholder="Ask about dates, eligibility or which exams fit you"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(input) } }}
          />
          <div className="composer-row">
            {messages.length > 0
              ? <button type="button" className="btn btn-quiet button-sm" onClick={() => { setMessages([]); setState({ busy: false, error: '' }) }}>Clear chat</button>
              : <span className="caption-2 muted">Shift and Enter for a new line</span>}
            <button type="submit" className="btn btn-primary button-md" disabled={!input.trim() || state.busy}>
              Ask <PaperPlaneRight size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
