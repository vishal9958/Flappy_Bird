const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set Canvas Size
canvas.width = document.getElementById('game-container').clientWidth;
canvas.height = document.getElementById('game-container').clientHeight;

// Game State
let bird, pipes, score, isGameOver;

// Bird properties
function resetGame() {
    bird = {
        x: 80,
        y: canvas.height / 2,
        radius: 20,
        gravity: 0.5,
        velocity: 0,
        lift: -8
    };
    pipes = [];
    score = 0;
    isGameOver = false;
}

// Load Images
const birdImg = new Image();
birdImg.src = 'bird.png';

const pipeImg = new Image();
pipeImg.src = 'pipe.png';

// Draw Bird
function drawBird() {
    ctx.drawImage(birdImg, bird.x - bird.radius, bird.y - bird.radius, bird.radius * 2, bird.radius * 2);
}

// Draw Pipes
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeImg, pipe.x, 0, 100, pipe.topHeight);
        ctx.drawImage(pipeImg, pipe.x, pipe.topHeight + 200, 100, canvas.height - pipe.topHeight - 200);
    });
}

// Update Pipes
function updatePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
        pipes.push({
            x: canvas.width,
            topHeight: Math.random() * (canvas.height - 300) + 100
        });
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 3;

        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + 100 &&
            (bird.y - bird.radius < pipe.topHeight ||
                bird.y + bird.radius > pipe.topHeight + 200)
        ) {
            endGame();
        }

        if (pipe.x + 100 < 0) {
            pipes.splice(index, 1);
            score++;
        }
    });
}

// Update Bird
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        endGame();
    }
}

// Draw Score
function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`Score: ${score}`, 20, 40);
}

// End Game
function endGame() {
    isGameOver = true;
    document.getElementById('final-score').innerText = `Your Score: ${score}`;
    document.getElementById('game-over-screen').style.display = 'flex';
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    updateBird();
    updatePipes();
    drawScore();

    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    }
}

// Start Button Listener
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    canvas.style.display = 'block';
    resetGame();
    gameLoop();
});

// Restart Button Listener
document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('game-over-screen').style.display = 'none';
    resetGame();
    gameLoop();
});

// Bird Movement on Key Press
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        if (!isGameOver) {
            bird.velocity = bird.lift;
        }
    }
});
