document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const timeDisplay = document.querySelector('.time-display');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapBtn = document.getElementById('lapBtn');
    const lapsList = document.getElementById('lapsList');
    const lapCount = document.getElementById('lapCount');
    
    // Variables
    let startTime;
    let elapsedTime = 0;
    let timerInterval;
    let isRunning = false;
    let lapTimes = [];
    
    // Format time (hh:mm:ss.ms)
    function formatTime(ms) {
        let date = new Date(ms);
        let hours = date.getUTCHours().toString().padStart(2, '0');
        let minutes = date.getUTCMinutes().toString().padStart(2, '0');
        let seconds = date.getUTCSeconds().toString().padStart(2, '0');
        let milliseconds = Math.floor(date.getUTCMilliseconds() / 10).toString().padStart(2, '0');
        
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
    
    // Update the time display
    function updateDisplay() {
        timeDisplay.textContent = formatTime(elapsedTime);
    }
    
    // Start the stopwatch
    function startTimer() {
        if (!isRunning) {
            startTime = Date.now() - elapsedTime;
            timerInterval = setInterval(function() {
                elapsedTime = Date.now() - startTime;
                updateDisplay();
            }, 10);
            isRunning = true;
            
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
            lapBtn.disabled = false;
        }
    }
    
    // Pause the stopwatch
    function pauseTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
    }
    
    // Reset the stopwatch
    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        elapsedTime = 0;
        lapTimes = [];
        
        updateDisplay();
        renderLaps();
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
        lapBtn.disabled = true;
    }
    
    // Record a lap time
    function recordLap() {
        if (isRunning) {
            lapTimes.unshift({
                number: lapTimes.length + 1,
                time: elapsedTime,
                formattedTime: formatTime(elapsedTime)
            });
            
            renderLaps();
        }
    }
    
    // Render lap times
    function renderLaps() {
        lapsList.innerHTML = '';
        
        if (lapTimes.length === 0) {
            lapsList.innerHTML = '<div class="lap-item" style="justify-content: center; background: none;">No laps recorded yet</div>';
            lapCount.textContent = '0 laps';
            return;
        }
        
        lapTimes.forEach(lap => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.innerHTML = `
                <div class="lap-number">${lap.number}</div>
                <div class="lap-time">${lap.formattedTime}</div>
            `;
            lapsList.appendChild(lapItem);
        });
        
        lapCount.textContent = `${lapTimes.length} ${lapTimes.length === 1 ? 'lap' : 'laps'}`;
    }
    
    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    lapBtn.addEventListener('click', recordLap);
    
    // Initialize
    updateDisplay();
    renderLaps();
});