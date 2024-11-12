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
const timeFactor = 0.1; // Scale down speed to show smoother movement

// Cloud properties
let clouds = [
    { x: 100, y: 50, speed: 0.5 },
    { x: 300, y: 80, speed: 0.3 },
    { x: 600, y: 60, speed: 0.4 }
];

// Tree properties
let trees = [
    { x: 100, y: 200, width: 10, height: 50 },
    { x: 300, y: 200, width: 10, height: 50 },
    { x: 500, y: 200, width: 10, height: 50 },
];

// Function to draw trees at specified positions
function drawTrees() {
    trees.forEach(tree => {
        // Draw trunk
        ctx.fillStyle = "#8B4513"; // Brown for trunk
        ctx.fillRect(tree.x, tree.y, tree.width, tree.height); 

        // Draw leaves
        ctx.fillStyle = "#228B22"; // Green for leaves
        ctx.beginPath();
        ctx.arc(tree.x + 5, tree.y - 20, 25, 0, Math.PI * 2); 
        ctx.fill();
    });
}

// Function to calculate forces based on momentum change
function calculateForces() {
    // Calculate change in momentum using m1u1 - m2v2
    const initialMomentumCar = car.mass * car.initialVelocity;
    const finalMomentumObject = object.mass * object.velocity;
    const momentumChange = initialMomentumCar - finalMomentumObject;

    // Assume a time interval for the force calculation
    const timeInterval = 1;  // Assume time for simplicity
    forceCarOnObject = momentumChange / timeInterval;
    forceObjectOnCar = -momentumChange / timeInterval;  // Equal and opposite reaction

    // Display forces
    displayForces();
}

// Function to display forces after collision
function displayForces() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Force exerted by Car on Object: ${forceCarOnObject.toFixed(2)} N`, 50, 50);
    ctx.fillText(`Force exerted by Object on Car: ${forceObjectOnCar.toFixed(2)} N`, 50, 80);
}

// Simulation function to run with trees, cloud, and other elements
function runSimulation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawClouds(); // Draw clouds
    drawTrees(); // Draw trees
    drawRoad(); // Draw road
    drawCar(); // Draw car
    drawObject(); // Draw other objects

    car.velocity = car.initialVelocity + car.acceleration * timeFactor;
    object.velocity = object.initialVelocity + object.acceleration * timeFactor;

    if (collisionDecision === "collide" && car.x + car.width < object.x) {
        car.x += car.velocity * timeFactor; // Move car
        object.x -= object.velocity * timeFactor; // Move object
    } else if (collisionDecision === "avoid") {
        ctx.fillStyle = 'green';
        ctx.fillText("Collision avoided. Good job!", 20, 120);
        return;
    }

    if (car.x + car.width >= object.x) {
        calculateForces(); // Calculate forces based on collision
    }

    requestAnimationFrame(runSimulation); // Continue the simulation
}

// Start the simulation when the user inputs values
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
    runSimulation(); // Start the simulation
});

    // Apply time scaling for smoother movement
    car.velocity = car.initialVelocity + car.acceleration * timeFactor;
    object.velocity = object.initialVelocity + object.acceleration * timeFactor;

    if (collisionDecision === "collide" && car.x + car.width < object.x) {
        car.x += car.velocity * timeFactor; // Move car
        object.x -= object.velocity * timeFactor; // Move object
    } else if (collisionDecision === "avoid") {
        const requiredDeceleration = car.velocity / (distance / car.velocity);
        ctx.fillStyle = 'black';
        ctx.fillText(`Collision avoided with deceleration: ${requiredDeceleration.toFixed(2)} m/s²`, 20, 50);
        ctx.fillText(`Great decision to avoid the collision!`, 20, 80);
        return;
    }

    if (car.x + car.width >= object.x) {
        calculateForces(); // Calculate forces
        displayForces(); // Display forces
        explosionVisible = true; // Trigger explosion display
    }

    if (explosionVisible) {
        drawExplosion(forceCarOnObject); // Draw explosion
    }

    requestAnimationFrame(runSimulation); // Continue the simulation
}

// Function to calculate forces based on the new velocity equations
function calculateForces() {
    // Calculate final velocity for the car and the object
    const carDistance = distance; // Distance to collision
    const objectDistance = distance; // Distance to collision for object

    const finalVelocityCar = Math.sqrt(Math.pow(car.initialVelocity, 2) + 2 * car.acceleration * carDistance);
    const finalVelocityObject = Math.sqrt(Math.pow(object.initialVelocity, 2) + 2 * object.acceleration * objectDistance);

    // Calculate the time taken using v = u + at
    const timeIntervalCar = (finalVelocityCar - car.initialVelocity) / car.acceleration;
    const timeIntervalObject = (finalVelocityObject - object.initialVelocity) / object.acceleration;

    // Change in momentum for the car
    const momentumChangeCar = car.mass * finalVelocityCar - car.mass * car.initialVelocity;

    // Change in momentum for the object
    const momentumChangeObject = object.mass * finalVelocityObject - object.mass * object.initialVelocity;

    // Calculate forces
    forceCarOnObject = momentumChangeCar / timeIntervalCar;
    forceObjectOnCar = momentumChangeObject / timeIntervalObject;

    // Display precautions based on speed
    if (finalVelocityCar > 30) {
        ctx.fillStyle = 'black';
        ctx.fillText(`Precaution: Drive Safely,someone is waiting for you at home !`, 20, 120);
    }
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
    runSimulation(); // Start the simulation
});
