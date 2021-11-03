let width = 1280;
let height = 720;
let SCALE = 1;
let clickAccuracy = 10;
let run = false;
let cars = [];
let mouseHeld = false
//let map;
let prevPos;
let frameCount = 0;
let branchMode = false;
let branchSelected = false;
let branchNode = 0;
let showNodePos = false;
let FRAME = 0;
let monke = 5;
let closestDistance = 1000000;
let closestIndex = [];
let UNINODE;
let maps = [];
let lastMainNode = undefined;
let titanIterator = 0;
let drawingMain = false;
let onDraw = 0;
let whatWouldHappen = "";
let universalNodeId = 0;
let branchNum = 0
let drawLayer = 0
let fpsToShow;


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

function checkIfOverlappingMap() {
  for (let m in maps) {
    for (let n of maps[m].nodes) {
      if (dist(mouseX, mouseY, n.pos.x, n.pos.y) < 60) {
        return m;
      }
    }
  }
  return -1;
}

function setup() {
  frameRate(120)
  //createCanvas(width, height);
  createCanvas(window.innerWidth, window.innerHeight)
  //maps.push(new GameMap())
  //map = new GameMap();
  makeButtons();
  prevPos = createVector(0, 0);
  setInterval(() => {
    fpsToShow = round(frameRate());
  }, 500);
}


function draw() {
  background(56);
  calculateBranching();
  updateMouseHint();
  updateMouseStuff();
  
  textSize(12);
  push();
  textAlign(RIGHT);
  fill(255);
  text("FPS: " + fpsToShow, width - 10, 15);
  pop();
  
  // Draw the roads
  let on = 0
  let c = [...cars]
  while (on <= 4){
    for (let i of maps) {
      i.showOffIndex(on)
    }
    for (let i=c.length-1;i>=0;i--){
      if (c[i].elevation == on){
        c[i].show(on)
        c.splice(i, 1)
      }
    }
    on++
  }

  updateButtons();

  // Draw a mouse hint to show what would happen
  if (whatWouldHappen != "") {
    const tooltipHeight = 2;
    push();
    fill(255, 255, 255);
    rect(mouseX - 3, mouseY - 19 - tooltipHeight,
        textWidth(whatWouldHappen) + 6,
        textSize() + 5 - tooltipHeight);
    fill(0, 0, 0);
    text(whatWouldHappen, mouseX, mouseY - 7 - tooltipHeight);
    pop();
  }

  // Update the cars if we are running
  if (run) {
    for (let z = 0; z < monke; z++) {
      for (let i = 0; i < cars.length; i ++) {
        cars[i].nodeSteer();
        cars[i].update();
      }
      if (FRAME % 5) {
        if (cars.length > 1) {
          // Only create a car if we are far enough away from the last one
          // So we don't overlap with a car and get stuck
          if (dist(cars[cars.length - 1].pos.x, cars[cars.length - 1].pos.y, 
                    cars[i].nodes[0].pos.x, cars[i].nodes[0].pos.y) > 100) {
            cars.push(new Car(0, 0));
            cars[cars.length - 1].id = cars.length - 1;
          }
        } else {
          // Never made a car before
          cars.push(new Car(0, 0));
          cars[cars.length - 1].id = cars.length - 1;
        }
      }
      FRAME ++;
    }
  } else {
    push();
    textSize(30);
    fill(255); 
    text("Elevation: " + drawLayer, 100, 100);
    pop();
  }
}

function calculateBranching() {
  // If we never made a main node we cannot branch
  if (lastMainNode === undefined) {
    branchMode = false;
    return;
  }
  // // Get the last node on the main branch
  // let lastNodeDistance = dist(mouseX, mouseY, lastMainNode.pos.x, lastMainNode.pos.y);
  // // Get the closest node to the cursor
  // closestIndex = [];
  // closestDistance = 999999999999999999999999999999;
  // UNINODE = maps[0].nodes[0]
  // for (let i = 0; i < maps.length; i++) {
  //   chooseUni(maps[i].nodes);
  // }
  // let closestNode = UNINODE;
  // let closestNodeDistance = dist(mouseX, mouseY, closestNode.pos.x, closestNode.pos.y);
  // // Only branch if we are farther then 100 pixels from the last main node
  // // And less the 100 pixels from a node
  // branchMode = lastNodeDistance > 100 && closestNodeDistance < 100;
}

function updateMouseHint() {
  if (overlappingButtons()) {
    whatWouldHappen = "";
    return;
  }
  if (dist(mouseX, mouseY, prevPos.x, prevPos.y) > clickAccuracy) {
    if (!branchMode) {
      // Not branching, add to main path
      whatWouldHappen = "Continue main path";
      let check = checkIfOverlappingMap();
      if (!drawingMain) {
        if (check == -1) {
          whatWouldHappen = "Make new car spawner";
        }
      }
    } else {
      // If a branch isn't selected, then get the closest node
      whatWouldHappen = "Continue branch";
      if (!branchSelected) {
        whatWouldHappen = "Create new branch";
      }
    }
  }
}

function updateMouseStuff() {
  if (overlappingButtons()) {
    return;
  }
  if (mouseHeld) {
    if (dist(mouseX, mouseY, prevPos.x, prevPos.y) > clickAccuracy) {
      if (!branchMode) {
        // Not branching, add to main path
        whatWouldHappen = "Continue main path";
        let check = checkIfOverlappingMap();
        if (!drawingMain) {
          branchNum++
          if (check == -1) {
            whatWouldHappen = "Make new car spawner";
            maps.push(new GameMap());
            maps[maps.length - 1].addNode();
            onDraw = maps.length - 1;
          } else {
            lastMainNode = maps[check].addNode();
            onDraw = check;
          }
          drawingMain = true;
        } else {
          lastMainNode = maps[onDraw].addNode();
        }
      } else {
        // If a branch isn't selected, then get the closest node
        whatWouldHappen = "Continue branch";
        if (!branchSelected) {
          branchNum ++;
          whatWouldHappen = "Create new branch";
          closestIndex = [];
          closestDistance = 999999999999999999999999999999;
          UNINODE = maps[0].nodes[0]
          for (let i = 0; i < maps.length; i++) {
            chooseUni(maps[i].nodes)
          }
        }
        branchSelected = true;
        testAdd();
      }
      prevPos = createVector(mouseX, mouseY);
    }
  } else {
    drawingMain = false;
    branchSelected = false;
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
  // Up arrow
  if (keyCode == 38) {
    if (drawLayer < 4) {
      drawLayer ++;
    }
  }
  // Down arrow
  if (keyCode == 40) {
    if (drawLayer > 0) {
      drawLayer --;
    }
  }
}