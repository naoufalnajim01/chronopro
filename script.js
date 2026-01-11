/**
 * Chrono EPS Pro+ v3.0
 * Application de chronométrage pour professeurs EPS
 * Modern, Clean & Accessible
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ============================================
    // DOM SELECTORS
    // ============================================

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    // Core Elements
    const body = document.body;
    const root = document.documentElement;
    const themeToggle = $('#themeToggle');
    const navButtons = $$('.nav-button');
    const sections = $$('.timer-section');
    const currentYearSpan = $('#current-year');
    const largeDisplayToggle = $('#large-display-toggle');
    const largeDisplayExitBtn = $('#large-display-exit-btn');
    const infoButtons = $$('.info-button');
    const guideCloseButtons = $$('.close-guide-btn');
    const animatedSloganElement = $('#animated-slogan');

    // Audio Elements
    const sounds = {
        tick: $('#tickSound'),
        lap: $('#lapSound'),
        start: $('#startSound'),
        stop: $('#stopSound'),
        countdown: $('#countdownSound')
    };

    // Stopwatch Elements
    const swDisplay = {
        hr: $('#sw-hr'),
        min: $('#sw-min'),
        sec: $('#sw-sec'),
        ms: $('#sw-ms')
    };
    const swStartPauseBtn = $('#sw-start-pause');
    const swLapBtn = $('#sw-lap');
    const swResetBtn = $('#sw-reset');
    const swClearLapsBtn = $('#sw-clear-laps');
    const lapTableBody = $('#lap-table-body');
    const lapsContainer = $('#laps-container');
    const lapStatsDisplay = {
        fastest: $('#lap-stat-fastest'),
        slowest: $('#lap-stat-slowest'),
        average: $('#lap-stat-average')
    };
    const sessionNameInput = $('#session-name');
    const swCountdownEnable = $('#sw-countdown-enable');
    const swCountdownDisplay = $('#sw-countdown-display');

    // Interval Timer Elements
    const intervalInputs = {
        workM: $('#interval-work-m'),
        workS: $('#interval-work-s'),
        restM: $('#interval-rest-m'),
        restS: $('#interval-rest-s'),
        rounds: $('#interval-rounds')
    };
    const intervalDisplay = {
        min: $('#interval-min'),
        sec: $('#interval-sec')
    };
    const intervalProgressRing = $('#interval-progress-ring');
    const intervalDisplayWrapper = $('#interval-display-wrapper');
    const intervalTypeDisplay = $('#interval-type');
    const intervalRoundsDisplay = $('#interval-rounds-display');
    const intervalStartPauseBtn = $('#interval-start-pause');
    const intervalResetBtn = $('#interval-reset');
    const intervalNextBtn = $('#interval-next');
    const presetNameInput = $('#preset-name');
    const savePresetBtn = $('#save-preset-btn');
    const loadPresetSelect = $('#load-preset-select');
    const deletePresetBtn = $('#delete-preset-btn');
    const intervalCountdownEnable = $('#interval-countdown-enable');
    const intervalCountdownDisplay = $('#interval-countdown-display');

    // Devoir Mode Elements
    const devoirModeOptions = $$('.devoir-option-button');
    const devoirSubSections = $$('.devoir-sub-section');
    const devoirChronoDisplay = {
        hr: $('#d-chrono-hr'),
        min: $('#d-chrono-min'),
        sec: $('#d-chrono-sec')
    };
    const devoirChronoStartPauseBtn = $('#d-chrono-start-pause');
    const devoirChronoResetBtn = $('#d-chrono-reset');
    const heureActuelleDisplay = $('#heure-actuelle-display');
    const motivationMessageElement = $('#motivation-message');

    // Pomodoro Elements
    const pomoOptionBtns = $$('.pomo-option-button');
    const pomoDisplay = {
        min: $('#pomo-min'),
        sec: $('#pomo-sec')
    };
    const pomoStartPauseBtn = $('#pomo-start-pause');
    const pomoResetBtn = $('#pomo-reset');
    const pomoStatus = $('#pomo-status');
    const pomoProgressRing = $('#pomo-progress-ring');

    // Custom Timer Elements
    const customInputs = {
        h: $('#custom-h'),
        m: $('#custom-m'),
        s: $('#custom-s')
    };
    const customSetBtn = $('#custom-set');
    const customDisplay = {
        hr: $('#custom-hr-d'),
        min: $('#custom-min-d'),
        sec: $('#custom-sec-d')
    };
    const customStartPauseBtn = $('#custom-start-pause');
    const customResetBtn = $('#custom-reset');
    const customStatus = $('#custom-status');
    const customProgressRing = $('#custom-progress-ring');
    const customCountdownEnable = $('#custom-countdown-enable');
    const customCountdownDisplay = $('#custom-countdown-display');

    // ============================================
    // STATE
    // ============================================

    let currentMode = 'stopwatch';
    let isLargeDisplayMode = false;
    let countdownInterval = null;
    let typeWriterTimeout = null;
    let heureActuelleInterval = null;

    const stopwatchState = {
        isRunning: false,
        intervalId: null,
        startTime: 0,
        elapsedTime: 0,
        prevLapTime: 0,
        laps: [],
        lapCounter: 1,
        sessionName: ''
    };

    const intervalState = {
        isRunning: false,
        intervalId: null,
        currentPhase: 'ready',
        workSeconds: 30,
        restSeconds: 15,
        totalRounds: 8,
        currentRound: 1,
        currentSeconds: 30,
        presets: {}
    };

    const devoirChronoState = {
        isRunning: false,
        intervalId: null,
        startTime: 0,
        elapsedTime: 0
    };

    const pomodoroState = {
        isRunning: false,
        intervalId: null,
        totalSeconds: 25 * 60,
        currentSeconds: 25 * 60,
        mode: 'Pomodoro'
    };

    const customTimerState = {
        isRunning: false,
        intervalId: null,
        totalSeconds: 0,
        currentSeconds: 0,
        isSet: false
    };

    // ============================================
    // UTILITIES
    // ============================================

    const pad = (num) => String(num).padStart(2, '0');

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const playSound = (key) => {
        const audio = sounds[key];
        if (!audio || document.visibilityState !== 'visible') return;

        try {
            audio.currentTime = 0;
            audio.play().catch(() => { });
        } catch (e) {
            // Silent fail
        }
    };

    const formatTime = (ms, showMs = true) => {
        if (isNaN(ms) || ms < 0) ms = 0;

        const totalSec = Math.floor(ms / 1000);
        const hours = Math.floor(totalSec / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const seconds = totalSec % 60;
        const centiseconds = showMs ? Math.floor((ms % 1000) / 10) : 0;

        return {
            hours: pad(hours),
            minutes: pad(minutes),
            seconds: pad(seconds),
            ms: pad(centiseconds),
            formatted: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}${showMs ? '.' + pad(centiseconds) : ''}`
        };
    };

    const updateElement = (el, prop, value) => {
        if (el) el[prop] = value;
    };

    const toggleClass = (el, className, force) => {
        if (el) el.classList.toggle(className, force);
    };

    const setDisabled = (el, disabled) => {
        if (el) el.disabled = disabled;
    };

    // ============================================
    // THEME
    // ============================================

    const setDarkMode = (isDark) => {
        body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', isDark);
        if (themeToggle) themeToggle.checked = isDark;
    };

    const initTheme = () => {
        const saved = localStorage.getItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(saved !== null ? JSON.parse(saved) : prefersDark);
    };

    if (themeToggle) {
        themeToggle.addEventListener('change', () => setDarkMode(themeToggle.checked));
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('darkMode') === null) setDarkMode(e.matches);
    });

    // ============================================
    // LARGE DISPLAY MODE
    // ============================================

    const toggleLargeDisplay = () => {
        isLargeDisplayMode = !isLargeDisplayMode;
        body.classList.toggle('large-display-mode', isLargeDisplayMode);
    };

    if (largeDisplayToggle) {
        largeDisplayToggle.addEventListener('click', toggleLargeDisplay);
    }

    if (largeDisplayExitBtn) {
        largeDisplayExitBtn.addEventListener('click', toggleLargeDisplay);
    }

    // ============================================
    // SECTION GUIDES
    // ============================================

    infoButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const guideId = btn.dataset.guide;
            const guide = $(`#${guideId}`);

            // Close other guides
            $$('.section-guide.active').forEach(g => {
                if (g.id !== guideId) g.classList.remove('active');
            });

            if (guide) guide.classList.toggle('active');
        });
    });

    guideCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.section-guide')?.classList.remove('active');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            $$('.section-guide.active').forEach(g => g.classList.remove('active'));
        }
    });

    // ============================================
    // NAVIGATION
    // ============================================

    const stopAllTimers = () => {
        // Stop stopwatch
        if (stopwatchState.isRunning) {
            clearInterval(stopwatchState.intervalId);
            stopwatchState.isRunning = false;
        }

        // Stop interval
        if (intervalState.isRunning) {
            clearInterval(intervalState.intervalId);
            intervalState.isRunning = false;
        }

        // Stop devoir chrono
        if (devoirChronoState.isRunning) {
            clearInterval(devoirChronoState.intervalId);
            devoirChronoState.isRunning = false;
        }

        // Stop pomodoro
        if (pomodoroState.isRunning) {
            clearInterval(pomodoroState.intervalId);
            pomodoroState.isRunning = false;
        }

        // Stop custom timer
        if (customTimerState.isRunning) {
            clearInterval(customTimerState.intervalId);
            customTimerState.isRunning = false;
        }

        // Stop countdown
        clearInterval(countdownInterval);
        clearInterval(heureActuelleInterval);

        // Hide countdown overlays
        $$('.countdown-overlay.visible').forEach(el => el.classList.remove('visible'));

        // Remove running class
        body.classList.remove('timer-running');
    };

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            if (mode === currentMode || !mode) return;

            stopAllTimers();

            // Update nav
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update sections
            sections.forEach(s => s.classList.remove('active-section'));
            const section = $(`#${mode}-section`);
            if (section) section.classList.add('active-section');

            currentMode = mode;

            // Close guides
            $$('.section-guide.active').forEach(g => g.classList.remove('active'));

            // Mode-specific init
            if (mode === 'devoir') {
                const defaultBtn = $('.devoir-option-button[data-submode="heure"]');
                if (defaultBtn) defaultBtn.click();
            } else if (mode === 'interval') {
                loadPresets();
            }

            // Restart slogan
            startSloganAnimation();
        });
    });

    // ============================================
    // COUNTDOWN (Generic)
    // ============================================

    const startCountdown = (seconds, displayEl, callback) => {
        let count = seconds;
        clearInterval(countdownInterval);

        const update = () => {
            if (!displayEl) {
                clearInterval(countdownInterval);
                return;
            }

            if (count > 0) {
                displayEl.textContent = count;
                displayEl.classList.add('visible');
                playSound('countdown');
                count--;
            } else {
                displayEl.classList.remove('visible');
                clearInterval(countdownInterval);
                if (callback) callback();
            }
        };

        update();
        countdownInterval = setInterval(update, 1000);
    };

    // ============================================
    // SLOGAN ANIMATION
    // ============================================

    const sloganText = 'Application dédiée aux professeurs EPS.';
    let charIndex = 0;
    let isDeleting = false;

    const typeWriter = () => {
        if (!animatedSloganElement) return;

        clearTimeout(typeWriterTimeout);
        animatedSloganElement.classList.remove('typing-done');

        if (isDeleting) {
            animatedSloganElement.textContent = sloganText.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                typeWriterTimeout = setTimeout(typeWriter, 500);
            } else {
                typeWriterTimeout = setTimeout(typeWriter, 40);
            }
        } else {
            animatedSloganElement.textContent = sloganText.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === sloganText.length) {
                isDeleting = true;
                animatedSloganElement.classList.add('typing-done');
                typeWriterTimeout = setTimeout(typeWriter, 4000);
            } else {
                typeWriterTimeout = setTimeout(typeWriter, 80);
            }
        }
    };

    const startSloganAnimation = () => {
        if (!animatedSloganElement) return;
        clearTimeout(typeWriterTimeout);
        charIndex = 0;
        isDeleting = false;
        typeWriterTimeout = setTimeout(typeWriter, 500);
    };

    // ============================================
    // STOPWATCH
    // ============================================

    const updateStopwatchDisplay = () => {
        if (!swDisplay.hr) return;

        const elapsed = stopwatchState.isRunning
            ? Date.now() - stopwatchState.startTime
            : stopwatchState.elapsedTime;

        const time = formatTime(elapsed, true);

        swDisplay.hr.textContent = time.hours;
        swDisplay.min.textContent = time.minutes;
        swDisplay.sec.textContent = time.seconds;
        swDisplay.ms.textContent = time.ms;
    };

    const startStopwatch = () => {
        if (stopwatchState.isRunning) return;

        stopwatchState.isRunning = true;
        stopwatchState.startTime = Date.now() - stopwatchState.elapsedTime;
        stopwatchState.intervalId = setInterval(updateStopwatchDisplay, 30);

        updateElement(swStartPauseBtn, 'innerHTML', '<i class="fas fa-pause" aria-hidden="true"></i><span>Pause</span>');
        toggleClass(swStartPauseBtn, 'pause', true);
        setDisabled(swLapBtn, false);
        setDisabled(swResetBtn, false);
        body.classList.add('timer-running');

        playSound('start');
    };

    const pauseStopwatch = (silent = false) => {
        if (!stopwatchState.isRunning) return;

        stopwatchState.isRunning = false;
        clearInterval(stopwatchState.intervalId);
        stopwatchState.elapsedTime = Date.now() - stopwatchState.startTime;

        updateElement(swStartPauseBtn, 'innerHTML', '<i class="fas fa-play" aria-hidden="true"></i><span>Reprendre</span>');
        toggleClass(swStartPauseBtn, 'pause', false);
        body.classList.remove('timer-running');

        if (!silent) playSound('tick');
    };

    const resetStopwatch = (silent = false) => {
        pauseStopwatch(true);
        clearInterval(countdownInterval);
        toggleClass(swCountdownDisplay, 'visible', false);

        stopwatchState.elapsedTime = 0;
        stopwatchState.prevLapTime = 0;
        stopwatchState.laps = [];
        stopwatchState.lapCounter = 1;

        updateStopwatchDisplay();
        renderLaps();
        calculateLapStats();

        updateElement(swStartPauseBtn, 'innerHTML', '<i class="fas fa-play" aria-hidden="true"></i><span>Démarrer</span>');
        toggleClass(swStartPauseBtn, 'pause', false);
        setDisabled(swLapBtn, true);
        setDisabled(swResetBtn, true);
        setDisabled(swClearLapsBtn, true);

        if (!silent) playSound('tick');
    };

    const handleStopwatchStartPause = () => {
        if (stopwatchState.isRunning) {
            pauseStopwatch();
        } else if (swCountdownEnable?.checked && stopwatchState.elapsedTime === 0) {
            startCountdown(3, swCountdownDisplay, startStopwatch);
        } else {
            startStopwatch();
        }
    };

    const recordLap = () => {
        if (!stopwatchState.isRunning && stopwatchState.elapsedTime === 0) return;

        const totalMs = stopwatchState.isRunning
            ? Date.now() - stopwatchState.startTime
            : stopwatchState.elapsedTime;
        const lapMs = totalMs - stopwatchState.prevLapTime;

        stopwatchState.laps.unshift({
            number: stopwatchState.lapCounter,
            totalTimeMs: totalMs,
            lapTimeMs: lapMs
        });

        stopwatchState.prevLapTime = totalMs;
        stopwatchState.lapCounter++;

        renderLaps();
        calculateLapStats();
        setDisabled(swClearLapsBtn, false);

        playSound('lap');
    };

    const renderLaps = () => {
        if (!lapTableBody) return;

        lapTableBody.innerHTML = '';

        stopwatchState.laps.forEach(lap => {
            const row = lapTableBody.insertRow();
            const totalTime = formatTime(lap.totalTimeMs);
            const lapTime = formatTime(lap.lapTimeMs);

            row.innerHTML = `
                <td>${pad(lap.number)}</td>
                <td>${totalTime.formatted}</td>
                <td>+ ${lapTime.formatted}</td>
            `;
        });

        toggleClass(lapsContainer, 'empty', stopwatchState.laps.length === 0);
    };

    const calculateLapStats = () => {
        if (!lapStatsDisplay.fastest) return;

        if (stopwatchState.laps.length === 0) {
            lapStatsDisplay.fastest.textContent = '--';
            lapStatsDisplay.slowest.textContent = '--';
            lapStatsDisplay.average.textContent = '--';
            return;
        }

        let min = Infinity, max = 0, sum = 0;

        stopwatchState.laps.forEach(lap => {
            min = Math.min(min, lap.lapTimeMs);
            max = Math.max(max, lap.lapTimeMs);
            sum += lap.lapTimeMs;
        });

        const avg = sum / stopwatchState.laps.length;

        lapStatsDisplay.fastest.textContent = formatTime(min).formatted;
        lapStatsDisplay.slowest.textContent = formatTime(max).formatted;
        lapStatsDisplay.average.textContent = formatTime(avg).formatted;
    };

    const clearLaps = () => {
        if (stopwatchState.laps.length === 0) return;

        if (confirm(`Effacer les ${stopwatchState.laps.length} tours ?`)) {
            stopwatchState.laps = [];
            stopwatchState.lapCounter = 1;
            stopwatchState.prevLapTime = stopwatchState.isRunning
                ? Date.now() - stopwatchState.startTime
                : stopwatchState.elapsedTime;

            renderLaps();
            calculateLapStats();
            setDisabled(swClearLapsBtn, true);

            playSound('tick');
        }
    };

    // Stopwatch event listeners
    if (swStartPauseBtn) swStartPauseBtn.addEventListener('click', handleStopwatchStartPause);
    if (swLapBtn) swLapBtn.addEventListener('click', recordLap);
    if (swResetBtn) swResetBtn.addEventListener('click', () => resetStopwatch());
    if (swClearLapsBtn) swClearLapsBtn.addEventListener('click', clearLaps);

    // ============================================
    // INTERVAL TIMER
    // ============================================

    const intervalCircumference = intervalProgressRing
        ? 2 * Math.PI * (intervalProgressRing.r?.baseVal?.value || 54)
        : 0;

    if (intervalProgressRing) {
        intervalProgressRing.style.strokeDasharray = `${intervalCircumference} ${intervalCircumference}`;
        intervalProgressRing.style.strokeDashoffset = intervalCircumference;
    }

    const updateIntervalDisplay = () => {
        if (!intervalDisplay.min) return;

        const minutes = Math.floor(intervalState.currentSeconds / 60);
        const seconds = intervalState.currentSeconds % 60;

        intervalDisplay.min.textContent = pad(minutes);
        intervalDisplay.sec.textContent = pad(seconds);

        if (intervalRoundsDisplay) {
            intervalRoundsDisplay.textContent = `Round ${intervalState.currentRound} / ${intervalState.totalRounds}`;
        }
    };

    const updateIntervalProgress = () => {
        if (!intervalProgressRing) return;

        const total = intervalState.currentPhase === 'work'
            ? intervalState.workSeconds
            : intervalState.restSeconds;

        if (total <= 0) {
            intervalProgressRing.style.strokeDashoffset = intervalCircumference;
            return;
        }

        const progress = (total - intervalState.currentSeconds) / total;
        intervalProgressRing.style.strokeDashoffset = intervalCircumference * (1 - clamp(progress, 0, 1));
    };

    const loadPresets = () => {
        if (!loadPresetSelect) return;

        try {
            const stored = localStorage.getItem('intervalPresets_v1');
            intervalState.presets = stored ? JSON.parse(stored) : {};
        } catch (e) {
            intervalState.presets = {};
        }

        loadPresetSelect.innerHTML = '<option value="">Choisir...</option>';

        for (const name in intervalState.presets) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            loadPresetSelect.appendChild(option);
        }
    };

    const savePreset = () => {
        const name = presetNameInput?.value.trim();
        if (!name) {
            alert('Veuillez donner un nom au préréglage.');
            return;
        }

        intervalState.presets[name] = {
            workM: parseInt(intervalInputs.workM?.value) || 0,
            workS: parseInt(intervalInputs.workS?.value) || 0,
            restM: parseInt(intervalInputs.restM?.value) || 0,
            restS: parseInt(intervalInputs.restS?.value) || 0,
            rounds: parseInt(intervalInputs.rounds?.value) || 1
        };

        try {
            localStorage.setItem('intervalPresets_v1', JSON.stringify(intervalState.presets));
            loadPresets();
            loadPresetSelect.value = name;
            alert(`Préréglage "${name}" sauvegardé !`);
            playSound('tick');
        } catch (e) {
            alert('Erreur de sauvegarde.');
        }
    };

    const loadSelectedPreset = () => {
        const name = loadPresetSelect?.value;
        if (!name || !intervalState.presets[name]) return;

        const preset = intervalState.presets[name];

        if (intervalInputs.workM) intervalInputs.workM.value = preset.workM;
        if (intervalInputs.workS) intervalInputs.workS.value = preset.workS;
        if (intervalInputs.restM) intervalInputs.restM.value = preset.restM;
        if (intervalInputs.restS) intervalInputs.restS.value = preset.restS;
        if (intervalInputs.rounds) intervalInputs.rounds.value = preset.rounds;
        if (presetNameInput) presetNameInput.value = name;

        resetInterval(true);
    };

    const deleteSelectedPreset = () => {
        const name = loadPresetSelect?.value;
        if (!name || !intervalState.presets[name]) {
            alert('Sélectionnez un préréglage à supprimer.');
            return;
        }

        if (confirm(`Supprimer "${name}" ?`)) {
            delete intervalState.presets[name];

            try {
                localStorage.setItem('intervalPresets_v1', JSON.stringify(intervalState.presets));
                loadPresets();
                if (presetNameInput) presetNameInput.value = '';
                playSound('tick');
            } catch (e) {
                alert('Erreur de suppression.');
            }
        }
    };

    const setupIntervalTimer = () => {
        intervalState.workSeconds = (parseInt(intervalInputs.workM?.value) || 0) * 60 +
            (parseInt(intervalInputs.workS?.value) || 0);
        intervalState.restSeconds = (parseInt(intervalInputs.restM?.value) || 0) * 60 +
            (parseInt(intervalInputs.restS?.value) || 0);
        intervalState.totalRounds = parseInt(intervalInputs.rounds?.value) || 1;
        intervalState.currentSeconds = intervalState.workSeconds;
        intervalState.currentRound = 1;
        intervalState.currentPhase = 'ready';
    };

    const runInterval = () => {
        if (intervalState.currentSeconds > 0) {
            intervalState.currentSeconds--;
        } else {
            if (intervalState.currentPhase === 'work') {
                playSound('stop');

                if (intervalState.currentRound >= intervalState.totalRounds) {
                    finishInterval();
                    return;
                }

                intervalState.currentPhase = 'rest';
                intervalState.currentSeconds = intervalState.restSeconds;
                updateElement(intervalTypeDisplay, 'textContent', 'Repos');
                toggleClass(intervalDisplayWrapper, 'phase-resting', true);
                toggleClass(intervalDisplayWrapper, 'phase-work', false);
                playSound('start');
            } else if (intervalState.currentPhase === 'rest') {
                playSound('start');
                intervalState.currentRound++;
                intervalState.currentPhase = 'work';
                intervalState.currentSeconds = intervalState.workSeconds;
                updateElement(intervalTypeDisplay, 'textContent', 'Travail');
                toggleClass(intervalDisplayWrapper, 'phase-resting', false);
                toggleClass(intervalDisplayWrapper, 'phase-work', true);
            }
        }

        updateIntervalDisplay();
        updateIntervalProgress();
    };

    const startInterval = () => {
        if (intervalState.isRunning) return;

        if (intervalState.currentPhase === 'ready' || intervalState.currentPhase === 'finished') {
            setupIntervalTimer();

            if (intervalState.workSeconds <= 0) {
                alert('La durée de travail doit être supérieure à 0.');
                return;
            }

            intervalState.currentPhase = 'work';
            intervalState.currentSeconds = intervalState.workSeconds;
        }

        intervalState.isRunning = true;
        intervalState.intervalId = setInterval(runInterval, 1000);

        updateElement(intervalStartPauseBtn, 'innerHTML', '<i class="fas fa-pause" aria-hidden="true"></i><span>Pause</span>');
        toggleClass(intervalStartPauseBtn, 'pause', true);
        setDisabled(intervalResetBtn, false);
        setDisabled(intervalNextBtn, false);
        updateElement(intervalTypeDisplay, 'textContent', intervalState.currentPhase === 'work' ? 'Travail' : 'Repos');
        body.classList.add('timer-running');
        toggleClass(intervalDisplayWrapper, 'phase-work', true);
        toggleClass(intervalDisplayWrapper, 'phase-resting', false);
        toggleClass(intervalDisplayWrapper, 'phase-finished', false);

        updateIntervalDisplay();
        playSound('start');
    };

    const pauseInterval = (silent = false) => {
        if (!intervalState.isRunning) return;

        intervalState.isRunning = false;
        clearInterval(intervalState.intervalId);

        updateElement(intervalStartPauseBtn, 'innerHTML', '<i class="fas fa-play" aria-hidden="true"></i><span>Reprendre</span>');
        toggleClass(intervalStartPauseBtn, 'pause', false);
        body.classList.remove('timer-running');

        if (!silent) playSound('tick');
    };

    const resetInterval = (silent = false) => {
        pauseInterval(true);
        clearInterval(countdownInterval);
        toggleClass(intervalCountdownDisplay, 'visible', false);

        setupIntervalTimer();
        intervalState.currentPhase = 'ready';

        updateIntervalDisplay();
        updateIntervalProgress();

        updateElement(intervalStartPauseBtn, 'innerHTML', '<i class="fas fa-play" aria-hidden="true"></i><span>Démarrer</span>');
        toggleClass(intervalStartPauseBtn, 'pause', false);
        setDisabled(intervalStartPauseBtn, false);
        setDisabled(intervalResetBtn, true);
        setDisabled(intervalNextBtn, true);
        updateElement(intervalTypeDisplay, 'textContent', 'Prêt');
        toggleClass(intervalDisplayWrapper, 'phase-resting', false);
        toggleClass(intervalDisplayWrapper, 'phase-finished', false);
        toggleClass(intervalDisplayWrapper, 'phase-work', false);

        if (!silent) playSound('tick');
    };

    const finishInterval = () => {
        pauseInterval(true);
        intervalState.currentPhase = 'finished';

        updateElement(intervalTypeDisplay, 'textContent', 'Terminé ! 🎉');
        toggleClass(intervalDisplayWrapper, 'phase-resting', false);
        toggleClass(intervalDisplayWrapper, 'phase-work', false);
        toggleClass(intervalDisplayWrapper, 'phase-finished', true);
        setDisabled(intervalStartPauseBtn, true);
        setDisabled(intervalNextBtn, true);

        playSound('stop');
    };

    const nextInterval = () => {
        if (!intervalState.isRunning || intervalState.currentPhase === 'finished' || intervalState.currentPhase === 'ready') return;

        if (intervalState.currentPhase === 'work') {
            if (intervalState.currentRound >= intervalState.totalRounds) {
                finishInterval();
                return;
            }

            intervalState.currentPhase = 'rest';
            intervalState.currentSeconds = intervalState.restSeconds;
            updateElement(intervalTypeDisplay, 'textContent', 'Repos');
            toggleClass(intervalDisplayWrapper, 'phase-resting', true);
            toggleClass(intervalDisplayWrapper, 'phase-work', false);
        } else {
            intervalState.currentRound++;
            intervalState.currentPhase = 'work';
            intervalState.currentSeconds = intervalState.workSeconds;
            updateElement(intervalTypeDisplay, 'textContent', 'Travail');
            toggleClass(intervalDisplayWrapper, 'phase-resting', false);
            toggleClass(intervalDisplayWrapper, 'phase-work', true);
        }

        updateIntervalDisplay();
        updateIntervalProgress();

        clearInterval(intervalState.intervalId);
        intervalState.intervalId = setInterval(runInterval, 1000);

        playSound('lap');
    };

    const handleIntervalStartPause = () => {
        if (intervalState.isRunning) {
            pauseInterval();
        } else if (intervalCountdownEnable?.checked && intervalState.currentPhase !== 'finished') {
            startCountdown(3, intervalCountdownDisplay, startInterval);
        } else {
            startInterval();
        }
    };

    // Interval event listeners
    if (savePresetBtn) savePresetBtn.addEventListener('click', savePreset);
    if (loadPresetSelect) loadPresetSelect.addEventListener('change', loadSelectedPreset);
    if (deletePresetBtn) deletePresetBtn.addEventListener('click', deleteSelectedPreset);
    if (intervalStartPauseBtn) intervalStartPauseBtn.addEventListener('click', handleIntervalStartPause);
    if (intervalResetBtn) intervalResetBtn.addEventListener('click', () => resetInterval());
    if (intervalNextBtn) intervalNextBtn.addEventListener('click', nextInterval);

    // ============================================
    // DEVOIR MODE
    // ============================================

    const updateDevoirChronoDisplay = () => {
        if (!devoirChronoDisplay.hr) return;

        const elapsed = devoirChronoState.isRunning
            ? Date.now() - devoirChronoState.startTime
            : devoirChronoState.elapsedTime;

        const time = formatTime(elapsed, false);

        devoirChronoDisplay.hr.textContent = time.hours;
        devoirChronoDisplay.min.textContent = time.minutes;
        devoirChronoDisplay.sec.textContent = time.seconds;
    };

    const startDevoirChrono = () => {
        if (devoirChronoState.isRunning) return;

        devoirChronoState.isRunning = true;
        devoirChronoState.startTime = Date.now() - devoirChronoState.elapsedTime;
        devoirChronoState.intervalId = setInterval(updateDevoirChronoDisplay, 500);

        updateElement(devoirChronoStartPauseBtn, 'innerHTML', '<i class="fas fa-pause" aria-hidden="true"></i><span>Pause</span>');
        toggleClass(devoirChronoStartPauseBtn, 'pause', true);
        setDisabled(devoirChronoResetBtn, false);
        body.classList.add('timer-running');

        playSound('start');
    };

    const pauseDevoirChrono = (silent = false) => {
        if (!devoirChronoState.isRunning) return;

        devoirChronoState.isRunning = false;
        clearInterval(devoirChronoState.intervalId);
        devoirChronoState.elapsedTime = Date.now() - devoirChronoState.startTime;

        updateElement(devoirChronoStartPauseBtn, 'innerHTML', '<i class="fas fa-play" aria-hidden="true"></i><span>Reprendre</span>');
        toggleClass(devoirChronoStartPauseBtn, 'pause', false);
        body.classList.remove('timer-running');

        if (!silent) playSound('tick');
    };

    const resetDevoirChrono = (silent = false) => {
        pauseDevoirChrono(true);

        devoirChronoState.elapsedTime = 0;

        updateDevoirChronoDisplay();

        updateElement(devoirChronoStartPauseBtn, 'innerHTML', '<i class="fas fa-play" aria-hidden="true"></i><span>Démarrer</span>');
        toggleClass(devoirChronoStartPauseBtn, 'pause', false);
        setDisabled(devoirChronoResetBtn, true);

        if (!silent) playSound('tick');
    };

    const updateHeureActuelle = () => {
        if (!heureActuelleDisplay) return;

        const now = new Date();
        const h = pad(now.getHours());
        const m = pad(now.getMinutes());
        const s = pad(now.getSeconds());

        heureActuelleDisplay.innerHTML = `
            <span class="digit">${h}</span>
            <span class="time-separator">:</span>
            <span class="digit">${m}</span>
            <span class="time-separator">:</span>
            <span class="digit">${s}</span>
        `;
    };

    const startHeureActuelleUpdate = () => {
        clearInterval(heureActuelleInterval);
        updateHeureActuelle();
        heureActuelleInterval = setInterval(updateHeureActuelle, 1000);
    };

    // Devoir mode navigation
    devoirModeOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const submode = btn.dataset.submode;
            if (!submode) return;

            // Stop other submode
            if (submode === 'heure') {
                resetDevoirChrono(true);
            } else {
                clearInterval(heureActuelleInterval);
            }

            // Update buttons
            devoirModeOptions.forEach(b => {
                b.classList.toggle('active', b === btn);
                b.setAttribute('aria-selected', b === btn);
            });

            // Update subsections
            devoirSubSections.forEach(s => {
                s.classList.toggle('active-sub-section', s.id === `devoir-${submode}`);
            });

            // Start clock if needed
            if (submode === 'heure') {
                startHeureActuelleUpdate();
            }
        });
    });

    // Devoir event listeners
    if (devoirChronoStartPauseBtn) {
        devoirChronoStartPauseBtn.addEventListener('click', () => {
            devoirChronoState.isRunning ? pauseDevoirChrono() : startDevoirChrono();
        });
    }
    if (devoirChronoResetBtn) {
        devoirChronoResetBtn.addEventListener('click', () => resetDevoirChrono());
    }

    // ============================================
    // POMODORO
    // ============================================

    const pomoCircumference = pomoProgressRing
        ? 2 * Math.PI * (pomoProgressRing.r?.baseVal?.value || 54)
        : 0;

    if (pomoProgressRing) {
        pomoProgressRing.style.strokeDasharray = `${pomoCircumference} ${pomoCircumference}`;
        pomoProgressRing.style.strokeDashoffset = pomoCircumference;
    }

    const updatePomodoroDisplay = () => {
        if (!pomoDisplay.min) return;

        const minutes = Math.floor(pomodoroState.currentSeconds / 60);
        const seconds = pomodoroState.currentSeconds % 60;

        pomoDisplay.min.textContent = pad(minutes);
        pomoDisplay.sec.textContent = pad(seconds);
    };

    const updatePomodoroProgress = () => {
        if (!pomoProgressRing || pomodoroState.totalSeconds <= 0) return;

        const progress = (pomodoroState.totalSeconds - pomodoroState.currentSeconds) / pomodoroState.totalSeconds;
        pomoProgressRing.style.strokeDashoffset = pomoCircumference * (1 - clamp(progress, 0, 1));
    };

    const setPomoTime = (minutes, silent = false) => {
        pausePomodoro(true);

        pomodoroState.totalSeconds = minutes * 60;
        pomodoroState.currentSeconds = pomodoroState.totalSeconds;

        if (minutes === 25) pomodoroState.mode = 'Pomodoro';
        else if (minutes === 5) pomodoroState.mode = 'Pause Courte';
        else if (minutes === 15) pomodoroState.mode = 'Pause Longue';
        else pomodoroState.mode = `${minutes}m`;

        updatePomodoroDisplay();
        updatePomodoroProgress();

        updateElement(pomoStartPauseBtn, 'innerHTML', '<i class="fas fa-play" aria-hidden="true"></i><span>Démarrer</span>');
        toggleClass(pomoStartPauseBtn, 'pause', false);
        setDisabled(pomoStartPauseBtn, false);
        setDisabled(pomoResetBtn, true);
        updateElement(pomoStatus, 'textContent', `${pomodoroState.mode} - Prêt`);

        // Update active button
        pomoOptionBtns.forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.time) === minutes);
        });

        if (!silent) playSound('tick');
    };

    const runPomodoro = () => {
        if (pomodoroState.currentSeconds > 0) {
            pomodoroState.currentSeconds--;
            updatePomodoroDisplay();
            updatePomodoroProgress();
        } else {
            pausePomodoro(true);
            updateElement(pomoStatus, 'textContent', `${pomodoroState.mode} - Terminé ! 🎉`);
            setDisabled(pomoStartPauseBtn, true);
            if (pomoProgressRing) pomoProgressRing.style.strokeDashoffset = 0;
            playSound('stop');
        }
    };

    const startPomodoro = () => {
        if (pomodoroState.isRunning || pomodoroState.currentSeconds <= 0) return;

        pomodoroState.isRunning = true;
        pomodoroState.intervalId = setInterval(runPomodoro, 1000);

        updateElement(pomoStartPauseBtn, 'innerHTML', '<i class="fas fa-pause" aria-hidden="true"></i><span>Pause</span>');
        toggleClass(pomoStartPauseBtn, 'pause', true);
        setDisabled(pomoResetBtn, false);
        updateElement(pomoStatus, 'textContent', `${pomodoroState.mode} - En cours...`);
        body.classList.add('timer-running');

        playSound('start');
    };

    const pausePomodoro = (silent = false) => {
        if (!pomodoroState.isRunning) return;

        pomodoroState.isRunning = false;
        clearInterval(pomodoroState.intervalId);

        updateElement(pomoStartPauseBtn, 'innerHTML', '<i class="fas fa-play" aria-hidden="true"></i><span>Reprendre</span>');
        toggleClass(pomoStartPauseBtn, 'pause', false);

        if (pomodoroState.currentSeconds > 0) {
            updateElement(pomoStatus, 'textContent', `${pomodoroState.mode} - En pause`);
        }

        body.classList.remove('timer-running');

        if (!silent) playSound('tick');
    };

    const resetPomodoro = (silent = false) => {
        pausePomodoro(true);

        pomodoroState.currentSeconds = pomodoroState.totalSeconds;

        updatePomodoroDisplay();
        updatePomodoroProgress();

        updateElement(pomoStartPauseBtn, 'innerHTML', '<i class="fas fa-play" aria-hidden="true"></i><span>Démarrer</span>');
        toggleClass(pomoStartPauseBtn, 'pause', false);
        setDisabled(pomoStartPauseBtn, false);
        setDisabled(pomoResetBtn, true);
        updateElement(pomoStatus, 'textContent', `${pomodoroState.mode} - Prêt`);

        if (!silent) playSound('tick');
    };

    // Pomodoro event listeners
    pomoOptionBtns.forEach(btn => {
        btn.addEventListener('click', () => setPomoTime(parseInt(btn.dataset.time)));
    });

    if (pomoStartPauseBtn) {
        pomoStartPauseBtn.addEventListener('click', () => {
            pomodoroState.isRunning ? pausePomodoro() : startPomodoro();
        });
    }
    if (pomoResetBtn) {
        pomoResetBtn.addEventListener('click', () => resetPomodoro());
    }

    // ============================================
    // CUSTOM TIMER
    // ============================================

    const customCircumference = customProgressRing
        ? 2 * Math.PI * (customProgressRing.r?.baseVal?.value || 54)
        : 0;

    if (customProgressRing) {
        customProgressRing.style.strokeDasharray = `${customCircumference} ${customCircumference}`;
        customProgressRing.style.strokeDashoffset = customCircumference;
    }

    const updateCustomTimerDisplay = () => {
        if (!customDisplay.hr) return;

        const hours = Math.floor(customTimerState.currentSeconds / 3600);
        const minutes = Math.floor((customTimerState.currentSeconds % 3600) / 60);
        const seconds = customTimerState.currentSeconds % 60;

        customDisplay.hr.textContent = pad(hours);
        customDisplay.min.textContent = pad(minutes);
        customDisplay.sec.textContent = pad(seconds);
    };

    const updateCustomTimerProgress = () => {
        if (!customProgressRing) return;

        if (customTimerState.totalSeconds <= 0) {
            customProgressRing.style.strokeDashoffset = customCircumference;
            return;
        }

        const progress = (customTimerState.totalSeconds - customTimerState.currentSeconds) / customTimerState.totalSeconds;
        customProgressRing.style.strokeDashoffset = customCircumference * (1 - clamp(progress, 0, 1));
    };

    const setCustomTimer = () => {
        pauseCustomTimer(true);

        const h = parseInt(customInputs.h?.value) || 0;
        const m = clamp(parseInt(customInputs.m?.value) || 0, 0, 59);
        const s = clamp(parseInt(customInputs.s?.value) || 0, 0, 59);

        if (customInputs.m) customInputs.m.value = m;
        if (customInputs.s) customInputs.s.value = s;

        customTimerState.totalSeconds = h * 3600 + m * 60 + s;

        if (customTimerState.totalSeconds <= 0) {
            customTimerState.isSet = false;
            customTimerState.currentSeconds = 0;
            updateElement(customStatus, 'textContent', 'Durée invalide.');
        } else {
            customTimerState.isSet = true;
            customTimerState.currentSeconds = customTimerState.totalSeconds;
            updateElement(customStatus, 'textContent', 'Minuteur prêt.');
        }

        updateCustomTimerDisplay();
        updateCustomTimerProgress();

        const isValid = customTimerState.isSet && customTimerState.totalSeconds > 0;
        setDisabled(customStartPauseBtn, !isValid);
        setDisabled(customResetBtn, !isValid);

        playSound('tick');
    };

    const runCustomTimer = () => {
        if (customTimerState.currentSeconds > 0) {
            customTimerState.currentSeconds--;
            updateCustomTimerDisplay();
            updateCustomTimerProgress();
        } else {
            pauseCustomTimer(true);
            updateElement(customStatus, 'textContent', 'Minuteur terminé ! 🎉');
            setDisabled(customStartPauseBtn, true);
            if (customProgressRing) customProgressRing.style.strokeDashoffset = 0;
            playSound('stop');
        }
    };

    const startCustomTimer = () => {
        if (customTimerState.isRunning || !customTimerState.isSet || customTimerState.currentSeconds <= 0) return;

        customTimerState.isRunning = true;
        customTimerState.intervalId = setInterval(runCustomTimer, 1000);

        updateElement(customStartPauseBtn, 'innerHTML', '<i class="fas fa-pause" aria-hidden="true"></i><span>Pause</span>');
        toggleClass(customStartPauseBtn, 'pause', true);
        setDisabled(customResetBtn, false);
        updateElement(customStatus, 'textContent', 'Minuteur en cours...');
        body.classList.add('timer-running');

        playSound('start');
    };

    const pauseCustomTimer = (silent = false) => {
        if (!customTimerState.isRunning) return;

        customTimerState.isRunning = false;
        clearInterval(customTimerState.intervalId);

        updateElement(customStartPauseBtn, 'innerHTML', '<i class="fas fa-play" aria-hidden="true"></i><span>Reprendre</span>');
        toggleClass(customStartPauseBtn, 'pause', false);

        if (customTimerState.currentSeconds > 0) {
            updateElement(customStatus, 'textContent', 'Minuteur en pause');
        }

        body.classList.remove('timer-running');

        if (!silent) playSound('tick');
    };

    const resetCustomTimer = (silent = false) => {
        pauseCustomTimer(true);
        clearInterval(countdownInterval);
        toggleClass(customCountdownDisplay, 'visible', false);

        customTimerState.currentSeconds = customTimerState.totalSeconds;

        updateCustomTimerDisplay();
        updateCustomTimerProgress();

        updateElement(customStartPauseBtn, 'innerHTML', '<i class="fas fa-play" aria-hidden="true"></i><span>Démarrer</span>');
        toggleClass(customStartPauseBtn, 'pause', false);

        const isValid = customTimerState.isSet && customTimerState.totalSeconds > 0;
        setDisabled(customStartPauseBtn, !isValid);
        setDisabled(customResetBtn, !isValid);
        updateElement(customStatus, 'textContent', isValid ? 'Minuteur prêt.' : 'Définir une durée.');

        if (!silent) playSound('tick');
    };

    const handleCustomTimerStartPause = () => {
        if (customTimerState.isRunning) {
            pauseCustomTimer();
        } else if (customCountdownEnable?.checked && customTimerState.isSet && customTimerState.currentSeconds > 0) {
            startCountdown(3, customCountdownDisplay, startCustomTimer);
        } else {
            startCustomTimer();
        }
    };

    // Custom timer event listeners
    if (customSetBtn) customSetBtn.addEventListener('click', setCustomTimer);

    Object.values(customInputs).forEach(input => {
        if (input) {
            input.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') setCustomTimer();
            });
        }
    });

    if (customStartPauseBtn) customStartPauseBtn.addEventListener('click', handleCustomTimerStartPause);
    if (customResetBtn) customResetBtn.addEventListener('click', () => resetCustomTimer());

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================

    document.addEventListener('keyup', (e) => {
        // Ignore if typing in input
        if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.altKey || e.ctrlKey || e.metaKey) return;

        // Close guides with Escape
        if (e.key === 'Escape') {
            $$('.section-guide.active').forEach(g => g.classList.remove('active'));
            return;
        }

        // Theme toggle
        if (e.key === 't' || e.key === 'T') {
            if (themeToggle) themeToggle.click();
            return;
        }

        // Large display toggle
        if (e.key === 'g' || e.key === 'G') {
            toggleLargeDisplay();
            return;
        }

        // Mode-specific shortcuts
        const activeSection = $('.timer-section.active-section');
        if (!activeSection) return;

        switch (activeSection.id) {
            case 'stopwatch-section':
                if (e.code === 'Space') {
                    e.preventDefault();
                    handleStopwatchStartPause();
                } else if (e.key === 'l' || e.key === 'L') {
                    if (!swLapBtn?.disabled) recordLap();
                } else if (e.key === 'r' || e.key === 'R') {
                    if (!swResetBtn?.disabled) resetStopwatch();
                } else if (e.key === 'c' || e.key === 'C') {
                    if (!swClearLapsBtn?.disabled) clearLaps();
                }
                break;

            case 'interval-section':
                if (e.code === 'Space') {
                    e.preventDefault();
                    handleIntervalStartPause();
                } else if (e.key === 'r' || e.key === 'R') {
                    if (!intervalResetBtn?.disabled) resetInterval();
                } else if (e.key === 'n' || e.key === 'N' || e.key === 'ArrowRight') {
                    if (!intervalNextBtn?.disabled) nextInterval();
                }
                break;

            case 'devoir-section':
                const activeSub = activeSection.querySelector('.devoir-sub-section.active-sub-section');
                if (activeSub?.id === 'devoir-chrono') {
                    if (e.code === 'Space') {
                        e.preventDefault();
                        devoirChronoState.isRunning ? pauseDevoirChrono() : startDevoirChrono();
                    } else if (e.key === 'r' || e.key === 'R') {
                        if (!devoirChronoResetBtn?.disabled) resetDevoirChrono();
                    }
                }
                break;

            case 'pomodoro-section':
                if (e.code === 'Space') {
                    e.preventDefault();
                    if (!pomoStartPauseBtn?.disabled) {
                        pomodoroState.isRunning ? pausePomodoro() : startPomodoro();
                    }
                } else if (e.key === 'r' || e.key === 'R') {
                    if (!pomoResetBtn?.disabled) resetPomodoro();
                } else if (e.key >= '1' && e.key <= '3') {
                    const btn = pomoOptionBtns[parseInt(e.key) - 1];
                    if (btn) btn.click();
                }
                break;

            case 'custom-section':
                if (e.code === 'Space') {
                    e.preventDefault();
                    if (!customStartPauseBtn?.disabled) handleCustomTimerStartPause();
                } else if (e.key === 'r' || e.key === 'R') {
                    if (!customResetBtn?.disabled) resetCustomTimer();
                } else if (e.key === 'Enter') {
                    setCustomTimer();
                }
                break;
        }
    });

    // ============================================
    // INITIALIZATION
    // ============================================

    const init = () => {
        console.log('Chrono EPS Pro+ v3.0 - Initializing...');

        // Update year
        if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

        // Init theme
        initTheme();

        // Load presets
        loadPresets();

        // Init displays
        updateStopwatchDisplay();
        renderLaps();
        calculateLapStats();

        setupIntervalTimer();
        updateIntervalDisplay();
        updateIntervalProgress();

        updateDevoirChronoDisplay();

        setPomoTime(25, true);

        updateCustomTimerDisplay();
        updateCustomTimerProgress();

        // Set initial states
        toggleClass(lapsContainer, 'empty', true);

        // Start slogan animation
        startSloganAnimation();

        console.log('Chrono EPS Pro+ v3.0 - Ready!');
    };

    init();
});