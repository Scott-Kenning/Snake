const SNAKE_SPEED = 4;
const EXPANSION_RATE = 2;
let lastRenderTime = 0;
let lastInputDirection;
let newSegments = 0;
let gameOver = false;
const gameBoard = document.getElementById("game-board");

function main(currentTime) {
    if(gameOver) {
        if (confirm('You lost. Press ok to restart')) {
            window.location = window.location.href
        }
        return
    }

    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000;
    window.requestAnimationFrame(main);
    if(secondsSinceLastRender < .5/SNAKE_SPEED) return;
    lastRenderTime = currentTime;
    console.log(currentTime);

    update();
    draw();
}

window.requestAnimationFrame(main);

function update() {
    updateSnake();
    updateFood();
    checkDeath();
}

function draw() {
    gameBoard.innerHTML="";
    drawSnake(gameBoard);
    drawFood(gameBoard);
}

function checkDeath() {
    gameOver = outsideGrid(snakeBody[0]) || snakeItersection()
}

//----------------------------------Snake--------------------------------------------------------------------------------------------------------------------------------------

const snakeBody = [{x:11, y:11}];

function updateSnake() {
    addSegments();
    const inputDirection = getInputDirection();
    for(let i=snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i+1] = {...snakeBody[i] }
    }

    snakeBody[0].x += inputDirection.x;
    snakeBody[0].y += inputDirection.y;
}

function drawSnake(gameBoard) {
    snakeBody.forEach(segment => {
        const snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.classList.add('snake');
        gameBoard.appendChild(snakeElement)
    })

}

function expandSnake(amount) {
    newSegments += amount;
}

function onSnake(position, {ignoreHead = false} = {}) {
    return snakeBody.some((segment, index) => {
        if(ignoreHead && index === 0) return false;
        return equalPositions(segment, position);
    })
}
function equalPositions(p1,p2) {
    return p1.x === p2.x && p1.y === p2.y
}

function addSegments() {
    for(let i=0;i<newSegments;i++) {
        snakeBody.push ({...snakeBody[snakeBody.length -1]})
    }

    newSegments = 0;
}

function snakeItersection() {
    return onSnake(snakeBody[0],{ignoreHead: true})
}

//----------------------------------Input-----------------------------------------------------------------------------------------------------------------------------------------

let inputDirection = {x:0,y:0}

function getInputDirection() {
    lastInputDirection = inputDirection;
    return inputDirection
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (lastInputDirection.y !== 0) break
            inputDirection = {x:0,y:-1}
            break
        case 'ArrowDown':
            if (lastInputDirection.y !== 0) break
            inputDirection = {x:0,y:1}
             break
        
        case 'ArrowRight':
            if (lastInputDirection.x !== 0) break
            inputDirection = {x:1,y:0}
            break
        case 'ArrowLeft':
            if (lastInputDirection.x !== 0) break
            inputDirection = {x:-1,y:0}
            break
    }
})

//-----------------------------------------Food----------------------------------------------------------------------------------------------------------------------------------

let food = {x:10, y:1}

function updateFood() {
    if(onSnake(food)) {
        expandSnake(EXPANSION_RATE)
        food = getRandomFoodPosition();
    }
}

function drawFood(gameBoard) {
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement)
}

function getRandomFoodPosition() {
    let newPosition
    while(newPosition == null || onSnake(newPosition)) {
        newPosition = getRandomPosition()
    }
    return newPosition;
}

function getRandomPosition() {
    return {
        x: Math.floor(Math.random()*21) + 1,
        y: Math.floor(Math.random()*21) + 1
    }
}

function outsideGrid(position) {
    return position.x < 1 ||  position.y < 1 ||  position.x > 21 || position.y > 21;
}

