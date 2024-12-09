const socket = io()

// Your Phaser game setup
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

// Function to round the current time to the nearest hour
function roundToNearestHour() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // Round to nearest hour
    const roundedMinutes = (minutes >= 30) ? 60 : 0; // Round up if past the 30-minute mark
    const roundedTime = new Date(now.setMinutes(roundedMinutes, 0, 0)); // Set minutes to 0 or 60 depending on rounding

    return roundedTime.getTime();
}

// Function to reset every hour after the rounded start time
function getResetTime(startTime) {
    return startTime + 3600000; // Add 1 hour (in milliseconds)
}



// Set the start time of the doodle and reset it after ever hour after that
let startTime = roundToNearestHour();
let resetTime = getResetTime(startTime);

// COnvert the time to a human-readable format
let humanStartTime = new Date(startTime);
let humanResetTime = new Date(resetTime);



// Initialize variables
let graphics, lastPosition, doodles = [];

function preload() {
    console.log("Board starts on: ", humanStartTime);
    console.log("Board closes on: ", humanResetTime);
    console.log('Foxes are preloading doodle board...');
    // Load assets here if needed
}

function create() {
    console.log('Doodle app started');
    const time = this.add.text(0, 0, `Board session will reset: ${humanResetTime}`, { font: '12px Arial', fill: '#ffffff' });
    // Set time to the very front of all elements
    time.setDepth(1000)

    // Create graphics options for drawing
    graphics = this.add.graphics();
    graphics.lineStyle(4, 0xffffff, 1);

    // Handle pointer down
    this.input.on('pointerdown', (pointer) => {
        lastPosition = { x: pointer.x, y: pointer.y } // Start here
    });

    // Handle drawing
    this.input.on('pointermove', (pointer) => {
        if (pointer.isDown && lastPosition) {
            doodles.push({
                startX: lastPosition.x,
                startY: lastPosition.y,
                endX: pointer.x,
                endY: pointer.y
            });

            graphics.moveTo(lastPosition.x, lastPosition.y);
            graphics.lineTo(pointer.x, pointer.y);
            graphics.strokePath();

            lastPosition = { x: pointer.x, y: pointer.y }; // Updates last pos
        }
    });

    // Reset last position on pointer up
    // Because we do not want to draw a line from the last position to the next pointer down lol
    this.input.on('pointerup', () => {
        lastPosition = null;
    });

}

// Ephemerial doodles

function update() {
    // Clear doodles every 3,600 seconds
    if (doodles.length > 0) {
        setTimeout(() => {
            try {
                // save doodle
                saveDoodles(); // Save doodles
            } catch (error) {
                console.log('Foxies are having trouble saving the doodles');
            }
            graphics.clear(); // Clear graphics
            doodles = []; // Reset doodles
        }, 5000);
    }
}

function saveDoodles() {
    // Save doodles to a file
    console.log('Foxies are looking over the doodles and are saving them to .jpg...');
}
