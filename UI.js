const selectedColor = "#009DFF";
const unselectedColor = "#FFFFFF";
const hoverColor = "#61C2FF";
const disabledColor = "#828282"

let runButton;
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
  runButton = makeCheckButton(10, 10, 100, 30, "Run", 
    () => {  // Enabled
      return true;
    }, 
    () => {  // Selected
      return run;
    },
    () => {  // On press
      run = !run;
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
  runButton.draw();
}
