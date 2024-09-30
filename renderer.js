const flashcards = [];

// Local에 저장
function saveFlashcards() {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

// Load
function loadFlashcards() {
  const savedFlashcards = localStorage.getItem('flashcards');
  if (savedFlashcards) {
    flashcards.push(...JSON.parse(savedFlashcards));
    displayFlashcards();
  }
}

// Display
function displayFlashcards() {
  const flashcardsList = document.getElementById('flashcards');
  flashcardsList.innerHTML = '';  // 초기화

  flashcards.forEach((card, index) => {
    const flashcardItem = document.createElement('li');
    flashcardItem.innerHTML = `
      <strong>Q: </strong> ${card.question} <br/>
      <strong>A: </strong> ${card.answer}
      <button onclick="editFlashcard(${index})">수정</button>
      <button onclick="deleteFlashcard(${index})">삭제</button>
    `;
    flashcardsList.appendChild(flashcardItem);
  });
}

// Clear question & answer inputs after adding/updating
function clearInputs() {
  document.getElementById('questionInput').value = '';
  document.getElementById('answerInput').value = '';
}

// Warning sign 나타내기
function popWarning() {
  const warning = document.getElementById('warning');
  warning.textContent = '질문과 답을 모두 입력해주세요.';
}
// Warning sign 없애기
function noWarning() {
  const warning = document.getElementById('warning');
  warning.textContent = '';
}

// 추가 & 저장
function addFlashcard() {
  const questionInput = document.getElementById('questionInput');
  const answerInput = document.getElementById('answerInput');

  const question = questionInput.value.trim()
  const answer = answerInput.value.trim()

  if (question === "" || answer === "") {
    popWarning();
    if (question === "") {
      questionInput.focus();
    } else {
      answerInput.focus();
    }
    return;
  }

  const newFlashcard = {
    question: question,
    answer: answer
  };

  flashcards.push(newFlashcard);
  saveFlashcards();
  displayFlashcards();
  clearInputs();
  noWarning();
}


// 수정
function editFlashcard(index) {
  const questionInput = document.getElementById('questionInput');
  const answerInput = document.getElementById('answerInput');

  // 기존 내용으로 input 채워넣기
  questionInput.value = flashcards[index].question;
  answerInput.value = flashcards[index].answer;

  // 기존 '추가' 버튼을 '저장' 버튼으로 변경
  const addButton = document.getElementById('addButton');
  addButton.textContent = "저장";
  addButton.onclick = function() {
    updateFlashcard(index);
  };
}

// 업데이트 & 저장
function updateFlashcard(index) {
  const questionInput = document.getElementById('questionInput');
  const answerInput = document.getElementById('answerInput');

  const question = questionInput.value.trim()
  const answer = answerInput.value.trim()

  if (question === "" || answer === "") {
    popWarning();
    if (question === "") {
      questionInput.focus();
    } else {
      answerInput.focus();
    }
    return;
  }

  flashcards[index].question = question;
  flashcards[index].answer = answer;

  saveFlashcards();  

  // '저장' 버튼을 원래대로 '추가' 버튼으로
  const addButton = document.getElementById('addButton');
  addButton.textContent = "추가";
  addButton.onclick = addFlashcard;

  displayFlashcards();
  clearInputs();
  noWarning();
}

// 삭제
function deleteFlashcard(index) {
  flashcards.splice(index, 1);
  saveFlashcards(); 
  displayFlashcards();
}

// 앱 시작 시 플래시카드 로드
window.onload = loadFlashcards;