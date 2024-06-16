const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const continueButton = document.getElementById("continue");
const resetButton = document.getElementById("reset");
const increaseTimeButton = document.getElementById("increase-time");
const decreaseTimeButton = document.getElementById("decrease-time");
const timeDisplay = document.getElementById("time");
const breakDisplay = document.getElementById("break-time");
const focusAnimation = document.getElementById("focus-animation");
const breakSection = document.getElementById("break");
const fileInput = document.getElementById("file-input");
const addMusicButton = document.getElementById("add-music");
const musicList = document.getElementById("music-list");
const previousSongButton = document.getElementById("previous-song");
const nextSongButton = document.getElementById("next-song");
const shuffleButton = document.getElementById("shuffle");
const playButton = document.querySelector(".play-song");
const pauseButton2 = document.querySelector(".pause-song");
const todoInput = document.getElementById("new-task");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const themeBtn = document.getElementById("theme");
const modeIcon = document.getElementById("mode-icon");
const modeName = document.getElementsByClassName("modeName")[0];

let audioElements = [];
let audioFileNames = [];
let currentIndex = 0;
let isShuffle = false;
let isPlaying = false;
let currentAudio;

pauseButton2.style.display = "none";

let timer;
let breakTimer;
let totalTime = 25 * 60; // 25 minutes in seconds
let timeLeft = totalTime;
let breakTime = 5 * 60; // 5 minutes break in seconds
let isBreak = false;
let progress = 0;

// Function to add task from input
function addTask() {
    const taskText = todoInput.value.trim();
    if (taskText) {
        addTaskToList(taskText);
        todoInput.value = '';
    }
}

// Function to add task to the list
function addTaskToList(taskText, completed = false) {
    const listItem = document.createElement('li');
    listItem.classList.add('task-item'); // Optionally add a class for styling purposes

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    taskSpan.classList.add('task-text');
    if (completed) {
        taskSpan.classList.add('completed');
    }
    listItem.appendChild(taskSpan);

    const taskButtons = document.createElement('div');
    taskButtons.classList.add('task-buttons');

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.classList.add('complete-task');
    completeButton.addEventListener('click', () => {
        completeButton.textContent = taskSpan.classList.contains('completed') ? 'Complete' : 'Incomplete';
        taskSpan.classList.toggle('completed'); // Toggle completed class on taskSpan
        listItem.classList.toggle('completed'); // Toggle completed class on listItem
        saveTasks();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-task');
    deleteButton.addEventListener('click', () => {
        taskList.removeChild(listItem);
        saveTasks();
    });

    taskButtons.appendChild(completeButton);
    taskButtons.appendChild(deleteButton);
    listItem.appendChild(taskButtons);

    taskList.appendChild(listItem);
    saveTasks();
}

// Event listener for adding a task
addTaskButton.addEventListener('click', addTask);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Function to save tasks to localStorage
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(task => {
        tasks.push({
            text: task.querySelector('.task-text').textContent,
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        addTaskToList(task.text, task.completed);
    });
}

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function updateBreakDisplay() {
    const minutes = Math.floor(breakTime / 60);
    const seconds = breakTime % 60;
    breakDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
            updateFocusAnimation();
        } else {
            clearInterval(timer);
            startBreak();
        }
    }, 1000);

    startButton.style.display = "none";
    pauseButton.style.display = "inline-block";
    increaseTimeButton.style.display = "none";
    decreaseTimeButton.style.display = "none";
    document.querySelector('.timer-circle').style.display = 'block'; 
}

function pauseTimer() {
    clearInterval(timer);
    pauseButton.style.display = "none";
    continueButton.style.display = "inline-block";
    resetButton.style.display = "inline-block";
}

function continueTimer() {
    startTimer();
    continueButton.style.display = "none";
    resetButton.style.display = "none";
}

function startBreak() {
    isBreak = true;
    breakTime = 5 * 60;
    breakSection.style.display = "flex";
    updateBreakDisplay();
    document.querySelector('.timer-circle').style.display = 'none';
    breakTimer = setInterval(() => {
        if (breakTime > 0) {
            breakTime--;
            updateBreakDisplay();
        } else {
            clearInterval(breakTimer);
            isBreak = false;
            breakSection.style.display = "none";
            timeLeft = totalTime;
            updateDisplay();
            startTimer();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    clearInterval(breakTimer);
    // timeLeft = totalTime;
    timeLeft = 1500;
    totalTime = 1500;
    updateDisplay();
    focusAnimation.style.height = "0%";
    breakSection.style.display = "none";
    isBreak = false;
    progress = 0;
    // stopMusic();

    startButton.style.display = "inline-block";
    increaseTimeButton.style.display = "inline-block";
    decreaseTimeButton.style.display = "inline-block";
    pauseButton.style.display = "none";
    continueButton.style.display = "none";
    resetButton.style.display = "none";
    document.querySelector('.timer-circle').style.display = 'none'; 
}

function updateFocusAnimation() {
    progress = (totalTime - timeLeft) / totalTime;
    const size = progress * 100; // Percentage of growth
    focusAnimation.style.height = `${size}%`;

    // Change background color dynamically based on progress
    const red = 102 + Math.floor(progress * 153); // From 102 to 255
    const green = 187 - Math.floor(progress * 49); // From 187 to 138
    const blue = 106 - Math.floor(progress * 34); // From 106 to 72
    const backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    focusAnimation.style.background = backgroundColor;

    // Adjust text color for better visibility
    const textColor = progress > 0.5 ? "#fff" : "#333"; // White text for darker background
    document.body.style.color = textColor;
}
function increaseTime() {
    if (totalTime >= 30 * 60) {
        totalTime += 15 * 60; // Increase by 15 minutes
    } else {
        totalTime += 5 * 60; // Increase by 5 minutes
    }
    timeLeft = totalTime;
    updateDisplay();
}

function decreaseTime() {
    if (totalTime > 60) {
        if (totalTime >= 45 * 60) {
            totalTime -= 15 * 60; // Decrease by 15 minutes
        } else {
            totalTime -= 5 * 60; // Decrease by 5 minutes
        }
        timeLeft = totalTime;
        updateDisplay();
    }
}


let originalAudioElements = [];
let originalAudioFileNames = [];

function addMusic(event) {
    const files = event.target.files;
    for (let file of files) {
        const audio = new Audio(URL.createObjectURL(file));
        audioElements.push(audio);
        audioFileNames.push(file.name);

        originalAudioElements.push(audio);
        originalAudioFileNames.push(file.name);
    }

    updateMusicListUI();
}

function showPlayButton() {
    playButton.style.display = "inline-block";
    pauseButton2.style.display = "none";
}

function playMusic() {
    if (audioElements.length > 0) {
        stopCurrentAudio();
        currentAudio = audioElements[currentIndex];
        currentAudio.addEventListener("ended", handleAudioEnded);
        currentAudio.play();
        isPlaying = true;
        playButton.style.display = "none";
        pauseButton2.style.display = "inline-block";
    }
}

function handleAudioEnded() {
    playNextSong();
}

function pauseMusic() {
    if (currentAudio) {
        currentAudio.pause();
        isPlaying = false;
        playButton.style.display = "inline-block";
        pauseButton2.style.display = "none";
    }
}

function stopCurrentAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio.removeEventListener("ended", handleAudioEnded);
    }
}

function stopMusic() {
    if (audioElements.length > 0) {
        audioElements.forEach((audio) => audio.pause());
        audioElements = [];
        audioFileNames = [];
    }
}

function getRandomIndex() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * audioElements.length);
    } while (randomIndex === currentIndex);
    return randomIndex;
}

fileInput.addEventListener("change", addMusic);
addMusicButton.addEventListener("click", () => fileInput.click());
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
continueButton.addEventListener("click", continueTimer);
resetButton.addEventListener("click", resetTimer);
increaseTimeButton.addEventListener("click", increaseTime);
decreaseTimeButton.addEventListener("click", decreaseTime);
previousSongButton.addEventListener("click", playPreviousSong);
nextSongButton.addEventListener("click", playNextSong);
shuffleButton.addEventListener("click", toggleShuffle);
playButton.addEventListener("click", playMusic);
pauseButton2.addEventListener("click", pauseMusic);
themeBtn.addEventListener('click', function(eve) {
    eve.preventDefault();
    document.documentElement.classList.toggle('light'); // Toggle dark mode on the root element

    if (modeName.textContent === "Light") {
        modeName.textContent = "Dark";
        modeIcon.src = "./images/moon-icon-9d3bd779.svg";
    } else {
        modeName.textContent = "Light";
        modeIcon.src = "./images/sun-icon.svg";
    }
});

function playPreviousSong() {
    if (audioElements.length > 1) {
        stopCurrentAudio();
        currentIndex = (currentIndex - 1 + audioElements.length) % audioElements.length;
        playMusic();
    }
}

function playNextSong() {
    if (audioElements.length > 1) {
        stopCurrentAudio();
        if (!isShuffle) {
            currentIndex = (currentIndex + 1) % audioElements.length;
        } else {
            // currentIndex = getRandomIndex();
            // currentIndex = currentIndex+1;
            currentIndex = (currentIndex + 1 + audioElements.length) % audioElements.length;
        }
        playMusic();
    }
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    if (isShuffle) {
        shuffleButton.classList.add('active');
        stopCurrentAudio();

        const copiedAudioElements = [...audioElements];
        const copiedAudioFileNames = [...audioFileNames];

        audioElements = [];
        audioFileNames = [];

        shuffleAudioElements(copiedAudioElements, copiedAudioFileNames);

        audioElements = copiedAudioElements;
        audioFileNames = copiedAudioFileNames;

        currentIndex = 0;
        updateMusicListUI();
    } else {
        shuffleButton.classList.remove('active');
        stopCurrentAudio();

        audioElements = [...originalAudioElements];
        audioFileNames = [...originalAudioFileNames];

        currentIndex = 0;
        updateMusicListUI();
    }
    playMusic();
}

function shuffleAudioElements(audioElementsToShuffle, audioFileNamesToShuffle) {
    for (let i = audioElementsToShuffle.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [audioElementsToShuffle[i], audioElementsToShuffle[j]] = [audioElementsToShuffle[j], audioElementsToShuffle[i]];
        [audioFileNamesToShuffle[i], audioFileNamesToShuffle[j]] = [audioFileNamesToShuffle[j], audioFileNamesToShuffle[i]];
    }
}

function resetAudioElementsOrder() {
    const audioElementsWithNames = audioElements.map((audio, index) => ({ audio, name: audioFileNames[index] }));
    audioElementsWithNames.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
    audioElements = audioElementsWithNames.map(item => item.audio);
    audioFileNames = audioElementsWithNames.map(item => item.name);
}

function updateMusicListUI() {
    musicList.innerHTML = '';

    for (let i = 0; i < audioElements.length; i++) {
        const listItem = document.createElement('li');
        listItem.textContent = audioFileNames[i];
        listItem.addEventListener('click', () => {
            currentIndex = i;
            playMusic();
        });
        musicList.appendChild(listItem);
    }
}

updateDisplay();