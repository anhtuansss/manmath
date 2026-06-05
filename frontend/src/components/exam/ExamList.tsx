import { ExamCard } from './ExamCard';
import type { ExamListItem } from './types';

type ExamListProps = {
  exams: ExamListItem[];
};

export function ExamList({ exams }: ExamListProps) {
  const recommendedExams = exams.slice(0, 2);
  const totalQuestions = exams.reduce((sum, exam) => sum + exam.totalQuestions, 0);
  const averageDuration =
    exams.length > 0
      ? Math.round(
          exams.reduce((sum, exam) => sum + exam.durationMinutes, 0) / exams.length,
        )
      : 0;
  const hardExamCount = exams.filter((exam) => exam.difficulty === 'hard').length;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 text-slate-950 sm:px-6 sm:py-8">
      <header className="mb-8 border-b border-slate-200 pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">ManMath</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
              Chọn đề luyện thi
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Luyện đề Toán THPT với giao diện tập trung, rõ thời lượng và số câu trước
              khi bắt đầu.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <span className="font-semibold text-slate-950">{exams.length}</span> đề
            khả dụng
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Gợi ý hôm nay
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Bắt đầu nhanh với các đề phù hợp cho flow MVP hiện tại.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {recommendedExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Thư viện đề
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Chọn một đề để vào màn làm bài.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {exams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} variant="compact" />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Tổng quan thư viện
            </h2>
            <div className="mt-4 divide-y divide-slate-200 text-sm">
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-500">Tổng số câu</span>
                <span className="font-semibold text-slate-950">
                  {totalQuestions} câu
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-500">Thời lượng trung bình</span>
                <span className="font-semibold text-slate-950">
                  {averageDuration} phút
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-slate-500">Đề khó</span>
                <span className="font-semibold text-slate-950">
                  {hardExamCount} đề
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-blue-200 bg-blue-50 p-5">
            <h2 className="text-lg font-semibold text-slate-950">
              Gợi ý luyện tập
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Nếu mới kiểm tra flow, hãy chọn đề ngắn trước. Khi đã quen thao tác,
              chuyển sang đề dài hơn để luyện nhịp làm bài và quản lý thời gian.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}
