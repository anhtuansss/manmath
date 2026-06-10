import Link from 'next/link';
import { ExamCard } from './ExamCard';
import { Logo } from './Logo';
import { TypewriterText } from './TypewriterText';
import type { ExamListItem } from './types';
import type { UserStats } from '../../lib/userStats';
import { Footer } from './Footer';
import { AuthButton } from '../auth/AuthButton';

type ExamListProps = {
  exams: ExamListItem[];
  stats?: UserStats | null;
  draftExamId?: string | null;
};

const difficultyLabels: Record<ExamListItem['difficulty'], string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

export function ExamList({ exams, stats, draftExamId }: ExamListProps) {
  const recommendedExams = exams.slice(0, 3);
  const totalQuestions = exams.reduce((sum, exam) => sum + exam.totalQuestions, 0);
  const averageDuration =
    exams.length > 0
      ? Math.round(
          exams.reduce((sum, exam) => sum + exam.durationMinutes, 0) / exams.length,
        )
      : 0;
  const hardExamCount = exams.filter((exam) => exam.difficulty === 'hard').length;
  const shortestExam = exams.reduce<ExamListItem | null>((currentShortest, exam) => {
    if (!currentShortest || exam.durationMinutes < currentShortest.durationMinutes) {
      return exam;
    }

    return currentShortest;
  }, null);

  const draftExam = draftExamId ? exams.find((e) => e.id === draftExamId) : null;

  return (
    <div className="flex min-h-[100dvh] flex-col">
    <main className="flex-1 bg-background text-text-primary pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Hero Section ── */}
        <header className="relative pb-10">
          {/* Subtle background decoration */}
          <div className="pointer-events-none absolute -top-10 right-0 -z-10 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />

          <div className="flex flex-col gap-8 pt-2 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              {/* Logo + Brand */}
              <Link href="/" aria-label="Về trang chủ" className="group flex cursor-pointer items-center gap-3 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                <Logo className="h-11 w-11 transition-transform group-hover:scale-105" />
                <div>
                  <p className="font-[family-name:var(--font-outfit)] text-lg font-bold tracking-tight text-text-primary transition-colors group-hover:text-primary">
                    ManMath
                  </p>
                  <p className="text-xs font-medium text-primary">
                    Nền tảng thi thử
                  </p>
                </div>
              </Link>

              {/* Breadcrumb + Heading */}
              <div className="mt-8">
                <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  Tuyển tập đề thi mới nhất
                </p>
                <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-outfit)] text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:leading-[1.1]">
                  <TypewriterText text="Nền tảng luyện đề Toán THPT miễn phí" />
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
                  Làm đề có đồng hồ, chấm điểm tự động, xem lại lỗi sai và theo dõi tiến bộ sau mỗi lần luyện.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:w-[380px] lg:items-end">
              <AuthButton />

              {/* Stat Cards / Streak */}
              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
                {stats && stats.currentStreak > 0 ? (
                  <div className="col-span-2 sm:col-span-3 mb-2 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-900">{stats.currentStreak} ngày liên tiếp!</p>
                        <p className="text-xs text-amber-700">Giữ vững phong độ nhé.</p>
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="rounded-lg border border-border bg-surface px-4 py-3 shadow-card">
                  <div className="flex items-center gap-2">
                    {/* Document icon */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                      <path d="M4.5 2h7a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 12.5v-9A1.5 1.5 0 0 1 4.5 2Z" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                    <p className="text-xs font-medium text-text-secondary">Số đề</p>
                  </div>
                  <p className="mt-1.5 text-xl font-semibold text-text-primary">
                    {exams.length}
                  </p>
                </div>
                <div className="rounded-lg border border-border border-l-2 border-l-accent bg-surface px-4 py-3 shadow-card">
                  <div className="flex items-center gap-2">
                    {/* List icon */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent">
                      <path d="M5 4h8M5 8h8M5 12h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <circle cx="3" cy="4" r="0.75" fill="currentColor"/>
                      <circle cx="3" cy="8" r="0.75" fill="currentColor"/>
                      <circle cx="3" cy="12" r="0.75" fill="currentColor"/>
                    </svg>
                    <p className="text-xs font-medium text-text-secondary">Tổng câu</p>
                  </div>
                  <p className="mt-1.5 text-xl font-semibold text-text-primary">
                    {totalQuestions}
                  </p>
                </div>
                <div className="col-span-2 rounded-lg border border-border border-l-2 border-l-slate-400 bg-surface px-4 py-3 shadow-card sm:col-span-1">
                  <div className="flex items-center gap-2">
                    {/* Clock icon */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate-400">
                      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="text-xs font-medium text-text-secondary">Trung bình</p>
                  </div>
                  <p className="mt-1.5 text-xl font-semibold text-text-primary">
                    {averageDuration} phút
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Main Content Grid ── */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-8">
            {draftExam && (
              <section className="animate-fade-in rounded-xl border border-warning-border bg-warning-light p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning-dark">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <h2 className="font-[family-name:var(--font-outfit)] text-lg font-bold text-warning-dark">
                      Bạn có bài làm chưa hoàn thành
                    </h2>
                  </div>
                  <p className="mt-1 text-sm font-medium text-warning-dark/80">
                    {draftExam.title}
                  </p>
                </div>
                <Link
                  href={`/exam/${draftExam.id}`}
                  className="shrink-0 inline-flex h-10 items-center justify-center rounded-lg bg-warning px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-warning/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning focus-visible:ring-offset-2"
                >
                  Tiếp tục làm bài
                </Link>
              </section>
            )}

            {/* ── Featured Exams Section ── */}
            <section>
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-text-primary">
                    Đề luyện thi đề xuất
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    Các đề đầu tiên từ kho hiện có, phù hợp để bắt đầu nhanh.
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-primary">
                  {recommendedExams.length} đề
                </span>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {recommendedExams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>
            </section>

            {/* ── Full Exam List Section ── */}
            <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-text-primary">
                    Danh sách đề thi
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    Scan nhanh số câu, thời lượng và độ khó trước khi vào đề.
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-text-secondary">
                  {exams.length} đề khả dụng
                </span>
              </div>

              <div className="divide-y divide-border">
                {exams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} variant="compact" />
                ))}
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            {/* Overview Card */}
            <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <div className="flex items-center gap-2">
                {/* Chart icon */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                  <rect x="2" y="8" width="3" height="6" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
                  <rect x="6.5" y="4" width="3" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
                  <rect x="11" y="6" width="3" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                <h2 className="font-[family-name:var(--font-outfit)] text-base font-semibold text-text-primary">
                  Tổng quan kho đề
                </h2>
              </div>
              <div className="mt-4 divide-y divide-border text-sm">
                <div className="flex items-center justify-between py-3">
                  <span className="text-text-secondary">Tổng số câu</span>
                  <span className="font-semibold text-text-primary">
                    {totalQuestions} câu
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-text-secondary">Thời lượng trung bình</span>
                  <span className="font-semibold text-text-primary">
                    {averageDuration} phút
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-text-secondary">Đề khó</span>
                  <span className="font-semibold text-text-primary">
                    {hardExamCount} đề
                  </span>
                </div>
              </div>
            </section>

            {/* Suggestion Card */}
            <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <div className="flex items-center gap-2">
                {/* Lightbulb icon */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-warning">
                  <path d="M8 1.5a4.5 4.5 0 0 0-1.5 8.74V12a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.76A4.5 4.5 0 0 0 8 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                  <path d="M6.5 14h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <h2 className="font-[family-name:var(--font-outfit)] text-base font-semibold text-text-primary">
                  Gợi ý chọn đề
                </h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                Nếu muốn kiểm tra flow nhanh, hãy bắt đầu với đề có thời lượng ngắn
                nhất trong kho hiện tại.
              </p>

              {shortestExam && (
                <div className="mt-4 rounded-lg border border-border bg-background p-3">
                  <p className="line-clamp-2 text-sm font-semibold leading-5 text-text-primary">
                    {shortestExam.title}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs font-medium text-text-secondary">
                    <span className="inline-flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-text-muted">
                        <path d="M4.5 2h7a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 12.5v-9A1.5 1.5 0 0 1 4.5 2Z" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                      {shortestExam.totalQuestions} câu
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-text-muted">
                        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {shortestExam.durationMinutes} phút
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{difficultyLabels[shortestExam.difficulty]}</span>
                  </div>
                </div>
              )}
            </section>
            
            {/* Personal Stats Section */}
            {stats && stats.examsCompleted > 0 && (
              <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M12 20v-6M6 20V10M18 20V4" />
                  </svg>
                  <h2 className="font-[family-name:var(--font-outfit)] text-base font-semibold text-text-primary">
                    Thống kê cá nhân
                  </h2>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs text-text-secondary">Đã hoàn thành</p>
                    <p className="mt-1 text-lg font-bold text-text-primary">{stats.examsCompleted} <span className="text-sm font-medium text-text-secondary">đề</span></p>
                  </div>
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs text-text-secondary">Điểm trung bình</p>
                    <p className="mt-1 text-lg font-bold text-primary">{stats.averageScore.toFixed(1)}</p>
                  </div>
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs text-text-secondary">Điểm cao nhất</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">{stats.bestScore.toFixed(1)}</p>
                  </div>
                  <div className="rounded-lg bg-background p-3">
                    <p className="text-xs text-text-secondary">Số câu đã trả lời</p>
                    <p className="mt-1 text-lg font-bold text-text-primary">{stats.totalQuestionsAnswered}</p>
                  </div>
                </div>
              </section>
            )}

          </aside>
        </div>
      </div>
    </main>
    <Footer />
    </div>
  );
}
