import "./main.scss"
const axios = require('axios')

// HTML Elements
const board = document.querySelector('#board')
const scoreBoard = document.querySelector('#scoreBoard')
const startButton = document.querySelector('#start')
const gameOverSign = document.querySelector('#gameOver')

// Game Settings
const boardSize = 10
const gameSpeed = 100
const squareTypes = {
  emptySquare: 0,
  snakeSquare: 1,
  foodSquare: 2
}
const directions = {
  ArrowUp: -10,
  ArrowDown: 10,
  ArrowRight: 1,
  ArrowLeft: -1
}

// Game variables
let snake
let score
let direction
let boardSquares
let emptySquares
let moveInterval

//  Rellena cada cuadrado del tablero
//  @params
//  square: posicion del cuadrado
//  type: tipo de cuadrado (emptySquare, snakeSquare, foodSquare)
const drawSquare = (square, type) => {
  const [row, column] = square.split('')
  boardSquares[row][column] = squareTypes[type]
  const squareElement = document.getElementById(square)
  squareElement.setAttribute('class', `square ${type}`)

  if (type === 'emptySquare') {
    emptySquares.push(square)
  } else {
    if (emptySquares.indexOf(square)) {
      emptySquares.splice(emptySquares.indexOf(square), 1)
    }
  }
}

const drawSnake = () => {
  snake.forEach( square => drawSquare(square, 'snakeSquare'))
}

const createBoard = () => {
  boardSquares.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const squareValue = `${rowIndex}${columnIndex}`
      const squareElement = document.createElement('div')
      squareElement.setAttribute('class', 'square emptySquare')
      squareElement.setAttribute('id', squareValue)
      board.appendChild(squareElement)
      emptySquares.push(squareValue)
    })
  });
}

const setGame = () => {
  snake = ['42', '43', '44', '45']
  score = snake.length
  direction = 'ArrowRight'
  boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare))
  console.log(boardSquares)
  board.innerHTML = ''
  emptySquares = []
  createBoard()
}

const startGame = async () => {
  setGame()
  gameOverSign.style.display = 'none'
  startButton.disabled = true
  drawSnake();
 
  createRandomFood()
  document.addEventListener('keydown', directionEvent)
  let response
  //http://localhost:7001/v1/

  await axios.get('http://localhost:7001/v1/login/ip')
    .then(res => {
      response = res.data
    })

  updateScore(JSON.stringify(response));
}

startButton.addEventListener('click', startGame)

const updateScore = (res) => {
  scoreBoard.innerText = res
}

const createRandomFood = () => {
  const ramdomEmptySquares = emptySquares[(Math.floor(Math.random() * emptySquares.length))]
  drawSquare(ramdomEmptySquares, 'foodSquare')
}

const setDirection = newDirection => {
  direction = newDirection
}

const directionEvent = key => {
  switch(key) {
    case 'ArrowUp':
      direction != 'ArrowDown' && setDirection(key.code)
      break;
    case 'ArrowDown':
      direction != 'ArrowUp' && setDirection(key.code)
      break;
    case 'ArrowRight':
      direction != 'ArrowLeft' && setDirection(key.code)
      break;
    case 'ArrowLeft':
      direction != 'ArrowRight' && setDirection(key.code)
      break;
  }
}