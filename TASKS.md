# TASKS

## Current MVP Status
- Backend can serve mock exam data.
- Frontend fetches exam data from backend.
- Timer works and stops at zero.
- Submit request works and backend returns score data.

## Next Steps
- [ ] Lock the exam after submit so answers cannot change anymore.
- [ ] Add autosave for answers in `localStorage` and restore them on reload.
- [ ] Clear autosaved data after successful submit.
- [ ] Remove the remaining direct dependency on `mockData.json`.
- [ ] Do one full end-to-end smoke test for load, answer, timer, submit, and result display.

## Notes
- Keep using TypeScript only.
- Do not add database, auth, or AI/OCR yet.
- Keep changes small and focused on MVP flow.
