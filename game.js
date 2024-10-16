const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scale = 30;
const rows = canvas.height / scale;
const columns = canvas.width / scale;
let snake, fruit, enemy, score, colors, colorIndex, startTime;

(function setup() {
    snake = new Snake();
    fruit = new Fruit();
    enemy = new Enemy();
    fruit.pickLocation();
    score = 0;
    colors = ["#4CAF50", "#FF5733", "#33FF57", "#3357FF", "#FF33A2"];
    colorIndex = 0;
    startTime = Date.now();

    window.setInterval(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        fruit.draw();
        snake.update();
        snake.draw();
        if (score >= 15) {
            enemy.draw();
            if (checkCollision(snake, enemy)) {
                showGameOver();
                return;
            }
        }
        document.getElementById('score').innerText = score;
        updateTime();
    }, 250);
}());

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.update = function() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }

        this.tail[this.total - 1] = { x: this.x, y: this.y };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= canvas.width) this.x = 0;
        if (this.y >= canvas.height) this.y = 0;
        if (this.x < 0) this.x = canvas.width - scale;
        if (this.y < 0) this.y = canvas.height - scale;

        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            score++;
            if (score % 5 === 0) {
                this.changeColor();
            }
            fruit.pickLocation();
        }
    };

    this.draw = function() {
        context.fillStyle = colors[colorIndex];

        for (let i = 0; i < this.tail.length; i++) {
            context.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }

        context.fillRect(this.x, this.y, scale, scale);
    };

    this.changeColor = function() {
        colorIndex = (colorIndex + 1) % colors.length;
    };

    this.changeDirection = function(direction) {
        switch(direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale;
                    this.ySpeed = 0;
                }
                break;
        }
    };
}

function Fruit() {
    this.x;
    this.y;

    this.pickLocation = function() {
        this.x = Math.floor(Math.random() * rows) * scale;
        this.y = Math.floor(Math.random() * columns) * scale;
    };

    this.draw = function() {
        context.fillStyle = "#FF0000";
        context.fillRect(this.x, this.y, scale, scale);
    };
}

function Enemy() {
    this.x = Math.floor(Math.random() * rows) * scale;
    this.y = Math.floor(Math.random() * columns) * scale;
    this.total = 5;
    this.tail = [];
    for (let i = 0; i < this.total; i++) {
        this.tail.push({ x: this.x - i * scale, y: this.y });
    }

    this.draw = function() {
        context.fillStyle = "#FF00FF";

        for (let i = 0; i < this.tail.length; i++) {
            context.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
    };
}

function checkCollision(snake, enemy) {
    for (let i = 0; i < enemy.tail.length; i++) {
        if (snake.x === enemy.tail[i].x && snake.y === enemy.tail[i].y) {
            return true;
        }
    }
    return false;
}

function showGameOver() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#FF0000";
    context.font = "40px Arial";
    context.textAlign = "center";
    context.fillText("Game Over", canvas.width / 2, canvas.height / 2);
}

function updateTime() {
    const now = Date.now();
    const elapsedTime = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    document.getElementById('time').innerText = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

window.addEventListener('keydown', (evt) => {
    const direction = evt.key.replace('Arrow', '');
    snake.changeDirection(direction);
});
