let mode = "timer"; // "timer" or "stopwatch"

let totalSeconds = 0;
let remainingSeconds = 0;
let stopwatchSeconds = 0;

let timerInterval = null;

// 📅 Daily tracking
let todayKey = new Date().toDateString();
let studiedTime = parseInt(localStorage.getItem(todayKey)) || 0;

// DOM
const timerModeBtn = document.getElementById("timerModeBtn");
const stopwatchModeBtn = document.getElementById("stopwatchModeBtn");

const hoursInput = document.getElementById("hoursInput");
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");

const setBtn = document.getElementById("setTimerBtn");

const timeDisplay = document.getElementById("timeDisplay");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const todayTimeDisplay = document.getElementById("todayTime");

// ⬅️ add this line
const timerControls = document.getElementById("timerControls");

// 🧠 Format time
function formatTime(sec) {
    let h = Math.floor(sec / 3600);
    let m = Math.floor((sec % 3600) / 60);
    let s = sec % 60;

    return `${h.toString().padStart(2, "0")}:` +
           `${m.toString().padStart(2, "0")}:` +
           `${s.toString().padStart(2, "0")}`;
}

// 📊 Update display
function updateDisplay() {
    if (mode === "timer") {
        timeDisplay.textContent = formatTime(remainingSeconds);
    } else {
        timeDisplay.textContent = formatTime(stopwatchSeconds);
    }
}

// 📊 Update study time
function updateTodayTime() {
    let mins = Math.floor(studiedTime / 60);
    todayTimeDisplay.textContent = mins + " minutes";
}

// 🔄 SWITCH MODES

// initial state
mode = "timer";
timerModeBtn.classList.add("active");
stopwatchModeBtn.classList.remove("active");
timerControls.classList.remove("hidden");

timerModeBtn.addEventListener("click", () => {
    if (mode === "timer") return;

    mode = "timer";

    timerModeBtn.classList.add("active");
    stopwatchModeBtn.classList.remove("active");

    // show timer inputs in timer mode
    timerControls.classList.remove("hidden");

    clearInterval(timerInterval);
    timerInterval = null;
    updateDisplay();
});

stopwatchModeBtn.addEventListener("click", () => {
    if (mode === "stopwatch") return;

    mode = "stopwatch";

    stopwatchModeBtn.classList.add("active");
    timerModeBtn.classList.remove("active");

    // hide timer inputs in stopwatch mode
    timerControls.classList.add("hidden");

    console.log("Controls classes:", timerControls.className);

    clearInterval(timerInterval);
    timerInterval = null;
    updateDisplay();
});

// ⏱ SET TIMER
setBtn.addEventListener("click", () => {
    let h = parseInt(hoursInput.value) || 0;
    let m = parseInt(minutesInput.value) || 0;
    let s = parseInt(secondsInput.value) || 0;

    totalSeconds = h * 3600 + m * 60 + s;
    remainingSeconds = totalSeconds;

    updateDisplay();
});

// ▶ START
startBtn.addEventListener("click", () => {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        if (mode === "timer") {
            if (remainingSeconds > 0) {
                remainingSeconds--;
                studiedTime++;
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                alert("Time's up!");
            }
        } else if (mode === "stopwatch") {
            stopwatchSeconds++;
            studiedTime++;
        }

        localStorage.setItem(todayKey, studiedTime);

        updateDisplay();
        updateTodayTime();
    }, 1000);
});

// ⏸ PAUSE
pauseBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;
});

// 🔄 RESET
resetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerInterval = null;

    if (mode === "timer") {
        remainingSeconds = totalSeconds;
    } else {
        stopwatchSeconds = 0;
    }

    updateDisplay();
});

loadWeeklyData();

// 🔥 INIT
updateDisplay();
updateTodayTime();

function loadWeeklyData() {
    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
        let d = new Date();
        d.setDate(d.getDate() - i);

        let key = d.toDateString();

        labels.push(
            d.toLocaleDateString(undefined, { weekday: "short" })
        );

        let value = parseInt(localStorage.getItem(key)) || 0;

        data.push(Math.floor(value / 60)); // minutes
    }

    const ctx = document.getElementById("weeklyChart");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Minutes Studied",
                    data: data
                }
            ]
        },
        options: {
            responsive: true
        }
    });
}