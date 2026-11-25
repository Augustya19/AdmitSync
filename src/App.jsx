import { useCallback, useEffect, useState } from 'react'
import { EXAMS, VERIFIED_ON } from './data/exams'
import { fmt } from './lib/dates'
import { go, useRoute, useStored } from './lib/store'
import Home from './components/Home'
import Plan from './components/Plan'
import Ask from './components/Ask'
import ExamSheet from './components/ExamSheet'
import Onboarding from './components/Onboarding'
// Inlined so the logo paints with the page instead of waiting on a separate request.
import wordmarkSvg from './assets/wordmark.svg?raw'
import monogramSvg from './assets/monogram.svg?raw'

const asDataUrl = (svg) => `data:image/svg+xml,${encodeURIComponent(svg)}`
const wordmark = asDataUrl(wordmarkSvg)
const monogram = asDataUrl(monogramSvg)

const byId = Object.fromEntries(EXAMS.map((e) => [e.id, e]))

function Nav({ route, count }) {
  const links = [
    ['/', 'Explore'],
    ['/plan', 'My plan'],
    ['/ask', 'Ask'],
  ]
  const current = route
  return (
    <header className="nav-wrap">
      <nav className="nav" aria-label="Main">
        <a href="#/" className="wordmark" aria-label="AdmitSync, all exams">
          <img src={wordmark} alt="" className="wordmark-full" width="128" height="24" />
          <img src={monogram} alt="" className="wordmark-mono" width="36" height="28" />
        </a>
        <ul className="nav-links">
          {links.map(([href, label]) => (
            <li key={href}>
              <a href={`#${href}`} className="nav-link title-4" aria-current={current === href ? 'page' : undefined}>
                {label}
                {href === '/plan' && count > 0 && <span className="nav-count caption-3 num" aria-label={`${count} exams`}>{count}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

function Legal({ kind }) {
  return (
    <article className="container legal">
      {kind === 'privacy' ? (
        <>
          <h1 className="heading-3">Privacy</h1>
          <p className="body-3">AdmitSync has no accounts and stores nothing about you on a server.</p>
          <h2 className="heading-6">What stays on your device</h2>
          <p className="body-3">The exams in your plan and your chat history are saved in your browser’s local storage. Clearing your browser data removes them.</p>
          <h2 className="heading-6">What leaves your device</h2>
          <p className="body-3">When you ask the assistant a question, the text of your recent messages is sent through our server to Google’s Gemini API to write the answer. Do not type personal details such as your roll number or phone number into it. Google’s Gemini API terms cover how Google handles that text.</p>
          <p className="body-3">Hosting by Vercel records standard request logs, such as IP address and time, to run and protect the site.</p>
          <h2 className="heading-6">Calendar files</h2>
          <p className="body-3">Calendar files are made in your browser. Adding a date to Google Calendar opens Google with the date filled in; nothing is sent until you save it there.</p>
        </>
      ) : (
        <>
          <h1 className="heading-3">Terms</h1>
          <p className="body-3">AdmitSync is a free planning aid. Exam bodies change dates, extend deadlines and correct notices; we check dates regularly, but the official site is always the final word.</p>
          <p className="body-3">Dates marked expected are estimates from the previous cycle and may be wrong. Answers from the assistant are generated automatically and may contain mistakes.</p>
          <p className="body-3">Before you pay a fee, book travel or skip an application, confirm the date on the exam’s official site. AdmitSync is not responsible for decisions made on its information.</p>
          <p className="body-3">Last checked: {fmt(VERIFIED_ON)}.</p>
        </>
      )}
      <p className="body-3"><a href="#/">Back to all exams</a></p>
    </article>
  )
}

function NotFound() {
  return (
    <section className="container notfound">
      <svg width="120" height="140" viewBox="0 0 18 20" aria-hidden="true"><path d="M1 19V9a8 8 0 0 1 16 0v10z" fill="none" stroke="var(--color-blue)" strokeWidth="0.6" /></svg>
      <h1 className="heading-3">This door leads nowhere</h1>
      <p className="body-3 muted">The page you asked for does not exist. The exams are all still here.</p>
      <a className="btn btn-primary button-md" href="#/">Go to all exams</a>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="body-6">AdmitSync is a planning aid. The exam’s official site has the final word.</p>
        <ul className="footer-links body-6">
          <li><a href="#/privacy">Privacy</a></li>
          <li><a href="#/terms">Terms</a></li>
          <li><a href="https://github.com/Augustya19/AdmitSync/issues" target="_blank" rel="noreferrer">Report a wrong date</a></li>
        </ul>
      </div>
    </footer>
  )
}

export default function App() {
  const route = useRoute()
  const [plan, setPlan] = useStored('admitsync.plan', [])
  const [onboarding, setOnboarding] = useState(false)
  const [toast, setToast] = useState(null)

  const examId = route.startsWith('/exam/') ? route.slice(6) : null
  const exam = examId ? byId[examId] : null
  // The page under the exam panel: whatever route was open before it.
  const [backTo, setBackTo] = useState('/')
  if (!examId && backTo !== route) setBackTo(route)

  // Each route starts at the top, except when the exam panel opens over the page.
  useEffect(() => { if (!examId) window.scrollTo(0, 0) }, [route, examId])
  useEffect(() => {
    const base = route.startsWith('/exam/') ? exam?.name : { '/': 'All exams', '/plan': 'My plan', '/ask': 'Ask', '/privacy': 'Privacy', '/terms': 'Terms' }[route]
    document.title = base ? `${base} | AdmitSync` : 'Page not found | AdmitSync'
  }, [route, exam])
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 6000); return () => clearTimeout(t) }, [toast])

  const toggle = useCallback((id) => {
    if (plan.includes(id)) {
      setPlan(plan.filter((x) => x !== id))
      setToast({ text: `${byId[id].name} removed from your plan.`, undo: () => setPlan((q) => (q.includes(id) ? q : [...q, id])) })
    } else {
      setPlan([...plan, id])
      setToast({ text: `${byId[id].name} added to your plan.` })
    }
  }, [plan, setPlan])

  const open = useCallback((id) => go(`/exam/${id}`), [])
  const close = useCallback(() => go(backTo), [backTo])
  const build = useCallback(() => setOnboarding(true), [])

  const page = examId ? backTo : route
  let body
  if (page === '/') body = <Home plan={plan} onToggle={toggle} onOpen={open} onBuild={build} />
  else if (page === '/plan') body = <Plan plan={plan} onRemove={toggle} onOpen={open} onBuild={build} />
  else if (page === '/ask') body = <Ask plan={plan} onToggle={toggle} onOpen={open} />
  else if (page === '/privacy' || page === '/terms') body = <Legal kind={page.slice(1)} />
  else body = <NotFound />

  return (
    <>
      <a className="skip body-5" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>Skip to content</a>
      <Nav route={examId ? backTo : route} count={plan.length} />
      <main id="main" tabIndex={-1}>{examId && !exam ? <NotFound /> : body}</main>
      <Footer />

      {exam && <ExamSheet exam={exam} inPlan={plan.includes(exam.id)} onToggle={toggle} onClose={close} />}
      {onboarding && (
        <Onboarding
          plan={plan}
          onClose={() => setOnboarding(false)}
          onDone={(ids) => { setPlan(ids); setOnboarding(false); setToast({ text: `Saved ${ids.length} ${ids.length === 1 ? 'exam' : 'exams'} to your plan.` }); go('/plan') }}
        />
      )}
      <div className="toast-zone" role="status" aria-live="polite">
        {toast && (
          <div className="toast body-5">
            <span>{toast.text}</span>
            {toast.undo && <button type="button" className="toast-undo button-sm" onClick={() => { toast.undo(); setToast(null) }}>Undo</button>}
          </div>
        )}
      </div>
    </>
  )
}
