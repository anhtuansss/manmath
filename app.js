let appState = {
    screen: 'welcome', // welcome, exam, results
    timeLeft: examData.durationMinutes * 60,
    answers: {}, 
    timerInterval: null
};

// Khởi chạy ứng dụng
function init() {
    render();
}

function render() {
    const appEl = document.getElementById('app');
    if (appState.screen === 'welcome') {
        appEl.innerHTML = renderWelcome();
    } else if (appState.screen === 'exam') {
        appEl.innerHTML = renderTimer() + renderExam(false);
    } else if (appState.screen === 'results') {
        appEl.innerHTML = renderResults() + renderExam(true);
    }
    
    // Render công thức toán học bằng KaTeX
    if (window.renderMathInElement) {
        renderMathInElement(appEl, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    }
}

function renderWelcome() {
    return `
        <div class="flex flex-col items-center justify-center min-h-[70vh] text-center fade-in text-slate-800">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h1 class="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900">${examData.title}</h1>
            <p class="text-lg text-slate-600 mb-8 max-w-2xl">Xin chào! Bài thi mẫu gồm 3 phần theo định dạng chuẩn đánh giá năng lực môn Toán mới của Bộ Giáo dục và Đào tạo (Áp dụng từ 2025). Thời gian làm bài là <span class="font-semibold text-slate-800">${examData.durationMinutes} phút</span>.</p>
            <button onclick="startExam()" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg">
                Bắt đầu làm bài
            </button>
        </div>
    `;
}

function startExam() {
    appState.screen = 'exam';
    appState.timeLeft = examData.durationMinutes * 60;
    
    // Bắt đầu đếm ngược
    clearInterval(appState.timerInterval);
    appState.timerInterval = setInterval(() => {
        appState.timeLeft--;
        if (appState.timeLeft <= 0) {
            submitExam();
        } else {
            // Cập nhật DOM trực tiếp để tối ưu thay vì gọi render() toàn bộ trang
            const timerEl = document.getElementById('timer-display');
            if (timerEl) {
                const minutes = Math.floor(appState.timeLeft / 60);
                const seconds = appState.timeLeft % 60;
                timerEl.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }
    }, 1000);
    
    render();
    window.scrollTo(0, 0);
}

function renderTimer() {
    const minutes = Math.floor(appState.timeLeft / 60);
    const seconds = appState.timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return `
        <div class="sticky-timer flex justify-between items-center rounded-b-xl px-4 md:px-8 shadow-sm">
            <h2 class="font-semibold text-lg text-slate-800 hidden md:block w-3/4 truncate">${examData.title}</h2>
            <div class="flex items-center gap-4 ml-auto">
                <div class="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                    <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span id="timer-display" class="font-mono text-xl font-bold text-slate-800 tracking-wider w-16">${timeString}</span>
                </div>
                <button onclick="submitExam()" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-colors">
                    Nộp bài
                </button>
            </div>
        </div>
    `;
}

function handleAnswer(questionId, value) {
    appState.answers[questionId] = value;
}

function renderExam(isReview = false) {
    let html = '<form id="exam-form" class="space-y-12 pb-24 fade-in" onsubmit="event.preventDefault();">';
    
    examData.parts.forEach((part, pIdx) => {
        html += `
            <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 class="text-xl md:text-2xl font-bold mb-6 text-blue-800 border-b border-slate-100 pb-4">${part.title}</h2>
                <div class="space-y-10">
        `;
        
        part.questions.forEach((q, qIdx) => {
            html += `<div class="question-container">
                        <div class="flex gap-3 mb-4">
                            <span class="font-bold text-lg min-w-[65px] text-blue-900 border-b-2 border-transparent">Câu ${qIdx + 1}:</span>
                            <div class="text-lg leading-relaxed text-slate-800">${q.content}</div>
                        </div>
            `;
            
            if (part.type === 'multiple_choice') {
                html += `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 ml-1 md:ml-[70px]">`;
                q.options.forEach((opt, optIdx) => {
                    const isChecked = appState.answers[q.id] === optIdx;
                    const isCorrect = isReview && q.correctAnswerIndex === optIdx;
                    const isWrongSelected = isReview && isChecked && !isCorrect;
                    
                    let bgClass = "bg-slate-50 border-slate-200";
                    if (isReview) {
                        if (isCorrect) bgClass = "bg-green-50 border-green-500 font-medium text-green-900 z-10 shadow-sm";
                        else if (isWrongSelected) bgClass = "bg-red-50 border-red-500 text-red-900";
                        else bgClass = "opacity-60 bg-slate-50 border-slate-200";
                    }

                    html += `
                        <label class="option-label relative flex items-center p-4 border rounded-xl cursor-pointer ${bgClass}">
                            <input type="radio" name="q_${q.id}" value="${optIdx}" 
                                class="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500 mr-3" 
                                ${isChecked ? 'checked' : ''} 
                                ${isReview ? 'disabled' : ''}
                                onchange="handleAnswer('${q.id}', ${optIdx})">
                            <span class="text-slate-700 w-full">${opt}</span>
                            ${isReview && isCorrect ? '<svg class="w-6 h-6 text-green-500 absolute right-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
                            ${isReview && isWrongSelected ? '<svg class="w-6 h-6 text-red-500 absolute right-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>' : ''}
                        </label>
                    `;
                });
                html += `</div>`;
            } else if (part.type === 'true_false') {
                html += `<div class="ml-1 md:ml-[70px] space-y-3 overflow-x-auto">
                            <table class="w-full text-left border-collapse min-w-[400px]">
                                <thead>
                                    <tr class="border-b border-slate-200 text-slate-500 text-sm">
                                        <th class="py-2 font-medium">Mệnh đề (Phát biểu)</th>
                                        <th class="py-2 text-center w-24 font-medium">Đúng</th>
                                        <th class="py-2 text-center w-24 font-medium">Sai</th>
                                    </tr>
                                </thead>
                                <tbody>
                `;
                q.statements.forEach((stmt, idx) => {
                    const ans = appState.answers[stmt.id];
                    
                    html += `<tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                <td class="py-4 pr-4 text-slate-700 font-medium"><b>${String.fromCharCode(97+idx)})</b> ${stmt.text}</td>
                                <td class="py-4 text-center">
                                    <div class="flex justify-center">
                                        <input type="radio" name="tf_${stmt.id}" value="true" 
                                            class="w-6 h-6 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                            ${ans === true ? 'checked' : ''}
                                            ${isReview ? 'disabled' : ''}
                                            onchange="handleAnswer('${stmt.id}', true)">
                                    </div>
                                </td>
                                <td class="py-4 text-center">
                                    <div class="flex justify-center">
                                        <input type="radio" name="tf_${stmt.id}" value="false" 
                                            class="w-6 h-6 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                                            ${ans === false ? 'checked' : ''}
                                            ${isReview ? 'disabled' : ''}
                                            onchange="handleAnswer('${stmt.id}', false)">
                                    </div>
                                </td>
                            </tr>
                    `;
                    
                    if (isReview) {
                        const correctVal = stmt.correctValue;
                        const isCorrect = ans === correctVal;
                        
                        let badgeHtml = '';
                        if (isCorrect) {
                            badgeHtml = '<div class="inline-flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-md text-sm font-semibold"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Chính xác</div>';
                        } else {
                            if (ans === undefined) {
                                badgeHtml = `<div class="inline-flex items-center gap-1 text-slate-700 bg-slate-200 px-3 py-1 rounded-md text-sm font-semibold">Chưa trả lời (Đáp án: ${correctVal ? 'Đúng' : 'Sai'})</div>`;
                            } else {
                                badgeHtml = `<div class="inline-flex items-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-md text-sm font-semibold"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg> Sai (Đáp án đúng: ${correctVal ? 'Đúng' : 'Sai'})</div>`;
                            }
                        }
                        
                        html += `<tr class="${isCorrect ? 'bg-green-50/50' : 'bg-red-50/50'}"><td colspan="3" class="pb-3 pt-1 border-b border-slate-100 pl-4">${badgeHtml}</td></tr>`;
                    }
                });
                html += `</tbody></table></div>`;
            } else if (part.type === 'short_answer') {
                const ans = appState.answers[q.id] || '';
                const isCorrect = isReview && parseFloat(ans.toString().replace(',','.')) === parseFloat(q.correctAnswer);
                
                let inputClass = "w-full md:w-1/2 p-3 font-semibold border-2 rounded-lg focus:ring-0 outline-none text-lg transition-colors";
                if (isReview) {
                    if (isCorrect) inputClass += " bg-green-50 border-green-500 text-green-900";
                    else inputClass += " bg-red-50 border-red-500 text-red-900";
                } else {
                    inputClass += " bg-slate-50 border-slate-300 focus:border-blue-500 focus:bg-white";
                }
                
                html += `<div class="ml-1 md:ml-[70px] mt-4">
                            <label class="block text-sm font-medium text-slate-700 mb-2">Nhập đáp án của bạn:</label>
                            <input type="text" 
                                class="${inputClass}" 
                                placeholder="Ví dụ: 120.5" 
                                value="${ans}"
                                ${isReview ? 'disabled' : ''}
                                oninput="handleAnswer('${q.id}', this.value)">
                `;
                if (isReview && !isCorrect) {
                     html += `<div class="mt-3 text-red-600 bg-red-50 p-3 rounded-md border border-red-100 inline-block">Đáp án đúng: <span class="font-bold text-lg text-red-700">${q.correctAnswer}</span></div>`;
                }
                html += `</div>`;
            }
            
            // Show explanation if in review mode
            if (isReview && q.explanation) {
                html += `
                    <div class="ml-1 md:ml-[70px] mt-6 bg-amber-50 rounded-xl border border-amber-200 overflow-hidden shadow-sm">
                        <div class="bg-amber-100 px-4 py-2 border-b border-amber-200 flex items-center gap-2">
                           <h4 class="font-bold text-amber-900">Lời giải chi tiết</h4>
                        </div>
                        <div class="p-4 text-slate-800 text-base leading-relaxed">${q.explanation}</div>
                    </div>
                `;
            }
            
            html += `</div>`; // end question
            if (qIdx < part.questions.length - 1) html += '<hr class="my-8 border-slate-200">';
        });
        
        html += `</div></div>`; // end part
    });
    
    // Bottom sticky submit button (only during exam)
    if (!isReview) {
        html += `
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] z-40">
                <div class="max-w-4xl mx-auto flex justify-between items-center px-4">
                    <div class="text-slate-500 font-medium hidden sm:block">Đã trả lời: <span id="answered-count" class="text-blue-600 font-bold text-lg bg-blue-50 px-2 py-1 rounded">0</span></div>
                    <button type="button" onclick="submitExam()" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 md:px-12 rounded-xl shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
                        Hoàn thành bài thi
                    </button>
                </div>
            </div>
        `;
    }
    
    html += '</form>';
    return html;
}

function submitExam() {
    if (appState.screen === 'exam') {
        if(appState.timeLeft > 0) {
            if(!confirm("Bạn có chắc chắn muốn nộp bài ngay bây giờ?")) return;
        }
        clearInterval(appState.timerInterval);
        appState.screen = 'results';
        render();
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}

function renderResults() {
    // Grade exam based on 2025 rule
    let totalScore = 0;
    
    let p1Correct = 0, p2CorrectIds = 0, p3Correct = 0;
    
    examData.parts.forEach(p => {
        if(p.type === 'multiple_choice') {
            p.questions.forEach(q => {
                if(appState.answers[q.id] === q.correctAnswerIndex) {
                    totalScore += 0.25; // 0.25đ / câu
                    p1Correct++;
                }
            });
        }
        else if(p.type === 'true_false') {
            p.questions.forEach(q => {
                let correctCount = 0;
                q.statements.forEach(stmt => {
                    if (appState.answers[stmt.id] === stmt.correctValue) correctCount++;
                });
                if (correctCount === 1) totalScore += 0.1;
                else if (correctCount === 2) totalScore += 0.25;
                else if (correctCount === 3) totalScore += 0.5;
                else if (correctCount === 4) { totalScore += 1.0; p2CorrectIds++; }
            });
        }
        else if(p.type === 'short_answer') {
            p.questions.forEach(q => {
                const ans = appState.answers[q.id] || '';
                // Chuẩn hóa dấu phẩy thành dấu chấm
                const parsedAns = parseFloat(ans.toString().replace(',','.'));
                if(!isNaN(parsedAns) && parsedAns === parseFloat(q.correctAnswer)) {
                    totalScore += 0.5; // 0.5đ / câu
                    p3Correct++;
                }
            });
        }
    });

    return `
        <div class="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200 mb-8 text-center fade-in relative overflow-hidden">
            <!-- Decorative circle -->
            <div class="absolute -top-20 -right-20 w-40 h-40 bg-blue-50 rounded-full opacity-50"></div>
            
            <h2 class="text-3xl font-bold text-slate-800 mb-2 relative z-10">Kết Quả Bài Thi</h2>
            <p class="text-slate-500 mb-8 relative z-10">Bài thi được chấm tự động dựa trên cấu trúc điểm 2025</p>
            
            <div class="mx-auto flex flex-col items-center justify-center w-48 h-48 rounded-full border-[10px] border-blue-500 mb-8 bg-blue-50 relative z-10 shadow-inner">
                <span class="text-6xl font-black text-blue-700 tracking-tighter">${totalScore.toFixed(2)}</span>
                <span class="text-base font-bold text-blue-500 mt-1 uppercase">/ 10 Điểm</span>
            </div>
            
            <div class="max-w-md mx-auto text-left bg-slate-50 p-6 rounded-xl border border-slate-100 shadow-sm relative z-10">
                <ul class="space-y-4">
                    <li class="flex justify-between items-center">
                        <span class="text-slate-600 font-medium">Thời gian hoàn thành:</span> 
                        <span class="font-bold text-slate-900 bg-white px-3 py-1 rounded-md border border-slate-200 shadow-sm">${Math.floor((examData.durationMinutes*60 - appState.timeLeft)/60)}p ${((examData.durationMinutes*60 - appState.timeLeft)%60).toString().padStart(2, '0')}s</span>
                    </li>
                    <li class="flex justify-between items-center border-t border-slate-200 pt-4">
                        <span class="text-slate-600 font-medium">Trắc nghiệm nhiều lựa chọn:</span> 
                        <span class="font-bold text-green-700">${p1Correct} câu</span>
                    </li>
                    <li class="flex justify-between items-center">
                        <span class="text-slate-600 font-medium">Trắc nghiệm Đúng/Sai:</span> 
                        <span class="font-bold text-green-700">${p2CorrectIds} câu <span class="text-xs font-normal text-slate-400 block text-right">(đúng trọn vẹn 4 ý)</span></span>
                    </li>
                    <li class="flex justify-between items-center pb-2">
                        <span class="text-slate-600 font-medium">Trả lời ngắn:</span> 
                        <span class="font-bold text-green-700">${p3Correct} câu</span>
                    </li>
                </ul>
            </div>
            
            <div class="mt-10 relative z-10">
                <button onclick="location.reload()" class="bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mx-auto">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Làm lại bài thi
                </button>
            </div>
        </div>
        
        <div class="flex items-center gap-3 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 class="text-xl font-bold text-blue-900">Xem lại chi tiết đáp án & lời giải</h3>
        </div>
    `;
}

// Cập nhật số câu đã làm liên tục khi đang làm bài
setInterval(() => {
    if (appState.screen === 'exam') {
        const countSpan = document.getElementById('answered-count');
        if (countSpan) {
            let answeredQuestions = 0;
            // Một chút phức tạp để đếm:
            // Phần 1 & 3: mỗi id là 1 câu
            // Phần 2: mỗi ý (a,b,c,d) là 1 answer. Không tính theo ý, ta đếm chung các keys trong appState.answers hiện tại cho đơn giản (số thao tác đã chọn).
            // Thực tế có thể đếm chính xác số câu, nhưng ở mức cơ bản, đếm số thao tác là được.
            
            countSpan.innerText = Object.keys(appState.answers).length;
        }
    }
}, 500);

// Chạy ứng dụng khi DOM đã tải xong
document.addEventListener('DOMContentLoaded', init);
