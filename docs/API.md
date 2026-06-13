# API ManMath

## Ghi chu chung

- Base URL backend local: `http://localhost:5000`
- Cac route exam duoc mount duoi `/api`
- Route protected dung JWT Bearer token

## Exam APIs

| Method | Endpoint | Auth | Muc dich |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Kiem tra backend con hoat dong |
| `GET` | `/api/exams` | Public | Lay danh sach de, ho tro tim kiem va loc theo topic/subtopic |
| `GET` | `/api/exams/:id` | Public | Lay chi tiet mot de |
| `GET` | `/api/topics` | Public | Lay danh sach topic va subtopic de filter exam list |
| `POST` | `/api/exam/submit` | Optional JWT | Nop bai, cham diem, luu attempt va tra ket qua |

### Exam list query params

`GET /api/exams` ho tro cac query param additive sau:

- `search`: tim theo `title` va `description`
- `topic`: loc theo `Topic.slug`
- `subtopic`: loc theo `Subtopic.slug`

Vi du:

```txt
/api/exams?search=ham
/api/exams?topic=ham-so
/api/exams?topic=ham-so&subtopic=cuc-tri
```

Neu khong truyen query param, response giu shape cu.

### Exam detail response shape

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
    optionImageUrls: Array<string | null>;
    subtopic: {
      id: string;
      name: string;
      slug: string;
    } | null;
    correctAnswer: string;
  }>;
}
```

### Topics response shape

```ts
{
  topics: Array<{
    id: string;
    name: string;
    slug: string;
    subtopics: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  }>;
}
```

### Submit response shape

```ts
{
  correctCount: number;
  totalQuestions: number;
  score: number;
  topicStats: TopicStatDto[];
}
```

## Attempt / History APIs

| Method | Endpoint | Auth | Muc dich |
| --- | --- | --- | --- |
| `GET` | `/api/exams/:id/attempts` | Protected | Lay lich su lam bai cua user hien tai theo de |
| `GET` | `/api/attempts/:attemptId` | Protected | Lay chi tiet mot lan lam bai neu user la owner |

### Attempt detail response shape

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
    optionImageUrls: Array<string | null>;
    subtopic: {
      id: string;
      name: string;
      slug: string;
    } | null;
    selectedOptionIndex: number | null;
    correctOptionIndex: number;
    isCorrect: boolean;
  }>;
  topicStats: TopicStatDto[];
}
```

### Ghi chu

- `imageUrl` dung cho anh cau hoi
- `optionImageUrls` map theo index voi `options`
- `subtopic` la metadata bo sung cho taxonomy MVP
- `POST /api/exam/submit` giu response cu va bo sung `topicStats` theo huong additive

## Auth APIs

| Method | Endpoint | Auth | Muc dich |
| --- | --- | --- | --- |
| `POST` | `/api/auth/google` | Public | Dang nhap bang Google credential |
| `GET` | `/api/auth/me` | Protected | Lay user hien tai tu JWT |

### Auth response shape

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

| Method | Endpoint | Auth | Muc dich |
| --- | --- | --- | --- |
| `GET` | `/api/me/topic-stats` | Protected | Lay thong ke do chinh xac theo topic cua user hien tai |
| `GET` | `/api/me/recommendations` | Protected | Lay weak topics va de nen lam tiep |
| `GET` | `/api/me/progress` | Protected | Lay summary tien do, recent attempts va progress theo thoi gian |

### Topic stats response shape

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

### Recommendations response shape

```ts
{
  weakTopics: Array<{
    topicId: string | null;
    topicName: string;
    topicSlug: string | null;
    correct: number;
    total: number;
    accuracy: number;
    reason: string;
  }>;
  recommendedExams: Array<{
    examId: string;
    title: string;
    durationMinutes: number;
    matchedWeakTopicCount: number;
    matchedWeakQuestionCount: number;
    reason: string;
  }>;
}
```

### Progress response shape

```ts
{
  summary: {
    attemptCount: number;
    averageScore: number;
    bestScore: number;
    latestScore: number | null;
  };
  recentAttempts: Array<{
    attemptId: string;
    examId: string;
    examTitle: string;
    score: number;
    correctCount: number;
    totalQuestions: number;
    submittedAt: string;
  }>;
  progressByAttempt: Array<{
    attemptId: string;
    examTitle: string;
    score: number;
    accuracy: number;
    submittedAt: string;
  }>;
}
```

### Ghi chu analytics

- Recommendation hien van la rule-based MVP
- `reason` co the nhac them subtopic neu de goi y co nhieu cau thuoc mot nhom con cu the
- Analytics hien van giu trong tam o level `Topic`; `Subtopic` moi la metadata bo sung

## Import script noi bo

Import de tu JSON hien chua phai HTTP API. MVP dang dung backend script:

```bash
cd backend
npm run import:exam -- ./src/data/import/sample-exam.json
```

Xem format va rule chi tiet tai [docs/IMPORT_JSON.md](./IMPORT_JSON.md).
