import { parse } from './dates'

const pad = (n) => String(n).padStart(2, '0')
const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
const plusDay = (s) => { const d = parse(s); d.setDate(d.getDate() + 1); return d }
const esc = (t) => String(t).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

const title = (dl) => `${dl.exam.name}: ${dl.label}${dl.sure ? '' : ' (expected)'}`
const details = (dl) =>
  `${dl.exam.full}.${dl.sure ? '' : ' This date is an estimate from last year; check the official site.'}\nOfficial site: ${dl.exam.link}\nFrom AdmitSync`

/** A Google Calendar "add event" link for one all-day deadline. */
export function googleLink(dl) {
  const start = ymd(parse(dl.date))
  const end = ymd(plusDay(dl.end || dl.date))
  const p = new URLSearchParams({ action: 'TEMPLATE', text: title(dl), dates: `${start}/${end}`, details: details(dl) })
  return `https://calendar.google.com/calendar/render?${p}`
}

function vevent(dl) {
  const uid = `${dl.exam.id}-${dl.kind}-${dl.date}@admitsync`
  const lines = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${ymd(new Date())}T000000Z`,
    `DTSTART;VALUE=DATE:${ymd(parse(dl.date))}`,
    `DTEND;VALUE=DATE:${ymd(plusDay(dl.end || dl.date))}`,
    `SUMMARY:${esc(title(dl))}`,
    `DESCRIPTION:${esc(details(dl))}`,
    `URL:${dl.exam.link}`,
  ]
  if (dl.sure) {
    for (const [trigger, words] of [['-P7D', 'in a week'], ['-P1D', 'tomorrow']]) {
      lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `TRIGGER:${trigger}`, `DESCRIPTION:${esc(`${title(dl)} ${words}`)}`, 'END:VALARM')
    }
  }
  lines.push('END:VEVENT')
  return lines.join('\r\n')
}

/** An .ics file with reminders a week and a day before every confirmed deadline. */
export function icsFile(deadlines) {
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//AdmitSync//Exam deadlines//EN', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:AdmitSync deadlines', ...deadlines.map(vevent), 'END:VCALENDAR'].join('\r\n')
}

export function downloadIcs(deadlines, filename = 'admitsync-deadlines.ics') {
  const blob = new Blob([icsFile(deadlines)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
