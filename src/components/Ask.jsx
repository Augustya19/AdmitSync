import { useEffect, useRef, useState } from 'react'
import { PaperPlaneRight, ArrowClockwise } from '@phosphor-icons/react'
import { useStored } from '../lib/store'

const STARTERS = [
  'Which design entrance exams can I still apply for?',
  'What is the difference between CLAT and AILET?',
  'I want to do an MBA. Which exams close next?',
  'Which engineering exams are there besides JEE Main?',
]

/** Plain text in, readable blocks out: paragraphs and simple lists, no markdown leftovers. */
function Reply({ text }) {
  const blocks = text.replace(/\*\*/g, '').replace(/^#+\s*/gm, '').split(/\n{2,}/)
  return blocks.map((b, i) => {
    const lines = b.split('\n').filter(Boolean)
    if (lines.length && lines.every((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l))) {
      return <ul key={i}>{lines.map((l, j) => <li key={j}>{l.replace(/^\s*([-*•]|\d+[.)])\s+/, '')}</li>)}</ul>
    }
    return <p key={i}>{lines.join(' ')}</p>
  })
}

export default function Ask() {
  const [messages, setMessages] = useStored('admitsync.chat', [])
  const [input, setInput] = useState('')
  const [state, setState] = useState({ busy: false, error: '' })
  const end = useRef(null)
  const field = useRef(null)

  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }) }, [messages, state.busy])

  async function send(history) {
    setState({ busy: true, error: '' })
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.text) throw new Error(data.error || 'The assistant could not answer. Try again in a minute.')
      setMessages([...history, { role: 'model', text: data.text }])
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

  return (
    <div className="container ask">
      <header className="ask-head">
        <h1 className="heading-2">Ask about any exam</h1>
        <p className="body-3 muted">Answers use the same checked dates. Confirm close deadlines officially.</p>
      </header>

      <div className="chat" aria-live="polite">
        {messages.length === 0 && (
          <div className="starters">
            <p className="title-3">Try one of these</p>
            <ul>
              {STARTERS.map((s) => (
                <li key={s}><button type="button" className="starter body-5" onClick={() => ask(s)}>{s}</button></li>
              ))}
            </ul>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`msg msg-${m.role}`}>
            <span className="visually-hidden">{m.role === 'user' ? 'You asked:' : 'AdmitSync answered:'}</span>
            <div className="msg-body body-6"><Reply text={m.text} /></div>
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

      <form className="composer" onSubmit={(e) => { e.preventDefault(); ask(input) }}>
        <label className="visually-hidden" htmlFor="q">Your question</label>
        <textarea
          id="q"
          ref={field}
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
  )
}
