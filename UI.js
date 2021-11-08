const selectedColor = "#009DFF";
const unselectedColor = "#FFFFFF";
const hoverColor = "#61C2FF";
const disabledColor = "#828282"

let runButton;
let fastForwardButton;

let branchButton;
let upElevationButton;
let downElevationButton;

let allButtons = [];

function makeCommandButton(x, y, width, height, text, isEnabledFunc, onPressFunc) {
  let button = new Clickable();
  button.x = x;
  button.y = y;
  button.width = width;
  button.height = height;
  button.color = unselectedColor;
  button.cornerRadius = 5;
  button.text = text;
  button.onOutside = function() {
    this.hovering = false;
    this.color = isEnabledFunc() ? unselectedColor : disabledColor;
  }
  button.onHover = function() {
    this.hovering = true;
    this.color = isEnabledFunc() ? hoverColor : disabledColor;
  }
  button.onPress = function() {
    if (!isEnabledFunc()) {
      return;
    }
    this.color = selectedColor;
    onPressFunc();
  }
  allButtons.push(button);
  return button;
}

function makeCheckButton(x, y, width, height, text, isEnabledFunc, isSelectedFunc, onPressFunc) {
  let button = new Clickable();
  button.x = x;
  button.y = y;
  button.width = width;
  button.height = height;
  button.color = unselectedColor;
  button.cornerRadius = 5;
  button.text = text;
  button.onOutside = function() {
    this.hovering = false;
    if (!isEnabledFunc()) {
      this.color = disabledColor;
      return;
    }
    this.color = isSelectedFunc() ? selectedColor : unselectedColor;
  }
  button.onHover = function() {
    this.hovering = true;
    if (!isEnabledFunc()) {
      this.color = disabledColor;
      return;
    }
    this.color = isSelectedFunc() ? selectedColor : hoverColor;
  }
  button.onPress = function() {
    if (!isEnabledFunc()) {
      return;
    }
    this.color = selectedColor;
    onPressFunc();
  }
  allButtons.push(button);
  return button;
}

function makeButtons() {
  runButton = makeCheckButton(10, 10, 100, 30, "Run (space)", 
    () => {  // Enabled
      return maps.length > 0 && checkIfRoadsMeetGoals();
    }, 
    () => {  // Selected
      return run;
    },
    toggleRun
  )
  fastForwardButton = makeCommandButton(10, 50, 100, 30, "Speed x1 (f)", 
    () => {
      return run;
    }, 
    changeSpeed
  )

  branchButton = makeCheckButton(120, 10, 150, 30, "Branch mode (s)",
    () => {
      return !run && maps.length > 0;
    },
    () => {
      return branchMode;
    },
    () => {
      branchMode = !branchMode;
    }
  )
  upElevationButton = makeCommandButton(120, 50, 150, 30, "Increase elevation (↑)", 
    () => {
      return !run && drawLayer < 4;
    }, 
    () => {
      if (drawLayer < 4) {
        drawLayer ++;
      }
    }
  )
  downElevationButton = makeCommandButton(120, 90, 150, 30, "Decrease elevation (↓)", 
    () => {
      return !run && drawLayer > 0;
    }, 
    () => {
      if (drawLayer > 0) {
        drawLayer --;
      }
    }
  )
}

function overlappingButtons() {
  for (let btn of allButtons) {
    if (btn.hovering) {
      return true;
    }
  }
  return false;
}

function updateButtons() {
  fastForwardButton.text = "Speed x" + monke + " (f)";
  for (let btn of allButtons) {
    btn.draw();
  }
}
