// NOTA IMPORTANTE, este vato empieza a programar desde abajo para arriba, desde startButton y va haciendo una función a la vez que va, según yo, encapsulando las demás funciones.

// HTML Elements
const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");

// Game Stettings
const boardSize = 10;
const gameSpeed = 110;

// Objetos
const squareTypes = {
  emptySquare: 0,
  snakeSquare: 1,
  foodSquare: 2,
};

const directions = {
  ArrowUp: -10,
  ArrowDown: 10,
  ArrowRight: 1,
  ArrowLeft: -1,
};

// Game Variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;

// Una vez que se  puede dibiujar un cuadrado con la función de DrawAquare, pasamos a crear la Función DrawSnake.
const drawSnake = () => {
  snake.forEach((square) => drawSquare(square, "snakeSquare"));
};
// Función para dibujar 1 solo cuadrado.
// Rellena cada cuadro del tablero.
// @params
// square: posición del cuadrado
// type: tipo de cuadrado (emptySquare, snakeSquare, foodSquare)
const drawSquare = (square, type) => {
  const [row, column] = square.split("");
  boardSquares[row][column] = squareTypes[type];
  const squareElement = document.getElementById(square);
  squareElement.setAttribute("class", `square ${type}`);

  if (type === "emptySquare") {
    emptySquares.push(square);
  } else {
    if (emptySquares.indexOf(square) !== -1) {
      emptySquares.splice(emptySquares.indexOf(square), 1);
    }
  }
};

// Función MoveSnake.
const moveSnake = () => {
  const newSquare = String(
    Number(snake[snake.length - 1]) + directions[direction]
  ).padStart(2, "0");
  const [row, column] = newSquare.split("");
  // Se pregunta si el juego se ha terminado, que esto ocurre si la serpiente choca con alguna de las paredes o cuando choca contra sí misma.
  if (
    newSquare < 0 ||
    newSquare > boardSize * boardSize ||
    (direction === "ArrowRight" && column == 0) ||
    (direction === "ArrowLeft" && column == 9) ||
    boardSquares[row][column] === squareTypes.snakeSquare
  ) {
    gameOver();
  } else {
    snake.push(newSquare);
    if (boardSquares[row][column] === squareTypes.foodSquare) {
      // Función para agregar un cuadro más a la serpiente.
      addFood();
    } else {
      // Con este Else se toma el primer elemento, se saca y con la función DrawSquare se termina dibujando un cuadro vacío.
      const emptySquare = snake.shift();
      drawSquare(emptySquare, "emptySquare");
    }
    // Con DrawSnake, se vuelve a pintar la serpiente para que se mueva un lugar a la derecha,
    drawSnake();
  }
};

// Función AddFood que hará crecer la serpiente.
const addFood = () => {
  score++;
  updateScore();
  createRandomFood();
};

// Función GameOver
const gameOver = () => {
  gameOverSign.style.display = "block";
  clearInterval(moveInterval);
  startButton.disabled = false;
};

// Esta fiunción es mandada a llamar por la función de abajo.
const setDirection = (newDirection) => {
  direction = newDirection;
};

// Función que se manda a llamar para poder usar las teclas.
const directionEvent = (key) => {
  switch (key.code) {
    // Los siguientes casos son para denotar que la serpiente no podrá ir en sentido contrario según la dirección que tome.
    case "ArrowUp":
      direction != "ArrowDown" && setDirection(key.code);
      break;
    case "ArrowDown":
      direction != "ArrowUp" && setDirection(key.code);
      break;
    case "ArrowLeft":
      direction != "ArrowRight" && setDirection(key.code);
      break;
    case "ArrowRight":
      direction != "ArrowLeft" && setDirection(key.code);
      break;
  }
};

// Función para crear alimento CreateRandomFood.
const createRandomFood = () => {
  const randomEmptySquare =
    emptySquares[Math.floor(Math.random() * emptySquares.length)];
  drawSquare(randomEmptySquare, "foodSquare");
};

// Función par actualizar el Score.
const updateScore = () => {
  scoreBoard.innerText = score;
};

// Función para crear el tablero de juego.
const createBoard = () => {
  boardSquares.forEach((row, rowIndex) => {
    row.forEach((column, columnndex) => {
      const squareValue = `${rowIndex}${columnndex}`;
      const squareElement = document.createElement("div");
      squareElement.setAttribute("class", "square emptySquare");
      squareElement.setAttribute("id", squareValue);
      board.appendChild(squareElement);
      emptySquares.push(squareValue);
    });
  });
};

// Función para darle valor a todas las variables del juego.
const setGame = () => {
  snake = ["00", "01", "02", "03"];
  score = 0;
  // Si usamos esta línea de Socore, el marcador empezará marcando 4 porque es el número predeterminado de cuadros que se le da a la serpiente, por lo tanto empezaría a contar a partir del 4.
  // score = snake.length;
  direction = "ArrowRight";
  boardSquares = Array.from(Array(boardSize), () =>
    new Array(boardSize).fill(squareTypes.emptySquare)
  );
  console.log(boardSquares);
  board.innerHTML = "";
  emptySquares = [];
  createBoard();
};

// Función para iniciar el juego.
const startGame = () => {
  setGame();
  gameOverSign.style.display = "none";
  startButton.disabled = true;
  // Función para dibujar un Cuadro.
  drawSnake();
  // Función para actualizar el Score, apenas inicia el juego.
  updateScore();
  // Función para crear alimento de manera aleatoria en el tablero.
  createRandomFood();
  // Para poder mover a la serpiente con el teclado.
  document.addEventListener("keydown", directionEvent);
  // Para que se mueva la serpiente a la velocidad que se declaró en las variables, que es de 100ms, ejecutando la función MoveSnake.
  moveInterval = setInterval(() => moveSnake(), gameSpeed);
};

// MAnda a llamar a la función StartGame.
startButton.addEventListener("click", startGame);
