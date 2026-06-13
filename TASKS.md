# TASKS

## Phase 1 - MVP Foundation

### Frontend MVP

* [x] Trang danh sách đề `/`
* [x] Alias danh sách đề `/exams`
* [x] Trang làm bài `/exam/[id]`
* [x] Trang kết quả `/exam/[id]/result`
* [x] Hiển thị câu hỏi và đáp án A/B/C/D
* [x] Đồng hồ đếm ngược
* [x] Autosave bằng `localStorage`
* [x] Khôi phục bài làm sau khi reload
* [x] Submit bài thi
* [x] Chuyển sang trang kết quả
* [x] Review đáp án
* [x] Result Page hiển thị thống kê theo chuyên đề sau submit
* [x] Search/filter đề theo keyword và topic
* [x] Filter đề theo thời lượng
* [x] Filter đề theo độ khó
* [x] Loading / Error / Empty states
* [x] UI polish theo Concept 2

### Backend MVP

* [x] API health check
* [x] API lấy danh sách đề
* [x] API `GET /api/exams` hỗ trợ query `search/topic/subtopic`
* [x] API `GET /api/exams` hỗ trợ query `durationMin/durationMax/difficulty`
* [x] API `GET /api/topics`
* [x] API lấy chi tiết đề
* [x] API submit bài thi
* [x] Submit response trả `topicStats`
* [x] Validation cơ bản cho submit
* [x] Error handling cơ bản

### Technical Cleanup

* [x] API config helper
* [x] Storage helper
* [x] DTO naming cleanup
* [x] Legacy seed cleanup
* [x] Route - Controller - Service architecture
* [x] Backend smoke test checklist
* [x] Frontend build không phụ thuộc Google Fonts
* [x] Documentation update

---

## Phase 2 - Database Foundation

### Prisma & Environment

* [x] Prisma client helper
* [x] Env guard (`DATABASE_URL`, `PORT`, ...)
* [x] Centralized config

### PostgreSQL Integration

* [x] Hoàn thiện schema Prisma
* [x] Tạo migrations
* [x] Seed dữ liệu đề thi
* [x] Chuyển `GET /api/exams` sang DB
* [x] Chuyển `GET /api/exams/:id` sang DB
* [x] Chuyển `POST /api/exam/submit` sang DB
* [x] Xóa dependency runtime vào mock data
* [x] Tách rõ DB record type khỏi API DTO trong mapper

### Database Testing

* [x] Smoke test toàn bộ API với PostgreSQL
* [x] Verify response shape không đổi
* [x] Verify frontend hoạt động không cần sửa

---

## Phase 3 - User System

### Authentication

* [x] User schema cho Google Login
* [x] JWT Access Token backend
* [x] Google auth endpoint backend
* [x] Auth middleware
* [x] Attempt gắn `userId` khi request có token hợp lệ
* [x] API `/api/auth/me`
* [x] Frontend auth config/storage
* [x] Frontend Google Login
* [x] Frontend gửi `Authorization` header khi có JWT
* [x] Logout UI tối thiểu
* [x] Bảo vệ history/attempt detail theo user
* [ ] Refresh Token
* [ ] Email/password register/login

### User Profile

* [x] Hồ sơ người dùng tối thiểu
* [x] Link tới hồ sơ người dùng sau khi login
* [x] CTA từ hồ sơ sang analytics
* [x] CTA đề nên làm tiếp trong hồ sơ
* [x] Hoạt động gần đây trong hồ sơ
* [ ] Thay đổi mật khẩu
* [ ] Cập nhật thông tin cá nhân

---

## Phase 4 - Exam History

### Attempts

* [x] Lưu lịch sử làm bài
* [x] Lưu từng đáp án đã chọn
* [x] Lưu thời gian làm bài
* [x] Lưu điểm số

### Result Tracking

* [x] API summary lịch sử làm bài theo đề
* [x] API chi tiết một lần làm bài
* [x] API chi tiết một lần làm bài trả `topicStats`
* [x] Xem lịch sử làm bài
* [x] Xem chi tiết một lần làm bài
* [x] Attempt Detail hiển thị `topicStats`
* [x] Xem lần làm gần nhất
* [x] Xem điểm cao nhất
* [x] Thống kê số lần làm
* [x] API lịch sử làm bài chỉ trả attempt của user hiện tại
* [x] API chi tiết lần làm bài chỉ cho owner xem

---

## Phase 5 - Math Rendering

### KaTeX

* [x] Render công thức toán học
* [x] Render phân số
* [x] Render căn thức
* [x] Render tích phân
* [x] Render giới hạn
* [x] Render ma trận
* [x] Render hình học cơ bản

### Question Format

* [x] Hỗ trợ nội dung LaTeX trong đề
* [x] Hỗ trợ nội dung LaTeX trong đáp án
* [x] Mock data LaTeX để kiểm thử KaTeX
* [x] Hỗ trợ hình ảnh trong câu hỏi
* [x] Render ảnh câu hỏi ở màn làm bài, result review và attempt detail
* [x] Hỗ trợ hình ảnh trong đáp án
* [x] Render ảnh đáp án ở màn làm bài, result review và attempt detail

---

## Phase 6 - Exam Content Pipeline

### Import Questions

* [x] Import đề từ JSON
* [x] Sample JSON import
* [x] Import JSON dry-run
* [x] Import JSON validation/report lỗi rõ hơn
* [x] Import JSON batch/manifest MVP
* [x] Seed/import consistency cho demo workflow
* [ ] Import đề từ Excel
* [ ] Import đề từ Word

### Admin Exam Management

* [ ] Tạo đề
* [ ] Sửa đề
* [ ] Xóa đề
* [ ] Quản lý ngân hàng câu hỏi

---

## Phase 7 - Analytics

### Topic System

* [x] Bảng Topics
* [x] Mapping Question -> Topic
* [x] Mapping Question -> Subtopic MVP
* [x] Attempt Detail có `topicStats`
* [x] Result Page sau submit hiển thị `topicStats`
* [x] Topic taxonomy cleanup MVP
* [ ] Mapping Question -> Subtopic analytics nâng cao

### User Analytics

* [x] Tính độ chính xác theo chuyên đề
* [x] API `/api/me/topic-stats` tổng hợp topic analytics theo user
* [x] Analytics dashboard nhỏ tại `/analytics`
* [x] Tính độ chính xác theo thời gian
* [x] Theo dõi tiến bộ
* [ ] Dashboard học tập

### Recommendation Engine (Không AI)

* [x] Xác định chuyên đề yếu
* [x] Gợi ý chuyên đề cần luyện
* [x] Gợi ý đề thi phù hợp
* [x] Recommendation rule improvement MVP

---

## Phase 8 - AI Features

### AI Feedback

* [ ] Sinh nhận xét sau bài thi
* [ ] Giải thích điểm mạnh
* [ ] Giải thích điểm yếu
* [ ] Đề xuất kế hoạch học tập

### AI Explanation

* [ ] Giải thích đáp án
* [ ] Giải thích từng bước giải

### AI Tutor

* [ ] Hỏi đáp theo từng câu hỏi
* [ ] Ôn tập cá nhân hóa

---

## Future Ideas

* [ ] OCR đề thi PDF
* [ ] Leaderboard
* [ ] Hệ thống thành tích
* [ ] Subscription
* [ ] Mobile app
* [ ] Thi thử nhiều người

---

## Current Focus

### Sprint hiện tại

* [x] Tạo schema Attempt / AttemptAnswer
* [x] Lưu attempt khi submit bài
* [x] Giữ response submit không đổi
* [x] Lưu thời gian làm bài
* [x] Tạo API đọc lịch sử làm bài
* [x] Tạo API chi tiết một lần làm bài
* [x] Tạo giao diện xem lịch sử làm bài
* [x] Tạo giao diện xem chi tiết một lần làm bài
* [x] Tạo User schema và migration cho Google Auth
* [x] Tạo JWT helper và backend auth endpoint
* [x] Tạo auth middleware và optional auth middleware
* [x] Gắn `Attempt.userId` khi submit có token hợp lệ
* [x] Tạo API `/api/auth/me`
* [x] Smoke test backend Google Auth foundation
* [x] Tạo frontend auth config/storage/API helper
* [x] Cài Google OAuth package cho frontend
* [x] Tạo Google Provider và Google Login button
* [x] Frontend lưu JWT ManMath sau khi login
* [x] Frontend gửi `Authorization` header khi submit/history/detail có token
* [x] Tạo route `/profile` hiển thị hồ sơ người dùng tối thiểu
* [x] Thêm link tới `/profile` trong user card sau khi login
* [x] Smoke test auth flow cơ bản
* [x] Protect `GET /api/exams/:id/attempts` theo user
* [x] Protect `GET /api/attempts/:attemptId` theo owner
* [x] Frontend xử lý 401 Unauthorized cho history/attempt detail
* [x] Tạo schema Topic
* [x] Mapping `Question -> Topic`
* [x] Seed topic và gắn `Question.topicId`
* [x] Kiểm tra dữ liệu topic trong PostgreSQL
* [x] API attempt detail trả `topicStats` theo chuyên đề
* [x] Frontend hiển thị `topicStats` trong trang chi tiết lần làm
* [x] API `/api/me/topic-stats` tổng hợp topic analytics theo user
* [x] Submit response trả `topicStats`
* [x] Hiển thị topic stats ở result page sau submit nếu phù hợp
* [x] Hoàn thiện Question Image Support MVP với `Question.imageUrl` và ảnh static path
* [x] Hoàn thiện Option Image Support MVP với `options: string[]` + `optionImageUrls` map theo index
* [x] Hoàn thiện Recommendation MVP với API `/api/me/recommendations`
* [x] Chuẩn hóa topic taxonomy cho seed/mock/import và cải thiện rule recommendation MVP
* [x] Tạo analytics dashboard nhỏ tại route `/analytics`
* [x] Tạo script import đề từ JSON và sample file import
* [x] Thêm dry-run và validation report rõ hơn cho import JSON
* [x] Chạy smoke test tối thiểu sau khi fix frontend build fonts
* [x] Làm rõ workflow `seed` / `seed:demo` / import JSON cho dữ liệu demo nhất quán

### Không làm lúc này

* [ ] AI
* [ ] OCR
* [ ] Payment
* [ ] Leaderboard
* [ ] Mobile app
