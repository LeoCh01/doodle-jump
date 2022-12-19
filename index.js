const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = innerHeight - 30;

// -------------------------------------------------

class Player {
    constructor(r, col, speed) {
        this.img = null;
        this.x = canvas.width / 2;
        this.y = canvas.height - 150;
        this.dir = 0;
        this.r = r;
        this.vel = 0;
        this.speed = speed;
        this.pts = 0;
        this.col = col;
    }

    update() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.col;
        ctx.fill();

        this.vel += 1;
        this.y += this.vel;
        this.x += this.dir * this.speed;
    }
}

class Tile {
    constructor(x, y, b) {
        this.x = x;
        this.y = y;
        this.size = 100;
        this.bounce = -b;
        this.col = b == 25 ? "#000" : "#0fa";
    }

    update() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.closePath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = this.col;
        ctx.stroke();
    }
}

// ------------------------------------------------

let p1 = new Player(30, "#f00", 12);
let death = true;
let lastTile;
let tiles;
let scoreElement = document.querySelector("h1");
let score = 0;

function init() {
    death = false;
    score = 0;
    p1.vel = 0;
    p1.x = canvas.width / 2;
    p1.y = canvas.height - 150;
    lastTile = new Tile(200, canvas.height - 50, 25);
    tiles = [lastTile];
    animate();
}

function tileSpawn() {
    x = Math.max(0, Math.floor(Math.random() * canvas.width - 100));
    y = lastTile.y - Math.max(70, Math.floor(Math.random() * 200));
    jump = Math.random() > 0.1 ? 25 : 50;
    lastTile = new Tile(x, y, jump);
    tiles.push(lastTile);
}

function animate() {
    animationID = requestAnimationFrame(animate);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    scoreElement.innerHTML = score;

    tiles.forEach((t) => {
        t.update();

        if (
            p1.vel >= 0 &&
            p1.y + p1.r <= t.y &&
            p1.y + p1.r + p1.vel >= t.y &&
            t.x <= p1.x + 20 &&
            p1.x - 20 <= t.x + t.size
        ) {
            p1.y = t.y - p1.r;
            p1.vel = t.bounce;
        }
    });

    p1.update();

    // on death
    if (p1.y - p1.r > canvas.height) {
        cancelAnimationFrame(animationID);
        death = true;
    }

    // camera move
    if (p1.y < innerHeight / 2) {
        p1.y -= p1.vel;
        tiles.forEach((t) => {
            t.y -= p1.vel;
        });
        score -= Math.floor(p1.vel / 100);
    }

    // tile spawn
    if (tiles.length < 20) {
        tileSpawn();
    }

    // tile delete
    if (tiles[0].y > canvas.height) {
        tiles.shift();
    }
}

addEventListener("keydown", (e) => {
    if (e.key == "r" && death) {
        init();
    }
    if (e.key == "a") {
        p1.dir = -1;
        if (p1.x < 0) {
            p1.x = canvas.width;
        }
    }
    if (e.key == "d") {
        p1.dir = 1;
        if (p1.x > canvas.width) {
            p1.x = 0;
        }
    }
});

addEventListener("keyup", (e) => {
    if (e.key == "a" && p1.dir == -1) {
        p1.dir = 0;
    }
    if (e.key == "d" && p1.dir == 1) {
        p1.dir = 0;
    }
});
