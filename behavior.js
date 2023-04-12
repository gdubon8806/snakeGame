let directionHistory = [""];

class Grid {
  constructor(width, height, currentSnake, currentFood) {
    this.gridContent = new Map();
    this.width = width;
    this.height = height;
    this.currentSnake = currentSnake;
    this.currentFood = currentFood;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.gridContent.set(y * width + x, mapGrid(x, y));  //this adds to the map the current div with its id
        let currentDiv = this.gridContent.get(y * width + x) //this takes the current div we just added 
        if (this.currentSnake.includes(this.gridContent.get(y * width + x).id)) { // this evaluates if its part of the body of the snake
          currentDiv.setAttribute("class", "partOfSnake"); //if its part,  it will renderize in the grid, otherwise will be ignored
        }
        if (this.currentFood.includes(this.gridContent.get(y * width + x).id)) {
          currentDiv.setAttribute("class", "food");
        }
      }
    }
  }
}

function mapGrid(x, y) { //this creates the grid we visualize in the document
  let div = document.createElement("div");
  div.setAttribute('id', x + "" + y);
  let spaceForGrid = document.getElementById("spaceForGrid")
  spaceForGrid.appendChild(div);
  return div;
}

function updateSnake(state, direction, locationOfFood) {
  let nextSnake = state.currentSnake
  let deletedTail;
  let currentHead;
  directionHistory.push(direction);
  let previousDirection = directionHistory[directionHistory.length - 1];
  console.log("La dirrecion anterior es: ", previousDirection);
  console.log("La direccion actual es: ",direction)


  switch (direction) {
    case "d":
      if(previousDirection !== "a") {
        currentHead = nextSnake[nextSnake.length - 1].split("");
        currentHead[currentHead.length - 2] = Number(currentHead[currentHead.length - 2]);
        currentHead[currentHead.length - 2] += 1
        currentHead[currentHead.length - 2] = String(currentHead[currentHead.length - 2]);
        currentHead = currentHead.join("");
        nextSnake.push(currentHead);
        deletedTail = nextSnake.shift();
        break;  
      } 
      
    case "w":
      if(previousDirection !== "s") {
        currentHead = nextSnake[nextSnake.length - 1].split("");
        currentHead[currentHead.length - 1] = Number(currentHead[currentHead.length - 1]);
        currentHead[currentHead.length - 1] -= 1
        currentHead[currentHead.length - 1] = String(currentHead[currentHead.length - 1]);
        currentHead = currentHead.join("");
        nextSnake.push(currentHead);
        deletedTail = nextSnake.shift();
        console.log(nextSnake);
        break;
      }
      
    case "s":
      if(previousDirection !== 'w') {
        currentHead = nextSnake[nextSnake.length - 1].split("");
        currentHead[currentHead.length - 1] = Number(currentHead[currentHead.length - 1]);
        currentHead[currentHead.length - 1] += 1
        currentHead[currentHead.length - 1] = String(currentHead[currentHead.length - 1]);
        currentHead = currentHead.join("");
        nextSnake.push(currentHead);
        deletedTail = nextSnake.shift();
        console.log(nextSnake);
        break;        
      }  
    case "a":
      if(previousDirection !== 'd') {
        currentHead = nextSnake[nextSnake.length - 1].split("");
        currentHead[currentHead.length - 2] = Number(currentHead[currentHead.length - 2]);
        currentHead[currentHead.length - 2] -= 1
        currentHead[currentHead.length - 2] = String(currentHead[currentHead.length - 2]);
        currentHead = currentHead.join("");
        nextSnake.push(currentHead);
        deletedTail = nextSnake.shift();
        break;
      }
  }

  let keys = state.gridContent.keys(); //we are extracting the keys of the map that holds all the blocks of grid

  for (let key of keys) { //we iterate through the keys to extract the divs of the map and check whether the snake is there or not
    let div = state.gridContent.get(key)
    if (nextSnake.includes(div.id)) { //if the snake has the current div we will display it on the screen
      state.gridContent.get(key).setAttribute("class", "partOfSnake");
    } else {
      state.gridContent.get(key).removeAttribute("class", "partOfSnake");
    }
  }


  if (nextSnake[nextSnake.length - 1] == locationOfFood) {
    console.log("I MUST GROW MY SNAKE")
    nextSnake.unshift(deletedTail);
  }

  //TROZO DE CODIGO QUE SE ENCARGA DE VERIFICAR QUE LA CULEBRA NO SE TOQUE A ELLA MISMA Y QUE NO CHOQUE CON LAS PAREDES
  let stringToNumber = nextSnake.map(coord => Number(coord));
  let sorted_arr = stringToNumber.slice().sort();

  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  if(results.length > 0){
    alert("PERDISTE")
    
     window.location.reload();
     results = [];
     return;
  }

  //VERIFICA QUE LA CULEBRA NO SE SALGA DE LA GRID, SI LO HACE VALIO MADRES
  
  for(let coord of nextSnake) {
    if(isNaN(Number(coord)) || coord.length > 2) {
        alert("PERDISTE")
        validSnake = nextSnake
        window.location.reload();
        return;
        
      }

    
  }
  


  return nextSnake;
}

function generateFood(state) {
  let coordsForFood;
  do {
    coordsForFood = Math.floor(Math.random() * 99)
  } while (state.currentSnake.some(coord => coord == coordsForFood));
  return coordsForFood;
}

function showFood(state) {
  let locationOfFood = state.currentFood;

  let keys = state.gridContent.keys();
  for (let key of keys) {
    let div = state.gridContent.get(key);
    if (div.id == locationOfFood) {
      state.gridContent.get(key).setAttribute("class", "food");
    }

  }
  return locationOfFood
}

function updateFood(state, locationOfFood) {
  if (state.currentSnake[state.currentSnake.length - 1] == locationOfFood) {
    let div = state.gridContent.get(Number(state.currentSnake[state.currentSnake.length - 1]));
    div.removeAttribute("class", "food");
    // div.setAttribute("id", locationOfFood)
    locationOfFood = generateFood(state);
    console.log("I touched the food");
    return generateFood(state);
  }
  return state.currentFood;
}

function runGame() {
  var state = new Grid(10, 10, ["00", "01", "02"], "56");
  let newDirection; //variable i use to set the store the new direction when i touch the keyboard

  // addEventListener('keypress', (e) => {
  //   newDirection = e.key

  //   state.currentSnake = updateSnake(state, newDirection, state.currentFood);
  //   state.currentFood = showFood(state);
  //   // if(food == null) state.currentFood = updateFood(state, state.currentFood);
  //   state.currentFood = updateFood(state, state.currentFood);
  // })
  addEventListener('keypress', (e) => {
    newDirection = e.key
  })

  setInterval(() => {
    state.currentSnake = updateSnake(state, newDirection, state.currentFood);
    state.currentFood = showFood(state);
    // if(food == null) state.currentFood = updateFood(state, state.currentFood);
    state.currentFood = updateFood(state, state.currentFood);

  }, 100);
}

runGame()

