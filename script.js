let timer;
let time;
let timeLeft = 1500;
let pomodoroCount = 0;
let shortCount = 0;
let longCount = 0;
let workDuration = 25;
let shortDuration = 5
let longDuration = 15;
let cycleDuration = 4;
let isWorking = false;
let isBreak = false;
let isShort = false;
let isLong = false;
let toggle = false;

const timeDisplay = document.getElementById("time");
const pomodoroDisplay = document.getElementById("pomodoroCount");
const shortDisplay = document.getElementById("shortCount");
const longDisplay = document.getElementById("longCount");
const startButton = document.getElementById("start");
const restartButton = document.getElementById("restart");
const clearButton = document.getElementById("clear");
const workInput = document.getElementById("workDuration");
const shortInput = document.getElementById("shortDuration");
const longInput = document.getElementById("longDuration");
const cycleInput = document.getElementById("cycleDuration");
const autoStart = document.getElementById("autoStart");
const sound = document.getElementById("notification-sound");

document.querySelector(".settings-overlay").classList.add("hide");
const openButton = document.querySelector(".open-settings-button");
console.log(openButton);
const settings = document.querySelector(".settings-overlay");
console.log(settings);
const closeButton = document.querySelector(".close-settings-button");

document.querySelector(".clear-records-overlay").classList.add("hide");
const openClearRecordsButton = document.querySelector(".open-clear-records-button");
const clearRecordsOverlay = document.querySelector(".clear-records-overlay");
const closeClearRecordsButton = document.querySelector(".close-clear-records-button");

const pomodoroToastWrapper = document.querySelector(".pomodoro-toast-wrapper");
const breakToastWrapper = document.querySelector(".break-toast-wrapper");

function updateDisplay() {
    if (isNaN(timeLeft) || timeLeft < 0) {
        console.log("timeLeft:", timeLeft);
        return;
    }

    const minutes = Math.floor(timeLeft/60);
    const seconds = timeLeft%60;
    timeDisplay.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2,'0');
}

function startTimer() {
    if (isWorking) return;
    isWorking = true;

    timeLeft = checkRemainingTime();

    timer = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        }
        else {
            clearInterval(timer);

            if (!isBreak) {
                pomodoroCount++;
                updatePomodoro();
                showPomodoroToast();
            }
            else if (pomodoroCount > 0 && (pomodoroCount % cycleInput.value == 0 || pomodoroCount % cycleDuration == 0)) {
                longCount++;
                updateLong();
                showBreakToast();
            }
            else {
                shortCount++;
                updateShort();
                showBreakToast();
            }
            isBreak = !isBreak;
            resetTimer();
            if (toggle == true) {
                startTimer();
            }
        }
    }, 1000);
};

function resetTimer() {
    clearInterval(timer);
    isWorking = false;
    timeLeft = checkRemainingTime();
    updateDisplay();
}

function clearRecords() {
    clearInterval(timer);
    isBreak = false;
    isWorking = true;
    pomodoroCount = 0;
    shortCount = 0;
    longCount = 0;
    timeLeft = (parseInt(workInput.value) * 60) || workDuration * 60;
    updatePomodoro();
    updateShort();
    updateLong();
    updateDisplay();
    resetTimer();
}

function checkRemainingTime() {
    if (isBreak) {
        if (pomodoroCount > 0 && (pomodoroCount % cycleInput.value == 0 || pomodoroCount % cycleDuration == 0)) {
            return (parseInt(longInput.value) * 60) || longDuration * 60;
        }
        else {
            return (parseInt(shortInput.value) * 60) || shortDuration * 60;
        }
    }
    else {
        return (parseInt(workInput.value) * 60) || workDuration * 60;
    }
}

function updatePomodoro() {
    pomodoroDisplay.textContent = `Pomodoros: ${pomodoroCount}`;
}

function updateShort() {
    shortDisplay.textContent = `Short Breaks: ${shortCount}`;
}

function updateLong() {
    longDisplay.textContent = `Long Breaks: ${longCount}`;
}

function openSettings() {
    settings.classList.remove("hide");
    settings.classList.add("show");
}

function closeSettings() {
    settings.classList.remove("show");
    settings.classList.add("hide");
}

function openClearRecords() {
    clearRecordsOverlay.classList.remove("hide");
    clearRecordsOverlay.classList.add("show");
}

function closeClearRecords() {
    clearRecordsOverlay.classList.remove("show");
    clearRecordsOverlay.classList.add("hide");
}

function showPomodoroToast() {
    pomodoroToastWrapper.classList.add("show");
    setTimeout(() => {
        hidePomodoroToast();
    }, 10000);
    sound.play();
}

function hidePomodoroToast() {
    pomodoroToastWrapper.classList.remove("show");
}

function showBreakToast() {
    breakToastWrapper.classList.add("show");
    setTimeout(() => {
        hideBreakToast();
    }, 10000);
    sound.play();
}

function hideBreakToast() {
    breakToastWrapper.classList.remove("show");
}

function autoStartCheck() {
    return toggle = autoStart.checked? true : false;
}

startButton.addEventListener('click', startTimer);
restartButton.addEventListener('click', resetTimer);
openButton.addEventListener('click', openSettings);
settings.addEventListener('click', function (e) {
    if (e.target === settings) {
        closeSettings();
    }
});
closeButton.addEventListener('click', closeSettings);

openClearRecordsButton.addEventListener('click', openClearRecords);
closeClearRecordsButton.addEventListener('click', closeClearRecords);
clearRecordsOverlay.addEventListener('click', function (e) {
    if (e.target === clearRecordsOverlay) {
        closeClearRecords();
    }
});

autoStart.addEventListener('change', autoStartCheck);
updateDisplay();