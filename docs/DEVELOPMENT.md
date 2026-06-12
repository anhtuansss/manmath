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

### Frontend build lỗi vì font Google

Triệu chứng:

- `npm run build` fail ở `next/font`

Nguyên nhân thường gặp:

- môi trường hiện tại không truy cập được Google Fonts

Cách xử lý:

- build ở môi trường có internet
- hoặc chuyển sang self-host/local font nếu muốn build độc lập mạng

### Cache Next.js hoặc Tailwind

Triệu chứng:

- giao diện không phản ánh thay đổi mới

Cách xử lý:

- dừng dev server
- chạy lại `npm run dev`
- nếu cần, xóa cache build local trước khi chạy lại
