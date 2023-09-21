const TICK_WIDTH = 48;
const BOX_WIDTH = 672;
const TICK_INITIAL_POSITION = 429;

const epochStartTime = new Date(Date.UTC(2023, 6, 14, 8, 0, 0));
let currentIndex = 100;

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
    const elapsedPixels = (elapsedHours / 24) * TICK_WIDTH;
    return TICK_INITIAL_POSITION - elapsedPixels;
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
        epochText.innerHTML = `<span class="epoch-round-box">Epoch ${i / 14}</span>`;
        tick.appendChild(epochText);
    } else {
        verticalLine.classList.add('vertical-line');
    }

    tick.appendChild(verticalLine);
    tick.appendChild(horizontalLine);

    return tick;
}

const tickArea = document.getElementById('tickArea');

if (tickArea) {
    tickArea.style.left = getTickInitialPosition() + "px";
}

function moveTickArea() {
    if (!tickArea) return;
    
    const position = parseFloat(tickArea.style.left);
    tickArea.style.left = (position - 1) + "px";

    if (position <= (TICK_INITIAL_POSITION - TICK_WIDTH * currentIndex)) {
        tickArea.removeChild(tickArea.firstChild);
        tickArea.appendChild(addTick(currentIndex));
        currentIndex++;
    }
}

for (let i = 0; i < 100; i++) {
    if (tickArea) {
        tickArea.appendChild(addTick(i));
    }
}

function updateUTCClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const utcClock = document.getElementById('utcClock');
    if (utcClock) {
        utcClock.textContent = `${year}-${month}-${day} ${hours}:${minutes}`;
    }
}

updateUTCClock();
setInterval(updateUTCClock, 60000);

// Constants and Initial Settings
const MOVE_INTERVAL = 1800000; // Every 30 minutes
const PIXEL_MOVE = 1;

const startDate = new Date(2023, 6, 24, 8, 0, 0);
const currentDate = new Date();
const differenceInMilliseconds = currentDate - startDate;
const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
const totalPixelMove = differenceInMinutes / 30;

let boxSetPosition = Array(6).fill().map((_, idx) => 518 + BOX_WIDTH * idx - totalPixelMove);

let roundCounter = 0;

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

function updateBoxSetPosition(boxes, position) {
    if (boxes && boxes.length === 2) {
        boxes[0].style.left = position + 'px';
        boxes[1].style.left = (position + 648) + 'px';
    }
}

const boxSets = Array(6).fill().map(() => createBoxSet());

const maskContainer = document.querySelector('.container .mask');
if (maskContainer) {
    for (let i = 0; i < 6; i++) {
        maskContainer.appendChild(boxSets[i][0]);
        maskContainer.appendChild(boxSets[i][1]);
        updateBoxSetPosition(boxSets[i], boxSetPosition[i]);
    }
}

function moveBoxSet() {
    boxSetPosition = boxSetPosition.map(pos => pos - PIXEL_MOVE);
    
    for (let i = 0; i < boxSets.length; i++) { // 모든 박스 세트에 대해 반복
        updateBoxSetPosition(boxSets[i], boxSetPosition[i]);
    }
    
    if (maskContainer && boxSetPosition[0] <= -BOX_WIDTH) {
        maskContainer.removeChild(boxSets[0][0]);
        maskContainer.removeChild(boxSets[0][1]);
    
        boxSetPosition.shift();
        boxSetPosition.push(boxSetPosition[boxSetPosition.length - 1] + BOX_WIDTH);
    
        const newBoxSet = createBoxSet();
        maskContainer.appendChild(newBoxSet[0]);
        maskContainer.appendChild(newBoxSet[1]);
    
        boxSets.shift();
        boxSets.push(newBoxSet); // 이 부분이 새로 생성된 박스를 기존 배열에 추가하는 부분입니다.
    
        // 새로 추가된 박스의 포지션 업데이트
        updateBoxSetPosition(newBoxSet, boxSetPosition[boxSetPosition.length - 1]);
    }
    
}

