# ManMath

ManMath is a web app for practicing Vietnamese high school math exams.

The current goal is to finish a clean MVP before moving the data layer to PostgreSQL.

## Tech Stack

- Frontend: Next.js App Router + TypeScript + Tailwind CSS
- Backend: Express + TypeScript
- Current data source: backend mock data
- Future database: PostgreSQL + Prisma

## Current MVP Routes

- `/` - exam list page
- `/exams` - exam list page alias
- `/exam/[id]` - exam taking page
- `/exam/[id]/result` - result and answer review page

## Current MVP Features

- Backend serves multiple mock exams.
- Frontend fetches exam list and exam detail from backend.
- Exam taking page renders questions and A/B/C/D answer choices.
- Sidebar question navigator supports click-to-scroll.
- Timer runs and disables answer/submit flow when time is up.
- Answers are autosaved in `localStorage` and restored on reload.
- Submit calls backend scoring API.
- Result page reads temporary result data from `sessionStorage`.
- Result page shows score, correct count, accuracy, and answer review.
- Retake flow clears the exam autosave/result storage for that exam.

## Backend API

- `GET /api/health`
- `GET /api/exams`
- `GET /api/exams/:id`
- `POST /api/exam/submit`

## How to Run

Run backend:

```bash
cd backend
npm install
npm run dev
```

Run frontend:

```bash
cd frontend
npm install
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## MVP Smoke Test

1. Open `http://localhost:3000/`.
2. Confirm the exam list loads from the backend.
3. Open an exam, for example `/exam/thpt-mock-01`.
4. Select answers for a few questions.
5. Reload the page and confirm selected answers are restored.
6. Confirm the timer is running.
7. Submit the exam.
8. Confirm the app redirects to `/exam/thpt-mock-01/result`.
9. Confirm score, correct count, accuracy, and answer review are visible.
10. Click retake and confirm the exam opens again with cleared saved answers.

## Not in Current MVP

- Authentication
- Admin dashboard
- OCR
- AI explanation
- Ranking or leaderboard
- Payment or subscription
