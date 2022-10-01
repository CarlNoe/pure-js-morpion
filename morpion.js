
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

const createGridRows = (gridSize) => {
    const rowContainer = [];

    for (let i = 0; i < gridSize; i++) {
        const row = document.createElement('div');
        row.classList.add('row');

        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-${i}-${j}`;
            row.appendChild(cell);
        }
        rowContainer.push(row);
    }

    return rowContainer;
}

const initGameGrid = () => {
    const gameGrid = document.querySelector('#game-grid');
    const gridSize = document.querySelector('#grid-size-selector').value;

    const rowContainer = createGridRows(gridSize);
    
    gameGrid.innerHTML = '';
    rowContainer.forEach(row => gameGrid.appendChild(row));
}

const initScoreBar = () => {
    const scoreBar = document.querySelector('#score-bar');
    const scoreBarContainer = [];

}

const initGame = () => {

    initGameGrid();
    toggleGameDisplay();
    initScoreBar();
}


const startButton = document.getElementById('start');
startButton.addEventListener('click', initGame);