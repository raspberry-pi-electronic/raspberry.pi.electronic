class Polygon {
    sides = [];
  
    constructor(sides) {
      this.sides = sides;
    }
  
    getParameter() {
      var sum = 0;
      for( var side of this.sides ) {
        sum = sum + side;
      }
      return sum;
    }
  }

  class Rectangle extends Polygon{
    x = 0;
    y = 0;
    constructor(x, y) {
        super([x, y, x, y]);
        this.x = x;
        this.y = y;
    }

    getArea() {
        return this.x * this.y;
    }
  }

  class Square extends Rectangle {
    constructor(edge) {
        super(edge, edge);
    }

  }
  
var pentagon = new Polygon([2, 3, 34, 4, 2]);
console.log( pentagon.getParameter());

console.log("-----------------------------")

var rectangle = new Rectangle(23, 45);
console.log( rectangle.getParameter());
console.log( rectangle.getArea());

console.log("-----------------------------")

var square = new Square(23, 45);
console.log( square.getParameter());
console.log( square.getArea());

