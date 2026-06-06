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
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <header className="border-b border-[#E2E8F0] pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3882F6] text-lg font-bold text-white shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
                  M
                </div>
                <div>
                  <p className="text-base font-semibold text-[#0F172A]">ManMath</p>
                  <p className="text-xs font-medium text-[#64748B]">
                    Luyện đề Toán THPT
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <p className="text-sm font-semibold text-[#3882F6]">
                  Trang chủ · Chọn đề thi
                </p>
                <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
                  Chọn đề để chinh phục hôm nay
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748B]">
                  Luyện tập với giao diện tập trung, thông tin đề rõ ràng và nhịp
                  làm bài gần với một phiên thi thật.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[360px]">
              <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3">
                <p className="text-xs font-medium text-[#64748B]">Số đề</p>
                <p className="mt-1 text-xl font-semibold text-[#0F172A]">
                  {exams.length}
                </p>
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3">
                <p className="text-xs font-medium text-[#64748B]">Tổng câu</p>
                <p className="mt-1 text-xl font-semibold text-[#0F172A]">
                  {totalQuestions}
                </p>
              </div>
              <div className="col-span-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 sm:col-span-1">
                <p className="text-xs font-medium text-[#64748B]">Trung bình</p>
                <p className="mt-1 text-xl font-semibold text-[#0F172A]">
                  {averageDuration} phút
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-7">
            <section>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F172A]">
                    Đề luyện thi đề xuất
                  </h2>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Các đề đầu tiên từ kho hiện có, phù hợp để bắt đầu nhanh.
                  </p>
                </div>
                <span className="text-sm font-medium text-[#3882F6]">
                  {recommendedExams.length} đề
                </span>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {recommendedExams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-[#E2E8F0] bg-white">
              <div className="flex flex-col gap-2 border-b border-[#E2E8F0] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#0F172A]">
                    Danh sách đề thi
                  </h2>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Scan nhanh số câu, thời lượng và độ khó trước khi vào đề.
                  </p>
                </div>
                <span className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs font-semibold text-[#64748B]">
                  {exams.length} đề khả dụng
                </span>
              </div>

              <div className="divide-y divide-[#E2E8F0]">
                {exams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} variant="compact" />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <section className="rounded-xl border border-[#E2E8F0] bg-white p-5">
              <h2 className="text-base font-semibold text-[#0F172A]">
                Tổng quan kho đề
              </h2>
              <div className="mt-4 divide-y divide-[#E2E8F0] text-sm">
                <div className="flex items-center justify-between py-3">
                  <span className="text-[#64748B]">Tổng số câu</span>
                  <span className="font-semibold text-[#0F172A]">
                    {totalQuestions} câu
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-[#64748B]">Thời lượng trung bình</span>
                  <span className="font-semibold text-[#0F172A]">
                    {averageDuration} phút
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-[#64748B]">Đề khó</span>
                  <span className="font-semibold text-[#0F172A]">
                    {hardExamCount} đề
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-[#E2E8F0] bg-white p-5">
              <h2 className="text-base font-semibold text-[#0F172A]">
                Gợi ý chọn đề
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">
                Nếu muốn kiểm tra flow nhanh, hãy bắt đầu với đề có thời lượng ngắn
                nhất trong kho hiện tại.
              </p>

              {shortestExam && (
                <div className="mt-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <p className="line-clamp-2 text-sm font-semibold leading-5 text-[#0F172A]">
                    {shortestExam.title}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs font-medium text-[#64748B]">
                    <span>{shortestExam.totalQuestions} câu</span>
                    <span aria-hidden="true">·</span>
                    <span>{shortestExam.durationMinutes} phút</span>
                    <span aria-hidden="true">·</span>
                    <span>{difficultyLabels[shortestExam.difficulty]}</span>
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
