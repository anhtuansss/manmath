    # Hướng dẫn phát triển

## Chạy local chi tiết

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Prisma commands

```bash
cd backend
npx prisma validate
npx prisma migrate dev
npx prisma migrate status
npx prisma studio
npm run seed
npm run seed:demo
```

## Typecheck và build

### Backend

```bash
cd backend
npx tsc --noEmit
```

### Frontend

```bash
cd frontend
npx tsc --noEmit
npm run build
```

## Import đề từ JSON

Script import MVP hiện tại dùng để thêm hoặc cập nhật đề thi từ file JSON vào PostgreSQL.

Workflow chuẩn:

- `npm run seed`: reset về dataset mock chuẩn
- `npm run seed:demo`: reset dataset mock chuẩn và import thêm sample JSON exam
- `npm run import:exam -- ./src/data/import/sample-exam.json`: import hoặc cập nhật riêng một đề JSON
- `npm run import:exam -- ./src/data/import/sample-exam.json --dry-run`: validate và in summary, không ghi DB

Lệnh mẫu:

```bash
cd backend
npm run import:exam -- ./src/data/import/sample-exam.json
```

Dry-run mẫu:

```bash
cd backend
npm run import:exam -- ./src/data/import/sample-exam.json --dry-run
```

Ghi chú:

- import lại cùng `exam.id` sẽ update thay vì tạo duplicate
- `question.id` phải ổn định và không được trùng với exam khác
- dry-run sẽ báo danh sách lỗi rõ theo field như `questions[3].correctAnswer must be one of options`
- tài liệu chi tiết nằm ở [docs/IMPORT_JSON.md](./IMPORT_JSON.md)

## Smoke test tối thiểu

### Backend

```bash
cd backend
npx tsc --noEmit
npx prisma validate
npx prisma migrate status
npm run seed:demo
npm run import:exam -- ./src/data/import/sample-exam.json
```

### Frontend

```bash
cd frontend
npm run build
```

## Git workflow gợi ý

- Tạo branch riêng cho từng task
- Commit theo step nhỏ
- Với thay đổi lớn, chia thành nhiều commit rõ mục tiêu
- Tránh `git add .` khi đang có nhiều thay đổi lẫn nhau
- Kiểm tra `git status` trước khi commit

## Troubleshooting

### Thiếu `node_modules`

Triệu chứng:

- `npm run dev` hoặc `npm run build` báo thiếu package

Cách xử lý:

```bash
npm install
```

### Thiếu `.env`

Triệu chứng:

- backend fail fast vì thiếu `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `JWT_SECRET`
- frontend không gọi đúng API hoặc không hiện Google Login

Cách xử lý:

- kiểm tra `backend/.env`
- kiểm tra `frontend/.env.local`

### Prisma drift ở local

Triệu chứng:

- `prisma migrate dev` báo drift hoặc migration history lệch

Cách xử lý:

- xác nhận đây là local dev database
- nếu chấp nhận mất dữ liệu local, dùng `npx prisma migrate reset`
- seed lại dữ liệu sau khi reset

### Frontend build và font

Triệu chứng:

- `npm run build` fail do lỗi font hoặc CSS

Trạng thái hiện tại:

- frontend đã bỏ phụ thuộc build-time vào `next/font/google`
- build không còn cần tải Google Fonts từ internet

Cách xử lý:

- kiểm tra lại `src/app/layout.tsx` nếu ai đó thêm lại `next/font/google`
- kiểm tra cache local nếu build cũ vẫn đang giữ cấu hình trước đó

### Cache Next.js hoặc Tailwind

Triệu chứng:

- giao diện không phản ánh thay đổi mới

Cách xử lý:

- dừng dev server
- chạy lại `npm run dev`
- nếu cần, xóa cache build local trước khi chạy lại
