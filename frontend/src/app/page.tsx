/**
 * Mục đích:
 * Route trang chủ của ManMath. Hiển thị danh sách đề luyện thi.
 *
 * Luồng dữ liệu:
 * Trang này chỉ bọc layout nền chung. Việc gọi API và xử lý dữ liệu
 * nằm trong ExamListClient.
 *
 * File liên quan:
 * frontend/src/components/exam/ExamListClient.tsx
 */
import { ExamListClient } from '../components/exam/ExamListClient';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <ExamListClient />
    </div>
  );
}
