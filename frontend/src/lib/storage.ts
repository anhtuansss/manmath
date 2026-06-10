/**
 * Mục đích:
 * Gom key và thao tác storage cho lưu nháp đáp án và kết quả tạm.
 *
 * Luồng dữ liệu:
 * ExamTakingClient ghi localStorage/sessionStorage qua helper này.
 * ExamResultClient đọc và xóa kết quả/lưu nháp qua cùng helper để tránh lệch key.
 *
 * File liên quan:
 * frontend/src/components/exam/ExamTakingClient.tsx
 * frontend/src/components/exam/ExamResultClient.tsx
 * frontend/src/components/exam/types.ts
 */
import type { Answers, ExamResultSession, ExamDraftSession } from '../components/exam/types';

export const getExamAnswersKey = (examId: string): string => {
  return `exam-answers-${examId}`; // Old key
};

export const getExamDraftKey = (examId: string): string => {
  return `manmath:exam-draft:${examId}`; // New key
};

export const getExamResultKey = (examId: string): string => {
  return `exam-result-${examId}`;
};

export const readJsonStorage = <T>(storage: Storage, key: string): T | null => {
  try {
    const rawValue = storage.getItem(key);

    if (!rawValue) {
      return null;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    // Storage có thể bị sửa tay hoặc giữ định dạng cũ; trả null để UI xử lý an toàn.
    return null;
  }
};

export const writeJsonStorage = (storage: Storage, key: string, value: unknown): void => {
  storage.setItem(key, JSON.stringify(value));
};

export const removeStorageItem = (storage: Storage, key: string): void => {
  storage.removeItem(key);
};

export const readDraftStorage = (storage: Storage, examId: string): ExamDraftSession | null => {
  // First try the new key
  const draft = readJsonStorage<ExamDraftSession>(storage, getExamDraftKey(examId));
  if (draft && draft.answers && typeof draft.remainingSeconds === 'number') {
    return draft;
  }
  
  // Fallback to old key for backward compatibility
  const oldAnswers = readJsonStorage<Answers>(storage, getExamAnswersKey(examId));
  if (oldAnswers && Object.keys(oldAnswers).length > 0) {
    return {
      answers: oldAnswers,
      remainingSeconds: -1, // -1 signals that we need to fallback to full duration in the component
      updatedAt: Date.now(),
    };
  }
  
  return null;
};

export const writeDraftStorage = (storage: Storage, examId: string, draft: ExamDraftSession): void => {
  writeJsonStorage(storage, getExamDraftKey(examId), draft);
};

export const clearDraftStorage = (storage: Storage, examId: string): void => {
  removeStorageItem(storage, getExamDraftKey(examId));
  removeStorageItem(storage, getExamAnswersKey(examId)); // Clean up old key too
};


export const readResultStorage = (
  storage: Storage,
  examId: string
): ExamResultSession | null => {
  const data = readJsonStorage<Partial<ExamResultSession>>(
    storage,
    getExamResultKey(examId),
  );

  if (
    !data ||
    data.examId !== examId ||
    !data.examTitle ||
    !data.submittedAt ||
    !data.answers ||
    !data.submitResult
  ) {
    // Dữ liệu kết quả tạm cần đủ cấu trúc tối thiểu để hiển thị điểm và xem lại an toàn.
    return null;
  }

  return {
    examId: data.examId,
    examTitle: data.examTitle,
    submittedAt: data.submittedAt,
    answers: data.answers,
    submitResult: data.submitResult,
    exam: data.exam,
  };
};
