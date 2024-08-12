/*
** The Gameboard represents the state of the board
** Each equare holds a Cell (defined later)
** and we expose a dropToken method to be able to add Cells to squares
*/
let form=document.querySelector('form'); //get the form element
let resBtn=document.querySelector('.restart'); // restart btn
let startBtn=document.querySelector('.start'); // start btn
let boardCont=document.querySelector('#board'); // board container
boardCont.style.display="none"; //hide the board container
function Gameboard() {
    const rows = 3;
    const columns = 3;
    let board = [];


    for (let i = 0; i < rows; i++) { // create the 2d array
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i].push(Cell()); // here we are adding an object of the cell factory function into every index of our 2d array
        }
      }
  
    // This will be the method of getting the entire board that our
    // UI will eventually need to render it.
    const getBoard = () => board; // get the board but still encapsulate the board variable locally
    const resetBoard = ()=>{
      board = [];
      for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i].push(Cell()); // here we are adding an object of the cell factory function into every index of our 2d array
        }
      }
      return board; // return the 2d array
    }
 
   
    const dropToken = (column,row, player) => {
     //cell is the specified cell we want to mark "x" or 'O' in
      const cell=board[row][column]; // selected cell
      const  isCellAvailable=cell.getValue()===0; // I am allowed to use getValue() which is a function of Cell() factory because 
                                                 //every index of my array holds an object instance of the Cell factory function
                                                 //this is so because of ' board[i].push(Cell()); '

      //We need to check if the cell we are clicking has a value - meaning is it taken already
        if(isCellAvailable){
            cell.addToken(player); // add the token with the player value if its available else return
        }
       
    };
  
    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue())) // get the board with the values in the console
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
    let value = 0; // initial value is false
  
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
    const board = Gameboard(); // factory object of the board
    let array=board.getBoard(); // current display of the gameboard array
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
  
    let activePlayer = players[0]; // active player starting at the first player from the players object array
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0]; //switch turn depending on selected player itterate to next one
    };
    const getActivePlayer = () => activePlayer; // get active player encapsulating the activePlayer variable locally
    const getFirstPlayer = () => players[0];
  
    const printNewRound = () => { // only for console purposes
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
    };
    const checkWin = () =>{
      const allHaveValues =  array.every(row => row.every(cell => cell.getValue() !== 0)); // check if every cell in every row of the 2d array has a value different from 0
      if(allHaveValues){ // and if it is so it means its a tie since there isn't a winner
        ties++;
        array=board.resetBoard(); //reset cell values by making a new array with a nested for loop and adding empty cell values 
      }
      if(array[0][0].getValue()===array[0][1].getValue() && array[0][1].getValue()=== array[0][2].getValue() && array[0][0].getValue()!==0 || 
        array[1][0].getValue()===array[1][1].getValue() && array[1][1].getValue()===array[1][2].getValue() && array[1][0].getValue()!==0 || 
        array[2][0].getValue()===array[2][1].getValue() && array[2][1].getValue()===array[2][2].getValue() &&  array[2][0].getValue()!==0||
        array[0][0].getValue()===array[1][0].getValue() && array[1][0].getValue()===array[2][0].getValue() && array[0][0].getValue()!==0 ||  
        array[0][1].getValue()===array[1][1].getValue() && array[1][1].getValue()===array[2][1].getValue() && array[0][1].getValue()!==0 || 
        array[0][2].getValue()===array[1][2].getValue() && array[1][2].getValue()===array[2][2].getValue() && array[0][2].getValue()!==0 || 
        array[0][0].getValue()===array[1][1].getValue() && array[1][1].getValue()===array[2][2].getValue() && array[0][0].getValue()!==0 || 
        array[2][0].getValue()===array[1][1].getValue() && array[1][1].getValue()===array[0][2].getValue() && array[2][0].getValue()!==0 
       ) // winning conditions - check for matching patterns in values 
       {
        activePlayer.score++; // if there are matching winning patterns update score of active player by 1
        array=board.resetBoard(); // and reset the board to start a new game
         board.printBoard(); // print the new empty board
               }
                
                else return;
    }
    const getScore = ()=>{

      let text=` <span class="red">${players[0].name}</span> ${players[0].score}   /   <span class="green">${players[1].name}</span> ${players[1].score}  / <span class="gray">Ties:</span> ${ties}`;
      return text; // get player name and score to display as score in HTML

      
    }
    const playRound = (row,column) => { // selected cell depending on its row and column
      // Drop a token for the current player
   
      const cell=array[row][column];

      if(!(cell.getValue()===0)){ // if the cell's value is not 0 console log that the spot is taken and return without switching player turn
        console.log('This spot is taken');
        console.log(cell.getValue());
        return;
        // board.dropToken(column,row, getActivePlayer().token);
      }
      console.log(
        `Dropping ${getActivePlayer().name}'s token into column ${column} and row ${row}` // if its not taken diisplay the place we are adding a token for the activePlayer
      );
    
      board.dropToken(column,row, getActivePlayer().token); // add the player token into empty cell
      checkWin(); // check for win conditions after the move is made
      getScore(); // get score in case checkWin is true and it updates the score   
      // Switch player turn
      switchPlayerTurn(); // switch turn after sucessful player move
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
    const game = GameController(); // game controller object
    const playerTurnDiv = document.querySelector('.turn'); // display in text the activePlayer
    const boardDiv = document.querySelector('#board'); // the board container
    const score=document.querySelector('.score'); // display score in text 
    score.innerHTML=game.getScore(); // display the text for score
  
    const updateScreen = () => { // update screen in UI
      // clear the board
      boardDiv.textContent = ""; // main container should start empty
      score.innerHTML= game.getScore(); //take score
  
      // get the newest version of the board and player turn
      const board = game.getBoard(); // take current board 
      const activePlayer = game.getActivePlayer(); // take activePlayer in turn
      const firstPlayer=game.getFirstPlayer(); // take firstPlayer (styling purposes only)
  
      // Display player's turn in color
       playerTurnDiv.innerHTML = activePlayer===firstPlayer ? `<span class="red">${activePlayer.name}'s turn</span>` : `<span class="green">${activePlayer.name}'s turn</span>` //`${activePlayer.name}'s turn...`
  
      // Render board squares
      board.forEach((row,rowIndex) => { // looping through an array with 2 parameters in the forEach - the second parameter is always the index so we can this way
                                       //take the rowInex from the current array and ...
        row.forEach((cell, columnIndex) => {//the columnIndex from each cell itteration of the loop
          // Anything clickable should be a button!!
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell"); // add cell class for styling properties

          // Create a data attribute to identify the column
          // This makes it easier to pass into our `playRound` function 
          cellButton.dataset.column = columnIndex
          cellButton.dataset.row=rowIndex;
          cellButton.textContent = cell.getValue(); // X or O depending on token
          cellButton.textContent=cell.getValue()===0 ? "" : cell.getValue(); // if cellButton in UI is empty meaning no value - display nothing instead of 0
          cellButton.style.color=cell.getValue()==='X' ? 'red' : 'green'; // add color depending on token value
          boardDiv.appendChild(cellButton); // add the child to the board container
        })
      })
    }
  
    // Add event listener for the board
    function clickHandlerBoard(e) {
      const selectedColumn = e.target.dataset.column; // take the column of the selected cellButton
      const selectedRow=e.target.dataset.row;// take the row of the selected cellButton
      // Make sure I've clicked a column and not the gaps in between
      if (!selectedColumn && !selectedRow) return; // if clicking in between gaps don't do anything
      
      game.playRound(selectedRow,selectedColumn); // if its not in between gaps meaning successfully clicking on a button playRound
      updateScreen(); //updateScreen to get new score, player turn and board values
    }
    boardDiv.addEventListener("click", clickHandlerBoard); // attach the handler to the board
  
    // Initial render
    updateScreen(); // start by updating on first call of function
  
    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
  }
form.addEventListener('submit',(event)=>{ //
  event.preventDefault(); // prevent form events
  form.style.display="none"; // hide form after submission
  startBtn.disabled=true; //disable the start Button since its already started
  boardCont.style.display="grid"; // show the board from none to grid since game is started
  ScreenController();// call the screenController which has the main clickHandlerBoard which will trigger all the logic on cellButton click
  resBtn.addEventListener('click',()=>{
    ScreenController(); // reset the board and cell values
    startBtn.disabled=false; // enable start btn so new names can be inputted if the players would like to
    form.style.display="block"; //show the form again 
  })
  
});
