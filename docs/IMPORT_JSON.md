# Import đề từ JSON

## Mục đích

Import JSON dùng để thêm hoặc cập nhật đề thi vào PostgreSQL mà không cần sửa trực tiếp file seed. Đây là pipeline MVP để:

- thêm đề mới nhanh hơn
- chuẩn bị dữ liệu thật theo format ổn định
- tránh phải hardcode toàn bộ đề trong source code

Hiện tại tính năng này chạy qua backend script, chưa có admin UI và chưa hỗ trợ upload file từ web.

## Workflow khuyến nghị

### Khi cần reset dữ liệu mock chuẩn

```bash
cd backend
npm run seed
```

Lệnh này chỉ tạo lại các đề mock chuẩn trong `mockExams`.

### Khi cần setup demo đầy đủ

```bash
cd backend
npm run seed:demo
```

Lệnh này sẽ:

- chạy `seed` để tạo lại dữ liệu mock chuẩn
- import thêm `sample-json-exam-01` từ file JSON mẫu

Nếu bạn muốn có ngay cả đề mock và đề JSON mẫu để mở trên web, đây là lệnh nên dùng.

## Lệnh chạy import

```bash
cd backend
npm run import:exam -- ./src/data/import/sample-exam.json
```

Script hiện tại:

- đọc file JSON từ đường dẫn truyền vào
- validate dữ liệu cơ bản
- upsert `Exam`
- upsert `Topic` theo `slug` nếu có
- upsert `Question` theo `id`
- hỗ trợ cả `imageUrl` và `optionImageUrls` nếu file JSON có cung cấp

Nếu import lại cùng một file hoặc cùng `exam.id`, dữ liệu sẽ được cập nhật thay vì tạo duplicate.

## JSON format đầy đủ

```json
{
  "id": "sample-json-exam-01",
  "title": "Đề import mẫu từ JSON",
  "description": "Đề mẫu để kiểm tra import pipeline JSON vào PostgreSQL",
  "durationMinutes": 90,
  "subject": "Toán",
  "difficulty": "medium",
  "year": 2026,
  "statusLabel": "Imported JSON",
  "questions": [
    {
      "id": 1001,
      "question": "Cho hàm số $y=x^2$. Đồ thị của hàm số là gì?",
      "imageUrl": "/images/questions/sample-parabola.svg",
      "options": [
        "A. Đường thẳng",
        "B. Parabol",
        "C. Đường tròn",
        "D. Hyperbol"
      ],
      "optionImageUrls": ["", "", "", ""],
      "correctAnswer": "B. Parabol",
      "topic": {
        "name": "Hàm số",
        "slug": "ham-so"
      }
    }
  ]
}
```

## Field bắt buộc

### Cấp độ exam

- `id`
- `title`
- `durationMinutes`
- `questions`

### Cấp độ question

- `id`
- `question`
- `options`
- `correctAnswer`

## Field optional

### Cấp độ exam

- `description`
- `subject`
- `difficulty`
- `year`
- `statusLabel`

### Cấp độ question

- `imageUrl`
- `optionImageUrls`
- `topic`

### Cấp độ topic

- `name`
- `slug`

Lưu ý: object `topic` là optional, nhưng nếu đã có `topic` thì cả `name` và `slug` đều phải hợp lệ.

## Quy tắc dữ liệu

- `correctAnswer` phải nằm trong `options`
- `options` hiện nên có đúng 4 đáp án
- `optionImageUrls` map theo index với `options`
- `optionImageUrls[index] = ""` được hiểu là đáp án đó không có ảnh
- import lại cùng `exam.id` sẽ update, không tạo duplicate exam
- `question.id` không được trùng trong cùng file import
- `question.id` cũng không được “mượn” từ exam khác; script sẽ chặn nếu câu hỏi đó đã thuộc một đề khác

## Giới hạn hiện tại của MVP

- chưa import Word
- chưa import PDF
- chưa import Excel
- chưa có OCR
- chưa có AI parse đề
- chưa có upload ảnh
- chưa có admin UI để import qua web
- ảnh hiện dùng static public path, ví dụ `/images/questions/sample-parabola.svg`

## Ví dụ JSON ngắn

```json
{
  "id": "mini-json-exam-01",
  "title": "Đề JSON ngắn",
  "durationMinutes": 45,
  "questions": [
    {
      "id": 2001,
      "question": "Tính $$\\int_0^1 x^2\\,dx$$",
      "options": [
        "A. $\\frac{1}{2}$",
        "B. $\\frac{1}{3}$",
        "C. $1$",
        "D. $0$"
      ],
      "correctAnswer": "B. $\\frac{1}{3}$",
      "topic": {
        "name": "Tích phân",
        "slug": "tich-phan"
      }
    }
  ]
}
```

## Troubleshooting

### Thiếu `DATABASE_URL`

Triệu chứng:

- script báo lỗi kết nối Prisma/PostgreSQL

Cách xử lý:

- kiểm tra `backend/.env`
- đảm bảo `DATABASE_URL` trỏ đúng database local đang dùng

### Prisma Client chưa sẵn sàng

Triệu chứng:

- TypeScript hoặc runtime báo lỗi liên quan Prisma client

Cách xử lý:

```bash
cd backend
npx prisma generate
```

### `correctAnswer` không nằm trong `options`

Triệu chứng:

- script dừng với lỗi validation

Cách xử lý:

- kiểm tra chính xác chuỗi trong `correctAnswer`
- chuỗi này phải khớp một phần tử trong `options`

### Đường dẫn file JSON sai

Triệu chứng:

- script báo không tìm thấy file hoặc JSON không hợp lệ

Cách xử lý:

- kiểm tra path truyền vào sau `npm run import:exam --`
- ưu tiên dùng path tương đối từ thư mục `backend/`

Ví dụ đúng:

```bash
cd backend
npm run import:exam -- ./src/data/import/sample-exam.json
```

### `question.id` bị trùng với đề khác

Triệu chứng:

- script báo không thể import vì câu hỏi đang thuộc exam khác

Cách xử lý:

- đổi `question.id` sang id chưa dùng
- hoặc xác nhận bạn thực sự đang cập nhật đúng đề cũ
