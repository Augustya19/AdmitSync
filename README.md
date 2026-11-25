# AdmitSync

Every Indian entrance exam deadline in one plan. 43 exams across engineering, medical, management, law, design and science, with dates checked against official notices, a personal plan, calendar reminders and an exam advisor.

Live: https://admitsync.vercel.app

## What it does

- **Explore**: the next deadlines as a row of arches, and a filterable table of all 43 exams.
- **My plan**: pick your exams in three steps; see every date month by month; add them all to your calendar with reminders a week and a day before.
- **Exam panel**: the full timeline for one exam, each date marked confirmed or expected, with Google Calendar and .ics buttons.
- **Ask**: a Gemini-powered advisor that answers from the same checked dates.

Confirmed dates come from the exam body's notice. Dates the body has not announced are marked **expected** and placed where they fell last cycle; they are never counted down to the day.

## Run it

```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY to use Ask locally
npm run dev
```

## Deploy (Vercel)

1. In Vercel → Project → Settings → Environment Variables, add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`, default `gemini-2.5-flash`).
2. Remove any old `VITE_GEMINI_API_KEY` / `VITE_HF_API_KEY` variables, and rotate the Gemini key that used them: it was shipped to browsers.
3. Push. `api/chat.js` deploys as a serverless function; the key never reaches the browser.

## Keeping dates current

All data lives in `src/data/exams.js`. Each deadline is `sure: true` (announced) or an estimate with `approx: 'month' | 'week'`. When you re-check, update the dates and `VERIFIED_ON`. Expect to revisit: NEET UG, CUET UG, BITSAT, JEE Main session 2 and the state CETs announce between December and March.

## Stack

React 19, Vite, plain CSS with design tokens (`src/styles/tokens.css`), Manrope, Phosphor icons, a Vercel function for Gemini.
