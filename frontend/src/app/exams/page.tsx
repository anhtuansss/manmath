/**
 * Mục đích:
 * Route /exams dùng chung màn danh sách đề với trang chủ.
 *
 * Luồng dữ liệu:
 * Trang này không gọi API trực tiếp. ExamListClient gọi backend qua
 * GET /api/exams rồi hiển thị danh sách đề.
 *
 * File liên quan:
 * frontend/src/app/page.tsx
 * frontend/src/components/exam/ExamListClient.tsx
 */
import { ExamListClient } from '../../components/exam/ExamListClient';

export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <ExamListClient />
    </div>
  );
}
