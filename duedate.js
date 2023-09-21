const GENESIS_TIME = new Date("2023-07-14T08:00:00");
const EPOCH_DURATION = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
const ROUND_START_TIME = new Date("2023-07-24T08:00:00");
const ROUND_DURATION = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
const ROUND_ACTIVE_DURATION = 13.5 * 24 * 60 * 60 * 1000; // 13.5 days in milliseconds
const CYCLE_GAP_DURATION = 0.5 * 24 * 60 * 60 * 1000; // 0.5 day in milliseconds

function utcDateToLocaleDate(utcDate) {
    const timeOffset = utcDate.getTimezoneOffset() * 60 * 1000; // in milliseconds
    return new Date(utcDate.getTime() - timeOffset);
}

function updateTime() {
    const now = new Date();
    
    const genesisElapsed = now - GENESIS_TIME;
    document.getElementById('genesisTime').textContent = formatDetailedElapsedTime(genesisElapsed);
    
    const nextEpochTimeLocal = utcDateToLocaleDate(getNextTime(GENESIS_TIME, EPOCH_DURATION));
    document.getElementById('epochTime').textContent = formatDate(nextEpochTimeLocal);

    const nextRoundTimeLocal = utcDateToLocaleDate(getNextTime(ROUND_START_TIME, ROUND_DURATION, ROUND_ACTIVE_DURATION));
    document.getElementById('roundTime').textContent = formatDate(nextRoundTimeLocal);
    
    const nextGapCycleStartUTC = getNextGapCycleStart(ROUND_START_TIME, ROUND_DURATION, ROUND_ACTIVE_DURATION);
    const nextGapCycleStartLocal = utcDateToLocaleDate(nextGapCycleStartUTC);
    
    const nextGapCycleEndUTC = new Date(nextGapCycleStartUTC.getTime() + CYCLE_GAP_DURATION);
    const nextGapCycleEndLocal = utcDateToLocaleDate(nextGapCycleEndUTC);

    document.getElementById('gapCycleTime').textContent = `${formatDate(nextGapCycleStartLocal)} ~ ${formatDate(nextGapCycleEndLocal)}`;
}

function getNextGapCycleStart(startTime, roundDuration, activeDuration) {
    const now = new Date();
    let elapsed = now.getTime() - startTime.getTime();
    let roundsPassed = Math.floor(elapsed / roundDuration);
    let nextGapCycleStartTime = new Date(startTime.getTime() + (roundDuration * roundsPassed) + activeDuration);
    return nextGapCycleStartTime;
}

function getNextTime(startTime, duration, activeDuration = duration) {
    const now = new Date();
    let elapsed = now.getTime() - startTime.getTime();
    let cyclesPassed = Math.floor(elapsed / duration);
    let nextStartTime = new Date(startTime.getTime() + (duration * cyclesPassed));
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
    const localDate = moment(date);
    return `${months[localDate.month()]} ${localDate.date()}, ${localDate.year()} ${localDate.hours()}:00`;
}

// Call updateTime once initially
updateTime();
// Call updateTime every 5 minutes
setInterval(updateTime, 300000);

function displayTimeForTimeZone() {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    document.getElementById('selectedTimeZoneTime').textContent = currentTime;
}