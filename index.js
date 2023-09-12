const canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 800;
let ctx = canvas.getContext("2d");
const canvasMiddle = { x: canvas.width / 2, y: canvas.height / 2};
const red = "#FF0000";
const yellow = "#964B00"
const green = "#008000";
const backgroundColor = "black";


function clear() {
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = backgroundColor;
    ctx.fillRect(0, 0, 900, 900);
    ctx.strokeRect(0, 0, 900, 900);
}


function getRandomInt(min, max) {
    // Generate a random integer between min (inclusive) and max (inclusive)
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function convertToRadians(angle) {
    return angle * (Math.PI / 180);
};

function moveObject(object) {
    object.position.x += object.velocity.x;
    object.position.y += object.velocity.y;
}
function rotateObject(object) {
    object.rotatedAngle += object.rotationSpeed;
}
function drawObject(object) {
    ctx.save();
    ctx.translate(object.position.x, object.position.y);
    ctx.rotate(object.rotatedAngle);
    ctx.fillStyle = object.color;
    ctx.fillRect(0 - object.size.w/2, 0 - object.size.h/2, object.size.w, object.size.h);
    ctx.restore();
}
function Moon(position, color, velocity, size, hostPlanet) {
    this.type = "Moon"
    this.size = size;
    this.position = position;
    this.color = color;
    this.rotatedAngle = 0;
    this.rotationSpeed = 0.090;
    this.velocity = velocity;
    this.hostPlanet = hostPlanet;
    this.maxSpeed = 14;
}
Moon.prototype.limitVelocity = function() {
    const magnitudeSquared = this.velocity.x ** 2 + this.velocity.y ** 2;
    const maxSpeedSquared = this.maxSpeed ** 2;

    if (magnitudeSquared > maxSpeedSquared) {
        const direction = Math.atan2(this.velocity.y, this.velocity.x);
        this.velocity.x = Math.cos(direction) * this.maxSpeed;
        this.velocity.y = Math.sin(direction) * this.maxSpeed;
    }
}
Moon.prototype.update = function() {
    // Update the moon's rotation
    rotateObject(this);
    // Move the moon
    moveObject(this);
    this.limitVelocity()
    drawObject(this);
}

function Star() {
    this.type = "Star"
    this.size = {w: 50, h: 50};
    this.position = {x: canvas.width/2, y: canvas.height/2};
    this.color = "orange";
    this.rotatedAngle = 0;
    this.rotationSpeed = 0.010;
    this.gravityForce = 2
}
Star.prototype.attract = function(object) {
    const directionToStar = {x: this.position.x - object.position.x, y: this.position.y - object.position.y};
    const magnitude = Math.sqrt(directionToStar.x ** 2 + directionToStar.y ** 2);
    const directionUnitVec = {x: directionToStar.x / magnitude, y: directionToStar.y / magnitude};

    object.velocity.x += directionUnitVec.x / 15;
    object.velocity.y += directionUnitVec.y / 15;
}
Star.prototype.update = function() {
    drawObject(this);
    rotateObject(this);
    for (item of game.gameObjects) {
        if (item != this) {
            this.attract(item);
        } 
       }
}

function Planet(position, color, velocity, size) {
    this.type = "Planet"
    this.size = size;
    this.position = position;
    this.color = color;
    this.rotatedAngle = 0;
    this.rotationSpeed = 0.070;
    this.velocity = velocity;
    this.moons = []
}
Planet.prototype.attract = function(object) {
    const directionToStar = {x: this.position.x - object.position.x, y: this.position.y - object.position.y};
    const magnitude = Math.sqrt(directionToStar.x ** 2 + directionToStar.y ** 2);
    const directionUnitVec = {x: directionToStar.x / magnitude, y: directionToStar.y / magnitude};
    const attractionDivisor = object.type == "Moon" ? 3 : 70;

    object.velocity.x += directionUnitVec.x / attractionDivisor;
    object.velocity.y += directionUnitVec.y / attractionDivisor;
}

Planet.prototype.update = function() {
   drawObject(this);
   this.moons.length > 0 ? this.attract(this.moons[0]) : "";
   this.moons.length > 0 ? this.moons[0].update() : "";
   rotateObject(this);
   moveObject(this);
   for (item of game.gameObjects) {
    if (item != this && item.type != "Star") {
        this.attract(item);
    } 
   }
}

let game = {
    gameObjects: [new Star()],
    initializePlanets() {
        const planets = [
            new Planet({x: 680, y: 680}, "blue", {x: 0, y: 2}, {w: 10, h: 10}), 
            new Planet({x: 300, y: 700}, "lightgreen", {x: 5, y: 0}, {w: 15, h: 15}),
            new Planet({x: 200, y: 300}, "brown", {x: -5, y: 0}, {w: 20, h: 20}),
            new Planet({x: 250, y: 568}, "yellow", {x: 3, y: 4}, {w: 9, h: 9}),
        ];
        planets[1].moons.push(new Moon({x: planets[1].position.x, y: planets[1].position.y + 2},
            "white",{x: 1.4, y: 1.4}, {w: 4, h: 4}, planets[1]));
        planets.forEach((planet)=>{this.gameObjects.push(planet)});
        
    },
    updateGameObjects() {
        this.gameObjects.forEach((object, index)=>{
            object.update();
        })
    }
}

game.initializePlanets();
function gameLoop() {
    requestAnimationFrame(gameLoop);
    clear();
    game.updateGameObjects();


}

gameLoop();





