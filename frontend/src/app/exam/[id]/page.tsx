/**
 * Mục đích:
 * Route làm bài theo mã đề: /exam/[id].
 *
 * Luồng dữ liệu:
 * App Router lấy id từ URL, sau đó truyền xuống ExamTakingClient để tải đề,
 * quản lý đồng hồ, lưu nháp đáp án và nộp bài.
 *
 * File liên quan:
 * frontend/src/components/exam/ExamTakingClient.tsx
 * backend/server.ts
 */
import { ExamTakingClient } from '../../../components/exam/ExamTakingClient';

type ExamTakingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExamTakingPage({ params }: ExamTakingPageProps) {
  const { id } = await params;

  return <ExamTakingClient examId={id} />;
}
