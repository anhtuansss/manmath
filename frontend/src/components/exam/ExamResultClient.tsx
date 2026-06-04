'use client';

import Link from 'next/link';

type ExamResultClientProps = {
  examId: string;
};

export function ExamResultClient({ examId }: ExamResultClientProps) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-slate-500">ManMath / Kết quả bài làm</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Trang kết quả
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            Màn này sẽ hiển thị điểm số, phần review câu hỏi và các bước tiếp theo sau khi
            bạn nộp bài.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            Chưa có dữ liệu kết quả
          </div>

          <div className="mt-4 space-y-3">
            <h2 className="text-xl font-semibold text-slate-950">
              Hãy nộp bài để xem kết quả
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              Khi submit từ màn làm bài, ManMath sẽ đưa dữ liệu tạm sang đây để hiển thị
              điểm, đáp án đúng sai và phần review chi tiết.
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Đề hiện tại: <span className="font-medium text-slate-950">{examId}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Về danh sách đề
            </Link>
            <Link
              href={`/exam/${examId}`}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Quay lại làm đề
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
