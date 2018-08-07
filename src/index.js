import React from "react"
import ReactDOM from 'react-dom'
import './index.css'

// this is functional element, because it doesn't
// contain any state
function Square(props){
    return (
        <button 
            className="square"
            // this will handle a funciton passed as  
            // props from a parrent element 
            onClick={props.onClick}
        >
        {props.value}
        </button>

    )
}
function Toggle(props){
  return (
    <button 
      className="toggle-button"
      onClick={props.onClick}
      >Toggle</button>
    
  )
}
/*
class Square extends React.Component {
    render() {
      return (
        <button 
            className="square" 
            onClick={() => this.props.onClick()}
        >
          {this.props.value}
        </button>
      );
    }
  }
  */
  
  class Board extends React.Component {
    // the mission of this component is to render Square functonal element

    
    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)} 
        />
      );
    }

    render() {
      // refactored to draw a table using 2 "for" loops 
      let rows = []; 
      let count = 0; 
      for(let i = 0; i < 3; i++){
        let children = []
        for (let b = 0; b < 3; b++){
          children.push(this.renderSquare(count))
          count++
        }
        rows.push(<div className="board-row"> {children}</div>)
      }
      return (
        <div>{rows}</div>
        /* *
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
        */
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null), 
          // this will store moves in a history
          move: Array(2).fill(null), 
        }],
        xIsNext: true, 
        stepNumber: 0, 
        isReversed: false, // added a piece to track wheather histotry is reversed, or not; 
      }
    } 

    jumpTo(step){
      this.setState({
        stepNumber: step, 
        xIsNext: (step % 2) === 0, 
      })
    }

    handleToggleButton(){
      this.setState({
        isReversed: !this.state.isReversed,
      })
      

    }

    handleClick(i){
      const history = this.state.history.slice(0, this.state.stepNumber + 1)
      const current = history[history.length - 1];
      const squares = current.squares.slice(); 
      const gameMovePosition = current.move.slice(); // copying an array with history 

      // this if block determines a row in the history
      if (i >= 0 && i <= 2){
        gameMovePosition[1] = 1;  
      } else if ( i >= 3 && i <= 5){
        gameMovePosition[1] = 2;
      } else {
        gameMovePosition[1] = 3
      }
      // this determines a column position
      gameMovePosition[0] = i%3 + 1; 

      if (calculateWinner(squares) || squares[i]){
        return; 
      } 

      squares[i] = this.state.xIsNext? "X" : "O"

      this.setState({
        history: history.concat([{
          squares: squares,
          move: gameMovePosition, //updating a state for game move position 
        }]),
        xIsNext: !this.state.xIsNext, 
        stepNumber: history.length,
      }) 
    }

    render() {
      const history = this.state.history;
      const current = !this.state.isReversed ? 
        history[this.state.stepNumber] :
        history[history.length - this.state.stepNumber] // continue from here ********* 

      const winner = calculateWinner(current.squares);
      const className = 'active-button' 
      
      const moves = history.map((step, move) => {
        const gameMove = step.move;
        const desc = move ? 
          "go to move # " + move + `move: col(${gameMove[0]}) row(${gameMove[1]})` :
          "Go to game start"; 
        return (
          <li key={move}>
            <button 
              onClick={() => this.jumpTo(move)}
              /**
               Here I've added 2 event handlers to toggle a class for an active button
               */
              onMouseEnter={(e) => e.currentTarget.className=className}
              onMouseLeave={(e) => e.currentTarget.className=""}>
              {desc}
            </button>
          </li>
        )
      })

      let status;
      if (winner){
        status = "Winner: "+ winner;
      } else {
        status = "Next player: " + (this.state.xIsNext? "X" : "O");
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <Toggle onClick={() => this.handleToggleButton()} />
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for(let i = 0; i < lines.length; i++){
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]){
            return squares[a];
        }
    }
    return null;
}