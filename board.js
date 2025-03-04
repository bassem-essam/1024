import { Tile } from "./tile";
import { TILE_COUNT, inRange, Vector } from "./helpers";

export default class Board {
  constructor(elem, positions) {
    this.positions = positions;
    this.runningAnimations = 0;
    this.runner = Promise.resolve();
    this.scoreElem = document.querySelector("#score")
    this.topScoreElem = document.querySelector("#topscore")

    this.tiles = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    this.elem = elem;
    this.score = 0;
    this.topscore = localStorage.getItem('topscore') || 0
    if (this.topscore != 0) {
      this.topScoreElem.innerText = this.topscore
    }

    this.moveCount = 0;
    this.emptyPositions = [];
    this.locked = false;

    for (let y = 0; y < TILE_COUNT; y++) {
      for (let x = 0; x < TILE_COUNT; x++) {
        const value = this.positions[y][x];
        if (value != 0) {
          this.tiles[y][x] = new Tile(x, y, value, this);
        }
      }
    }

    this.addRandomTile();
  }

  move(dir) {
    if (this.locked) return
    this.refreshEmptyCells();
    if (this.emptyPositions.length == 0) {
      let moveAvailable = false;
      let prev, current;
      for (let shiftDirection of [new Vector(1, 0), new Vector(0, 1)]) {
        let direction = shiftDirection.reverse();
        let starter = new Vector(0, 0);
        while (inRange(starter)) {
          let prevPos = starter;
          while (inRange(prevPos)) {
            prev = this.getTile(prevPos);
            prevPos = prevPos.add(direction);
            current = this.getTile(prevPos);
            if (current && current.num == prev.num) {
              moveAvailable = true;
            }
          }

          starter = starter.add(shiftDirection);
        }
      }

      if (!moveAvailable) {
        this.showGameOver();
      }
    }
    let x = 0,
      y = 0;
    let iterator;
    let direction;
    let shiftDirection = new Vector(0, 1);
    switch (dir) {
      case "left":
        direction = new Vector(-1, 0);
        break;
      case "right":
        direction = new Vector(1, 0);
        x = 3;
        break;
      case "up":
        direction = new Vector(0, -1);
        shiftDirection = new Vector(1, 0);
        break;
      case "down":
        direction = new Vector(0, 1);
        shiftDirection = new Vector(1, 0);
        y = 3;
        break;
    }

    let starter = new Vector(x, y);
    while (inRange(starter)) {
      iterator = starter;
      let prevPos = iterator;
      let count = 0;

      while (inRange(iterator)) {
        let current = this.getTile(iterator),
          prev = this.getTile(prevPos);
        iterator = iterator.sub(direction);
        if (current == null || count == 0) {
          count++;
          continue;
        }

        if (prev !== null) {
          if (prev.num == current.num) {
            this.updateScore(current.num * 2);
            this.clearTile(current.pos);
            current.refresh(current.num * 2);
            current.setPos(prevPos);

            prev.destroy();
            this.setTile(prevPos, current);
            prevPos = prevPos.sub(direction);
          } else {
            prevPos = prevPos.sub(direction);
            this.clearTile(current.pos);
            current.setPos(prevPos);
            this.setTile(prevPos, current);
          }
        } else {
          this.clearTile(current.pos);
          current.setPos(prevPos);
          this.setTile(prevPos, current);
        }
      }
      starter = starter.add(shiftDirection);
    }
  }

  updateScore(score) {
    if (score == 1024) {
      this.scoreElem.style.color = "yellow";
      document.querySelector("#win-span").style.color = "yellow";
      document.querySelector("#win-span").style.fontWeight = "bold";
    }

    this.score += score;
    if (this.score > this.topscore) {
      this.topscore = this.score;
      localStorage.setItem('topscore', this.topscore)
    }

    this.scoreElem.innerText = this.score;
    this.topScoreElem.innerText = this.topscore;
  }

  refreshEmptyCells() {
    this.emptyPositions = [];
    this.tiles.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (!cell) {
          this.emptyPositions.push(new Vector(x, y));
        }
      });
    });
  }

  addRandomTile() {
    this.refreshEmptyCells();
    if (this.emptyPositions.length === 0) {
      console.log("empty");
      return 0;
    }

    let values = [1, 2];
    let randomPos =
      this.emptyPositions[
      Math.floor(Math.random() * this.emptyPositions.length)
      ];
    let randomValue = values[Math.floor(Math.random() * values.length)];
    let randomTile = new Tile(randomPos.x, randomPos.y, randomValue, this);
    this.setTile(randomPos, randomTile);
  }

  getTile(pos) {
    if (inRange(pos)) {
      return this.tiles[pos.y][pos.x];
    } else return null;
  }

  setTile(pos, tile) {
    // if (inRange(pos)) {
    this.tiles[pos.y][pos.x] = tile;
    // }
  }

  clearTile(pos) {
    this.tiles[pos.y][pos.x] = null;
  }

  restart() {
    for (let y = 0; y < TILE_COUNT; y++) {
      for (let x = 0; x < TILE_COUNT; x++) {
        let tile = this.getTile(new Vector(x, y))
        if (tile != null) {
          tile.destroy();
        }
      }
    }

    // this.updateScore(0);
    this.score = 0;
    this.updateScore(0);
    this.locked = false;
    this.moveCount = 0;
    this.positions = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.tiles = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    document.getElementById("gameover-modal").style.display = "none";
    this.addRandomTile();
  }

  clearGameOver() {
    this.locked = false;
    document.getElementById("gameover-modal").style.display = "none";
  }


  showGameOver() {
    this.locked = true;
    document.getElementById("gameover-modal").style.display = "flex";
  }
}
