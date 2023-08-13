let isDragging = false;
let startMouseX = 0;

const maskArea = document.querySelector('.mask');

function updateUTCClockBy(diffX) {
    const diffMinutes = -diffX * 30; 
    const currentDate = new Date(document.getElementById('utcClock').textContent);

    currentDate.setMinutes(currentDate.getMinutes() + diffMinutes);

    const roundedMinutes = Math.round(currentDate.getMinutes() / 30) * 30;
    currentDate.setMinutes(roundedMinutes);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');

    document.getElementById('utcClock').textContent = `${year}-${month}-${day} ${hours}:${minutes}`;
}


function moveElementsBy(diffX) {
    // Update tickArea
    const tickPosition = parseFloat(tickArea.style.left);
    tickArea.style.left = (tickPosition + diffX) + "px";

    // Update boxSets
    boxSetPosition = boxSetPosition.map(pos => pos + diffX);
    for (let i = 0; i < 4; i++) {
        updateBoxSetPosition(boxSets[i], boxSetPosition[i]);
    }

    updateUTCClockBy(diffX); 
}

maskArea.addEventListener('mousedown', function (e) {
    isDragging = true;
    startMouseX = e.clientX;
});

maskArea.addEventListener('mousemove', function (e) {
    if (!isDragging) return;

    const currentMouseX = e.clientX;
    const diffX = currentMouseX - startMouseX;
    moveElementsBy(diffX);
    startMouseX = currentMouseX;  // Update startMouseX for the next move
});

maskArea.addEventListener('mouseup', function () {
    isDragging = false;
});

// Prevent selection while dragging
maskArea.addEventListener('selectstart', function (e) {
    if (isDragging) {
        e.preventDefault();
    }
});


document.getElementById('resetButton').addEventListener('click', function() {
    location.reload();
});

