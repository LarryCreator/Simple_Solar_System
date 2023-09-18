class Vector2d {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(vector) {
        this.x += vector.x;
        this.y += vector.y
    };
    sub(vector) {
        return new Vector2d(this.x - vector.x, this.y - vector.y);
    };
    divide(vector) {
        this.x /= vector.x;
        this.y /= vector.y;
    }
    mult(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
    }
    multScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    getDotProduct(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    normalize() {
        const mag = Math.sqrt(this.x ** 2 + this.y ** 2);
        if (mag != 0) {
            this.x /= mag;
            this.y /= mag;
        }
        
    }
    mag () {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    setMag(magNum) {
        const mag = Math.sqrt(this.x ** 2 + this.y ** 2);
        this.x = this.x / mag * magNum;
        this.y = this.y / mag * magNum;
    }
    limit(magLimit) {
        const mag = Math.sqrt(this.x ** 2 + this.y ** 2);
        if (mag > magLimit) {
            this.x = this.x/mag * magLimit;
            this.y = this.y/mag * magLimit;
        }
    }
    copy() {
        return new Vector2d(this.x, this.y);
    }
    setNew(vector) {
        this.x = vector.x;
        this.y = vector.y;
    }
}

class Star {
    constructor(mass) {
        this.position = new Vector2d(canvas.width/2, canvas.height/2);
        this.mass = mass;
        this.radius = Math.sqrt(this.mass) * 10;
        this.gravityConstant = 2;
        this.color = "orange";
    }
    attract(planet) {
        //gForce will represent the direction of the force
        let gForce = this.position.copy();
        gForce = gForce.sub(planet.position);
        const distance = gForce.copy().mag() * 500;
        const strength = this.gravityConstant * this.mass * planet.mass / distance;
        gForce.setMag(strength);
        applyForce(gForce, planet);
    }
}



class Planet {
    constructor(mass, position, velocity, color) {
        this.position = position;
        this.velocity = velocity;
        this.acceleration = new Vector2d(0, 0);
        this.mass = mass;
        this.radius = Math.sqrt(this.mass);
        this.color = color;
        this.steps = 0;
    }

    accelerate() {
        this.velocity.add(this.acceleration);
    }
    move() {
        this.position.add(this.velocity);
    };
    drawNextSteps() {
        const newStar = new Star(100);
        let noRealPlanet = new Planet(this.mass, this.position.copy(), this.velocity.copy(), "blue");
        if (this.steps > 0) {
            for (let i = 0; i < this.steps; i++) {
                noRealPlanet.acceleration.setNew(new Vector2d(0, 0));
                newStar.attract(noRealPlanet);
                noRealPlanet.accelerate();
                noRealPlanet.move();
    
                //try with circles
                ctx.beginPath();
                ctx.arc(noRealPlanet.position.x, noRealPlanet.position.y, 1,0, Math.PI * 2); // Draw a full circle
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
            }
            this.steps -= 1
        }
        
        
    };
}

function getRandomInt(min, max) {
    // Generate a random integer between min (inclusive) and max (inclusive)
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

function applyForce(force, obj) {
    obj.acceleration.add(force);
}

function degreesToRadians(degrees) {
    // Formula to convert degrees to radians: radians = degrees * (Math.PI / 180)
    return degrees * (Math.PI / 180);
  }
  