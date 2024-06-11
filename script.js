document.addEventListener("DOMContentLoaded", () => {
    const selectionScreen = document.querySelector('.selection-screen');
    const gameContainer = document.querySelector('.game-container');
    const grid = document.querySelector('.grid');
    const message = document.getElementById('message');
    const resetButton = document.querySelector('.reset-button');
    const dinoOptions = document.querySelectorAll('.dino-option');

    let size = 10;
    let dinoPosition = { x: 0, y: 0 };
    let treasurePosition = {};
    let obstacles = [];
    let selectedDino = '1.gif';

    function generateRandomMap() {
        size = Math.floor(Math.random() * 4) + 7;
        dinoPosition = { x: 0, y: 0 };
        treasurePosition = {
            x: Math.floor(Math.random() * size),
            y: Math.floor(Math.random() * size)
        };
        obstacles = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (Math.random() < 0.2 && !(i === 0 && j === 0) && !(i === treasurePosition.x && j === treasurePosition.y)) {
                    obstacles.push({
                        x: j,
                        y: i,
                        type: Math.random() < 0.5 ? 'water' : 'rock'
                    });
                }
            }
        }
        createGrid();
        giveHint();
    }

    function createGrid() {
        grid.innerHTML = '';
        grid.style.gridTemplateColumns = `repeat(${size}, 50px)`;
        grid.style.gridTemplateRows = `repeat(${size}, 50px)`;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.x = j;
                cell.dataset.y = i;
                if (isObstacle(j, i)) {
                    cell.classList.add(obstacleClass(j, i));
                } else {
                    cell.classList.add('grass');
                }
                grid.appendChild(cell);
            }
        }
        updateGrid();
    }

    function updateGrid() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('dino');
            cell.style.backgroundImage = '';
            if (parseInt(cell.dataset.x) === dinoPosition.x && parseInt(cell.dataset.y) === dinoPosition.y) {
                cell.classList.add('dino');
                cell.style.backgroundImage = `url('${selectedDino}')`;
            }
        });
    }

    function isObstacle(x, y) {
        return obstacles.some(obstacle => obstacle.x === x && obstacle.y === y);
    }

    function obstacleClass(x, y) {
        const obstacle = obstacles.find(obstacle => obstacle.x === x && obstacle.y === y);
        return obstacle ? obstacle.type : '';
    }

    function moveDino(x, y) {
        if (x < 0 || x >= size || y < 0 || y >= size || isObstacle(x, y)) return;
        dinoPosition.x = x;
        dinoPosition.y = y;
        updateGrid();
        checkTreasure();
        giveHint();
    }

    function checkTreasure() {
        if (dinoPosition.x === treasurePosition.x && dinoPosition.y === treasurePosition.y) {
            message.textContent = '¡Encontraste el tesoro!';
            grid.style.pointerEvents = 'none';
            document.removeEventListener('keydown', handleKeydown);
            resetButton.style.display = 'block';
        }
    }

    function giveHint() {
        const dx = treasurePosition.x - dinoPosition.x;
        const dy = treasurePosition.y - dinoPosition.y;
        let hint = 'El tesoro está ';
        if (dy < 0) hint += 'arriba ';
        if (dy > 0) hint += 'abajo ';
        if (dx < 0) hint += 'a la izquierda';
        if (dx > 0) hint += 'a la derecha';
        message.textContent = hint.trim();
    }

    function handleKeydown(event) {
        switch (event.key) {
            case 'ArrowUp':
                moveDino(dinoPosition.x, dinoPosition.y - 1);
                break;
            case 'ArrowDown':
                moveDino(dinoPosition.x, dinoPosition.y + 1);
                break;
            case 'ArrowLeft':
                moveDino(dinoPosition.x - 1, dinoPosition.y);
                break;
            case 'ArrowRight':
                moveDino(dinoPosition.x + 1, dinoPosition.y);
                break;
        }
    }

    function resetGame() {
        grid.style.pointerEvents = 'auto';
        document.addEventListener('keydown', handleKeydown);
        resetButton.style.display = 'none';
        generateRandomMap();
    }

    dinoOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedDino = `${option.dataset.dino}.gif`;
            selectionScreen.style.display = 'none';
            gameContainer.style.display = 'block';
            resetGame();
        });
    });

    resetButton.addEventListener('click', resetGame);

    generateRandomMap();
});
