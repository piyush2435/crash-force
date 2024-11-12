// JavaScript for Car Collision Simulation with Improved Structure and Momentum-Based Force Calculation

const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext("2d");

// Vehicle and object properties
let car = { x: 0, y: 250, width: 100, height: 50, mass: 0, acceleration: 0, initialVelocity: 0, velocity: 0 };
let object = { x: 700, y: 250, width: 50, height: 50, mass: 0, acceleration: 0, initialVelocity: 0, velocity: 0 };
let objectType = 'person';
let distance = 1000;
let collisionDecision = 'collide';
let forceCarOnObject = 0;
let forceObjectOnCar = 0;
const timeFactor = 0.1;  // Scale down speed to show smoother movement

// Cloud properties
let clouds = [
    { x: 100, y: 50, speed: 0.5 },
    { x: 300, y: 80, speed: 0.3 },
    { x: 600, y: 60, speed: 0.4 }
];

// Function to draw trees at intervals along the background
function drawTrees() {
    for (let i = 50; i < canvas.width; i += 200) {
        // Draw tree trunk
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(i, 250, 10, 50);
        // Draw tree leaves
        ctx.beginPath();
        ctx.arc(i + 5, 240, 25, 0, Math.PI * 2);
        ctx.fillStyle = "#006400";
        ctx.fill();
    }
}

// Function to draw moving clouds
function drawClouds() {
    clouds.forEach(cloud => {
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 20, 0, Math.PI * 2);
        ctx.arc(cloud.x + 25, cloud.y, 25, 0, Math.PI * 2);
        ctx.arc(cloud.x + 50, cloud.y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        cloud.x -= cloud.speed;
        if (cloud.x < -50) cloud.x = canvas.width + 50;
    });
}

// Function to draw the road with lanes
function drawRoad() {
    ctx.fillStyle = "#707070";
    ctx.fillRect(0, 200, canvas.width, 100);

    ctx.strokeStyle = "#FFF";
    ctx.setLineDash([20, 20]);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.lineTo(canvas.width, 250);
    ctx.stroke();
}

// Function to draw a detailed car
function drawCar() {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(car.x, car.y, car.width, car.height);

    // Car details: windows, headlights
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(car.x + 20, car.y + 10, 20, 20);  // Window 1
    ctx.fillRect(car.x + 60, car.y + 10, 20, 20);  // Window 2
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(car.x + car.width - 10, car.y + 15, 5, 5); // Headlight

    // Car wheels
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(car.x + 20, car.y + car.height, 10, 0, Math.PI * 2);
    ctx.arc(car.x + 80, car.y + car.height, 10, 0, Math.PI * 2);
    ctx.fill();
}

// Function to draw other objects based on type
function drawObject() {
    ctx.fillStyle = "#0000FF";
    if (objectType === "person") {
        ctx.fillRect(object.x, object.y - 25, object.width / 2, object.height);  // Body
        ctx.beginPath();
        ctx.arc(object.x + 12, object.y - 35, 10, 0, Math.PI * 2); // Head
        ctx.fill();
    } else if (objectType === "car" || objectType === "truck") {
        ctx.fillRect(object.x, object.y, object.width, object.height);
        // Wheels
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.arc(object.x + 10, object.y + object.height, 10, 0, Math.PI * 2);
        ctx.arc(object.x + object.width - 10, object.y + object.height, 10, 0, Math.PI * 2);
        ctx.fill();
    } else if (objectType === "pole") {
        ctx.fillRect(object.x, object.y - 50, object.width / 3, object.height + 50);
    }
}

// Function to run the simulation
function runSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawClouds();
    drawTrees();
    drawRoad();
    drawCar();
    drawObject();

    // Apply time scaling for smoother movement
    car.velocity = car.initialVelocity + car.acceleration * timeFactor;
    object.velocity = object.initialVelocity + object.acceleration * timeFactor;

    if (collisionDecision === "collide" && car.x + car.width < object.x) {
        car.x += car.velocity * timeFactor;
        object.x -= object.velocity * timeFactor;
    } else if (collisionDecision === "avoid") {
        const requiredDeceleration = car.velocity / (distance / car.velocity);
        ctx.fillStyle = 'black';
        ctx.fillText(`Collision avoided with deceleration: ${requiredDeceleration.toFixed(2)} m/s²`, 20, 50);
        return;
    }

    if (car.x + car.width >= object.x) {
        calculateForces();
        displayForces();
    }

    requestAnimationFrame(runSimulation);
}

// Function to calculate forces and change in momentum
function calculateForces() {
    const initialMomentumCar = car.mass * car.initialVelocity;
    const finalMomentumCar = car.mass * car.velocity;
    const momentumChangeCar = finalMomentumCar - initialMomentumCar;

    const initialMomentumObject = object.mass * object.initialVelocity;
    const finalMomentumObject = object.mass * object.velocity;
    const momentumChangeObject = finalMomentumObject - initialMomentumObject;

    const timeInterval = 1;  // Assumed time interval for collision in seconds
    forceCarOnObject = momentumChangeCar / timeInterval;
    forceObjectOnCar = momentumChangeObject / timeInterval;
}

// Function to display forces after collision
function displayForces() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Force exerted by Car on Object: ${forceCarOnObject.toFixed(2)} N`, 50, 50);
    ctx.fillText(`Force exerted by Object on Car: ${forceObjectOnCar.toFixed(2)} N`, 50, 80);
}

// Event listeners for simulation
document.getElementById("startSimulation").addEventListener("click", () => {
    car.mass = parseFloat(document.getElementById("carMass").value);
    car.acceleration = parseFloat(document.getElementById("carAcceleration").value);
    car.initialVelocity = parseFloat(document.getElementById("carInitialVelocity").value);
    object.mass = parseFloat(document.getElementById("objectMass").value);
    object.acceleration = parseFloat(document.getElementById("objectAcceleration").value);
    object.initialVelocity = parseFloat(document.getElementById("objectInitialVelocity").value);
    distance = parseFloat(document.getElementById("objectDistance").value);
    objectType = document.getElementById("objectType").value;
    collisionDecision = document.getElementById("collisionDecision").value;
    runSimulation();
});
