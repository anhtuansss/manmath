# Database và Prisma

## Công nghệ

- PostgreSQL
- Prisma ORM

## Các model chính

### User

Lưu tài khoản người dùng.

Các field chính:

- `id`
- `email`
- `fullName`
- `avatarUrl`
- `googleId`
- `passwordHash`
- `authProvider`

### Exam

Lưu thông tin đề thi.

Các field chính:

- `id`
- `title`
- `description`
- `durationMinutes`
- `subject`
- `difficulty`
- `statusLabel`

### Question

Lưu từng câu hỏi trong đề.

Các field chính:

- `id`
- `examId`
- `order`
- `topicId`
- `question`
- `imageUrl`
- `options`
- `optionImageUrls`
- `correctAnswer`

Ghi chú:

- `imageUrl` là field optional dùng cho Question Image Support MVP
- `optionImageUrls` là mảng string map theo index với `options`
- Ảnh hiện được lưu dưới dạng static public path, ví dụ `/images/questions/sample-parabola.svg`
- MVP hiện vẫn giữ `options: string[]`, chưa đổi sang object option model

### Topic

Lưu chuyên đề Toán.

Các field chính:

- `id`
- `name`
- `slug`
- `description`
- `order`

Taxonomy MVP hiện tại dùng một bộ slug chính, ví dụ:

- `ham-so`
- `nguyen-ham-tich-phan`
- `gioi-han`
- `mu-logarit`
- `xac-suat-to-hop`
- `vector-toa-do`
- `ma-tran`
- `hinh-hoc-khong-gian`

Ghi chú:

- Analytics và recommendation đang phụ thuộc trực tiếp vào `Question -> Topic`
- Vì vậy slug topic cần được giữ nhất quán giữa `mockExams`, seed và JSON import

### Attempt

Lưu một lần làm bài.

Các field chính:

- `id`
- `examId`
- `userId`
- `score`
- `correctCount`
- `totalQuestions`
- `unansweredCount`
- `startedAt`
- `submittedAt`
- `durationSeconds`

### AttemptAnswer

Lưu từng câu trả lời của một lần làm bài.

Các field chính:

- `id`
- `attemptId`
- `questionId`
- `selectedOptionIndex`
- `correctOptionIndex`
- `isCorrect`

## Sơ đồ quan hệ

```text
User 1 --- n Attempt
Exam 1 --- n Question
Exam 1 --- n Attempt
Attempt 1 --- n AttemptAnswer
Topic 1 --- n Question
```

Ghi chú:

- `Attempt.userId` là nullable để vẫn hỗ trợ anonymous submit
- `AttemptAnswer.questionId` hiện là scalar field, chưa khai báo relation trực tiếp tới `Question`

## Vì sao cần Attempt và AttemptAnswer

### Attempt

Dùng để lưu kết quả tổng của một lần làm bài:

- điểm số
- số câu đúng
- tổng số câu
- thời gian nộp bài
- thời gian làm bài

### AttemptAnswer

Dùng để lưu từng đáp án user đã chọn:

- câu nào đúng
- câu nào sai
- câu nào bỏ trống
- dữ liệu đầu vào cho history, review và analytics

## Topic analytics lấy dữ liệu từ đâu

Topic analytics hiện dựa trên:

- mapping `Question -> Topic`
- dữ liệu `AttemptAnswer` của từng lần làm bài

Các luồng chính:

1. Submit bài:
   - backend chấm bài
   - gom câu theo topic
   - trả `topicStats`
2. Attempt detail:
   - đọc answers của một attempt
   - gom theo topic
3. User analytics:
   - lấy nhiều attempt của một user
   - tổng hợp theo topic
