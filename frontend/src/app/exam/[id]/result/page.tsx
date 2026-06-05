/**
 * Mục đích:
 * Route kết quả bài làm theo mã đề: /exam/[id]/result.
 *
 * Luồng dữ liệu:
 * Trang lấy id từ URL và giao cho ExamResultClient đọc kết quả tạm trong
 * sessionStorage. Nếu cần xem lại chi tiết từng câu, client có thể tải lại dữ liệu đề.
 *
 * File liên quan:
 * frontend/src/components/exam/ExamResultClient.tsx
 * frontend/src/lib/storage.ts
 */
import { ExamResultClient } from '../../../../components/exam/ExamResultClient';

type ExamResultPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExamResultPage({ params }: ExamResultPageProps) {
  const { id } = await params;

  return <ExamResultClient examId={id} />;
}
