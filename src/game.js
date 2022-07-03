const cells = document.querySelectorAll('.board__cell');
const rows = document.querySelectorAll('.board__row');
const newGameButton = document.querySelector('.popup__new-game-button');
const keyboard = document.querySelector('.keyboard');
const keyboardKeys = document.querySelectorAll('.keyboard__key');
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
    newGameButton.classList.remove('popup__new-game-button_visible');
    popup.classList.remove('popup_visible');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('board__cell_correct');
        cell.classList.remove('board__cell_has');
        cell.classList.remove('board__cell_wrong');
    });
    keyboardKeys.forEach(key => key.classList.remove('keyboard__key_wrong'));

    word = await getWord();
    currentWord = [];
    turn = 0;
    disableInput = false;
}

async function getWord() {
    disableInput = true;
    const res = await fetch('https://us-central1-svyat-wordle.cloudfunctions.net/getWord');
    const word = await res.text();
    disableInput = false;

    return word;
}

async function handleKeyboardClick({ target: { classList, textContent } }) {
    if (classList.contains('keyboard__key_remove')) {
        handleRemoveLetter();
    }

    if (classList.contains('keyboard__key_enter')) {
        await handleEnter();
    }

    if (classList.contains('keyboard__key_letter')) {
        handleLetterInput(textContent);
    }
}

async function handleKeyInput({ key }) {
    switch (key) {
        case 'Backspace':
            handleRemoveLetter();
            break;
        case 'Enter':
            await handleEnter();
            break;
        default:
            handleLetterInput(key);
    }
}

function handleLetterInput(letter) {
    if (currentWord.length < 5 && /[а-яА-Я]/.test(letter) && !disableInput) {
        currentWord.push(letter.toLowerCase());
        updateRowText();
    }
}

function handleRemoveLetter() {
    if (currentWord.length > 0 && !disableInput) {
        currentWord.pop();
        updateRowText();
    }
}

function updateRowText() {
    const currentRow = Array.from(rows[turn].children);
    currentRow.forEach((cell, index) => cell.textContent = currentWord[index]?.toUpperCase());
}

async function handleEnter() {
    if (currentWord.length === 5 && !disableInput) {
        const isRightWord = currentWord.join('') === word;

        if (isRightWord) {
            showEndGamePopup(`Правильно! Это слово ${getWikiLink(word)}. Отгадаешь еще слово?`);
            updateGameboard();
            return;
        }

        disableInput = true;
        const isWordExist = await getIsWordExist();
        disableInput = false;

        if (!isWordExist) {
            showNonExistencePopup();
            return;
        }

        updateGameboardAndKeyboard();

        if (!isRightWord && turn === 5) {
            showEndGamePopup(`Это было слово ${getWikiLink(word)}. Отгадаешь еще слово?`);
        } else {
            currentWord = [];
            turn++;
        }
    }
}

async function getIsWordExist() {
    const res = await fetch(`https://us-central1-svyat-wordle.cloudfunctions.net/checkExistence?word=${currentWord.join('')}`);
    const isWordExist = await res.text();

    return isWordExist === 'true';
}

function showEndGamePopup(content) {
    popupContent.innerHTML = content;
    popup.classList.add('popup_visible');
    newGameButton.classList.add('popup__new-game-button_visible');
    disableInput = true;
}

function showNonExistencePopup() {
    popupContent.innerHTML = 'В словаре нет такого слова';
    popup.classList.add('popup_visible');

    setTimeout(() => popup.classList.remove('popup_visible'), 2000);
}

function updateGameboardAndKeyboard() {
    updateGameboard();
    updateKeyboard();
}

function updateGameboard() {
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

function updateKeyboard() {
    let wrongLetters = [];

    currentWord.forEach(letter => {
        if (!word.includes(letter)) {
            wrongLetters.push(letter);
        }
    });

    keyboardKeys.forEach(key => {
        if (wrongLetters.includes(key.textContent.toLowerCase())) {
            key.classList.add('keyboard__key_wrong');
        }
    });
}

function getWikiLink(word) {
    return `<a target="_blank" href="https://ru.wiktionary.org/wiki/${word}#Значение">${word}</a>`;
}
