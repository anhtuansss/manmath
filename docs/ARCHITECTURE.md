# Kiến trúc ManMath

## Tổng quan

ManMath gồm hai phần chính:

- Frontend Next.js để hiển thị danh sách đề, màn làm bài, kết quả, lịch sử và hồ sơ người dùng
- Backend Express để xử lý đề thi, submit bài, auth, history và analytics

Database hiện dùng PostgreSQL, truy cập qua Prisma ORM.

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

## Trách nhiệm từng lớp

### Frontend

- Render giao diện danh sách đề, làm bài, kết quả, history, profile
- Gọi backend API qua `NEXT_PUBLIC_API_BASE_URL`
- Lưu autosave bài làm bằng `localStorage`
- Lưu kết quả submit tạm thời để hiển thị ở result page
- Gửi JWT khi user đã đăng nhập
- Render KaTeX, ảnh câu hỏi nếu `question.imageUrl` có dữ liệu, và ảnh đáp án nếu `optionImageUrls` có dữ liệu

### Backend

- Nhận request HTTP từ frontend
- Phân tách theo route, middleware, controller, service
- Verify Google credential
- Ký và verify JWT
- Chấm điểm bài thi
- Lưu attempt, attempt answer, topic analytics
- Expose `imageUrl` và `optionImageUrls` trong exam detail và attempt detail để frontend render ảnh câu hỏi/đáp án

### Database

- Lưu đề thi, câu hỏi, topic
- Lưu user
- Lưu lịch sử làm bài
- Lưu dữ liệu phục vụ analytics theo user

## Luồng request tổng quát

```text
Request
→ Route
→ Middleware
→ Controller
→ Service
→ Prisma
→ PostgreSQL
```

## Luồng làm bài

```text
User vào /exam/[id]
→ Frontend gọi GET /api/exams/:id
→ Render câu hỏi, ảnh minh họa câu hỏi và ảnh minh họa đáp án nếu có
→ User chọn đáp án
→ Frontend autosave localStorage
→ User submit
→ Frontend gọi POST /api/exam/submit
→ Backend chấm điểm + lưu Attempt
→ Frontend chuyển sang /exam/[id]/result
```

## Luồng lịch sử làm bài

```text
User đã login
→ Frontend gọi GET /api/exams/:id/attempts
→ Backend dùng authMiddleware
→ Service chỉ lấy attempt của user hiện tại
→ Frontend hiển thị danh sách lần làm
```

## Luồng chi tiết attempt

```text
User đã login
→ Frontend gọi GET /api/attempts/:attemptId
→ Backend dùng authMiddleware
→ Service kiểm tra owner
→ Trả chi tiết attempt + answers + topicStats + imageUrl/optionImageUrls nếu câu hoặc đáp án có ảnh
```

## Luồng topic analytics

### Theo lần submit

```text
POST /api/exam/submit
→ Backend chấm từng câu
→ Gom nhóm theo topic
→ Trả topicStats trong response
```

### Theo attempt detail

```text
GET /api/attempts/:attemptId
→ Backend đọc AttemptAnswer của attempt đó
→ Gom nhóm theo topic
→ Trả topicStats
```

### Theo user

```text
GET /api/me/topic-stats
→ Backend lấy các attempt của user hiện tại
→ Tổng hợp theo topic
→ Trả topicStats đã sort
```

## Luồng recommendation MVP

```text
User đã login
→ Frontend gọi GET /api/me/recommendations
→ Backend lấy topicStats của user
→ Xác định các chuyên đề yếu
→ Tìm các đề có nhiều câu thuộc nhóm topic yếu
→ Trả weakTopics + recommendedExams
→ Frontend hiển thị card gợi ý ở Exam List / Profile
```

## Luồng analytics dashboard nhỏ

```text
User vào /analytics
→ Frontend kiểm tra trạng thái đăng nhập
→ Nếu có token, gọi GET /api/me/topic-stats
→ Gọi thêm GET /api/me/progress để lấy summary + recent attempts + progress theo thời gian
→ Nếu có recommendation API, gọi thêm GET /api/me/recommendations
→ Render các block:
  - tổng quan chuyên đề
  - tiến độ gần đây
  - chuyên đề yếu
  - chuyên đề mạnh
  - đề nên làm tiếp
```

## Luồng recent activity trong hồ sơ

```text
User vào /profile
→ Frontend kiểm tra token
→ Nếu đã login, gọi GET /api/auth/me
→ Gọi thêm GET /api/me/progress
→ Lấy `recentAttempts` để hiển thị block hoạt động gần đây
→ Nếu có recommendation API, hiển thị CTA đề nên làm tiếp
```
