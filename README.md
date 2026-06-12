# ManMath

## Giới Thiệu

ManMath là web luyện đề Toán THPT, tập trung vào trải nghiệm làm bài sạch, rõ ràng và gần với một môi trường thi thật.

Người dùng có thể chọn đề, làm bài trắc nghiệm, nộp bài, xem kết quả, xem lại lịch sử làm bài và theo dõi phân tích theo chuyên đề.

Flow chính:

```text
Chọn đề -> Làm bài -> Submit -> Xem kết quả -> Xem lịch sử -> Xem phân tích theo chuyên đề
```

## Tính Năng Hiện Có

- [x] Danh sách đề tại `/` và `/exams`
- [x] Làm bài trắc nghiệm tại `/exam/[id]`
- [x] Đồng hồ đếm ngược
- [x] Autosave bài làm bằng `localStorage`
- [x] Khôi phục bài làm sau khi reload
- [x] Submit bài và chấm điểm ở backend
- [x] Trang kết quả tại `/exam/[id]/result`
- [x] Review đáp án từng câu
- [x] Lịch sử làm bài tại `/exam/[id]/attempts`
- [x] Chi tiết một lần làm bài tại `/attempts/[attemptId]`
- [x] Google Login
- [x] JWT Access Token
- [x] Bảo vệ history và attempt detail theo user
- [x] Render công thức toán bằng KaTeX
- [x] Topic stats trong attempt detail
- [x] Topic stats sau khi submit
- [x] API topic analytics theo user

## Tech Stack

### Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- KaTeX
- Google OAuth frontend button

### Backend

- Express
- TypeScript
- Prisma
- PostgreSQL
- Google Auth verification
- JWT

### Database

- PostgreSQL
- Prisma ORM
- Prisma migrations
- Seed dữ liệu đề thi mẫu

### Auth

- Google Login first
- JWT Access Token
- History và attempt detail yêu cầu user đã đăng nhập
- Submit bài vẫn hỗ trợ anonymous flow

## Kiến Trúc Tổng Quan

```text
Browser
  ↓
Next.js Frontend
  ↓
Express API
  ↓
Prisma ORM
  ↓
PostgreSQL
```

- Browser chạy UI làm bài, lưu draft bằng `localStorage` và result tạm bằng `sessionStorage`.
- Next.js Frontend gọi backend qua `NEXT_PUBLIC_API_BASE_URL`.
- Express API xử lý exam, submit, auth, history và analytics.
- Prisma ORM truy vấn PostgreSQL.
- PostgreSQL lưu đề thi, câu hỏi, user, attempt, answer và topic.

## Cấu Trúc Thư Mục

```text
frontend/
  src/app/                 Next.js App Router routes
  src/components/exam/     UI làm bài, danh sách đề, result, history
  src/components/auth/     Google auth provider và auth button
  src/config/              Frontend config
  src/lib/                 Storage/API helper

backend/
  server.ts                Express entrypoint
  prisma/                  Prisma schema và migrations
  src/routes/              Express routes
  src/controllers/         HTTP request/response handlers
  src/services/            Business logic
  src/lib/                 Prisma/JWT helpers
  src/config/              Backend env config
  src/data/                Seed data
```

## Cài Đặt Local

### 1. Clone Project

```bash
git clone <repo-url>
cd manmath
```

### 2. Cài Backend

```bash
cd backend
npm install
```

### 3. Cài Frontend

```bash
cd frontend
npm install
```

### 4. Tạo Env Backend

Tạo file `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/manmath_db"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
JWT_SECRET="your-dev-secret-at-least-32-characters"
JWT_EXPIRES_IN="7d"
```

Ghi chú:

- `DATABASE_URL` là secret backend.
- `GOOGLE_CLIENT_ID` ở backend dùng để verify Google credential.
- `JWT_SECRET` là secret backend, không được expose ra frontend.
- `JWT_EXPIRES_IN` đang có fallback mặc định là `7d` trong backend config.
- Có thể thêm `PORT=5000` nếu muốn đổi port backend.

### 5. Tạo Env Frontend

Tạo file `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

Ghi chú:

- Không commit file `.env` hoặc `.env.local`.
- Các biến bắt đầu bằng `NEXT_PUBLIC_` là public env cho frontend.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` phải cùng Google OAuth Client ID đã cấu hình trên Google Cloud.

### 6. Prisma Migrate Và Seed

```bash
cd backend
npx prisma migrate dev
npm run seed
```

Lệnh seed sẽ tạo dữ liệu đề thi mẫu, câu hỏi, topic và mapping `Question -> Topic`.

### 7. Chạy Backend

```bash
cd backend
npm run dev
```

Backend mặc định chạy tại:

```text
http://localhost:5000
```

### 8. Chạy Frontend

```bash
cd frontend
npm run dev
```

Frontend mặc định chạy tại:

```text
http://localhost:3000
```

## Scripts Hữu Ích

### Backend

```bash
npm run dev
npm run start
npm run seed
npx tsc --noEmit
npx prisma validate
npx prisma migrate dev
npx prisma studio
```

### Frontend

```bash
npm run dev
npm run build
npm run start
```

## Frontend Routes

| Route | Chức năng |
| --- | --- |
| `/` | Trang danh sách đề |
| `/exams` | Alias trang danh sách đề |
| `/exam/[id]` | Trang làm bài |
| `/exam/[id]/result` | Trang kết quả sau submit |
| `/exam/[id]/attempts` | Lịch sử làm bài của một đề |
| `/attempts/[attemptId]` | Chi tiết một lần làm bài |
| `/about` | Trang giới thiệu |

## API Chính

| Method | Endpoint | Auth | Chức năng | Response ngắn |
| --- | --- | --- | --- | --- |
| `GET` | `/api/health` | Public | Kiểm tra backend còn sống | `{ status, message }` |
| `GET` | `/api/exams` | Public | Lấy danh sách đề | `ExamSummaryDto[]` |
| `GET` | `/api/exams/:id` | Public | Lấy chi tiết đề | `ExamDetailDto` |
| `POST` | `/api/exam/submit` | Optional JWT | Nộp bài, chấm điểm, tạo attempt | `{ correctCount, totalQuestions, score, topicStats }` |
| `GET` | `/api/exams/:id/attempts` | Protected | Lấy lịch sử làm bài của user hiện tại theo đề | `ExamAttemptSummaryDto[]` |
| `GET` | `/api/attempts/:attemptId` | Protected | Lấy chi tiết một lần làm bài nếu user là owner | `{ attempt, exam, answers, topicStats }` |
| `POST` | `/api/auth/google` | Public | Đăng nhập bằng Google credential | `{ token, user }` |
| `GET` | `/api/auth/me` | Protected | Lấy user hiện tại từ JWT | `{ user }` |
| `GET` | `/api/me/topic-stats` | Protected | Thống kê độ chính xác theo chuyên đề của user hiện tại | `{ topicStats }` |

## Database Chính

Các model chính trong Prisma:

- `User`: tài khoản người dùng, hiện hỗ trợ Google Login và chuẩn bị cho password login sau này.
- `Exam`: đề thi.
- `Question`: câu hỏi của đề, gồm nội dung, đáp án và đáp án đúng.
- `Topic`: chuyên đề Toán.
- `Attempt`: một lần làm bài.
- `AttemptAnswer`: đáp án từng câu trong một lần làm bài.

Quan hệ chính:

```text
User 1 --- n Attempt
Exam 1 --- n Question
Exam 1 --- n Attempt
Attempt 1 --- n AttemptAnswer
Topic 1 --- n Question
Question 1 --- n AttemptAnswer theo questionId logic
```

Ghi chú: `AttemptAnswer.questionId` hiện là field scalar để lưu snapshot câu trả lời, chưa khai báo Prisma relation trực tiếp tới `Question`.

## Auth Flow

```text
Frontend Google Login
  ↓
Nhận Google credential / ID token
  ↓
Gửi credential về POST /api/auth/google
  ↓
Backend verify credential với Google
  ↓
Backend find-or-create User
  ↓
Backend phát hành JWT ManMath
  ↓
Frontend lưu JWT trong localStorage
  ↓
Frontend gửi Authorization: Bearer <token>
  ↓
Backend xác thực user và gắn Attempt.userId khi submit
```

Submit bài vẫn chạy được khi chưa đăng nhập. Nếu request submit có JWT hợp lệ, backend sẽ gắn `Attempt.userId`; nếu không có JWT, attempt được lưu như anonymous attempt.

## Topic Analytics

ManMath hiện đã có topic analytics ở ba mức:

- `POST /api/exam/submit` trả `topicStats` cho lần submit vừa xong.
- `GET /api/attempts/:attemptId` trả `topicStats` cho một lần làm bài cụ thể.
- `GET /api/me/topic-stats` tổng hợp độ chính xác theo chuyên đề của user hiện tại từ nhiều attempt.

Shape cơ bản:

```ts
{
  topicId: string | null;
  topicName: string;
  topicSlug: string | null;
  correct: number;
  total: number;
  accuracy: number;
}
```

Mục tiêu của phần này là chuẩn bị nền cho dashboard học tập, recommendation không AI và AI feedback sau này.

## Smoke Test Local

### Anonymous Flow

1. Mở `http://localhost:3000/`.
2. Chọn một đề, ví dụ `/exam/thpt-mock-01`.
3. Chọn vài đáp án.
4. Reload trang và kiểm tra autosave được khôi phục.
5. Submit bài.
6. Kiểm tra redirect sang `/exam/thpt-mock-01/result`.
7. Kiểm tra điểm, số câu đúng, review đáp án và topic stats.

### Logged-in Flow

1. Cấu hình Google OAuth env ở backend và frontend.
2. Đăng nhập bằng Google.
3. Làm bài và submit.
4. Kiểm tra attempt được gắn với user.
5. Mở `/exam/thpt-mock-01/attempts`.
6. Mở một attempt detail tại `/attempts/[attemptId]`.

### Protected History Flow

1. Logout hoặc xóa JWT trong localStorage.
2. Mở `/exam/thpt-mock-01/attempts`.
3. Kỳ vọng frontend hiển thị trạng thái cần đăng nhập.
4. Mở `/attempts/[attemptId]` khi chưa login.
5. Kỳ vọng frontend hiển thị trạng thái cần đăng nhập.

## Roadmap

### Near-term

- User Profile tối thiểu từ `/api/auth/me`
- Frontend analytics dashboard nhỏ cho `GET /api/me/topic-stats`
- Auth UX polish
- Topic system cleanup
- README/env example cleanup

### Planned Later

- Refresh Token
- Email/password register/login
- Question image support
- Import đề từ JSON/Excel/Word
- Admin/content management
- Dashboard học tập đầy đủ
- AI feedback
- AI explanation
- AI tutor

## Ghi Chú Phát Triển

- Commit theo từng bước nhỏ.
- Không commit `.env` hoặc secret.
- Không hardcode API URL hoặc secret trong component.
- Giữ API contract ổn định; nếu cần đổi response, ưu tiên additive change.
- Với task backend/database/auth, phân tích trước khi implement.
- Với UI, ưu tiên academic, focused, low-fatigue, tránh dashboard rối hoặc hiệu ứng màu mè.
