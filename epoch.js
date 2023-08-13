const epochStartTime = new Date(Date.UTC(2023, 6, 14, 8, 0, 0));
let epochCounter = 0;
let currentIndex = 100;


function isMoveTime() {
    const now = new Date();
    const minutes = now.getMinutes();
    const result = minutes === 0 || minutes === 30;

    if (result) {
        console.log(`isMoveTime returned true at: ${now.toISOString()}`);
    }

    return result;
}

function getEpochStartDate(counter) {
    const startDate = new Date(epochStartTime.getTime() + (counter * 14 * 24 * 60 * 60 * 1000));
    const year = startDate.getFullYear();
    const month = String(startDate.getMonth() + 1).padStart(2, '0');
    const day = String(startDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getTickInitialPosition() {
    const now = new Date();
    const elapsedMillis = now.getTime() - epochStartTime.getTime();
    const elapsedHours = elapsedMillis / (1000 * 60 * 60);
    const elapsedPixels = (elapsedHours / 24) * 48;
    return 429 - elapsedPixels; // - Left
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
    epochText.innerHTML = `<span class="epoch-round-box">Epoch ${i / 14}</span>`;  // ${epochStartDate} (UTC)
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

    if (position <= (430 - 48*(currentIndex))) {
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
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('utcClock').textContent = `${year}-${month}-${day} ${hours}:${minutes}`;
}

updateUTCClock();
setInterval(updateUTCClock, 60000);

// Constants and Initial Settings
const MOVE_INTERVAL = 1800000; // Every 30 minutes
const PIXEL_MOVE = 1;
let boxSetPosition = [518, 672 + 518, 672*2 + 518, 672*3 + 518, 672*4 + 518, 672*5 + 518];

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
const boxSets = [createBoxSet(), createBoxSet(), createBoxSet(), createBoxSet(), createBoxSet(), createBoxSet()];


for(let i=0; i<6; i++) {
    document.querySelector('.container .mask').appendChild(boxSets[i][0]);
    document.querySelector('.container .mask').appendChild(boxSets[i][1]);
    updateBoxSetPosition(boxSets[i], boxSetPosition[i]);
}

function moveBoxSet() {
    boxSetPosition = boxSetPosition.map(pos => pos - PIXEL_MOVE);
    for(let i=0; i<6; i++) {
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

     if (isMoveTime() && currentTime - lastMovedTime >= (30 * 60 * 1000) - 5000) { // 5초의 여유를 줍니다.
        console.log("Moving...");

        lastMovedTime = currentTime;
        
        moveTickArea();
        moveBoxSet();
    }
}

setInterval(moveIfNeeded, 60 * 1000);

let closestEpochMultiple = Math.floor((currentIndex + 14) / 14) * 14;
for (let i = closestEpochMultiple; i < closestEpochMultiple + 100; i++) {
    tickArea.appendChild(addTick(i));
}
