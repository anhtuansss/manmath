# TASKS

## Current MVP Status

- [x] Backend serves multiple mock exams.
- [x] Frontend fetches exam list from backend.
- [x] Frontend fetches exam detail by exam id.
- [x] Routes exist for `/`, `/exams`, `/exam/[id]`, and `/exam/[id]/result`.
- [x] Exam taking page renders questions and A/B/C/D options.
- [x] Timer works and stops at zero.
- [x] Answers are autosaved in `localStorage` and restored on reload.
- [x] Submit request works and backend returns score data.
- [x] Result page reads temporary submit result from `sessionStorage`.
- [x] Result page shows score, accuracy, and answer review.
- [x] Backend still uses mock data. No database is active yet.

## Next Technical Cleanup

- [ ] Move frontend API base URL into a small env/config helper.
- [ ] Create a small storage helper for answer autosave and result persistence.
- [ ] Standardize DTO naming between backend mock data and frontend types.
- [ ] Add lightweight backend validation for submit payloads.
- [ ] Clean up old Prisma `seedData.ts` that still uses `MathProblem`.
- [ ] Update smoke test notes after each MVP flow change.

## PostgreSQL Preparation

- [ ] Design the initial PostgreSQL/Prisma schema for exams, questions, options, and answers.
- [ ] Decide how mock exam data maps to database seed data.
- [ ] Replace backend mock data gradually after schema approval.
- [ ] Keep API response shapes stable while moving data source to PostgreSQL.

## Out of Scope For Now

- [ ] Do not add authentication.
- [ ] Do not add OCR.
- [ ] Do not add AI explanation.
- [ ] Do not add admin dashboard.
- [ ] Do not add ranking, leaderboard, payment, or subscription.
