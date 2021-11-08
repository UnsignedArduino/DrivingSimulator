function runLevel(l) {
  let levels = [levelZero, levelOne, levelTwo];
  if (l < 0 || l >= levels.length) {
    return;
  }
  levels[l]();
}

function levelZero() {
  trafficFlow = 0;
  framesRan = 0;
  maps = [];
  goals = [];
}

function levelOne() {
  levelZero();
  maps.push(new GameMap())
  maps[0].addNodeAtPos(50, height/2)
  goals.push(createVector(width-50, height/2))
}

function levelTwo() {
  levelZero();
  maps.push(new GameMap())
  maps[0].addNodeAtPos(50, height/2)
  maps.push(new GameMap())
  maps[1].addNodeAtPos(width/2, 50)
  goals.push(createVector(width-50, height/2))
}

function hardLevel() {
  levelZero();
  maps.push(new GameMap());
  maps[0].addNodeAtPos(width-50, height / 2 - 40);
  maps.push(new GameMap());
  maps[1].addNodeAtPos(50, height / 2 + 40);

  maps.push(new GameMap());
  maps[2].addNodeAtPos(width / 2 - 40, 50);
  maps.push(new GameMap());
  maps[3].addNodeAtPos(width / 2 + 40, height - 50);

  
  goals.push(createVector(50, height / 2 - 40));
  goals.push(createVector(width - 50, height / 2 + 40));
  goals.push(createVector(width / 2 - 40, height - 50));
  goals.push(createVector(width / 2 + 40, 50));
}