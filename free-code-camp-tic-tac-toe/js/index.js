$(document).ready(function(){
  
  // Create a state
  function createState(player,board,status,score,depth) {
    let state = {};
    state.player = player;
    state.board = board;
    state.status = status;
    return state;
  }
  
  
  function getStatus(board) {
    let combo = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for(let i=0; i<combo.length; i++) {
      if(board[combo[i][0]] == board[combo[i][1]] && board[combo[i][2]] == board[combo[i][0]] && board[combo[i][0]] !== "e") {
        if(board[combo[i][0]] == players[1].sign) {
          return "won";
        } else {
          return "lost";
        }
      }
    }
    if(board.includes("e")) {
      return "on";
    }
    return "tie";
  }
  
  function getNextStates(state) {
    return state.board.reduce(function(acc, val, i) {
      if(val == "e") {
        let board = state.board.slice(0, i).concat([players[1].sign], state.board.slice(i+1));
        acc.push(
          createState(
            players[0],
            board,
            getStatus(board)
          )
        )
      }
      return acc;
    }, []);
  }
  
  function canItWin(stateList) {
    for(let i=0; i<stateList.length; i++) {
      if(stateList[i].status == "won") {
        return stateList[i];
      }
    }
    return false;
  }
  
  function canItLoose(state) {
    for(let i=0; i<state.board.length; i++) {
      if(state.board[i] == "e") {
        let board =  state.board.slice(0, i).concat([players[0].sign], state.board.slice(i+1));
        if(getStatus(board) == "lost") {
          board = state.board.slice(0, i).concat([players[1].sign], state.board.slice(i+1));
          return createState(
            players[0],
            board,
            getStatus(board)
          )
        }
      }
    }
    return false;
  }
  
  
  function chooseNextState(stateList, currentState) {
    if(canItWin(stateList) !== false) {
      return canItWin(stateList);
    } else if(canItLoose(currentState) !== false) {
      return canItLoose(currentState);
    } else {
      let random = Math.floor(Math.random() * stateList.length);
      return stateList[random];
    }
  }
  
  function getState(state) {
    var renderedBoard = ($(".square").toArray());
    var board = [];
    for(let i=0; i<renderedBoard.length; i++) {
      if($(renderedBoard[i]).html() == "O") {
        board.push("O");
      } else if($(renderedBoard[i]).html() == "X") {
        board.push("X");
      } else {
        board.push("e");
      }
    }
    return createState(
      players[1],
      board,
      getStatus(board)
    )
  }
  
  function renderBoard(currentBoard, nextBoard) {
    var board = ($(".square").toArray());
    for(let i=0; i<currentBoard.length; i++) {
      if(currentBoard[i] !== nextBoard[i]) {
        $(board[i]).html(nextBoard[i]);
      }
    }
  }
  
  function finalDecision(status) {
    switch(status) {
      case "won":
        $("#final").html("You lost!");
        $(".final").css({"display": "flex"});
        break;
      case "lost":
        $("#final").html("You won!");
        $(".final").css({"display": "flex"});
        break;
      case "tie":
        $("#final").html("It's a tie!");
        $(".final").css({"display": "flex"});
        break;
    }
  }
   
  let players = [{name: "player", sign: "O"}, {name: "ai", sign: "X"}];
  let board = ["e","e","e",
              "e","e","e",
              "e","e","e"];
  
  $(".choices").on("click", function() {
    if($(this).children().html() == "O"){
      players[0].sign = "O";
      players[1].sign = "X";
    } else {
      players[0].sign = "X";
      players[1].sign = "O";
    }
    $(".choice").fadeOut(500);
  })
  
  let state = createState(players[1], board, "on");
  
  function restartGame() {
    let board = ["e","e","e",
              "e","e","e",
              "e","e","e"];
    $(".square").text("");
    state = createState(players[1], board, "on");
  }
  
  $("#restart").on("click", function() {
    restartGame();
    $(".final").fadeOut(500);
  })
            
  $(".square").on("click", function() {
    if($(this).html() == "" && state.status == "on") {
      $(this).html(players[0].sign);
      state = getState(state);
      finalDecision(state.status)
    }
    if(state.status == "on") {
      let chosenState = chooseNextState(getNextStates(state), state);
      renderBoard(state.board, chosenState.board);
      state = chosenState;
      finalDecision(state.status)
    }
  });
  
})