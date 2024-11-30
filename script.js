let timerInterval;
let elapsedTime = 0;

const timeDisplay = document.getElementById("time-display");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const resetBtn = document.getElementById("reset-btn");
const lapBtn = document.getElementById("lap-btn");
const exportBtn = document.getElementById("export-btn");
const modeBtn = document.getElementById("mode-btn");
const lapList = document.getElementById("lap-list");

const formatTime = (time) => {
  const milliseconds = Math.floor((time % 1000) / 10).toString().padStart(2, "0");
  const seconds = Math.floor((time / 1000) % 60).toString().padStart(2, "0");
  const minutes = Math.floor((time / (1000 * 60)) % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}.${milliseconds}`;
};

const updateDisplay = () => {
  timeDisplay.textContent = formatTime(elapsedTime);
};

const startTimer = () => {
  const startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
  }, 10);
};

const stopTimer = () => clearInterval(timerInterval);

const resetTimer = () => {
  clearInterval(timerInterval);
  elapsedTime = 0;
  lapList.innerHTML = "";
  updateDisplay();
};

const addLap = () => {
  const lapTime = formatTime(elapsedTime);
  const lapItem = document.createElement("li");
  lapItem.className = "lap-item";
  lapItem.textContent = `Lap ${lapList.children.length + 1}: ${lapTime}`;
  lapList.appendChild(lapItem);
};

const exportLaps = () => {
  const laps = Array.from(lapList.children).map((lap) => lap.textContent).join("\n");
  const blob = new Blob([laps], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "laps.txt";
  link.click();
};

const toggleMode = () => {
  const isLightMode = document.body.classList.contains("light-mode");
  document.body.classList.toggle("light-mode", !isLightMode);
  document.body.classList.toggle("dark-mode", isLightMode);
  modeBtn.textContent = isLightMode ? "Light Mode" : "Dark Mode";
};


[startBtn, stopBtn, resetBtn, lapBtn, exportBtn].forEach((btn) => {
  btn.addEventListener("click", () => new Audio("beep.mp3").play());
});

startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  stopBtn.disabled = false;
  startTimer();
});

stopBtn.addEventListener("click", () => {
  stopBtn.disabled = true;
  startBtn.disabled = false;
  stopTimer();
});

resetBtn.addEventListener("click", resetTimer);
lapBtn.addEventListener("click", addLap);
exportBtn.addEventListener("click", exportLaps);
modeBtn.addEventListener("click", toggleMode);

window.addEventListener("beforeunload", () => {
  localStorage.setItem("elapsedTime", elapsedTime);
  localStorage.setItem("laps", lapList.innerHTML);
});

window.addEventListener("load", () => {
  elapsedTime = parseInt(localStorage.getItem("elapsedTime")) || 0;
  lapList.innerHTML = localStorage.getItem("laps") || "";
  updateDisplay();
});