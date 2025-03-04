const LENGTH = 6;
const TILE_COUNT = 4;


function Vector(x, y) {
  this.x = x;
  this.y = y;
}

Vector.prototype.add = function (addend) {
  return new Vector(this.x + addend.x, this.y + addend.y);
};

Vector.prototype.sub = function (addend) {
  return new Vector(this.x - addend.x, this.y - addend.y);
};

Vector.prototype.toString = function() {
  return `Vector (${this.x}, ${this.y})`
}

Vector.prototype.reverse = function() {
  return new Vector(this.y, this.x)
}

function inRange(pos) {
  return pos.x >= 0 && pos.x < TILE_COUNT && pos.y >= 0 && pos.y < TILE_COUNT;
}

function toColor(num) {
  // let values = [ "#abc", "#bbc", "#efb", "#33c"]
  // let colors = ["#1880F2", "#19C1FC", "#22E6E6", "#19FCBC", "#18F277", "#0BDB2A", "#33F90C", "#DAFD00", "#E6D80B", "#FED70D", "#E8AA00"]
  let colors = ["#1880F2", "#19C1FC", "#22E6E6", "#19FCBC", "#18F277", "#0BDB2A", "#33F90C", "#9cb30c", "#E6D80B", "#FED70D", "#E8AA00"]
  let index = Math.log2(num)
  return colors[index]
}
function coord(value){ 
  return value * LENGTH + ((value+1) * 1) + "rem"
};

function rgbToHsl(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
      h = s = 0; // achromatic
  }else{
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max){
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return [h, s, l];
}


export { Vector, inRange, toColor, LENGTH, TILE_COUNT, coord, rgbToHsl };