const gridTost = document.querySelector('.grid')
const score = document.querySelector('.score')
const startBtn = document.getElementById('startBtn')
const pauseBtn = document.getElementById('pauseBtn')
const resetBtn = document.getElementById('resetBtn')

const blockWidth = 100
const blockHight = 20
const borderWidth = 560
const borderHeight =300
const ballDiameter = 20
let scoreDisplay = 0
let timerId = null
let isPaused = false
let gameStarted = false
let xDirection = 2
let yDirection = 2

const userStart = [(borderWidth - blockWidth) / 2, 10]
let currentPosition = userStart

const ballStart = [borderWidth / 2 - ballDiameter / 2, 30]
let ballStartPosition = ballStart

class Block {
    constructor(xAxsis, yAxsis) {
        this.bottomLeft = [xAxsis, yAxsis]
        this.bottomRight = [xAxsis + blockWidth, yAxsis]
        this.topLeft = [xAxsis, yAxsis + blockHight]
        this.topRight = [xAxsis + blockWidth, yAxsis + blockHight]
    }
}

const blocks =  [
    new Block (10,270),
    new Block (120,270), 
    new Block (230,270), 
    new Block (340,270), 
    new Block (450,270), 
    new Block (10,240),
    new Block (120,240), 
    new Block (230,240), 
    new Block (340,240), 
    new Block (450,240), 
    new Block (10,210),
    new Block (120,210), 
    new Block (230,210), 
    new Block (340,210), 
    new Block (450,210), 
    // new Block (560,270), 
    // new Block (670,270), 
    // new Block (670,270), 
    // new Block (670,270), 
    // new Block (670,270), 
    // new Block (670,270), 
    // new Block (670,270), 
    // new Block (670,270), 
    // new Block (670,270), 
    // new Block (670,270), 
    
]
console.log(blocks[0]) 
function theBlocks() {
for (let i = 0; i < blocks.length; i++) {
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left = blocks[i].bottomLeft[0] + 'px'
    block.style.bottom =blocks[i].bottomLeft[1] + 'px'
    gridTost.appendChild(block)  
}

console.log(blocks)
}
theBlocks() 

const userHandle = document.createElement('div')
userHandle.classList.add('user')
drawUser() 
gridTost.appendChild(userHandle)

function drawUser() {
userHandle.style.left = currentPosition[0] + 'px'
userHandle.style.bottom = currentPosition[1] + 'px'
}
function drawBall() {
ball.style.left=ballStartPosition[0] + 'px'
ball.style.bottom=ballStartPosition[1] + 'px'
}

function moveUser(e) {
    switch (e.key) {
        case "ArrowLeft":
            if (currentPosition[0] > 0) {
                currentPosition[0] -= 10
                drawUser() 
            }
            
            break;

        case "ArrowRight":
            if (currentPosition[0] < borderWidth - 100) {
                currentPosition[0] += 10
                drawUser() 
            }
            

        break;
            
        default:
            break;
    }
}
document.addEventListener('keydown' , moveUser) 

const ball = document.createElement('div') 
ball.classList.add('ball') 
drawBall() 
gridTost.appendChild(ball) 

function moveBall() {
    ballStartPosition[0] += xDirection
    ballStartPosition[1] += yDirection
    drawBall() 
    checkForCollision() 
}

function startGame() {
    if (!gameStarted) {
        
        gameStarted = true
        startBtn.disabled = true
        pauseBtn.disabled = false
        timerId = setInterval(moveBall, 30)
    }
}

function pauseGame() {
    if (gameStarted) {
        if (!isPaused) {
            clearInterval(timerId)
            isPaused = true
            pauseBtn.textContent = 'Resume'
        } else {
            timerId = setInterval(moveBall, 30)
            isPaused = false
            pauseBtn.textContent = 'Pause'
        }
    }
}

function resetGame() {
    // Clear game interval
    clearInterval(timerId)
    
    // Reset game state
    gameStarted = false
    isPaused = false
    scoreDisplay = 0
    score.textContent = `Score: ${scoreDisplay}`
    
    // Reset button states
    startBtn.disabled = false
    pauseBtn.disabled = true
    pauseBtn.textContent = 'Pause'
    startBtn.textContent = 'Start Game'
    
    // Reset ball position and direction (center)
    ballStartPosition = [borderWidth / 2 - ballDiameter / 2, 30]
    xDirection = 2
    yDirection = 2
    drawBall()
    
    // Reset user position to center
    currentPosition = [(borderWidth - blockWidth) / 2, 10]
    drawUser()
    
    // Clear and recreate the grid
    gridTost.innerHTML = ''
    
    // Recreate blocks array with centered positions
    blocks.length = 0
    const blockSpacing = 110 // Space between blocks
    const startX = (borderWidth - (5 * blockSpacing - 10)) / 2 // Center the blocks horizontally
    
    // Create three rows of blocks
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
            const x = startX + (col * blockSpacing)
            const y = 270 - (row * 30) // 30 is the vertical spacing between rows
            blocks.push(new Block(x, y))
        }
    }
    
    // Redraw all game elements
    theBlocks()
    gridTost.appendChild(userHandle)
    gridTost.appendChild(ball)
    
    // Re-enable keyboard controls
    document.addEventListener('keydown', moveUser)
}

function checkForCollision() {
    for (let i = 0; i < blocks.length; i++) {
        if ( (ballStartPosition[0] > blocks[i].bottomLeft[0] && ballStartPosition[0] < blocks[i].bottomRight[0] ) &&
             (ballStartPosition[1] + ballDiameter)> blocks[i].bottomLeft[1] && ballStartPosition[1] < blocks[i].topLeft[1] ) 
            {
               const allBlocks = Array.from(document.querySelectorAll('.block') ) 
            allBlocks[i].classList.remove('block')
            blocks.splice(i, 1 )
            changeDirection()
            scoreDisplay++
            score.textContent = `Score: ${scoreDisplay}`
           }
    }
  
    if (ballStartPosition[0] >= (borderWidth - ballDiameter) ||
        ballStartPosition[1] >= (borderHeight - ballDiameter) ||
        ballStartPosition[0] <=  0
        ) {
        changeDirection()
    }  

    if (
        (ballStartPosition[0]>currentPosition[0] && ballStartPosition[0] < currentPosition[0] + blockWidth) &&
        (ballStartPosition[1]>currentPosition[1] && ballStartPosition[1] < currentPosition[1] + blockHight)
    ) {
       changeDirection()
    }

    if (ballStartPosition[1] <= 0) {
        clearInterval(timerId)
        score.textContent = `Game Over! Final Score: ${scoreDisplay}`
        document.removeEventListener('keydown', moveUser)
        
        startBtn.disabled = false
        pauseBtn.disabled = true
        startBtn.textContent = 'Play Again'
    }
}

function changeDirection() {
    if (xDirection === 2 && yDirection === 2) {
        yDirection = -2
        return
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection = -2
        return
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2
        return
    }
    if (xDirection === -2 && yDirection === 2) {
        xDirection = 2
        return
    }
}

// Initialize game
startBtn.addEventListener('click', function() {
    if (startBtn.textContent === 'Play Again') {
        resetGame()
    } else {
        startGame()
    }
})
pauseBtn.addEventListener('click', pauseGame)
resetBtn.addEventListener('click', resetGame)
