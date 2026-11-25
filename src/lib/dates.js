const DAY = 86400000

export const parse = (s) => new Date(s + 'T00:00:00')
export function today() { const t = new Date(); t.setHours(0, 0, 0, 0); return t }
export const daysUntil = (s, now = today()) => Math.round((parse(s) - now) / DAY)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function fmt(s, { year = true } = {}) {
  const d = parse(s)
  return `${d.getDate()} ${MONTHS[d.getMonth()]}${year ? ' ' + d.getFullYear() : ''}`
}
export const monthKey = (s) => s.slice(0, 7)
export function monthLabel(key) { const [y, m] = key.split('-'); return `${LONG[+m - 1]} ${y}` }

/** How a deadline's date should read: exact, a range, or an estimate. */
export function when(dl) {
  const d = parse(dl.date)
  if (!dl.sure) {
    if (dl.approx === 'week') return `Around ${fmt(dl.date)}`
    return `${LONG[d.getMonth()]} ${d.getFullYear()}`
  }
  if (dl.end) {
    const e = parse(dl.end)
    if (d.getMonth() === e.getMonth()) return `${d.getDate()} to ${e.getDate()} ${MONTHS[e.getMonth()]} ${e.getFullYear()}`
    return `${fmt(dl.date, { year: false })} to ${fmt(dl.end)}`
  }
  return fmt(dl.date)
}

/** The last day a deadline still matters (the end of a window, or the day itself). */
export const lastDay = (dl) => dl.end || dl.date
export const isPast = (dl, now = today()) => daysUntil(lastDay(dl), now) < 0

export function countdown(dl, now = today()) {
  if (!dl.sure) return dl.approx === 'week' ? 'estimate' : 'expected'
  const start = daysUntil(dl.date, now)
  if (dl.end && start <= 0 && daysUntil(dl.end, now) >= 0) return 'on now'
  const n = start
  if (n < 0) return 'done'
  if (n === 0) return 'today'
  if (n === 1) return 'tomorrow'
  return `${n} days`
}

/** urgent ≤ 7 days, soon ≤ 30, later, past, or estimate. */
export function urgency(dl, now = today()) {
  if (isPast(dl, now)) return 'past'
  if (!dl.sure) return 'estimate'
  const n = daysUntil(dl.date, now)
  if (n <= 7) return 'urgent'
  if (n <= 30) return 'soon'
  return 'later'
}

export const upcoming = (exam, now = today()) => exam.deadlines.filter((dl) => !isPast(dl, now))
export const nextStep = (exam, now = today()) => upcoming(exam, now)[0] || null

/** Applications open, closing, closed, or not open yet — read from the deadlines. */
export function applyStatus(exam, now = today()) {
  const close = exam.deadlines.find((dl) => dl.kind === 'close' && dl.sure && !isPast(dl, now))
  const open = exam.deadlines.find((dl) => dl.kind === 'apply')
  if (close) {
    const openedAlready = !open || daysUntil(open.date, now) <= 0
    if (openedAlready) return { id: 'open', label: `Applications open until ${fmt(close.date, { year: false })}` }
  }
  if (open && !isPast(open, now)) return { id: 'soon', label: open.sure ? `Applications open ${fmt(open.date)}` : `Applications expected ${when(open).replace('Around ', 'around ')}` }
  const anyClose = exam.deadlines.find((dl) => dl.kind === 'close')
  if (anyClose && isPast(anyClose, now)) return { id: 'closed', label: 'Applications closed' }
  return { id: 'none', label: 'Application dates not out yet' }
}

/** Every upcoming deadline across a set of exams, soonest first. */
export function timeline(exams, now = today(), { includePast = false } = {}) {
  return exams
    .flatMap((e) => e.deadlines.map((dl) => ({ ...dl, exam: e })))
    .filter((x) => includePast || !isPast(x, now))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/** Confirmed dates still ahead (windows already under way are left out): the doors still to close. */
export const ahead = (exams, now = today()) => timeline(exams, now).filter((x) => x.sure && daysUntil(x.date, now) >= 0)

/** The soonest confirmed deadline across exams, for the countdown. */
export function nextConfirmed(exams, now = today()) {
  return timeline(exams, now).find((x) => x.sure && daysUntil(x.date, now) >= 0) || null
}
