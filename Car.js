class Car {
  constructor(x, y) {
    this.size = createVector(30, 15);
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.desiredDirection = createVector();
    this.angle = 0;
    this.maxSpeed = 2;
    this.steerStrength = 1;
    this.nodeOn = 0;
    this.id = -1;
    this.raycastDistance = 200;
    this.rayPoints = [];
    this.edgeLines = [];
    this.isSlowing = false;
    this.goPass = false;
    this.nodes = [...map.nodes];
    // Nice random color that doesn't involve red (so we can see taillights)
    this.COLOR = color(0, random(0, 255), random(0, 255));
  }

  show() {
    // Draw the car to the screen
    push();
    translate(this.pos.x / SCALE, this.pos.y / SCALE);
    rotate(this.angle);
    rectMode(CENTER);
    fill(this.COLOR);
    rect(0, 0, this.size.x / SCALE, this.size.y / SCALE);
    // Draw red circle if slowing down, otherwise black
    fill(this.isSlowing ? 255 : 0, 0, 0);
    noStroke();
    circle(-this.size.x / 2.5, -this.size.y / 2.5, 5);
    circle(-this.size.x / 2.5, this.size.y / 2.5, 5);
    pop();
    // Draw the rays
    // push();
    // stroke(0);
    // for (let l of this.rayPoints) {
    //   line(l[0], l[1], l[2], l[3]);
    // }
    // pop()
  }

  calcRotation(x, y, offx, offy, angle) {
    // Do some math to get the rotation
    let X = x + offx;
    let Y = y + offy;
    let New_X = x + (X - x) * cos(angle) - (Y - y) * sin(angle);
    let New_Y = y + (X - x) * sin(angle) + (Y - y) * cos(angle);
    return new p5.Vector(New_X, New_Y);
  }

  setRayPoints() {
    // Do some more math
    let xOff = 30;
    let X = this.pos.x + this.raycastDistance;
    let Y = this.pos.y;
    let New_X = this.pos.x + (X - this.pos.x) * cos(this.angle) - (Y - this.pos.y) * sin(this.angle);
    let New_Y = this.pos.y + (X - this.pos.x) * sin(this.angle) + (Y - this.pos.y) * cos(this.angle);
    this.rayPoints[0] = [this.pos.x, this.pos.y, New_X, New_Y];

    X = this.pos.x + this.raycastDistance;
    Y = this.pos.y + xOff;
    New_X = this.pos.x + (X - this.pos.x) * cos(this.angle) - (Y - this.pos.y) * sin(this.angle);
    New_Y = this.pos.y + (X - this.pos.x) * sin(this.angle) + (Y - this.pos.y) * cos(this.angle);
    this.rayPoints[1] = [this.pos.x, this.pos.y, New_X, New_Y];

    X = this.pos.x + this.raycastDistance;
    Y = this.pos.y - xOff;
    New_X = this.pos.x + (X - this.pos.x) * cos(this.angle) - (Y - this.pos.y) * sin(this.angle);
    New_Y = this.pos.y + (X - this.pos.x) * sin(this.angle) + (Y - this.pos.y) * cos(this.angle);
    this.rayPoints[2] = [this.pos.x, this.pos.y, New_X, New_Y];
  }

  setLineBound() {
    // Calculate the edges and stuff
    this.edgeLines[0] = [this.calcRotation(this.pos.x, this.pos.y, -this.size.x / 2, -this.size.y / 2, this.angle)
                        ,this.calcRotation(this.pos.x, this.pos.y, this.size.x / 2, -this.size.y / 2, this.angle)];
    this.edgeLines[1] = [this.calcRotation(this.pos.x, this.pos.y, -this.size.x / 2, this.size.y / 2, this.angle)
                        ,this.calcRotation(this.pos.x, this.pos.y, this.size.x / 2, this.size.y / 2, this.angle)];
    this.edgeLines[2] = [this.calcRotation(this.pos.x, this.pos.y, -this.size.x / 2, -this.size.y / 2, this.angle)
                        ,this.calcRotation(this.pos.x, this.pos.y, -this.size.x / 2, this.size.y / 2, this.angle)];
    this.edgeLines[3] = [this.calcRotation(this.pos.x, this.pos.y, this.size.x / 2, -this.size.y / 2, this.angle)
                        ,this.calcRotation(this.pos.x, this.pos.y, this.size.x / 2, this.size.y / 2, this.angle)];
  }

  update() {
    this.setRayPoints();
    this.setLineBound();
    // Update the car with physics magic
    let desiredVelocity = createVector();
    let desiredSteeringForce = createVector();
    let acceleration = createVector();
    desiredVelocity = new p5.Vector.mult(this.desiredDirection, this.maxSpeed);
    desiredSteeringForce = new p5.Vector.sub(desiredVelocity, this.vel);
    desiredSteeringForce.mult(this.steerStrength);
    acceleration = desiredSteeringForce.copy();
    acceleration.setMag(constrain(acceleration.mag(), 0, this.steerStrength));
    let velTemp = new p5.Vector.add(this.vel, acceleration);
    this.vel = velTemp.copy();
    this.vel.setMag(constrain(this.vel.mag(), 0, this.maxSpeed));
    // Check if there is car in front and slow down if there is
    this.isSlowing = false;
    for (let car of cars) {
      // Skip if it's own self
      if (car.id == this.id) {
        continue;
      }
      // Iterate through every "edge line"
      for (let l of car.edgeLines) {
        for (let l2 of this.edgeLines) {
          if (collideLineLine(l2[0].x, l2[0].y, l2[1].x, l2[1].y,
                              l[0].x, l[0].y, l[1].x, l[1].y)) {
              // Destroy this car with we overlap
              cars.splice(this.id, 1);
              // Shift all the IDs down
              for (let i = 0; i < cars.length; i ++) {
                cars[i].id = i;
              }
              break;
          }
        }
        // Do some math
        for (let ray of this.rayPoints) {
          if (collideLineLine(ray[0], ray[1], ray[2], ray[3],
                              l[0].x, l[0].y, l[1].x, l[1].y)) {
            // Slow down
            this.vel.mult(dist(this.pos.x, this.pos.y, car.pos.x, car.pos.y) / (this.raycastDistance*2));
            this.isSlowing = true;
          }
        }
        for (let ray of this.rayPoints) {
          for (let ray2 of car.rayPoints) {
            if (collideLineLine(ray[0], ray[1], ray[2], ray[3],
                                ray2[0], ray2[1], ray2[2], ray2[3])) {
              // Slow down
              if (!this.goPass) {
                this.vel.mult(0.95);
                car.goPass = true;
                this.isSlowing = true;
              }
              // car.vel.mult(1.1);
              // push();
              // stroke(255, 0, 0);
              // strokeWeight(15);
              // line(ray[0], ray[1], ray[2], ray[3])
              // pop()
              break;
            }
          }
        }
      }
    }
    this.pos.add(this.vel);
    this.angle = Math.atan2(this.vel.y, this.vel.x);
    this.goPass = false;
  }

  setVelTorwardsMouse() {
    // Set the desired direction towards the mouse (for testing)
    let target = createVector(mouseX, mouseY);
    this.desiredDirection = new p5.Vector.sub(target, this.pos);
  }

  setDirection(x, y) {
    // Set the direction to an x and y position
    let target = createVector(x, y);
    this.desiredDirection = new p5.Vector.sub(target, this.pos);
  }

  nodeSteer() {
    // Drive to all the nodes
    let nextNode = this.nodes[this.nodeOn];
    let onPos = createVector(nextNode.pos.x, nextNode.pos.y);
    this.setDirection(onPos.x, onPos.y);
    if (dist(this.pos.x, this.pos.y, onPos.x, onPos.y) < 5) {
      if (this.nodeOn < this.nodes.length - 1) {
        this.nodeOn ++;
        if (this.nodes[this.nodeOn].nextNodes.length > 0) {
          if (random(0, 1) < 0.5) {
            this.nodes.splice(this.nodeOn + 1, this.nodes.length);
            this.nodes = this.nodes.concat(this.nodes[this.nodeOn].nextNodes);
          }
        }
      } else {
        // Destroy if at end of path
        this.nodeOn = 0;
        cars.splice(this.id, 1)
        // Shift IDs down
        for (let i = 0; i < cars.length; i ++) {
          cars[i].id = i;
        }
      }
    }
  }
}