/*
** The Gameboard represents the state of the board
** Each equare holds a Cell (defined later)
** and we expose a dropToken method to be able to add Cells to squares
*/
let form=document.querySelector('form');
let resBtn=document.querySelector('.restart');
let startBtn=document.querySelector('.start');
let boardCont=document.querySelector('#board');
boardCont.style.display="none";
function Gameboard() {
    const rows = 3;
    const columns = 3;
    let board = [];


    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i].push(Cell()); // here we are adding an object of the cell factory function into every index of our 2d array
        }
      }
  
    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board;
    const resetBoard = ()=>{
      board = [];
      for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i].push(Cell()); // here we are adding an object of the cell factory function into every index of our 2d array
        }
      }
      return board;
    }
 
   
    const dropToken = (column,row, player) => {
     //cell is the specified cell we want to mark "x" or 'O' in
      const cell=board[row][column];
      const  isCellAvailable=cell.getValue()===0; // I am allowed to use getValue() which is a function of Cell() factory because 
                                                 //every index of my array holds an object instance of the Cell factory function
                                                 //this is so because of ' board[i].push(Cell()); '

      //We need to check if the cell we are clicking has a value - meaning is it taken already
        if(isCellAvailable){
            cell.addToken(player);
        }
       
    };
  
    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
      console.log(boardWithCellValues);
    };
  
    // Here, we provide an interface for the rest of our
    // application to interact with the board
    return { getBoard, dropToken, printBoard,resetBoard};
  }
  
  /*
  ** A Cell represents one "square" on the board and can have one of
  ** 0: no token is in the square,
  ** 1: Player One's token,
  ** 2: Player 2's token
  */
  
  function Cell() {
    let value = 0;
  
    // Accept a player's token to change the value of the cell
    const addToken = (player) => {
      value = player;
    };
  
    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;
  
    return {
      addToken,
      getValue
    };
  }
  
  /* 
  ** The GameController will be responsible for controlling the 
  ** flow and state of the game's turns, as well as whether
  ** anybody has won the game
  */
  function GameController(
    playerOneName = document.querySelector('#player1').value,
    playerTwoName = document.querySelector('#player2').value
  ) {
    let ties=0;
    const board = Gameboard();
    let array=board.getBoard();
    const players = [
      {
        name: playerOneName,
        token: 'X',
        score: 0
      },
      {
        name: playerTwoName,
        token: 'O',
        score: 0
      }
    ];
  
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
    const getFirstPlayer = () => players[0];
  
    const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };
    const checkWin = () =>{
      const allHaveValues =  array.every(row => row.every(cell => cell.getValue() !== 0));
      if(allHaveValues){
        ties++;
        array=board.resetBoard();
      }
      if(array[0][0].getValue()===array[0][1].getValue() && array[0][1].getValue()=== array[0][2].getValue() && array[0][0].getValue()!==0 || 
        array[1][0].getValue()===array[1][1].getValue() && array[1][1].getValue()===array[1][2].getValue() && array[1][0].getValue()!==0 || 
        array[2][0].getValue()===array[2][1].getValue() && array[2][1].getValue()===array[2][2].getValue() &&  array[2][0].getValue()!==0||
        array[0][0].getValue()===array[1][0].getValue() && array[1][0].getValue()===array[2][0].getValue() && array[0][0].getValue()!==0 ||  
        array[0][1].getValue()===array[1][1].getValue() && array[1][1].getValue()===array[2][1].getValue() && array[0][1].getValue()!==0 || 
        array[0][2].getValue()===array[1][2].getValue() && array[1][2].getValue()===array[2][2].getValue() && array[0][2].getValue()!==0 || 
        array[0][0].getValue()===array[1][1].getValue() && array[1][1].getValue()===array[2][2].getValue() && array[0][0].getValue()!==0 || 
        array[2][0].getValue()===array[1][1].getValue() && array[1][1].getValue()===array[0][2].getValue() && array[2][0].getValue()!==0 
       )
       {
        activePlayer.score++;
        array=board.resetBoard();
         board.printBoard();
               }
                
                else return;
    }
    const getScore = ()=>{

      let text=` <span class="red">${players[0].name}</span> ${players[0].score}   /   <span class="green">${players[1].name}</span> ${players[1].score}  / <span class="gray">Ties:</span> ${ties}`;
      return text;
    }
    const playRound = (row,column) => {
      // Drop a token for the current player
   
      const cell=array[row][column];

      if(!(cell.getValue()===0)){
        console.log('This spot is taken');
        console.log(cell.getValue());
        return;
        // board.dropToken(column,row, getActivePlayer().token);
      }
      console.log(
        `Dropping ${getActivePlayer().name}'s token into column ${column} and row ${row}`
      );
    
      board.dropToken(column,row, getActivePlayer().token);
      checkWin();
      getScore();
  
      /*  This is where we would check for a winner and handle that logic,
          such as a win message. */
        // checkWin();

        // if(winner){
        //   return;
        // }

       
     
      // Switch player turn
      switchPlayerTurn();
      printNewRound();
     
    };
  
    // Initial play game message
    printNewRound();
  
    // For the console version, we will only use playRound, but we will need
    // getActivePlayer for the UI version, so I'm revealing it now
    return {
      playRound,
      getActivePlayer,
      getBoard: board.getBoard,
      checkWin,
      getScore,
      getFirstPlayer
    };
  }
  function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('#board');
    const score=document.querySelector('.score');
    score.innerHTML=game.getScore();
  
    const updateScreen = () => {
      // clear the board
      boardDiv.textContent = "";
      score.innerHTML= game.getScore();
  
      // get the newest version of the board and player turn
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();
      const firstPlayer=game.getFirstPlayer();
  
      // Display player's turn
       playerTurnDiv.innerHTML = activePlayer===firstPlayer ? `<span class="red">${activePlayer.name}'s turn</span>` : `<span class="green">${activePlayer.name}'s turn</span>` //`${activePlayer.name}'s turn...`
  
      // Render board squares
      board.forEach((row,rowIndex) => {
        
        row.forEach((cell, columnIndex) => {
          // Anything clickable should be a button!!
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          // Create a data attribute to identify the column
          // This makes it easier to pass into our `playRound` function 
          cellButton.dataset.column = columnIndex
          cellButton.dataset.row=rowIndex;
          cellButton.textContent = cell.getValue();
          cellButton.textContent=cell.getValue()===0 ? "" : cell.getValue();
          cellButton.style.color=cell.getValue()==='X' ? 'red' : 'green';
          boardDiv.appendChild(cellButton); 
        })
      })
    }
  
    // Add event listener for the board
    function clickHandlerBoard(e) {
      const selectedColumn = e.target.dataset.column;
      const selectedRow=e.target.dataset.row;
      // Make sure I've clicked a column and not the gaps in between
      if (!selectedColumn && !selectedRow) return;
      
      game.playRound(selectedRow,selectedColumn);
      updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
  
    // Initial render
    updateScreen();
  
    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
  }
form.addEventListener('submit',(event)=>{
  event.preventDefault();
  form.style.display="none";
  startBtn.disabled=true;
  boardCont.style.display="grid";
  ScreenController();
  resBtn.addEventListener('click',()=>{
    ScreenController();
    startBtn.disabled=false;
    form.style.display="block";
  })
  
});
