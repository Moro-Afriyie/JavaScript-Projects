const div = `<div></div>`;
const takenDiv = `<div class="taken"></div>`;
const mingridDiv = `<div class="mini-grid"></div>`;
const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('#score');
let scores = 0;
const startBtn = document.querySelector('#start-button');
const width = 10;
let nextRandom = 0;
let timerId = null;
const colors = ['orange', 'red', 'purple', 'green', 'blue']

// create a 20 x 10 grid with 20 rows and 10 colums = 200
for (let i = 0; i < 200; i++) {
    grid.insertAdjacentHTML('afterbegin', div);
}
for (let i = 0; i < 16; i++) {
    document.querySelector('.mini-grid').insertAdjacentHTML('afterbegin', div);
}
for (let i = 0; i < 10; i++) {
    grid.insertAdjacentHTML('beforeend', takenDiv);
}

let squares = Array.from(document.querySelectorAll('.grid div'));
for (let i = 0; i < 200; i++) {
    squares[i].textContent = i;
}



// The Tetriminoes
const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
]

const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
]

const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
]

const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
]

const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
]

const theTetriminoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

// start of the tetrimino display
let currentPosition = 4;
let currentRotation = 0;

// select teriminoes randomly and its first rotation
let random = Math.floor(Math.random() * theTetriminoes.length);
let current = theTetriminoes[random][currentRotation];

//draw the tetrimino
draw = () => {
    current.forEach(index => {
        // add the tetrimino class to each element in the div
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[random];
    });

};
//draw();

undraw = () => {
    current.forEach(index => {
        // remove the tetrimino
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor = ''
    });
};


// listens to the event when a key is pressed
document.addEventListener('keyup', e => {

    // assign function to keycodes

    // left arrow key
    if (e.keyCode === 37) {
        moveLeft();
    } else if (e.keyCode === 38) {
        rotate();
    } else if (e.keyCode === 39) {
        moveRight();
    } else if (e.keyCode === 40) {
        moveDown();
    }

});

function moveDown() {
    // 1. undraw the shape at the current position
    undraw();
    // 2. Add the width to the current position
    currentPosition += width;
    // 3. redraw the new or updated shape
    draw();
    freeze();
}



function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));

        // start a new tetrimino falling
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetriminoes.length);
        current = theTetriminoes[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        addScores();
        gameOver();
    }
}

// move tetrimino to the left, unless is at the edge or there is a blockage
function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    // allows shape to move left if it's not at the left position
    if (!isAtLeftEdge) currentPosition -= 1;

    // push it unto a tetrimino that is already on the left edge
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;

    }
    draw();
}


// move tetrimino to the left, unless is at the edge or there is a blockage
function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    // allows shape to move right if it's not at the right position
    if (!isAtRightEdge) currentPosition += 1;

    // push it unto a tetrimino that is already on the right edge
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;

    }
    draw();
}


///FIX ROTATION OF TETROMINOS A THE EDGE 
function isAtRight() {
    return current.some(index => (currentPosition + index + 1) % width === 0)
}

function isAtLeft() {
    return current.some(index => (currentPosition + index) % width === 0)
}

function checkRotatedPosition(P) {
    P = P || currentPosition //get current position.  Then, check if the piece is near the left side.
    if ((P + 1) % width < 4) { //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
        if (isAtRight()) { //use actual position to check if it's flipped over to right side
            currentPosition += 1 //if so, add one to wrap it back around
            checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    } else if (P % width > 5) {
        if (isAtLeft()) {
            currentPosition -= 1
            checkRotatedPosition(P)
        }
    }
}

// rotate the tetrimino
function rotate() {
    undraw();
    // move down to the next item in our array
    currentRotation++;
    if (currentRotation === current.length) {
        currentRotation = 0;
    }
    current = theTetriminoes[random][currentRotation]
    checkRotatedPosition()
    draw();
}


// show up-nex tetromino in mini-grid display
const displaySqaures = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;



//the Tetrominos without rotations
const UpNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
]

// display the shape in the mini-grid display

function displayShape() {
    // remove any trace of tetrimino from the entire grid
    displaySqaures.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = '';
    });

    UpNextTetrominoes[nextRandom].forEach(index => {
        displaySqaures[displayIndex + index].classList.add('tetromino');
        displaySqaures[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
}


// add functionality to the button
startBtn.addEventListener('click', () => {
    // pause the game if the timer ID is not null
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    } else {
        // draw the tetrimino
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random() * theTetriminoes.length);
        displayShape();
    }
});


// add scores
function addScores() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

        // check if all the rows contains a class of taken
        if (row.every(index => squares[index].classList.contains('taken'))) {
            // add 10 to the scores
            scores += 10;
            scoreDisplay.textContent = scores;
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            });
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => {
                grid.appendChild(cell);
            })
        };
    };
}

// Game over

function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'Game Over';
        clearInterval(timerId);
    }
}