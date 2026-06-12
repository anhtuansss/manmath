# API ManMath

## Ghi chú chung

- Base path backend hiện tại là `http://localhost:5000`
- Các route exam được mount dưới `/api`
- Auth dùng JWT Bearer token khi route yêu cầu đăng nhập

## Exam APIs

| Method | Endpoint | Auth | Mục đích |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Kiểm tra backend còn hoạt động |
| `GET` | `/api/exams` | Public | Lấy danh sách đề |
| `GET` | `/api/exams/:id` | Public | Lấy chi tiết một đề |
| `POST` | `/api/exam/submit` | Optional JWT | Nộp bài, chấm điểm, lưu attempt và trả kết quả |

### Shape ngắn của exam detail response

```ts
{
  id: string;
  examTitle: string;
  durationMinutes: number;
  questions: Array<{
    id: number;
    question: string;
    imageUrl: string | null;
    options: string[];
    correctAnswer: string;
  }>;
}
```

### Shape ngắn của submit response

```ts
{
  correctCount: number;
  totalQuestions: number;
  score: number;
  topicStats: TopicStatDto[];
}
```

## Attempt / History APIs

| Method | Endpoint | Auth | Mục đích |
| --- | --- | --- | --- |
| `GET` | `/api/exams/:id/attempts` | Protected | Lấy lịch sử làm bài của user hiện tại theo đề |
| `GET` | `/api/attempts/:attemptId` | Protected | Lấy chi tiết một lần làm bài nếu user là owner |

### Shape ngắn của attempt detail response

```ts
{
  attempt: {
    id: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
    submittedAt: string;
  };
  exam: {
    id: string;
    title: string;
  };
  answers: Array<{
    questionId: number;
    question: string;
    imageUrl: string | null;
    options: string[];
    selectedOptionIndex: number | null;
    correctOptionIndex: number;
    isCorrect: boolean;
  }>;
  topicStats: TopicStatDto[];
}
```

Ghi chú:

- Question Image Support MVP hiện chỉ dùng `question.imageUrl`
- Giá trị `imageUrl` hiện là static public path, ví dụ `/images/questions/sample-unit-circle.svg`
- Ảnh trong đáp án chưa được hỗ trợ ở giai đoạn này

## Auth APIs

| Method | Endpoint | Auth | Mục đích |
| --- | --- | --- | --- |
| `POST` | `/api/auth/google` | Public | Đăng nhập bằng Google credential |
| `GET` | `/api/auth/me` | Protected | Lấy user hiện tại từ JWT |

### Shape ngắn của auth response

```ts
{
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
}
```

## Me / Analytics APIs

| Method | Endpoint | Auth | Mục đích |
| --- | --- | --- | --- |
| `GET` | `/api/me/topic-stats` | Protected | Lấy thống kê độ chính xác theo chuyên đề của user hiện tại |

### Shape ngắn của topic stats

```ts
{
  topicStats: Array<{
    topicId: string | null;
    topicName: string;
    topicSlug: string | null;
    correct: number;
    total: number;
    accuracy: number;
  }>;
}
```
