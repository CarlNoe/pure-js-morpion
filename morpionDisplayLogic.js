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

const resetGame = () => {
    //todo: is it better to init globaly since the value doesnt change ?
    const gameGrid = document.querySelector("#game-grid");
    if (window.confirm("Do you want to play again ?")) {
        gameGrid.innerHTML = "";
        initGameGrid();
    } else {
        gameGrid.innerHTML = "";
        toggleGameDisplay();
    }
}

//Todo: check what copilot did and modify it
const checkWin = (currentCell, gameMode) => {
    const currentCellX = parseInt(currentCell.id.split('-')[1]);
    const currentCellY = parseInt(currentCell.id.split('-')[2]);
    const currentCellSymbol = currentCell.innerText;

    console.log(gameMode);
    console.log(gridSize);
    console.log(cellsAmountToWin);
    console.log(currentCellX, currentCellY, currentCellSymbol);

    if (checkColumnWin(currentCellX, currentCellY, currentCellSymbol, cellsAmountToWin) ||
        checkRowWin(currentCellX, currentCellY, currentCellSymbol, cellsAmountToWin) ||
        checkDiagonalWin(currentCellX, currentCellY, currentCellSymbol, cellsAmountToWin)) {

        alert(`Player ${isPlayer1Turn ? 1 : 2} won !`);
        incrementScore(isPlayer1Turn ? "player1" : "player2");
        resetGame();
    }

}

const changePlayerTurn = () => {
    isPlayer1Turn = !isPlayer1Turn;
}

const addSymbolOnClick = (event) => {
    const cell = event.target;
    const symbol = isPlayer1Turn ? "X" : "O";

    cell.innerText = symbol;
    cell.removeEventListener('click', addSymbolOnClick);

    changePlayerTurn();

    checkWin(event.target, gameMode);
}

// DISPLAYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY

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
    cell.addEventListener('click', addSymbolOnClick);

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

const initGame = () => {
    initGameGrid();
    toggleGameDisplay();
    initScoreBar();
}

/////////////////////////////////////////////////////////////////////////////


const startButton = document.getElementById('start');
startButton.addEventListener('click', initGame);