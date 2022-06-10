const cells = document.querySelectorAll('.board__cell');
const rows = document.querySelectorAll('.board__row');
const newGameButton = document.querySelector('.new-game');
const keyboard = document.querySelector('.keyboard');
const popup = document.querySelector('.popup');
const popupContent = document.querySelector('.popup__content');

let words;
let word;
let currentWord;
let turn;

export function game(wordList) {
    words = wordList;
    newGame();
    
    newGameButton.addEventListener('click', newGame);

    window.addEventListener('keydown', (({ key }) => handleKeyInput(key)));

    keyboard.addEventListener('click', ({ target: { classList, textContent } }) => {
        if (classList.contains('keyboard__key_letter')) {
            handleLetterInput(textContent);
        }

        if (classList.contains('keyboard__key_remove')) {
            handleRemoveLetter();
        }

        if (classList.contains('keyboard__key_enter')) {
            handleEnter();
        }
    });
}

function newGame() {
    word = getWord();
    currentWord = [];
    turn = 0;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('board__cell_correct');
        cell.classList.remove('board__cell_has');
        cell.classList.remove('board__cell_wrong');
    });
    newGameButton.classList.remove('new-game_visible');
    popup.classList.remove('popup_visible');
}

function getWord() {
    const filteredWords = words.filter(word => word.length === 5 && word.match(/^[а-я]/));
    const randomIndex = Math.floor(Math.random() * filteredWords.length) - 1;

    return filteredWords.at(randomIndex).toUpperCase();
}

function handleKeyInput(key) {
    switch (key) {
        case 'Backspace':
            handleRemoveLetter();
            break;
        case 'Enter':
            handleEnter();
            break;
        default:
            handleLetterInput(key);
    }
}

function handleLetterInput(letter) {
    if (currentWord.length < 5 && /[а-яА-Я]/.test(letter)) {
        currentWord.push(letter.toUpperCase());
        updateRow();
    }
}

function handleRemoveLetter() {
    if (currentWord.length > 0 && !newGameButton.classList.contains('new-game_visible')) {
        currentWord.pop();
        updateRow();
    }
}

function updateRow() {
    const currentRow = Array.from(rows[turn].children);
    currentRow.forEach((cell, index) => cell.textContent = currentWord[index]?.toUpperCase());
}

function handleEnter() {
    if (currentWord.length === 5 && !newGameButton.classList.contains('new-game_visible')) {
        if (!words.includes(currentWord.join('').toLowerCase())) {
            showNonExistencePopup();
            return;
        }

        checkLetters();

        if (currentWord.join('') !== word && turn !== 5) {
            currentWord = [];
            turn++;
        } else {
            showWinPopup();
        }
    }
}

function showNonExistencePopup() {
    popupContent.textContent = 'В словаре нет такого слова';
    popup.classList.add('popup_visible');

    setTimeout(() => popup.classList.remove('popup_visible'), 2000);
}

function showWinPopup() {
    popupContent.textContent = 'Правильно! Отгадаешь еще слово?';
    popup.classList.add('popup_visible');
    newGameButton.classList.add('new-game_visible');
}

function checkLetters() {
    const currentRow = rows[turn].children;
    currentWord.forEach((letter, index) => {
        const cellModificator = letter === word[index]
            ? 'correct'
            : word.includes(letter)
            ? 'has'
            : 'wrong';
        currentRow[index].classList.add(`board__cell_${cellModificator}`);
    });
}
