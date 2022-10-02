
let isPlayer1Turn = true;

export const addSymbolOnClick = (event) => {
  const cell = event.target;
  
  const player1Symbol = "X";
  const player2Symbol = "O";

  cell.innerText = isPlayer1Turn ? player1Symbol : player2Symbol;
  isPlayer1Turn = !isPlayer1Turn;

  cell.removeEventListener('click', addSymbolOnClick);

  checkWin();
}