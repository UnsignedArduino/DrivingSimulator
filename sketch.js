let width = 1280;
let height = 720;
let SCALE = 1;
let clickAccuracy = 15;

let run = false;
let cars = [];
let mouseHeld = false
let map;
let prevPos;
let frameCount = 0;
let branchMode = false;
let branchSelected = false;
let branchNode = 0;
let showNodePos = false;
let FRAME = 0;
let monke = 10;
let closestDistance = 1000000;
let closestIndex = [];
let UNINODE;
let maps = [];

function recurseAllNodes(arr, index) {
  // Get the closet node and return an array of indexes 
  // with the first element being the index of the closest node
  if (arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      let d = dist(mouseX, mouseY, arr[i].pos.x, arr[i].pos.y);
      if (d < closestDistance) {
        closestDistance = d;
        UNINODE = arr[i];
      }
      recurseAllNodes(arr[i].nextNodes);
    }
  }
}

function chooseUni(arr) {
  UNINODE = arr[0];
  recurseAllNodes(arr);
}

function closeAndAdd(arr) {
  console.log(closestIndex);
  let node = arr[closestIndex[0]];
  for (let i = 1; i < closestIndex.length; i++) {
    node = node.nextNodes[closestIndex[i]];
  }
  node.addNextNode();
}

function testAdd() {
  UNINODE.addNextNode();
}

function setup() {
  createCanvas(width, height);
  maps.push(new GameMap())
  map = new GameMap();
  prevPos = createVector(0, 0);
}

function draw() {
  background(56);
  // Add roads if mouse held
  if (mouseHeld) {
    if (dist(mouseX, mouseY, prevPos.x, prevPos.y) > clickAccuracy) {
      if (!branchMode) {
        map.addNode();
      } else {
        // If a branch isn't selected, then get the closest node
        if (!branchSelected) {
          closestIndex = [];
          closestDistance = 10000;
          //recurseAllNodes(map.nodes)
          chooseUni(map.nodes);
        }
        branchSelected = true;
        //closeAndAdd()
        testAdd();
      }
      prevPos = createVector(mouseX, mouseY);;
    }
  } else {
    branchSelected = false;
  }

  // Draw the roads
  map.show();
  fill(255, 0, 0);
  text(branchMode, 50, 50);
  for (let i = 0; i < cars.length; i ++) {
      cars[i].show();
    }
  
  // Update the cars if we are running
  for (let z  =0; z < monke; z++) {
    if (run) {
      map.update();
      for (let i = 0; i < cars.length; i ++) {
        cars[i].nodeSteer();
        cars[i].update();
      }
      if (FRAME % 5) {
        if (cars.length > 0){
          if (dist(cars[cars.length-1].pos.x, cars[cars.length-1].pos.y, map.nodes[0].pos.x, map.nodes[0].pos.y) > 100){
            cars.push(new Car(map.nodes[0].pos.x, map.nodes[0].pos.y));
            cars[cars.length - 1].id = cars.length - 1;
          }
        } else {
          cars.push(new Car(map.nodes[0].pos.x, map.nodes[0].pos.y));
          cars[cars.length - 1].id = cars.length - 1;
        }
      }
    FRAME++
    }
  }
}


function mousePressed() {
  mouseHeld = true;
}

function mouseReleased() {
  mouseHeld = false;
}

function keyPressed() {
  // Space
  if (keyCode == 32) {
    run = !run;
  }
  // S
  if (keyCode == 83) {
    branchMode = !branchMode;
  }
  // N
  if (keyCode == 78) {
    showNodePos = !showNodePos;
  }
}