# Import de tu JSON

## Muc dich

Import JSON dung de them hoac cap nhat de thi vao PostgreSQL ma khong can sua truc tiep file seed.

MVP hien tai phu hop cho:

- them de moi nhanh hon
- chuan hoa du lieu truoc khi dua de that vao he thong
- test image support, topic, subtopic va option image

Hien tai chua co admin UI va chua ho tro upload file qua web.

## Workflow khuyen nghi

### Reset du lieu mock chuan

```bash
cd backend
npm run seed
```

### Setup demo day du

```bash
cd backend
npm run seed:demo
```

Lenh nay:

- seed lai cac de mock chuan
- import them `sample-json-exam-01`

## Lenh import

```bash
cd backend
npm run import:exam -- ./src/data/import/sample-exam.json
```

### Dry-run

```bash
cd backend
npm run import:exam -- ./src/data/import/sample-exam.json --dry-run
```

Dry-run se:

- doc file JSON
- validate du lieu
- in summary
- khong ghi vao database

## Script hien tai lam gi

- upsert `Exam`
- upsert `Topic` theo `slug`
- upsert `Subtopic` theo `slug` neu co
- upsert `Question` theo `id`
- ho tro `imageUrl`
- ho tro `optionImageUrls`
- ho tro `topic`
- ho tro `subtopic`

Import lai cung `exam.id` se update, khong tao duplicate.

## Summary cua dry-run

Dry-run hien in:

- `exam id`
- `title`
- so cau hoi
- so topic detect duoc
- so subtopic detect duoc
- so cau co `imageUrl`
- so cau co `optionImageUrls`

## JSON format day du

```json
{
  "id": "sample-json-exam-01",
  "title": "De import mau tu JSON",
  "description": "De mau de test import pipeline",
  "durationMinutes": 90,
  "subject": "Toan",
  "difficulty": "medium",
  "year": 2026,
  "statusLabel": "Imported JSON",
  "questions": [
    {
      "id": 1001,
      "question": "Cho ham so $y=x^2$. Do thi cua ham so la gi?",
      "imageUrl": "/images/questions/sample-parabola.svg",
      "options": [
        "A. Duong thang",
        "B. Parabol",
        "C. Duong tron",
        "D. Hyperbol"
      ],
      "optionImageUrls": ["", "", "", ""],
      "correctAnswer": "B. Parabol",
      "topic": {
        "name": "Ham so",
        "slug": "ham-so"
      },
      "subtopic": {
        "name": "Do thi ham so",
        "slug": "do-thi-ham-so"
      }
    }
  ]
}
```

## Field bat buoc

### Cap do exam

- `id`
- `title`
- `durationMinutes`
- `questions`

### Cap do question

- `id`
- `question`
- `options`
- `correctAnswer`

## Field optional

### Cap do exam

- `description`
- `subject`
- `difficulty`
- `year`
- `statusLabel`

### Cap do question

- `imageUrl`
- `optionImageUrls`
- `topic`
- `subtopic`

### Cap do topic / subtopic

- `name`
- `slug`

## Rule du lieu

- `correctAnswer` phai nam trong `options`
- `options` hien nen co dung 4 dap an
- `optionImageUrls` map theo index voi `options`
- `optionImageUrls[index] = ""` duoc hieu la dap an do khong co anh
- `question.id` khong duoc trung trong cung file import
- `question.id` cung khong duoc trung voi question dang thuoc exam khac
- neu co `subtopic` thi phai co `topic`
- `subtopic` duoc import vao dung `topic`; khong co co che infer topic tu dong de tranh sai taxonomy

## Validation hien co

Script hien bao loi ro theo field/path, vi du:

- `id is required`
- `durationMinutes must be a positive integer`
- `questions must be a non-empty array`
- `questions[2].id must be a positive integer`
- `questions[3].question is required`
- `questions[1].options must contain exactly 4 items`
- `questions[3].correctAnswer must be one of options`
- `questions[0].optionImageUrls must be an array of strings`
- `questions[0].topic.slug must contain only lowercase letters, numbers, and hyphens`
- `questions[0].subtopic requires topic to be provided`
- `questions contain duplicate id: 1001`

Neu file co nhieu loi, script se in toan bo danh sach loi.

## Gioi han hien tai

- chua import Word
- chua import PDF
- chua import Excel
- chua co OCR
- chua co AI parse de
- chua co upload anh
- chua co admin UI
- image support hien dung static public path
- topic/subtopic taxonomy hien van la MVP, chua co taxonomy manager

## Troubleshooting

### Thieu `DATABASE_URL`

- kiem tra `backend/.env`
- dam bao database local dang chay

### Prisma Client chua san sang

```bash
cd backend
npx prisma generate
```

### `correctAnswer` khong nam trong `options`

- kiem tra chuoi trong `correctAnswer`
- chuoi nay phai khop mot phan tu trong `options`

### `subtopic` co nhưng `topic` thieu

- bo sung object `topic`
- dam bao `subtopic` thuoc dung topic do

### Dry-run pass nhung import that fail

- kiem tra `question.id` co dang thuoc exam khac trong DB khong
- neu la de moi, doi sang dai `question.id` chua dung

### Sai path file JSON

Vi du dung:

```bash
cd backend
npm run import:exam -- ./src/data/import/sample-exam.json
```
