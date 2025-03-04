import { coord, rgbToHsl, toColor, Vector } from "./helpers";
import anime from './anime.es'

var duration = 200;

export class Tile {
  constructor(x, y, num, parent) {
    this.pos = new Vector(x, y);
    this.num = num;
    this.elem = document.createElement("span");
    this.elem.className = "cell";
    this.createdAt = 0;
    let p = document.createElement("p");
    p.innerText = num;
    this.elem.appendChild(p);
    // this.elem.style = {...this.elem.style,
    //   left: coord(x),
    //   top: coord(y),
    //   backgroundColor: `#7${Math.log2(num)}07`
    // }
    this.elem.style.left = coord(x);
    this.elem.style.top = coord(y);
    this.elem.style.backgroundColor = toColor(num);
    this.board = parent;
    this.positions = parent.positions;
    this.board.elem.appendChild(this.elem);
  }
  
  setBackground(num) {
    let background = toColor(num);
    this.elem.style.backgroundColor = background;
    background = background.slice(1)
    var r = parseInt(background.substr(0, 2), 16),
        g = parseInt(background.substr(2, 2), 16),
        b = parseInt(background.substr(4, 2), 16);


    let [hue, sat, lightness] = rgbToHsl(r, g, b)
    if (lightness >= 0.5 && sat < 0.5) {
      this.elem.style.color = "black";
    }
  }
  refresh(num){
    this.num = num;
    this.setBackground(num)
    this.elem.childNodes[0].innerText = num;

    let tl = anime.timeline({
      duration: duration, 
      easing: 'easeInOutQuad'
    });

    tl.add({
      targets: this.elem,
      scale: 1.2,
    })

    tl.add({
      targets: this.elem,
      scale: 1,
      duration: duration / 2
    })
  }

  move(dir) {
    this.elem.style.backgroundColor = "#ace"
    let direction = new Vector(0, 0);
    let newPos = new Vector(this.pos.x, this.pos.y);
    switch (dir) {
      case "right":
        direction.x = 1;
        break;
      case "left":
        direction.x = -1;
        break;
      case "up":
        direction.y = -1;
        break;
      case "down":
        direction.y = 1;
        break;
    }

    while (this.board.empty(newPos.add(direction))) {
      newPos = newPos.add(direction);
    }


    
    if (this.pos.x != newPos.x || this.pos.y != newPos.y) {
      let merger = this.board.getTile(newPos.add(direction))
      if (merger != null && merger.createdAt != this.board.moveCount) {
        merger.elem.style.transform = "scale(1.2)";
        merger.destroy()
        this.destroy()
        let finalPos = newPos.add(direction)
        this.board.addTileResult(finalPos, merger.num + this.num)
        alert("Merged")
      }
      this.board.swapTile(this.pos, newPos);
      console.log("Swapping ", this.pos, " to ", newPos);
      this.setPos(newPos);
    }

  }

  destroy() {
    this.board.elem.removeChild(this.elem);
  }

  setPos(pos) {
    if (pos.x === this.pos.x && pos.y === this.pos.y) return;
    let board = this.board;
    board.runningAnimations++;
    this.pos = new Vector(pos.x, pos.y);
    anime({
      targets: this.elem,
      left: coord(pos.x),
      top: coord(pos.y),
      easing: 'easeInOutQuad',
      duration: duration,
      complete: function() { 
        board.runningAnimations--;
        if (board.runningAnimations == 0)
          board.addRandomTile()
      }
    })

    setTimeout(() => {
      this.elem.style.transform = "scale(1)"
    }, duration)
  }
}
