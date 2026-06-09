import { ExamCard } from './ExamCard';
import type { ExamListItem } from './types';

type ExamListProps = {
  exams: ExamListItem[];
};

const difficultyLabels: Record<ExamListItem['difficulty'], string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

export function ExamList({ exams }: ExamListProps) {
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

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 pb-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white shadow-sm ring-1 ring-primary/20">
                  M
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">ManMath</p>
                  <p className="text-xs font-medium text-slate-500">
                    Luyện đề Toán THPT
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1 text-sm font-medium text-primary">
                  <span>Trang chủ</span>
                  <span className="mx-2 text-blue-300">·</span>
                  <span>Chọn đề thi</span>
                </div>
                <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                  Nền tảng luyện đề Toán THPT miễn phí
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-7 text-slate-600 sm:text-xl sm:leading-8">
                  Làm đề có đồng hồ, chấm điểm tự động, xem lại lỗi sai và theo dõi tiến bộ sau mỗi lần luyện.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:w-[400px]">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Số đề</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {exams.length}
                </p>
              </div>
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <p className="text-sm font-medium text-slate-500">Tổng câu</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {totalQuestions}
                </p>
              </div>
              <div className="col-span-2 flex flex-col rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:col-span-1">
                <p className="text-sm font-medium text-slate-500">Trung bình</p>
                <p className="mt-2 flex items-baseline gap-1 text-3xl font-bold text-slate-900">
                  {averageDuration}
                  <span className="text-sm font-medium text-slate-500">phút</span>
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-10">
            <section>
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Đề luyện thi đề xuất
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Các đề đầu tiên từ kho hiện có, phù hợp để bắt đầu nhanh.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedExams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Danh sách đề thi
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Scan nhanh số câu, thời lượng và độ khó trước khi vào đề.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                  {exams.length} đề khả dụng
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {exams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} variant="compact" />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">
                Tổng quan kho đề
              </h2>
              <div className="mt-5 divide-y divide-slate-100 text-sm">
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-500">Tổng số câu</span>
                  <span className="font-semibold text-slate-900">
                    {totalQuestions} câu
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-500">Thời lượng trung bình</span>
                  <span className="font-semibold text-slate-900">
                    {averageDuration} phút
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-slate-500">Đề khó</span>
                  <span className="font-semibold text-slate-900">
                    {hardExamCount} đề
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">
                Gợi ý chọn đề
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Nếu muốn kiểm tra flow nhanh, hãy bắt đầu với đề có thời lượng ngắn
                nhất trong kho hiện tại.
              </p>

              {shortestExam && (
                <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/50">
                  <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
                    {shortestExam.title}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      {shortestExam.totalQuestions} câu
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {shortestExam.durationMinutes} phút
                    </span>
                  </div>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
