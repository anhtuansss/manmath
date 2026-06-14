# Database va Prisma

## Cong nghe

- PostgreSQL
- Prisma ORM

## Cac model chinh

### User

Luu tai khoan nguoi dung.

Field chinh:

- `id`
- `email`
- `fullName`
- `avatarUrl`
- `googleId`
- `passwordHash`
- `authProvider`

### Exam

Luu thong tin de thi.

Field chinh:

- `id`
- `title`
- `description`
- `durationMinutes`
- `subject`
- `difficulty`
- `source`
- `year`
- `statusLabel`

Ghi chu:

- `difficulty` hien dung enum `easy | medium | hard`
- `source` la metadata string optional cho nguon de
- `year` la metadata number optional cho nam thi
- metadata nay duoc expose ra exam list, exam detail va exam filter

### Topic

Luu nhom kien thuc lon.

Field chinh:

- `id`
- `name`
- `slug`
- `description`
- `order`

Topic hien la nen cho:

- topic stats
- recommendation MVP
- analytics dashboard

### Subtopic

Luu nhom kien thuc nho hon, nam trong mot `Topic`.

Field chinh:

- `id`
- `name`
- `slug`
- `topicId`

Ghi chu:

- `Subtopic` thuoc dung mot `Topic`
- `Question.subtopicId` la optional
- MVP hien chi dung `Subtopic` de tang do chi tiet cho taxonomy va DTO
- Analytics hien chua co API rieng theo subtopic

### Question

Luu tung cau hoi trong de.

Field chinh:

- `id`
- `examId`
- `order`
- `topicId`
- `subtopicId`
- `question`
- `imageUrl`
- `explanation`
- `options`
- `optionImageUrls`
- `correctAnswer`

Ghi chu:

- `imageUrl` la field optional cho Question Image Support
- `explanation` la field optional cho Explanation MVP, luu loi giai tinh co the chua KaTeX
- `optionImageUrls` la mang string map theo index voi `options`
- `subtopicId` la field optional cho Subtopic Mapping MVP
- Anh hien tai duoc luu dang static public path, vi du `/images/questions/sample-parabola.svg`
- MVP van giu `options: string[]`, chua doi sang object option model
- Explanation hien chi duoc render o result review va attempt detail, khong hien thi trong luc dang lam bai
- Question DTO / practice payload / attempt detail hien deu co the expose `imageUrl`, `optionImageUrls`, `explanation` va `subtopic`

### Attempt

Luu mot lan lam bai.

Field chinh:

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

Luu tung cau tra loi cua mot lan lam bai.

Field chinh:

- `id`
- `attemptId`
- `questionId`
- `selectedOptionIndex`
- `correctOptionIndex`
- `isCorrect`

## So do quan he

```text
User 1 --- n Attempt
Exam 1 --- n Question
Exam 1 --- n Attempt
Topic 1 --- n Question
Topic 1 --- n Subtopic
Subtopic 1 --- n Question
Attempt 1 --- n AttemptAnswer
```

## Ghi chu thiet ke

- `Attempt.userId` la nullable de van ho tro anonymous submit
- `AttemptAnswer.questionId` hien la scalar field, chua khai bao relation truc tiep toi `Question`
- Topic va Subtopic duoc giu doc lap voi attempt data; analytics tinh tu `AttemptAnswer` ket hop `Question`

## Vi sao can Topic va Subtopic

### Topic

Dung cho:

- thong ke theo nhom lon
- recommendation MVP
- dashboard tong quan

### Subtopic

Dung cho:

- phan loai cau hoi chi tiet hon
- cai thien quality cua seed/import
- mo duong cho recommendation va analytics sau nay

MVP hien tai chua chuyen he thong sang subtopic-first. Topic van la lop phan tich chinh.

## Topic taxonomy hien tai

Slug topic chinh dang dung gom:

- `ham-so`
- `nguyen-ham-tich-phan`
- `gioi-han`
- `mu-logarit`
- `xac-suat-to-hop`
- `vector-toa-do`
- `ma-tran`
- `hinh-hoc-khong-gian`

Vi du subtopic hien tai:

- `dao-ham`
- `cuc-tri`
- `do-thi-ham-so`
- `logarit-co-ban`
- `phuong-trinh-logarit`
- `tich-phan-co-ban`
- `dinh-thuc-ma-tran`
- `goc-va-khoang-cach`

Slug topic/subtopic can duoc giu nhat quan giua:

- `mockExams`
- seed
- JSON import
- recommendation / analytics services
