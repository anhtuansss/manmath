const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Exam = require('../models/Exam');

dotenv.config({ path: '../../../.env' }); // Trỏ đúng về file .env ở root project

const examData = {
  "title": "Đề chính thức kỳ thi tốt nghiệp THPT năm 2025 môn Toán",
  "durationMinutes": 90,
  "parts": [
    {
      "type": "multiple_choice",
      "title": "Phần 1: Câu trắc nghiệm nhiều phương án lựa chọn",
      "questions": [
        {
          "id": "1",
          "content": "Để gây quỹ từ thiện, câu lạc bộ thiện nguyện của một trường THPT tổ chức hoạt động bán hàng với hai mặt hàng là nước chanh và khoai chiên. Câu lạc bộ thiết kế hai thực đơn. Thực đơn 1 có giá $35$ nghìn đồng, bao gồm hai cốc nước chanh và một túi khoai chiên. Thực đơn 2 có giá $55$ nghìn đồng, bao gồm ba cốc nước chanh và hai túi khoai chiên. Biết rằng câu lạc bộ chỉ làm được không quá $165$ cốc nước chanh và $100$ túi khoai chiên. Số tiền lớn nhất mà câu lạc bộ có thể nhận được sau khi bán hết hàng bằng bao nhiêu nghìn đồng?",
          "options": ["A. 2500", "B. 2750", "C. 3000", "D. 3100"],
          "correctAnswerIndex": 1,
          "explanation": "Gợi ý: Gọi $x, y$ là số lượng thực đơn 1 và 2. Thiết lập quy hoạch tuyến tính để tìm giá trị lớn nhất."
        }
      ]
    },
    {
      "type": "true_false",
      "title": "Phần 2: Câu trắc nghiệm đúng/sai",
      "questions": [
        {
          "id": "2",
          "content": "Một phần mềm nhận dạng tin nhắn quảng cáo trên điện thoại bằng cách dựa theo từ khóa để đánh dấu một số tin nhắn được gửi đến. Qua một thời gian dài sử dụng, người ta thấy rằng trong số tất cả các tin nhắn gửi đến, có $20\\%$ số tin nhắn bị đánh dấu. Trong số các tin nhắn bị đánh dấu, có $10\\%$ số tin nhắn không phải là quảng cáo. Trong số các tin nhắn không bị đánh dấu, có $10\\%$ số tin nhắn là quảng cáo. Chọn ngẫu nhiên một tin nhắn được gửi đến điện thoại.",
          "statements": [
            { "id": "2a", "text": "Xác suất để tin nhắn đó không bị đánh dấu bằng $0,8$.", "correctValue": true },
            { "id": "2b", "text": "Xác suất để tin nhắn đó không phải là quảng cáo, biết rằng nó không bị đánh dấu, bằng $0,95$.", "correctValue": true },
            { "id": "2c", "text": "Xác suất để tin nhắn đó không phải là quảng cáo bằng $0,76$.", "correctValue": false },
            { "id": "2d", "text": "Xác suất để tin nhắn đó không bị đánh dấu, biết rằng nó không phải là quảng cáo, nhỏ hơn $0,95$.", "correctValue": false }
          ],
          "explanation": "Gợi ý: Sử dụng sơ đồ cây xác suất hoặc định lý Bayes."
        }
      ]
    },
    {
      "type": "short_answer",
      "title": "Phần 3: Câu trắc nghiệm trả lời ngắn",
      "questions": [
        {
          "id": "3",
          "content": "Để đặt được một vật trang trí trên mặt bàn, người ta thiết kế một chân đế như sau. Lấy một khối gỗ có dạng khối chóp cụt tứ giác đều với độ dài hai cạnh đáy lần lượt bằng $7,4 \\text{ cm}$ và $10,4 \\text{ cm}$, bề dày của khối gỗ bằng $1,5 \\text{ cm}$. Sau đó khoét bỏ đi một phần của khối gỗ sao cho phần đó có dạng vật thể $H$, ở đó $H$ nhận được bằng cách cắt khối cầu bán kính $5,7 \\text{ cm}$ bởi một mặt phẳng cắt mà mặt cắt là hình tròn bán kính $3,5 \\text{ cm}$. Thể tích của khối chân đế bằng bao nhiêu centimét khối (không làm tròn kết quả các phép tính trung gian, chỉ làm tròn kết quả cuối cùng đến hàng phần mười)?",
          "correctAnswer": "120.5",
          "explanation": "Gợi ý: Thể tích vật thể bằng thể tích chóp cụt trừ đi phần chỏm cầu bị khoét."
        }
      ]
    }
  ]
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding');
        
        await Exam.deleteMany(); // Xóa data cũ (nếu có)
        await Exam.create(examData); // Đẩy data mới
        
        console.log('Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDB();
