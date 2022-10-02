//Todo: Split functions in another file

let isPlayer1Turn = true;
//todo: is it better to init gridSize and gameMode  and cellsAmountToWin as global vars or inside in initGameGrid ?
//gameMode is either "simple" or "full"
let gameMode = "simple";
let gridSize = 0;
let cellsAmountToWin = 3;

const incrementScore = (player) => {
    try {
        const playerScoreSpan = document.querySelector(`#${player}-score-value`);
        const playerScore = parseInt(playerScoreSpan.textContent);
        playerScoreSpan.textContent = playerScore + 1;
    } catch (error) {
        console.error("incrementScore is called using something else than 'player1' or 'player2'", error);
    }
}

const checkColumnWin = (currentCellX, currentCellY, currentCellSymbol, cellsAmountToWin) => {
    let sameSymbolCount = 1;

    for (let i = 1; i < cellsAmountToWin; i++) {
        //Check bottom
        const cellToCheck = document.querySelector(`#cell-${currentCellX}-${currentCellY + i}`);
        cellToCheck && cellToCheck.innerText === currentCellSymbol ? sameSymbolCount++ : null;
        //Check top
        const cellToCheck2 = document.querySelector(`#cell-${currentCellX}-${currentCellY - i}`);
        cellToCheck2 && cellToCheck2.innerText === currentCellSymbol ? sameSymbolCount++ : null;
    }

    return sameSymbolCount === cellsAmountToWin;
}

const checkRowWin = (currentCellX, currentCellY, currentCellSymbol, cellsAmountToWin) => {
    let sameSymbolCount = 1;

    for (let i = 1; i < cellsAmountToWin; i++) {
        //Check right
        const cellToCheck = document.querySelector(`#cell-${currentCellX + i}-${currentCellY}`);
        cellToCheck && cellToCheck.innerText === currentCellSymbol ? sameSymbolCount++ : null;
        //Check left
        const cellToCheck2 = document.querySelector(`#cell-${currentCellX - i}-${currentCellY}`);
        cellToCheck2 && cellToCheck2.innerText === currentCellSymbol ? sameSymbolCount++ : null;
    }

    return sameSymbolCount === cellsAmountToWin;
}

const checkDiagonalWin = (currentCellX, currentCellY, currentCellSymbol, cellsAmountToWin) => {
    let sameSymbolCount = 1;

    for (let i = 1; i < cellsAmountToWin; i++) {
        //Check bottom right diagonal
        const cellToCheck = document.querySelector(`#cell-${currentCellX + i}-${currentCellY + i}`);
        cellToCheck && cellToCheck.innerText === currentCellSymbol ? sameSymbolCount++ : null;
        //Check top left diagonal
        const cellToCheck2 = document.querySelector(`#cell-${currentCellX - i}-${currentCellY - i}`);
        cellToCheck2 && cellToCheck2.innerText === currentCellSymbol ? sameSymbolCount++ : null;
        //Check top right diagonal
        const cellToCheck3 = document.querySelector(`#cell-${currentCellX + i}-${currentCellY - i}`);
        cellToCheck3 && cellToCheck3.innerText === currentCellSymbol ? sameSymbolCount++ : null;
        //Check bottom left diagonal
        const cellToCheck4 = document.querySelector(`#cell-${currentCellX - i}-${currentCellY + i}`);
        cellToCheck4 && cellToCheck4.innerText === currentCellSymbol ? sameSymbolCount++ : null;
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
    //todo: is it better to init globaly since the value doesnt change ?
    const gameGrid = document.querySelector("#game-grid");

    gameGrid.innerHTML = "";
    initGameGrid();
    toggleRelaunchPopupDisplay();
}

const finishGame = () => {
    toggleGameDisplay();
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
    const symbol = isPlayer1Turn ? "X" : "O";

    cell.innerText = symbol;
    cell.removeEventListener('click', handleCellOnClick);
}

const handleCellOnClick = (event) => {
    const cell = event.target;

    addSymbolInCell(cell);
    changePlayerTurn();
    checkWin(cell, gameMode);
}

// DISPLAYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY

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

const initGameGrid = () => {
    //todo: check if there is a better way to init those vars
    gridSize = parseInt(document.querySelector('#grid-size-selector').value);
    gameMode = document.querySelector('#game-mode-selector').value;
    cellsAmountToWin = gameMode === "simple" ? 3 : gridSize;

    const gameGrid = document.querySelector('#game-grid');
    const columnContainer = createGridColumns(gridSize);

    gameGrid.innerHTML = '';
    columnContainer.forEach(column => gameGrid.appendChild(column));
}

const initScoreBar = () => {
    const player1Name = document.querySelector('#player1').value;
    const player2Name = document.querySelector('#player2').value;

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
    initGameGrid();
    toggleGameDisplay();
    initScoreBar();
}

/////////////////////////////////////////////////////////////////////////////

const startButton = document.getElementById('start');
startButton.addEventListener('click', initGameOnClick);

const relaunchGameYes = document.querySelector("#relaunch-game-yes");
const relaunchGameNo = document.querySelector("#relaunch-game-no");

relaunchGameYes.addEventListener('click', relaunchGame);
relaunchGameNo.addEventListener('click', finishGame);