const canvas = document.querySelector('canvas');
let ctx = canvas.getContext("2d");
canvas.width = 1500;
canvas.height = 900;
const canvasMiddle = { x: canvas.width / 2, y: canvas.height / 2};
const red = "#FF0000";
const yellow = "#964B00"
const green = "#008000";
const backgroundColor = "black";
const seePathButton = document.querySelector('button');

seePathButton.onclick = ()=>{
    objects.forEach((planet)=>{
        console.log(planet.steps);
        if (planet.steps == 0) {
            planet.steps = 2000;
        }
        else {
            planet.steps = 0;
        }
        
    })
}


function clear() {
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawCircle(obj) {
    ctx.beginPath();
    ctx.arc(obj.position.x, obj.position.y, obj.radius,0, Math.PI * 2); // Draw a full circle
    ctx.fillStyle = obj.color;
    ctx.fill();
    ctx.closePath();
}

let objects = [new Planet(10, new Vector2d(400, canvas.height/2), new Vector2d(Math.cos(degreesToRadians(-49))/3, Math.sin(degreesToRadians(-49))* 3), "lightblue"),
               new Planet(20, new Vector2d(600, canvas.height/2), new Vector2d(0, Math.sin(degreesToRadians(-49))* 4 * -1), "red"),
               new Planet(10, new Vector2d(500, canvas.height/2), new Vector2d(Math.cos(degreesToRadians(-49))/3, Math.sin(degreesToRadians(-49))* 3), "gray")]
               
const star = new Star(100);
function gameLoop() {
    requestAnimationFrame(gameLoop);
    clear();

    drawCircle(star);
    for (planet of objects) {
        //ball.velocity.limit(20)
        planet.accelerate();
        planet.move();
        drawCircle(planet);
        planet.drawNextSteps();
        planet.acceleration.setNew(new Vector2d(0, 0));
        star.attract(planet);
        //applyForce(new Vector2d(0, ball.weight), ball);

    }

}

gameLoop();



