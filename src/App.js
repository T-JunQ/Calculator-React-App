import logo from "./logo.svg";
import "./App.css";
import { getByDisplayValue, render } from "@testing-library/react";
import { useEffect, useReducer, useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  const [currMove, setCurrMove] = useState(0);

  const [xNext, setXNext] = useState(true);
  const [squares, setSquares] = useState(() => {
    return Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(null)); // Dynamic initialization based on rows and cols
  });
  const [winner, setWinner] = useState(false);

  const [history, setHistory] = useState(null);

  function calculateWinner(squares) {
    if (squares === undefined) {
      return;
    }

    for (let i = 0; i < squares.length - 1; i++) {
      const set = new Set(squares[i]);
      if (set.size == 1 && !set.has(null)) {
        console.log("Win");
        setWinner(true);
        return;
      }

      // let colset = new Set();
      // for (let j = 0; j < squares[i].length; j++) {
      //   console.log(squares[i][j]);
      //   colset.add(squares[i][j]);
      // }
      // console.log("loop");
      // console.log(colset);
      // console.log("Size:", colset.size);

      // if (colset.size == 1 && !colset.has(null)) {
      //   setWinner(true);
      //   return;
      // }
    }

    for (let i = 0; i < squares[0].length; i++) {
      let colset = new Set();
      for (let j = 0; j < squares.length; j++) {
        console.log(squares[j][i]);
        colset.add(squares[j][i]);
      }
      console.log("loop");
      console.log(colset);
      console.log("Size:", colset.size);

      if (colset.size == 1 && !colset.has(null)) {
        setWinner(true);
        return;
      }
    }

    let diagonalleft = new Set();
    let diagonalright = new Set();
    for (let i = 0; i < squares.length; i++) {
      diagonalleft.add(squares[i][i]);
      diagonalright.add(squares[i][squares[0].length - 1 - i]);
    }
    if (
      (diagonalleft.size == 1 && !diagonalleft.has(null)) ||
      (diagonalright.size == 1 && !diagonalright.has(null))
    ) {
      setWinner(true);
      return;
    }
    setWinner(false);
  }

  function onClickListener(i, j) {
    const newsquares = squares.map((row) => [...row]);

    if (newsquares[i][j] || winner) return;

    newsquares[i][j] = xNext ? "X" : "O";
    calculateWinner(newsquares);

    let newhistory = [];

    if (history != null) {
      newhistory = [...history.slice(0, currMove + 1), newsquares];
      console.log("NotNull");
    } else {
      newhistory.push(newsquares);
    }

    console.log("Old Hisotyr: ", history);
    console.log("New History: ", newhistory);

    setSquares(newsquares);
    setXNext(!xNext);
    setHistory(newhistory);
    setCurrMove(currMove + 1);
  }

  function clearBoard() {
    setWinner(false);
    let arr = [];
    for (var i = 0; i < rows; i++) {
      let array2 = [];
      for (var j = 0; j < cols; j++) {
        array2.push(null);
      }
      arr.push(array2);
    }
    console.log(arr);
    setSquares(arr);
    setXNext(true);
    setHistory(null);
    setCurrMove(0);
  }

  function goBack(value, i) {
    setCurrMove(i);
    setSquares(value);
    setXNext((i + 1) % 2 == 0);

    if (currMove != history.length + 1) {
      setWinner(false);
    }
  }

  const moves =
    history == null ? (
      ""
    ) : (
      <>
        {history.map((v, i) => (
          <li>
            <button key={i + 1} onClick={() => goBack(v, i)}>
              Game Move #{i + 1}
            </button>
          </li>
        ))}
      </>
    );

  return (
    <>
      <h1>Tic-Tac-Toe</h1>
      <div className="game">
        <div className="game-board">
          {winner ? (
            <h1 style={{ color: "blueviolet" }}>Winner: {xNext ? "O" : "X"}</h1>
          ) : (
            ""
          )}
          {squares.map((col, i) => (
            <div className="board-row">
              {col.map((value, j) => (
                <Square
                  key={i + j}
                  value={value}
                  onSquareClick={() => onClickListener(i, j)}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>

      <h5 style={{ marginTop: 10 }}>{xNext ? "X" : "O"}'s turn</h5>

      <button onClick={clearBoard}>Clear Board</button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          clearBoard();
        }}
        style={{ marginTop: 15 }}
      >
        <label>Set Number of Rows: </label>
        <input
          type="number"
          onChange={(e) => setRows(e.target.value)}
          value={rows}
          required
        ></input>
        <br />
        <label>Set Number of Cols: </label>
        <input
          type="number"
          onChange={(e) => setCols(e.target.value)}
          value={cols}
          required
        ></input>
        <br />
        <button type="submit" style={{ marginTop: 2 }}>
          Apply Changes
        </button>
      </form>
    </>
  );
}

// return () => {
//   rows.forEach((i) => {
//     <h1>e</h1>;
//     cols.forEach((j) => {
//       return (
//         <>
//           <h1>e</h1> <Square value={rows[i][j]} />
//         </>
//       );
//     });
//   });
// };

// return Array(rows).fill(
//   <div className="board-row">
//     {Array(rows)
//       .fill()
//       .map((v, i) => (
//         <Square></Square>
//       ))}
//   </div>
// );
// }

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
