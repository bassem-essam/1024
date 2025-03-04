import "./style.css";
import Board from "./board";
import { Vector } from "./helpers";

function generateSampleTiles() {
  let data = [];
  for (let i = 0; i < 4; i++) {
    data.push([])
    for (let j = 0; j < 4; j++) {
      data[i][j] = Math.random() > 0.2 ? 1 : 0;
      // let value = 2 ** (i * 4 + j);
      // if (value <= 1024)
      //   data[i][j] = value;
      // else 
      data[i][j] = 0;
      // data[i][j] = 1
    }
  }

  // data[1][1] = 512;
  // data[3][3] = 512;

  return data
}

function insertHTMLSkeleton() {
  let table = document.createElement("table");
  for (let i = 0; i < 4; i++) {
    let row = document.createElement("tr");
    for (let j = 0; j < 4; j++) {
      let cell = document.createElement("td");
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  document.getElementById("board").appendChild(table);
}

insertHTMLSkeleton();
let data = generateSampleTiles()
let board = new Board(document.getElementById("board"), data);
window.board = board;
window.Vector = Vector;

document.addEventListener("keydown", (key) => {
  board.runner = board.runner.then(() => {
    if (board.runningAnimations != 0) return;
    switch (key.key) {
      case "ArrowDown":
        board.move("down");
        break;
      case "ArrowLeft":
        board.move("left");
        break;
      case "ArrowUp":
        board.move("up");
        break;
      case "ArrowRight":
        board.move("right");
        break;
    }
  })
});

document.querySelector("#restart").onclick = () => {
  board.restart()
}
