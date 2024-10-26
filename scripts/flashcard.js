import { getFolders } from './sidebar.js';

let flashcards = [];

export function initializeFlashcardCreator() {
    const createFlashcardBtn = document.getElementById('createFlashcardBtn');
    const questionInput = document.getElementById('questionInput');
    const answerInput = document.getElementById('answerInput');
    const imageInput = document.getElementById('imageInput');
    const tagsInput = document.getElementById('tagsInput');
    const folderSelect = document.getElementById('folderSelect');

    createFlashcardBtn.addEventListener('click', () => {
        const question = questionInput.value;
        const answer = answerInput.value;
        const tags = tagsInput.value.split(',').map(tag => tag.trim());
        const folder = folderSelect.value;

        if (question && answer) {
            const newFlashcard = {
                question,
                answer,
                tags,
                folder,
                image: null // 이미지 처리는 별도로 구현 필요
            };

            flashcards.push(newFlashcard);
            saveFlashcards();
            clearInputs();
        }
    });

    function clearInputs() {
        questionInput.value = '';
        answerInput.value = '';
        imageInput.value = '';
        tagsInput.value = '';
    }
}

function saveFlashcards() {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

export function loadFlashcards() {
    const savedFlashcards = localStorage.getItem('flashcards');
    if (savedFlashcards) {
        flashcards = JSON.parse(savedFlashcards);
    }
}

export function getFlashcards() {
    return flashcards;
}
