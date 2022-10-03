
/* 
    Global vars
*/

let isPlayer1Turn = true;
//gameMode is either "simple" or "full"
let gameMode = "simple";
let gridSize = 0;
let cellsAmountToWin = 3;
let player1Symbol = "O";
let player2Symbol = "X";

/* 
    Game logic
*/

const incrementScore = (player) => {
    if (player === "player1" || player === "player2") {
        const playerScoreSpan = document.querySelector(`#${player}-score-value`);
        const playerScore = parseInt(playerScoreSpan.textContent);
        playerScoreSpan.textContent = playerScore + 1;
    }
}

const checkColumnWin = (currentCellX, currentCellY, currentCellSymbol, cellsAmountToWin) => {
    let sameSymbolCount = 1;

    for (let i = 1; i < cellsAmountToWin; i++) {
        //Check bottom
        const bottomCell = document.querySelector(`#cell-${currentCellX}-${currentCellY + i}`);
        bottomCell && bottomCell.innerText === currentCellSymbol ? sameSymbolCount++ : null;
        //Check top
        const topCell = document.querySelector(`#cell-${currentCellX}-${currentCellY - i}`);
        topCell && topCell.innerText === currentCellSymbol ? sameSymbolCount++ : null;
    }

    return sameSymbolCount === cellsAmountToWin;
}

const checkRowWin = (currentCellX, currentCellY, currentCellSymbol, cellsAmountToWin) => {
    let sameSymbolCount = 1;

    for (let i = 1; i < cellsAmountToWin; i++) {
        //Check right
        const rightCell = document.querySelector(`#cell-${currentCellX + i}-${currentCellY}`);
        rightCell && rightCell.innerText === currentCellSymbol ? sameSymbolCount++ : null;
        //Check left
        const leftCell = document.querySelector(`#cell-${currentCellX - i}-${currentCellY}`);
        leftCell && leftCell.innerText === currentCellSymbol ? sameSymbolCount++ : null;
    }

    return sameSymbolCount === cellsAmountToWin;
}

const checkDiagonalWin = (currentCellX, currentCellY, currentCellSymbol, cellsAmountToWin) => {
    let sameSymbolCount = 1;

    if (currentCellX === currentCellY) {
        for (let i = 1; i < cellsAmountToWin; i++) {
            //Check bottom right diagonal
            const bottomRightCell = document.querySelector(`#cell-${currentCellX + i}-${currentCellY + i}`);
            bottomRightCell && bottomRightCell.innerText === currentCellSymbol ? sameSymbolCount++ : null;
            //Check top left diagonal
            const topLeftCell = document.querySelector(`#cell-${currentCellX - i}-${currentCellY - i}`);
            topLeftCell && topLeftCell.innerText === currentCellSymbol ? sameSymbolCount++ : null;
        }
        //For the reverse diagonal if we add the x and y we should get the same result as the grid size
    } else if (currentCellX + currentCellY === gridSize - 1) {
        for (let i = 1; i < cellsAmountToWin; i++) {
            //Check top right diagonal
            const topRightCell = document.querySelector(`#cell-${currentCellX + i}-${currentCellY - i}`);
            topRightCell && topRightCell.innerText === currentCellSymbol ? sameSymbolCount++ : null;
            //Check bottom left diagonal
            const bottomLeftCell = document.querySelector(`#cell-${currentCellX - i}-${currentCellY + i}`);
            bottomLeftCell && bottomLeftCell.innerText === currentCellSymbol ? sameSymbolCount++ : null;
        }
    }

    return sameSymbolCount === cellsAmountToWin;
}

const checkTie = () => {
    const cells = document.querySelectorAll('.cell');
    let isTie = true;

    cells.forEach(cell => {
        if (cell.innerText === "") {
            isTie = false;
        }
    });

    return isTie;
}

const relaunchGame = () => {
    const gameGrid = document.querySelector("#game-grid");

    gameGrid.innerHTML = "";
    initGameGrid();
    toggleRelaunchPopupDisplay();
}

const checkWin = (currentCell) => {
    const currentCellX = parseInt(currentCell.id.split('-')[1]);
    const currentCellY = parseInt(currentCell.id.split('-')[2]);
    const currentCellSymbol = currentCell.innerText;

    let winningConditionMet =
        checkColumnWin(currentCellX, currentCellY, currentCellSymbol, cellsAmountToWin) ||
        checkRowWin(currentCellX, currentCellY, currentCellSymbol, cellsAmountToWin) ||
        checkDiagonalWin(currentCellX, currentCellY, currentCellSymbol, cellsAmountToWin);

    if (winningConditionMet) {
        toggleRelaunchPopupDisplay(`Player ${isPlayer1Turn ? 1 : 2} won !`);
        incrementScore(isPlayer1Turn ? "player1" : "player2");
    } else if (checkTie()) {
        toggleRelaunchPopupDisplay("It's a tie !");
    }

}

const changePlayerTurn = () => {
    isPlayer1Turn = !isPlayer1Turn;
}

const addSymbolInCell = (cell) => {
    const symbol = isPlayer1Turn ? player1Symbol : player2Symbol;

    cell.innerText = symbol;
    cell.removeEventListener('click', handleCellOnClick);
}

const handleCellOnClick = (event) => {
    const cell = event.target;

    addSymbolInCell(cell);
    changePlayerTurn();
    checkWin(cell, gameMode);
}

/* 
    Display logic
*/

const toggleRelaunchPopupDisplay = (gameStateText) => {
    const relaunchPopup = document.querySelector("#relaunch-game-popup");
    relaunchPopup.classList.toggle("hidden");

    const gameStateTextSpan = document.querySelector("#relaunch-game-popup-gamestate");

    if (gameStateText) {
        gameStateTextSpan.innerText = gameStateText;
    }
}

const toggleGameDisplay = () => {
    const game = document.querySelector('#game');
    const settings = document.querySelector('#game-settings');

    if (game.classList.contains('hidden')) {
        game.classList.remove('hidden');
        settings.classList.add('hidden');
    } else {
        game.classList.add('hidden');
        settings.classList.remove('hidden');
    }
}

const createGridCells = (x, y) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.id = `cell-${x}-${y}`;
    cell.addEventListener('click', handleCellOnClick);

    return cell;
}

const createGridColumns = (gridSize) => {
    const columnContainer = [];

    for (let i = 0; i < gridSize; i++) {
        const column = document.createElement('div');
        column.classList.add('column');
        for (let j = 0; j < gridSize; j++) {
            const cell = createGridCells(i, j);
            column.appendChild(cell);
        }
        columnContainer.push(column);
    }

    return columnContainer;
}

const setGameData = () => {
    const player1NameInput = document.querySelector('#player1-name');
    const player2NameInput = document.querySelector('#player2-name');
    const player1SymbolInput = document.querySelector('#player1-symbol-selector');
    const player2SymbolInput = document.querySelector('#player2-symbol-selector');

    gameMode = document.querySelector('#game-mode-selector').value;
    gridSize = parseInt(document.querySelector('#grid-size-selector').value);
    cellsAmountToWin = gameMode === "simple" ? 3 : gridSize;

    player1Name = player1NameInput.value ? player1NameInput.value : "Player 1";
    player2Name = player2NameInput.value ? player2NameInput.value : "Player 2";
    player1Symbol = player1SymbolInput.value ? player1SymbolInput.value : "O";
    player2Symbol = player2SymbolInput.value ? player2SymbolInput.value : "X";
}

const initGameGrid = () => {
    const gameGrid = document.querySelector('#game-grid');
    const columnContainer = createGridColumns(gridSize);

    gameGrid.innerHTML = '';
    columnContainer.forEach(column => gameGrid.appendChild(column));
}

const initScoreBar = () => {
    const player1ScoreSpan = document.querySelector('#player1-score-value');
    const player2ScoreSpan = document.querySelector('#player2-score-value');
    const player1NameSpan = document.querySelector('#player1-score-name');
    const player2NameSpan = document.querySelector('#player2-score-name');

    player1ScoreSpan.textContent = 0;
    player2ScoreSpan.textContent = 0;
    player1NameSpan.textContent = player1Name;
    player2NameSpan.textContent = player2Name;
}

const initGameOnClick = () => {
    setGameData();
    initGameGrid();
    toggleGameDisplay();
    initScoreBar();
}

const finishGame = () => {
    toggleGameDisplay();
    toggleRelaunchPopupDisplay();
}

/* 
    Function calls
*/

const startButton = document.getElementById('start');
startButton.addEventListener('click', initGameOnClick);

const relaunchGameYes = document.querySelector("#relaunch-game-yes");
const relaunchGameNo = document.querySelector("#relaunch-game-no");

relaunchGameYes.addEventListener('click', relaunchGame);
relaunchGameNo.addEventListener('click', finishGame);