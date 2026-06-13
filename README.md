# ManMath

## Giới thiệu

ManMath là web luyện đề Toán THPT, tập trung vào trải nghiệm làm bài rõ ràng, ít gây mỏi mắt và gần với một môi trường thi thật.

Project hiện hỗ trợ chọn đề, làm bài trắc nghiệm, nộp bài, xem kết quả, xem lịch sử làm bài và theo dõi phân tích theo chuyên đề. Hệ thống dùng PostgreSQL + Prisma ở backend và Next.js ở frontend.

## Tính năng chính

- [x] Luyện đề Toán THPT
- [x] Làm bài trắc nghiệm theo đề
- [x] Chấm điểm, result page, review đáp án
- [x] Lịch sử làm bài và chi tiết attempt
- [x] Google Login + JWT
- [x] Topic analytics
- [x] Recommendation MVP và analytics dashboard nhỏ
- [x] KaTeX math rendering
- [x] Hỗ trợ ảnh câu hỏi và ảnh đáp án bằng static public path
- [x] Import đề từ JSON qua backend script

## Tech Stack

| Thành phần | Công nghệ |
| --- | --- |
| Frontend | Next.js App Router, React, TypeScript, Tailwind CSS |
| Backend | Express, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Google Login, JWT |
| Math rendering | KaTeX |

## Kiến trúc tổng quan

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

## Chạy local

### 1. Cài backend

```bash
cd backend
npm install
```

### 2. Cài frontend

```bash
cd frontend
npm install
```

### 3. Tạo env

`backend/.env`

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/manmath_db"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
JWT_SECRET="your-dev-secret-at-least-32-characters"
JWT_EXPIRES_IN="7d"
```

`frontend/.env.local`

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

### 4. Migrate và seed

```bash
cd backend
npx prisma migrate dev
npm run seed
```

### 5. Chạy backend

```bash
cd backend
npm run dev
```

### 6. Chạy frontend

```bash
cd frontend
npm run dev
```

## Env chính

### Backend

- `DATABASE_URL`
- `GOOGLE_CLIENT_ID`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

### Frontend

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

Ghi chú:

- Không commit `.env` hoặc `.env.local`
- `JWT_SECRET` chỉ dùng ở backend
- Các biến `NEXT_PUBLIC_*` là public env cho browser

## Docs chi tiết

- [Kiến trúc hệ thống](docs/ARCHITECTURE.md)
- [API hiện có](docs/API.md)
- [Auth flow](docs/AUTH.md)
- [Database và Prisma](docs/DATABASE.md)
- [Hướng dẫn phát triển](docs/DEVELOPMENT.md)
- [Import đề từ JSON](docs/IMPORT_JSON.md)

## Roadmap ngắn

- Refresh Token
- Email/password login
- Cập nhật thông tin cá nhân
- Upload và quản lý ảnh câu hỏi/đáp án
- Dashboard analytics sâu hơn và theo dõi tiến bộ dài hạn
- Import đề từ file
- AI feedback
