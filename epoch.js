const epochStartTime = new Date(Date.UTC(2023, 6, 14, 8, 0, 0));
let epochCounter = 0;
let currentIndex = 100;

function isMoveTime() {
    const now = new Date();
    const minutes = now.getUTCMinutes();
    const result = minutes === 0 || minutes === 30;

    if (result) {
        console.log(`isMoveTime returned true at: ${now.toISOString()}`);
    }

    return result;
}

function getEpochStartDate(counter) {
    const startDate = new Date(epochStartTime.getTime() + (counter * 14 * 24 * 60 * 60 * 1000));
    const year = startDate.getUTCFullYear();
    const month = String(startDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(startDate.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getTickInitialPosition() {
    const now = new Date();
    const elapsedMillis = now.getTime() - epochStartTime.getTime();
    const elapsedHours = elapsedMillis / (1000 * 60 * 60);
    const elapsedPixels = (elapsedHours / 24) * 48;
    return 414 - elapsedPixels; //414
}

function addTick(i) {
    const tick = document.createElement('div');
    tick.classList.add('tick');

    const verticalLine = document.createElement('div');
    const horizontalLine = document.createElement('div');
    horizontalLine.classList.add('horizontal-line');

    if (i % 14 === 0) {
    verticalLine.classList.add('bold-vertical-line');
    const epochText = document.createElement('div');
    epochText.classList.add('epoch-label');
    const epochStartDate = getEpochStartDate(i / 14); 
    epochText.innerHTML = `<span class="epoch-round-box">Epoch ${i / 14}</span>   ${epochStartDate} (UTC)`;
    tick.appendChild(epochText);
    } else {
        verticalLine.classList.add('vertical-line');
    }

    tick.appendChild(verticalLine);
    tick.appendChild(horizontalLine);

    return tick;
}

const tickArea = document.getElementById('tickArea');

tickArea.style.left = getTickInitialPosition() + "px";

function moveTickArea() {
    const position = parseFloat(tickArea.style.left);
    tickArea.style.left = (position - 1) + "px";

    if (position <= (414 - 48*(currentIndex))) {
        tickArea.removeChild(tickArea.firstChild);
        tickArea.appendChild(addTick(currentIndex));
        currentIndex++;
    }
}


for (let i = 0; i < 100; i++) {
    tickArea.appendChild(addTick(i));
}


function updateUTCClock() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    document.getElementById('utcClock').textContent = `Current time : ${year}-${month}-${day} ${hours}:${minutes} (UTC)`; //:${seconds}
}

updateUTCClock();
setInterval(updateUTCClock, 1000);

// Constants and Initial Settings
const MOVE_INTERVAL = 1800000; // Every 30 minutes
const PIXEL_MOVE = 1;
let boxSetPosition = [503, 672 + 503, 672*2 + 503, 672*3 + 503]; // Initial positions

// Calculate the difference in date and time
const startDate = new Date(2023, 6, 24, 8, 0, 0);
const currentDate = new Date();
const differenceInMilliseconds = currentDate - startDate;
const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
const totalPixelMove = differenceInMinutes / 30;
boxSetPosition = boxSetPosition.map(pos => pos - totalPixelMove);

let roundCounter = 0; 

// Function to dynamically create round box and gap box
function createBoxSet() {
    const roundBox = document.createElement('div');
    roundBox.className = 'round-box';
    roundBox.textContent = 'Round ' + roundCounter;
    roundCounter++;

    const gapBox = document.createElement('div');
    gapBox.className = 'gap-box';
    gapBox.textContent = 'Gap';

    return [roundBox, gapBox];
}

// Function to update the position of round box and gap box
function updateBoxSetPosition(boxes, position) {
    boxes[0].style.left = position + 'px';
    boxes[1].style.left = (position + 648) + 'px';
}

// Create initial sets of round boxes and gap boxes and add them to the document
const boxSets = [createBoxSet(), createBoxSet(), createBoxSet(), createBoxSet()];

for(let i=0; i<4; i++) {
    document.querySelector('.container .mask').appendChild(boxSets[i][0]);
    document.querySelector('.container .mask').appendChild(boxSets[i][1]);
    updateBoxSetPosition(boxSets[i], boxSetPosition[i]);
}

function moveBoxSet() {
    boxSetPosition = boxSetPosition.map(pos => pos - PIXEL_MOVE);
    for(let i=0; i<4; i++) {
        updateBoxSetPosition(boxSets[i], boxSetPosition[i]);
    }

    if (boxSetPosition[0] <= -672) {
        boxSetPosition.shift();
        boxSetPosition.push(boxSetPosition[boxSetPosition.length - 1] + 672);

        const newBoxSet = createBoxSet();
        document.querySelector('.container .mask').removeChild(boxSets[0][0]);
        document.querySelector('.container .mask').removeChild(boxSets[0][1]);
        document.querySelector('.container .mask').appendChild(newBoxSet[0]);
        document.querySelector('.container .mask').appendChild(newBoxSet[1]);
        boxSets.shift();
        boxSets.push(newBoxSet);
    }
}

let lastMovedTime = 0;

function moveIfNeeded() {
    const now = new Date();
    const currentTime = now.getTime();

    console.log("Checking if move is needed...");

    if (isMoveTime() && currentTime - lastMovedTime >= (30 * 60 * 1000)) {
        console.log("Moving...");

        lastMovedTime = currentTime;
        
        moveTickArea();
        moveBoxSet();
    }
}

setInterval(moveIfNeeded, 60 * 1000);

const GENESIS_TIME = new Date("2023-07-14T08:00:00");
const EPOCH_DURATION = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
const ROUND_START_TIME = new Date("2023-07-24T08:00:00");
const ROUND_DURATION = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
const ROUND_ACTIVE_DURATION = 13.5 * 24 * 60 * 60 * 1000; // 13.5 days in milliseconds
const CYCLE_GAP_DURATION = 0.5 * 24 * 60 * 60 * 1000; // 0.5 day in milliseconds

function updateTime() {
    const now = new Date();
    
    // Calculate the time elapsed since Genesis
    const genesisElapsed = now - GENESIS_TIME;
    document.getElementById('genesisTime').textContent = formatDetailedElapsedTime(genesisElapsed);
    
    // Calculate next Epoch date
    const nextEpochTime = getNextTime(GENESIS_TIME, EPOCH_DURATION);
    document.getElementById('epochTime').textContent = formatDate(nextEpochTime);
    
    // Calculate next Round date
    const nextRoundTime = getNextTime(ROUND_START_TIME, ROUND_DURATION, ROUND_ACTIVE_DURATION);
    document.getElementById('roundTime').textContent = formatDate(nextRoundTime);
    
    // Calculate next Gap Cycle
    const nextGapCycleStart = getNextGapCycleStart(ROUND_START_TIME, ROUND_DURATION, ROUND_ACTIVE_DURATION);
    const nextGapCycleEnd = new Date(nextGapCycleStart.getTime() + CYCLE_GAP_DURATION);

    document.getElementById('gapCycleTime').textContent = `${formatDate(nextGapCycleStart)} ~ ${formatDate(nextGapCycleEnd)}`;
}

function getNextGapCycleStart(startTime, roundDuration, activeDuration) {
    const now = new Date();
    let elapsed = now.getTime() - startTime.getTime();
    
    // Calculate how many complete rounds have passed since startTime
    let roundsPassed = Math.floor(elapsed / roundDuration);
    
    // Calculate the start time of the next gap cycle
    let nextGapCycleStartTime = new Date(startTime.getTime() + (roundDuration * roundsPassed) + activeDuration);
    
    return nextGapCycleStartTime;
}

function getNextTime(startTime, duration, activeDuration = duration) {
    const now = new Date();
    let elapsed = now.getTime() - startTime.getTime();
    
    // Calculate how many complete cycles (active + gap) have passed since startTime
    let cyclesPassed = Math.floor(elapsed / duration);

    // Calculate the start time of the next cycle
    let nextStartTime = new Date(startTime.getTime() + (duration * cyclesPassed));

    // If the current time is beyond the start time of the next cycle, add another cycle
    if(now.getTime() > nextStartTime.getTime()) {
        nextStartTime = new Date(nextStartTime.getTime() + duration);
    }
    return nextStartTime;
}

function formatDetailedElapsedTime(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    return `${years} years ${months % 12} months ${days % 30} days ${hours % 24} hours`;
}

function formatDate(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${date.getHours()}:00`;
}
// Call updateTime every second
setInterval(updateTime, 1000);

const timezones = moment.tz.names();
const dropdown = document.querySelector('.worldTime');
const timeZoneTimeDiv = document.getElementById('selectedTimeZoneTime');
let intervalId;

timezones.forEach(zone => {
    const option = document.createElement('option');
    option.value = zone;
    option.textContent = zone;
    dropdown.appendChild(option);
});

function displayTimeForTimeZone(timezone) {
    const currentTime = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
    timeZoneTimeDiv.textContent = currentTime;
}

dropdown.addEventListener('change', function() {
    clearInterval(intervalId);
    displayTimeForTimeZone(this.value);
    intervalId = setInterval(() => {
        displayTimeForTimeZone(this.value);
    }, 1000);
});
