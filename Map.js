class GameMap {
  constructor() {
    this.createMap();
    this.nodes = [];
  }

  createMap() {
    // Create the map
    this.starts = [];
    this.ends = [];
    this.createDestination(0, height / 2, width, height / 2);
  }

  createDestination(start_x, start_y, end_x, end_y) {
    // Create a destination from start to finish
    let end = new EndPosition(end_x, end_y);
    let start = new StartPosition(start_x, start_y, end);
    this.ends.push(end);
    this.starts.push(start);
  }

  addNode() {
    let node = new Node(mouseX, mouseY);
    this.nodes.push(node);
    return node;
  }

  update() {

  }

  showAllSubs(arr) {
    if (arr.length > 0){
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].nextNodes.length > 0) {
          arr[i].show();
          this.showAllSubs(arr[i].nextNodes);
        }
      }
    }
  }

  show() {
    // Show everything
    this.showAllSubs(this.nodes);
    for (let n = 0; n < this.nodes.length - 1; n ++) {
      // Draw roads
      push();
      stroke(200, 200, 200);
      strokeWeight(60);
      line(this.nodes[n].pos.x, this.nodes[n].pos.y, 
           this.nodes[n + 1].pos.x, this.nodes[n + 1].pos.y);
      pop();
    }
    if (showNodePos) {
      push();
      fill(255, 0, 0);
      noStroke();
      for (let n = 0; n < this.nodes.length; n ++) {
        circle(this.nodes[n].pos.x, this.nodes[n].pos.y, 5)
      } 
      pop();
    }
  }
}

class Node {
  constructor(x, y) {
    this.pos = createVector(x, y);
    // It's a list so we can branch
    this.nextNodes = [];
  }

  addNextNode() {
    this.nextNodes.push(new Node(mouseX, mouseY));
    if (this.nextNodes.length == 1) {
      this.nextNodes[0].pos = this.pos.copy()
    }
  }

  update() {

  }

  show() {
    // Draw a line from this node to every next node
    push();
    stroke(200, 200, 200);
    strokeWeight(60);
    for (let i = 1; i < this.nextNodes.length; i++) {
      line(this.nextNodes[i].pos.x, this.nextNodes[i].pos.y, 
           this.nextNodes[i-1].pos.x, this.nextNodes[i-1].pos.y);
    }
    pop();

    if (showNodePos) {
      push();
      fill(255, 0, 0);
      noStroke();
      for (let n = 0; n < this.nextNodes.length; n ++) {
        circle(this.nextNodes[n].pos.x, this.nextNodes[n].pos.y, 5)
      } 
      pop();
    }
  }
}

class StartPosition {
  constructor(x, y, end) {
    this.pos = createVector(x, y);
    this.end = end;
    // Every node that's connected
    this.nodes = [];
  }

  addNode(x, y) {
    // Add a node and connect it
    let node = new Node(x, y);
    let previousNode = this.nodes[this.nodes.length - 1];
    previousNode.addNextNode(node);
    this.nodes.push(node);
  }

  update() {

  }

  show() {
    // Draw every node
    push();
    stroke(200, 200, 200);
    circle(this.pos.x, this.pos.y, 100);
    pop();
    for (let node of this.nodes) {
      node.update();
      node.show();
    }
   
  }
  

}

class EndPosition {
  constructor(x, y) {
    this.pos = createVector(x, y);
    // So it doesn't fail when we treat this as a node cause it essentially is
    this.nextNodes = [];
  }

  update() {

  }

  show() {
    // Draw this last bit of road
    push();
    stroke(200, 200, 200);
    circle(this.pos.x, this.pos.y, 100);
    pop();
  }
}
