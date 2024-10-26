import { initializeSidebar } from './sidebar.js';
import { initializeFlashcardCreator } from './flashcard.js';
import { initializeReview } from './review.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializeFlashcardCreator();
    initializeReview();
});
