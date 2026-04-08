'use client';
import { useState, useEffect } from 'react';
import mockData from '../mockData.json';

export default function Exampage() {
  const [answers, setAnswers] = useState<Record<number,number>>({});

  useEffect(() => {
    const saveData = localStorage.getItem('exam-answers');

    if (saveData) {
      setAnswers(JSON.parse(saveData));
    }
  }, []);

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    const newAnswer = {
      ...answers,
      [questionId]: optionIndex
    };

    setAnswers(newAnswer);
    localStorage.setItem('exam-answers', JSON.stringify(newAnswer));
  };

  const handleSubmit = () => {
    alert('Bài làm đã được nộp!');
  };

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px', 
      fontFamily: 'sans-serif' 
    }}>
      
      {/* 2. CHIA 2 CỘT: Dùng display: flex để dàn hàng ngang */}
      <div style={{ 
        display: 'flex', 
        gap: '20px',      
        border: '2px solid #ccc', 
        borderRadius: '16px',    
        padding: '20px'
      }}>

        {/* CỘT TRÁI */}
        <div style={{ 
          flex: 3,                 // Chiếm 3 phần không gian
          display: 'flex',         
          flexDirection: 'column', 
          gap: '20px'              
        }}>
          
          {/* Khung Tên đề */}
          <div style={{ 
            padding: '15px', 
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '20px'
          }}>
            Tên đề: Toán THPT Quốc Gia
          </div>

          {/* Khung Nội dung đề */}
          <div style={{ 
            padding: '20px',
            minHeight: '500px'
          }}>
            {mockData.questions.map((q, index) => (
              <div key={q.id} style={{ 
                                border: '1px solid #ccc', 
                                padding: '15px', 
                                borderRadius: '8px',
                                marginBottom: '15px'
                              }}>
                <h3>Câu {index + 1}: {q.question}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {q.options.map((choice, cIndex) => {
                    const isSelected = answers[q.id] === cIndex;
              
                    return (
                      <button 
                        key={cIndex}
                        onClick={() => handleSelectAnswer(q.id, cIndex)}
                        style={{ 
                          padding: '10px', 
                          textAlign: 'left', 
                          cursor: 'pointer', 
                          borderRadius: '5px', 
                          border: '1px solid #999', 
                          
                          backgroundColor: isSelected ? '#cce5ff' : 'white',
                          borderColor: isSelected ? '#007bff' : '#999',
                          borderWidth: isSelected ? '2px' : '1px',
                          fontWeight: isSelected ? 'bold' : 'normal',
                          borderStyle: 'solid',
                          color: isSelected ? '#007bff' : 'black'
                        }}

                        onMouseOver={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.borderColor = '#9ca3af';
                          }
                        }}

                        onMouseOut={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = "white";
                            e.currentTarget.style.borderColor = "#ccc";
                          }
                        }}
                      >
                        {choice}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CỘT PHẢI */}
        <div style={{ 
          flex: 1, // Chiếm 1 phần không gian
        }}>
          
          {/* Khung Sidebar thời gian */}
          <div style={{
             border: '2px solid #ccc', 
             borderRadius: '12px', 
             padding: '20px',
             position: 'sticky', 
             top: '20px' 
          }}>
            <h3 style={{ textAlign: 'center', color: 'red', marginTop: 0 }}>⏳ 90:00</h3>
            <hr style={{ borderColor: '#eee' }} />
            <p>Số câu đã làm: 0/3</p>
            <p>Đánh dấu xem lại: 0</p>
            
            {/* Vùng chứa lưới ô vuông chọn câu */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(5, 1fr)', 
              gap: '5px', 
              marginTop: '20px' 
            }}>
              {/* 3 ô vuông tương đương 10 câu */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ border: '1px solid #ccc', padding: '10px 0', textAlign: 'center', borderRadius: '4px' }}>
                  {i + 1}
                </div>
              ))}
            </div>

            <button onClick={handleSubmit} style={{ 
              width: '100%', 
              marginTop: '20px', 
              padding: '10px', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: 'pointer'
            }}> 
              Nộp bài
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}