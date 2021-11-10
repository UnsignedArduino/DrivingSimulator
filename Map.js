function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}


class GameMap {
  constructor() {
    this.createMap();
    this.nodes = [];
    this.layer = drawLayer
  }

  createMap(
    
  ) {
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
    for (let i = 0; i < this.nodes.length; i ++) {
      this.nodes[i].isFinal = false;
    }
    node.isFinal = true;
    this.nodes.push(node);
    
    return node;
  }
  addNodeAtPos(x, y) {
    let node = new Node(x, y);
    for (let i = 0; i < this.nodes.length; i ++) {
      this.nodes[i].isFinal = false;
    }
    node.isFinal = true;
    this.nodes.push(node);
  }
  returnAllNodes(arr, all){
    if (all == null || all == undefined){
      all = []
    }
    if (arr.length > 0){
      for (let a of arr){
        all.push(a);
        this.returnAllNodes(a.nextNodes, all)
      }
    }
  }

  update() {

  }

  showAllSubsBottom(arr) {
    if (arr.length > 0){
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].nextNodes.length > 0) {
          arr[i].showBottom();
          this.showAllSubsBottom(arr[i].nextNodes);
        }
      }
    }
  }
  showAllSubsTop(arr) {
    if (arr.length > 0){
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].nextNodes.length > 0) {
          arr[i].showTop();
          this.showAllSubsTop(arr[i].nextNodes);
        }
      }
    }
  }

  showAllSubsOffIndex(arr, index) {
    if (arr.length > 0){
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].nextNodes.length > 0) {
          arr[i].show(index);
          this.showAllSubsOffIndex(arr[i].nextNodes, index);
        }
      }
    }
  }

  checkIfSatisfiedGoals(){
    let all = []
    this.returnAllNodes(this.nodes, all)
    let check = false
    let gotHowMany = 0
    let collected = []
    for (let a of all){
      for (let g in goals){
        let canCheck = true
        for (let c of collected){
          if (c == g){
            canCheck = false
          }
        }
        if (dist(goals[g].x, goals[g].y, a.pos.x, a.pos.y) < 40 && canCheck){
          gotHowMany++
          collected.push(g)
        }
      }
      if (gotHowMany >= goals.length){
        check = true
      }
    }
    return check;
  }

  showBottom() {
    // Show everything
    this.showAllSubsBottom(this.nodes);
    for (let n = 0; n < this.nodes.length - 1; n ++) {
      if (this.nodes[n].layer == 0){      
        push();
        stroke(map(this.nodes[n].layer, 0, 2, 100, 255));
        strokeWeight(40);
        line(this.nodes[n].pos.x, this.nodes[n].pos.y, 
            this.nodes[n + 1].pos.x, this.nodes[n + 1].pos.y);
        pop();
      }
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

  showTop() {
    // Show everything
    this.showAllSubsTop(this.nodes);
    for (let n = 0; n < this.nodes.length - 1; n ++) {
      if (this.nodes[n].layer == 1){      
        push();
        stroke(map(this.nodes[n].layer, 0, 2, 100, 255));
        strokeWeight(40);
        line(this.nodes[n].pos.x, this.nodes[n].pos.y, 
            this.nodes[n + 1].pos.x, this.nodes[n + 1].pos.y);
        pop();
      }
      
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

  showOffIndex(index) {
    // Show everything
    this.showAllSubsOffIndex(this.nodes, index);
    if (this.nodes[0].layer == index){
      push()
      noStroke()
      fill(map(this.nodes[0].layer, 0, 4, 100, 255))
      circle(this.nodes[0].pos.x, this.nodes[0].pos.y, 40)
      pop()
    }
    for (let n = 0; n < this.nodes.length - 1; n ++) {
      if (this.nodes[n].layer == index){      
        push();
        stroke(map(this.nodes[n].layer, 0, 4, 100, 255));
        strokeWeight(40);
        line(this.nodes[n].pos.x, this.nodes[n].pos.y, 
            this.nodes[n + 1].pos.x, this.nodes[n + 1].pos.y);
        pop();
        
      }
    }
    
    if (showNodePos) {
      push();
      fill(255, 0, 0);
      noStroke();
      for (let n = 0; n < this.nodes.length; n ++) {
        circle(this.nodes[n].pos.x, this.nodes[n].pos.y, 5)
        if (n % 10 == 0 && n<this.nodes.length-2) {
          let p = this.nodes[n].pos.copy();
          let m = this.nodes[n + 1].pos.copy();
          let v = p5.Vector.sub(m, p);
          v.setMag(5);
          drawArrow(p, v, "blue")
        }
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
    this.id = universalNodeId;
    this.isFinal = false
    this.branchNumber = branchNum
    this.layer = drawLayer;
    universalNodeId ++;
  }

  addNextNode() {
    this.nextNodes.push(new Node(mouseX, mouseY));
    if (this.nextNodes.length == 1) {
      this.nextNodes[0].pos = this.pos.copy();
    }
    for (let i = 0; i < this.nextNodes.length; i ++) {
      this.nextNodes[i].isFinal = false
    }
    this.nextNodes[this.nextNodes.length-1].isFinal = true;    
  }

  update() {

  }

  showBottom() {
    // Draw a line from this node to every next node
    push();
    
    strokeWeight(40);
    for (let i = 1; i < this.nextNodes.length; i++) {
      stroke(map(this.nextNodes[i].layer, 0, 2, 100, 255));
      if (this.nextNodes[i].layer == 0){
        line(this.nextNodes[i].pos.x, this.nextNodes[i].pos.y, 
            this.nextNodes[i-1].pos.x, this.nextNodes[i-1].pos.y);
      }
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

  showTop() {
    // Draw a line from this node to every next node
    push();
    stroke(map(this.layer, 0, 2, 100, 255));
    strokeWeight(40);
    for (let i = 1; i < this.nextNodes.length; i++) {
      stroke(map(this.nextNodes[i].layer, 0, 4, 100, 255));
      if (this.nextNodes[i].layer == 1) {
        line(this.nextNodes[i].pos.x, this.nextNodes[i].pos.y, 
            this.nextNodes[i-1].pos.x, this.nextNodes[i-1].pos.y);
      }
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
  
  show(index) {
    // Draw a line from this node to every next node
    push();
    stroke(map(this.layer, 0, 2, 100, 255));
    strokeWeight(40);
    for (let i = 1; i < this.nextNodes.length; i++) {
      if (this.nextNodes[i].layer == index){
      stroke(map(this.nextNodes[i].layer, 0, 4, 100, 255));
        line(this.nextNodes[i].pos.x, this.nextNodes[i].pos.y, 
            this.nextNodes[i-1].pos.x, this.nextNodes[i-1].pos.y);
      }
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
