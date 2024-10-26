import { getFlashcards, loadFlashcards } from './flashcard.js';

let currentCardIndex = 0;

export function initializeReview() {
    const flashcardViewer = document.getElementById('flashcard-viewer');
    const question = document.getElementById('question');
    const answer = document.getElementById('answer');
    const showAnswerBtn = document.getElementById('showAnswerBtn');
    const nextCardBtn = document.getElementById('nextCardBtn');

    loadFlashcards();

    showAnswerBtn.addEventListener('click', () => {
        answer.style.display = 'block';
        showAnswerBtn.style.display = 'none';
        nextCardBtn.style.display = 'block';
    });

    nextCardBtn.addEventListener('click', () => {
        currentCardIndex = (currentCardIndex + 1) % getFlashcards().length;
        showCard();
    });

    function showCard() {
        const flashcards = getFlashcards();
        if (flashcards.length === 0) {
            question.textContent = "플래시카드가 없습니다.";
            answer.textContent = "";
            showAnswerBtn.style.display = 'none';
            nextCardBtn.style.display = 'none';
            return;
        }

        const card = flashcards[currentCardIndex];
        question.textContent = card.question;
        answer.textContent = card.answer;
        answer.style.display = 'none';
        showAnswerBtn.style.display = 'block';
        nextCardBtn.style.display = 'none';
    }

    showCard();
}
