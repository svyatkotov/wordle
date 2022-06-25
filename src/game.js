const cells = document.querySelectorAll('.board__cell');
const rows = document.querySelectorAll('.board__row');
const newGameButton = document.querySelector('.new-game-button');
const keyboard = document.querySelector('.keyboard');
const popup = document.querySelector('.popup');
const popupContent = document.querySelector('.popup__content');

let word;
let currentWord;
let turn;
let disableInput;

export async function game() {
    await newGame();
    
    newGameButton.addEventListener('click', newGame);
    window.addEventListener('keydown', handleKeyInput);
    keyboard.addEventListener('click', handleKeyboardClick);
}

async function newGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('board__cell_correct');
        cell.classList.remove('board__cell_has');
        cell.classList.remove('board__cell_wrong');
    });
    newGameButton.classList.remove('new-game-button_visible');
    popup.classList.remove('popup_visible');

    word = await getWord();
    currentWord = [];
    turn = 0;
    disableInput = false;
}

async function getWord() {
    const res = await fetch('https://us-central1-svyat-wordle.cloudfunctions.net/getWord');
    const word = await res.text();
    console.log("🚀 ~ file: game.js ~ line 52 ~ getWord ~ word", word)

    return word;
}

function handleKeyboardClick({ target: { classList, textContent } }) {
    if (classList.contains('keyboard__key_remove')) {
        handleRemoveLetter();
    }

    if (classList.contains('keyboard__key_enter')) {
        handleEnter();
    }

    if (classList.contains('keyboard__key_letter')) {
        handleLetterInput(textContent);
    }
}

function handleKeyInput({ key }) {
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
    if (currentWord.length > 0 && !disableInput) {
        currentWord.pop();
        updateRow();
    }
}

function updateRow() {
    const currentRow = Array.from(rows[turn].children);
    currentRow.forEach((cell, index) => cell.textContent = currentWord[index]?.toUpperCase());
}

function handleEnter() {
    if (currentWord.length === 5 && !disableInput) {
        if (false) {
            showNonExistencePopup();
            return;
        }

        checkLetters();

        const isRightWord = currentWord.join('') === word;

        if (isRightWord) {
            showEndGamePopup('Правильно! Отгадаешь еще слово?');
        } else if (!isRightWord && turn === 5) {
            showEndGamePopup(`Это было слово ${word}. Отгадаешь еще слово?`);
        } else {
            currentWord = [];
            turn++;
        }
    }
}

function showNonExistencePopup() {
    popupContent.textContent = 'В словаре нет такого слова';
    popup.classList.add('popup_visible');

    setTimeout(() => popup.classList.remove('popup_visible'), 2000);
}

function showEndGamePopup(text) { 
    popupContent.textContent = text;
    popup.classList.add('popup_visible');
    newGameButton.classList.add('new-game-button_visible');
    disableInput = true;
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
