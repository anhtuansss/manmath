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
- [x] Backend serves exam list, exam detail, and submit data from PostgreSQL-backed seed data.

## Next Technical Cleanup

- [x] Move frontend API base URL into a small env/config helper.
- [x] Create a small storage helper for answer autosave and result persistence.
- [x] Standardize DTO naming between backend mock data and frontend types.
- [x] Add lightweight backend validation for submit payloads.
- [x] Legacy Prisma seed file is renamed and seed script is disabled.
- [x] Update smoke test notes after each MVP flow change.

## PostgreSQL Preparation

- [x] Design the initial PostgreSQL/Prisma schema for exams, questions, options, and answers.
- [x] Decide how mock exam data maps to database seed data.
- [x] Create a Prisma client helper and env guard for the backend.
- [x] Replace backend mock data gradually after schema approval.
- [x] Switch `GET /api/exams` and `GET /api/exams/:id` to PostgreSQL reads.
- [x] Keep API response shapes stable while moving data source to PostgreSQL.

## Next Backend Cleanup

- [x] Remove stale mock-data imports from runtime code and extract a small exam mapper from `server.ts`.
- [ ] Extract submit grading and validation helpers from `server.ts` into a dedicated backend helper.

## Out of Scope For Now

- [ ] Do not add authentication.
- [ ] Do not add OCR.
- [ ] Do not add AI explanation.
- [ ] Do not add admin dashboard.
- [ ] Do not add ranking, leaderboard, payment, or subscription.

## Smoke Test Notes

- `/` và `/exams`: mở danh sách đề, bấm vào một đề để đi tới `/exam/[id]`.
- `/exam/[id]`: tải đề, chọn đáp án, đồng hồ chạy, autosave giữ lại sau khi reload, submit chuyển sang trang kết quả.
- `/exam/[id]/result`: hiển thị điểm và phần xem lại đáp án; mở trực tiếp khi chưa submit thì thấy trạng thái rỗng.
