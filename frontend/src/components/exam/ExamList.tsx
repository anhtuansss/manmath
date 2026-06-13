import Link from 'next/link';
import { ExamCard } from './ExamCard';
import { Logo } from './Logo';
import { TypewriterText } from './TypewriterText';
import { RecommendationCard } from './RecommendationCard';
import { UserTopicStatsCard } from './UserTopicStatsCard';
import type {
  ExamDifficulty,
  ExamDurationFilter,
  ExamListItem,
  TopicFilterDto,
} from './types';
import type { UserStats } from '../../lib/userStats';
import { Footer } from './Footer';
import { AuthButton } from '../auth/AuthButton';

type ExamListProps = {
  exams: ExamListItem[];
  stats?: UserStats | null;
  draftExamId?: string | null;
  searchInput: string;
  selectedTopic: string;
  selectedSubtopic: string;
  selectedDuration: ExamDurationFilter;
  selectedDifficulty: '' | ExamDifficulty;
  topics: TopicFilterDto[];
  listError?: string | null;
  topicsError?: string | null;
  isFiltering?: boolean;
  onSearchChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onSubtopicChange: (value: string) => void;
  onDurationChange: (value: ExamDurationFilter) => void;
  onDifficultyChange: (value: '' | ExamDifficulty) => void;
  onClearFilters: () => void;
};

const difficultyLabels: Record<ExamListItem['difficulty'], string> = {
  easy: 'De',
  medium: 'Trung binh',
  hard: 'Kho',
};

export function ExamList({
  exams,
  stats,
  draftExamId,
  searchInput,
  selectedTopic,
  selectedSubtopic,
  selectedDuration,
  selectedDifficulty,
  topics,
  listError,
  topicsError,
  isFiltering = false,
  onSearchChange,
  onTopicChange,
  onSubtopicChange,
  onDurationChange,
  onDifficultyChange,
  onClearFilters,
}: ExamListProps) {
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
  const selectedTopicData = topics.find((topic) => topic.slug === selectedTopic) ?? null;
  const subtopicOptions = selectedTopicData?.subtopics ?? [];
  const hasActiveFilters =
    searchInput.trim().length > 0 ||
    selectedTopic.length > 0 ||
    selectedSubtopic.length > 0 ||
    selectedDuration !== 'all' ||
    selectedDifficulty.length > 0;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex-1 bg-background pb-16 text-text-primary">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <header className="relative pb-10">
            <div
              className="pointer-events-none absolute -top-10 right-0 -z-10 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl"
              aria-hidden="true"
            />

            <div className="flex flex-col gap-8 pt-2 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <Link
                  href="/"
                  aria-label="Ve trang chu"
                  className="group flex cursor-pointer items-center gap-3 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Logo className="h-11 w-11 transition-transform group-hover:scale-105" />
                  <div>
                    <p className="font-[family-name:var(--font-outfit)] text-lg font-bold tracking-tight text-text-primary transition-colors group-hover:text-primary">
                      ManMath
                    </p>
                    <p className="text-xs font-medium text-primary">Nen tang thi thu</p>
                  </div>
                </Link>

                <div className="mt-8">
                  <p className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                    Tuyen tap de thi moi nhat
                  </p>
                  <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-outfit)] text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:leading-[1.1]">
                    <TypewriterText text="Nen tang luyen de Toan THPT mien phi" />
                  </h1>
                  <p className="mt-4 max-w-xl text-base leading-7 text-text-secondary">
                    Lam de co dong ho, cham diem tu dong, xem lai loi sai va theo doi
                    tien bo sau moi lan luyen.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:w-[380px] lg:items-end">
                <AuthButton />

                {stats && stats.currentStreak > 0 ? (
                  <div className="flex w-full max-w-[380px] items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-900">
                          {stats.currentStreak} ngay lien tiep!
                        </p>
                        <p className="text-xs text-amber-700">Giu vung phong do nhe.</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-8">
              {draftExam && (
                <section className="animate-fade-in flex flex-col justify-between gap-4 rounded-xl border border-warning-border bg-warning-light p-5 shadow-card sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-warning-dark"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <h2 className="font-[family-name:var(--font-outfit)] text-lg font-bold text-warning-dark">
                        Ban co bai lam chua hoan thanh
                      </h2>
                    </div>
                    <p className="mt-1 text-sm font-medium text-warning-dark/80">
                      {draftExam.title}
                    </p>
                  </div>
                  <Link
                    href={`/exam/${draftExam.id}`}
                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-warning px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-warning/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning focus-visible:ring-offset-2"
                  >
                    Tiep tuc lam bai
                  </Link>
                </section>
              )}

              <section>
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-text-primary">
                      De luyen thi de xuat
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      Cac de dau tien tu kho hien co, phu hop de bat dau nhanh.
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-primary">
                    {recommendedExams.length} de
                  </span>
                </div>

                <div className="grid gap-5 lg:grid-cols-3">
                  {recommendedExams.map((exam) => (
                    <ExamCard key={exam.id} exam={exam} />
                  ))}
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
                <div className="border-b border-border px-5 py-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-text-primary">
                        Danh sach de thi
                      </h2>
                      <p className="mt-1 text-sm text-text-secondary">
                        Scan nhanh so cau, thoi luong va do kho truoc khi vao de.
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-text-secondary">
                      {exams.length} de kha dung
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(160px,0.8fr)_minmax(160px,0.8fr)_minmax(160px,0.75fr)_minmax(160px,0.75fr)_auto]">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        Tu khoa
                      </span>
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Tim theo tieu de hoac mo ta"
                        className="h-11 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        Chuyen de
                      </span>
                      <select
                        value={selectedTopic}
                        onChange={(event) => onTopicChange(event.target.value)}
                        className="h-11 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      >
                        <option value="">Tat ca chuyen de</option>
                        {topics.map((topic) => (
                          <option key={topic.id} value={topic.slug}>
                            {topic.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        Tieu chuyen de
                      </span>
                      <select
                        value={selectedSubtopic}
                        onChange={(event) => onSubtopicChange(event.target.value)}
                        disabled={!selectedTopicData}
                        className="h-11 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-primary focus:ring-2 focus:ring-primary/15"
                      >
                        <option value="">
                          {selectedTopicData
                            ? 'Tat ca tieu chuyen de'
                            : 'Chon chuyen de truoc'}
                        </option>
                        {subtopicOptions.map((subtopic) => (
                          <option key={subtopic.id} value={subtopic.slug}>
                            {subtopic.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        Thoi luong
                      </span>
                      <select
                        value={selectedDuration}
                        onChange={(event) =>
                          onDurationChange(event.target.value as ExamDurationFilter)
                        }
                        className="h-11 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      >
                        <option value="all">Tat ca thoi luong</option>
                        <option value="short">&lt;= 45 phut</option>
                        <option value="standard">46-90 phut</option>
                        <option value="long">&gt; 90 phut</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                        Do kho
                      </span>
                      <select
                        value={selectedDifficulty}
                        onChange={(event) =>
                          onDifficultyChange(event.target.value as '' | ExamDifficulty)
                        }
                        className="h-11 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      >
                        <option value="">Tat ca do kho</option>
                        <option value="easy">De</option>
                        <option value="medium">Trung binh</option>
                        <option value="hard">Kho</option>
                      </select>
                    </label>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={onClearFilters}
                        disabled={!hasActiveFilters}
                        className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-semibold text-text-primary transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
                      >
                        Xoa bo loc
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-secondary">
                  {isFiltering ? <span>Dang cap nhat danh sach de...</span> : null}
                  {listError ? <span className="text-warning-dark">{listError}</span> : null}
                  {topicsError ? <span className="text-warning-dark">{topicsError}</span> : null}
                    {hasActiveFilters && !isFiltering ? (
                      <span>Dang ap dung bo loc cho danh sach de.</span>
                    ) : null}
                  </div>
                </div>

                {exams.length === 0 ? (
                  <div className="px-5 py-10">
                    <div className="rounded-xl border border-dashed border-border bg-background px-6 py-8 text-center">
                      <h3 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-text-primary">
                        Khong tim thay de phu hop
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-text-secondary">
                        Hay thu doi tu khoa hoac xoa bot bo loc chuyen de de xem nhieu
                        de hon.
                      </p>
                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={onClearFilters}
                          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                        >
                          Xoa bo loc
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {exams.map((exam) => (
                      <ExamCard key={exam.id} exam={exam} variant="compact" />
                    ))}
                  </div>
                )}
              </section>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
              <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-primary"
                  >
                    <rect
                      x="2"
                      y="8"
                      width="3"
                      height="6"
                      rx="0.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <rect
                      x="6.5"
                      y="4"
                      width="3"
                      height="10"
                      rx="0.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <rect
                      x="11"
                      y="6"
                      width="3"
                      height="8"
                      rx="0.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                  <h2 className="font-[family-name:var(--font-outfit)] text-base font-semibold text-text-primary">
                    Tong quan kho de
                  </h2>
                </div>
                <div className="mt-4 divide-y divide-border text-sm">
                  <div className="flex items-center justify-between py-3">
                    <span className="text-text-secondary">Tong so cau</span>
                    <span className="font-semibold text-text-primary">
                      {totalQuestions} cau
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-text-secondary">Thoi luong trung binh</span>
                    <span className="font-semibold text-text-primary">
                      {averageDuration} phut
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-text-secondary">De kho</span>
                    <span className="font-semibold text-text-primary">
                      {hardExamCount} de
                    </span>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-warning"
                  >
                    <path
                      d="M8 1.5a4.5 4.5 0 0 0-1.5 8.74V12a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.76A4.5 4.5 0 0 0 8 1.5Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.5 14h3"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h2 className="font-[family-name:var(--font-outfit)] text-base font-semibold text-text-primary">
                    Goi y chon de
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  Neu muon kiem tra flow nhanh, hay bat dau voi de co thoi luong ngan
                  nhat trong kho hien tai.
                </p>

                {shortestExam && (
                  <div className="mt-4 rounded-lg border border-border bg-background p-3">
                    <p className="line-clamp-2 text-sm font-semibold leading-5 text-text-primary">
                      {shortestExam.title}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs font-medium text-text-secondary">
                      <span className="inline-flex items-center gap-1">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="text-text-muted"
                        >
                          <path
                            d="M4.5 2h7a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 12.5v-9A1.5 1.5 0 0 1 4.5 2Z"
                            stroke="currentColor"
                            strokeWidth="1.3"
                          />
                          <path
                            d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                          />
                        </svg>
                        {shortestExam.totalQuestions} cau
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="text-text-muted"
                        >
                          <circle
                            cx="8"
                            cy="8"
                            r="5.5"
                            stroke="currentColor"
                            strokeWidth="1.3"
                          />
                          <path
                            d="M8 5v3l2 1.5"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {shortestExam.durationMinutes} phut
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{difficultyLabels[shortestExam.difficulty]}</span>
                    </div>
                  </div>
                )}
              </section>

              {stats && stats.examsCompleted > 0 && (
                <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
                  <div className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M12 20v-6M6 20V10M18 20V4" />
                    </svg>
                    <h2 className="font-[family-name:var(--font-outfit)] text-base font-semibold text-text-primary">
                      Thong ke ca nhan
                    </h2>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-background p-3">
                      <p className="text-xs text-text-secondary">Da hoan thanh</p>
                      <p className="mt-1 text-lg font-bold text-text-primary">
                        {stats.examsCompleted}{' '}
                        <span className="text-sm font-medium text-text-secondary">de</span>
                      </p>
                    </div>
                    <div className="rounded-lg bg-background p-3">
                      <p className="text-xs text-text-secondary">Diem trung binh</p>
                      <p className="mt-1 text-lg font-bold text-primary">
                        {stats.averageScore.toFixed(1)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-background p-3">
                      <p className="text-xs text-text-secondary">Diem cao nhat</p>
                      <p className="mt-1 text-lg font-bold text-emerald-600">
                        {stats.bestScore.toFixed(1)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-background p-3">
                      <p className="text-xs text-text-secondary">So cau da tra loi</p>
                      <p className="mt-1 text-lg font-bold text-text-primary">
                        {stats.totalQuestionsAnswered}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              <RecommendationCard />
              <UserTopicStatsCard />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
