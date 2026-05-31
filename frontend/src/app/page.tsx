'use client';
import { useState, useEffect } from 'react';
import mockData from '../mockData.json';

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

type ExamRespone = {
  examTitle: string;
  durationMinutes: number;
  questions: Question[];
};

type SubmitRequest = {
  answers: Record<number, number>;
};

type SubmitResult = {
  correctCount: number;
  totalQuestions: number;
  score: number;
};  

export default function ExamPage() {
  // State quản lý câu trả lời, dữ liệu đề thi, trạng thái loading/error, thời gian còn lại, kết quả submit
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [exam, setExam] = useState<ExamRespone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const isTimeUp = remainingSeconds === 0;
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  useEffect(() => {
    const saveData = localStorage.getItem('exam-answers');
    if (saveData) {
      setAnswers(JSON.parse(saveData));
    }
  }, []);

  // Fetch exam data from backend API
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:5000/api/exams');
        if (!response.ok) {
          throw new Error(`Failed to fetch exam`);
        }

        const data = await response.json();
        setExam(data);
      } catch (err: any) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, []);

  // Khởi tạo thời gian còn lại khi có dữ liệu đề thi
  useEffect(() => {
    if (!exam) return;
    setRemainingSeconds(exam.durationMinutes * 60);
  }, [exam]);

  // Timer countdown
  useEffect(() => {
    if (!exam) return;

    const timerId = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [exam]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    const newAnswer = {
      ...answers,
      [questionId]: optionIndex
    };
    setAnswers(newAnswer);
    localStorage.setItem('exam-answers', JSON.stringify(newAnswer));
  };

  const handleSubmit = async() => {
    if (!exam) return;

    try {
      // Gửi dữ liệu trả lời lên backend API
      const payload: SubmitRequest = { answers, };
      // Thay đổi URL nếu backend API có endpoint khác để xử lý submit
      const response = await fetch('http://localhost:5000/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit exam');
      }

      const result: SubmitResult = await response.json();
      setSubmitResult(result);
      console.log('Submit result:', result);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-500">Đang tải đề thi...</p>;
    }
    if (error) {
      return <p className="text-center text-red-500">Lỗi: {error}</p>;
    }
    if (!exam) {
      return <p className="text-center text-gray-500">Không có đề thi nào.</p>;
    } 
    return null;
  };

  return (
    // Container chính: Canh giữa, max-width 1200px, padding
    <div className="max-w-6xl mx-auto p-5 font-sans text-gray-800">
      
      {/* Khung viền lớn bao ngoài cả 2 cột */}
      <div className="flex flex-col md:flex-row gap-6 border-2 border-gray-200 rounded-2xl p-4 md:p-6 shadow-sm bg-white">

        {/* CỘT TRÁI (Nội dung đề) */}
        <div className="flex-[3] flex flex-col gap-6">
          
          {/* Khung Tên đề */}
          <div className="p-4 text-center font-bold text-xl md:text-2xl bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
            {exam?.examTitle}
          </div>

          {/* Khung Danh sách câu hỏi */}
          <div className="min-h-[500px]">
            {exam?.questions.map((q, index) => (
              <div key={q.id} className="border border-gray-200 p-5 rounded-xl mb-6 shadow-sm hover:shadow-md transition-shadow bg-gray-50">
                
                <h3 className="font-semibold text-lg mb-4">Câu {index + 1}: {q.question}</h3>
                
                <div className="flex flex-col gap-3">
                  {q.options.map((choice, cIndex) => {
                    const isSelected = answers[q.id] === cIndex;
              
                    return (
                      <button 
                        key={cIndex}
                        disabled={isTimeUp}
                        onClick={() => handleSelectAnswer(q.id, cIndex)}
                        className={`
                          w-full p-3 text-left cursor-pointer rounded-lg border transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                          ${isSelected 
                            ? 'bg-blue-100 border-blue-500 border-2 font-bold text-blue-700' 
                            : 'bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                          }
                        `}
                      >
                        {choice}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI (Sidebar)  */}
        <div className="flex-1">
          
          <div className="border-2 border-gray-200 rounded-xl p-5 sticky top-6 bg-white shadow-sm">
            <h3 className="text-center text-red-600 font-bold text-2xl mb-4">{formatTime(remainingSeconds)}</h3>
            
            <hr className="border-gray-200 mb-4" />
            
            <div className="text-gray-700 space-y-2 mb-6 font-medium">
              <p>Số câu đã làm: <span className="text-blue-600 font-bold">{Object.keys(answers).length} / {exam?.questions.length}</span></p>
              <p>Đánh dấu xem lại: <span className="text-yellow-600 font-bold">0</span></p>
            </div>
            
            {/* Lưới ô vuông */}
            <div className="grid grid-cols-5 gap-2">
              {exam?.questions.map((q, i) => {
                const isAnswered = answers[q.id] !== undefined;

                return (
                  <div 
                    key={i} 
                    className={`
                      py-2 text-center rounded border transition-colors
                      ${isAnswered 
                        ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-md' 
                        : 'border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {i + 1}
                  </div>
                )
              })}
            </div>

            {isTimeUp && (
              <p className="mt-3 text-center text-red-600 font-semibold">
                Đã hết giờ
              </p>
            )}

            {submitResult && (
              <div className="mt-4 rounded-lg border p-4">
                <p>Đúng: {submitResult.correctCount}/{submitResult.totalQuestions}</p>
                <p>Điểm: {submitResult.score}</p>
              </div>
            )}

            {/* Nút Nộp bài */}
            <button 
              onClick={handleSubmit}
              disabled={isTimeUp}
              className="w-full mt-8 p-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Nộp bài
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}