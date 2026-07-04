// Forbidden Notebook - Core Application Controller

document.addEventListener('DOMContentLoaded', () => {
  // --- APPLICATION STATE ---
  const state = {
    isForbiddenMode: false,
    isNotebookOpen: false,
    isLightTheme: false,
    activeMenuTab: 'diary',
    activeNotebookPage: 'entries', // 'entries', 'write', 'lore', 'rituals'
    selectedLoreIndex: 0,
    skullClicks: 0,
    clockInterval: null,
    glitchInterval: null,
    cameraBreathingInterval: null,
    spookyInterval: null,
    
    // Mouse coordinates for particle vortex attraction
    mouseX: -999,
    mouseY: -999,

    // Music tracks state (6 Tracks)
    currentTrackIndex: 0,
    isMusicPlaying: true,
    isMusicMuted: false,
    tracks: [
      { name: "Track 1: Lo-Fi Study Chill", audioType: 'lofi-1' },
      { name: "Track 2: Rainy Night Beats", audioType: 'lofi-2' },
      { name: "Track 3: Gothic Cathedral Choir", audioType: 'gothic' },
      { name: "Track 4: Soft Ethereal Piano", audioType: 'piano' },
      { name: "Track 5: Midnight Jazz Vibes", audioType: 'jazz' },
      { name: "Track 6: Haunted Music Box", audioType: 'musicbox' }
    ],

    // Sliders & Customizer configs
    config: {
      darkIntensity: 0.8,
      rainVolume: 0.4,
      thunderFrequency: 0.5,
      notebookGlow: 0.5,
      inkGlow: 0.5,
      particleDensity: 0.5,
      candleBrightness: 0.5,
      shadowMovement: 0.5,
      ambientMusicVolume: 0.4,
      animationSpeed: 1.0,
      paperAging: 0.5,
      featherDensity: 0.5,
      fogDensity: 0.5,
      windowRainIntensity: 0.5
    },

    // Hardcoded initial diary entries
    diaryEntries: [
      { date: "Yesterday", title: "A Quiet Evening", body: "The sound of rain outside has been continuous. I stayed at my desk, sketching out the initial outlines for the new design. There is a strange comfort in the dark wood and the soft tick of the clock." },
      { date: "3 Days Ago", title: "Overthinking Again", body: "Spent hours staring at the blinking cursor. Decided to leave a small notepad note: 'Don't overthink it.' It is sound advice, if only I could follow it myself. Coffee helped, though it went cold too fast." }
    ],
    // Forbidden mode written entries
    occultEntries: []
  };

  // --- HTML ELEMENTS ---
  const el = {
    body: document.body,
    cinematicContainer: document.querySelector('.cinematic-container'),
    skull: document.getElementById('skull-trigger'),
    skullEyes: document.querySelector('.skull-eyes'),
    deskSurface: document.querySelector('.desk-surface'),
    monitorScreen: document.querySelector('.monitor-screen'),
    monitorContentNormal: document.querySelector('.monitor-content-normal'),
    monitorContentForbidden: document.querySelector('.monitor-content-forbidden'),
    
    // Theme Switcher & Talisman
    themeToggle: document.getElementById('theme-toggle'),
    themeSunIcon: document.querySelector('.theme-sun-icon'),
    themeMoonIcon: document.querySelector('.theme-moon-icon'),
    purifyTalismanBtn: document.getElementById('purify-talisman-btn'),
    spookyShadow: document.getElementById('spooky-shadow'),

    // Lantern / Lamp
    candleFlame: document.querySelector('.candle-flame'),
    lampBulbGlow: document.querySelector('.lamp-bulb-glow'),
    
    // Clock
    monitorTime: document.getElementById('monitor-time'),
    monitorDate: document.getElementById('monitor-date'),

    // Notebook elements
    diaryBookWrapper: document.getElementById('diary-book-wrapper'),
    notebookOverlay: document.getElementById('notebook-overlay'),
    notebookContainer: document.querySelector('.notebook-container'),
    notebookLeftPage: document.getElementById('notebook-left-page'),
    notebookRightPage: document.getElementById('notebook-right-page'),
    notebookCloseBtn: document.getElementById('notebook-close-btn'),
    
    // Actions / Music Widgets
    diaryActions: document.getElementById('diary-actions'),
    musicPlayerWidget: document.getElementById('music-player-widget'),
    currentTrackName: document.getElementById('current-track-name'),
    musicPrevBtn: document.getElementById('music-prev-btn'),
    musicToggleBtn: document.getElementById('music-toggle-btn'),
    musicNextBtn: document.getElementById('music-next-btn'),
    musicMuteBtn: document.getElementById('music-mute-btn'),
    musicVolSlider: document.getElementById('music-vol-slider'),

    // Buttons
    btnOpenDiary: document.getElementById('btn-open-diary'),
    btnNewEntry: document.getElementById('btn-new-entry'),
    settingsPanel: document.getElementById('settings-panel'),
    settingsCloseBtn: document.getElementById('settings-close-btn'),
    
    // Bottom mystery
    mysteryBanner: document.getElementById('mystery-banner'),
    
    // Canvases
    rainCanvas: document.getElementById('window-rain-canvas'),
    particlesCanvas: document.getElementById('room-particles-canvas'),
    writingParticlesCanvas: document.getElementById('writing-particles-canvas'),
    
    // Ritual Cinematic magic overlay
    ritualOverlay: document.getElementById('ritual-cinematic-overlay'),
    ritualChantTitle: document.getElementById('ritual-chant-title'),
    ritualChantCountdown: document.getElementById('ritual-chant-countdown'),
    
    // Ending Overlay
    endingOverlay: document.getElementById('ending-overlay'),
    endingTitle: document.getElementById('ending-title'),
    endingDesc: document.getElementById('ending-desc'),
    endingCloseBtn: document.getElementById('ending-close-btn')
  };

  // --- CANVAS CONTEXTS & CONFIGS ---
  const rainCtx = el.rainCanvas.getContext('2d');
  const particlesCtx = el.particlesCanvas.getContext('2d');
  const writingParticlesCtx = el.writingParticlesCanvas.getContext('2d');
  
  let windowRainArray = [];
  let roomParticlesArray = [];
  let writingParticlesArray = [];
  let lightningTimer = 0;

  // --- 1. INITIALIZATION ---
  function initApp() {
    setupEventListeners();
    startClock();
    startCameraBreathing();
    resizeCanvases();
    
    // Start ambient animations
    requestAnimationFrame(animationLoop);
    
    // Start normal audio on first click
    document.addEventListener('click', () => {
      if (window.AudioEngine && !window.AudioEngine.isInitialized) {
        window.AudioEngine.startNormalAmbient();
      }
    }, { once: true });
    
    renderEntriesList();
    applySlidersToCSS(); // Apply initial configurations
    
    console.log("Living Desk Virtual Diary initialized successfully.");
  }

  // Handle window resizing
  function resizeCanvases() {
    const rect = el.deskSurface.getBoundingClientRect();
    
    const winFrame = document.querySelector('.window-frame');
    if (winFrame) {
      const winRect = winFrame.getBoundingClientRect();
      el.rainCanvas.width = winRect.width;
      el.rainCanvas.height = winRect.height;
    }

    el.particlesCanvas.width = rect.width;
    el.particlesCanvas.height = rect.height;

    el.writingParticlesCanvas.width = window.innerWidth;
    el.writingParticlesCanvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', () => {
    resizeCanvases();
    initParticles();
  });

  // --- 2. CLOCK & CAMERA BREATHING ---
  function startClock() {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      
      if (el.monitorTime) el.monitorTime.textContent = `${hrs}:${mins}`;
      
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      if (el.monitorDate) el.monitorDate.textContent = now.toLocaleDateString('en-US', options);
    };
    
    updateTime();
    state.clockInterval = setInterval(updateTime, 60000);
  }

  function startCameraBreathing() {
    let angle = 0;
    const speed = 0.005;
    
    state.cameraBreathingInterval = setInterval(() => {
      if (state.isForbiddenMode) {
        angle += speed * 1.5;
        const scale = 1.008 + Math.sin(angle) * 0.008;
        const x = Math.cos(angle * 1.2) * 1.8;
        const y = Math.sin(angle * 0.8) * 1.2;
        el.cinematicContainer.style.setProperty('--camera-scale', scale);
        el.cinematicContainer.style.setProperty('--camera-x', `${x}px`);
        el.cinematicContainer.style.setProperty('--camera-y', `${y}px`);
      } else {
        angle += speed;
        const scale = 1.003 + Math.sin(angle) * 0.003;
        const x = Math.cos(angle * 0.8) * 0.8;
        const y = Math.sin(angle * 0.5) * 0.5;
        el.cinematicContainer.style.setProperty('--camera-scale', scale);
        el.cinematicContainer.style.setProperty('--camera-x', `${x}px`);
        el.cinematicContainer.style.setProperty('--camera-y', `${y}px`);
      }
    }, 30);
  }

  // --- 3. EVENT LISTENERS ---
  function setupEventListeners() {
    el.skull.addEventListener('click', handleSkullClick);

    el.diaryBookWrapper.addEventListener('click', () => openNotebook());
    el.btnOpenDiary.addEventListener('click', () => openNotebook('entries'));
    el.btnNewEntry.addEventListener('click', () => openNotebook('write'));
    
    const btnWriteNow = document.getElementById('btn-write-now');
    if (btnWriteNow) {
      btnWriteNow.addEventListener('click', (e) => {
        e.preventDefault();
        openNotebook('write');
      });
    }
    
    el.notebookCloseBtn.addEventListener('click', closeNotebook);
    
    el.notebookOverlay.addEventListener('click', (e) => {
      if (e.target === el.notebookOverlay) closeNotebook();
    });

    document.querySelectorAll('nav a, .bottom-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        if (tab) {
          e.preventDefault();
          if (window.AudioEngine) window.AudioEngine.triggerPageTurn();

          if (tab === 'settings') {
            toggleSettingsPanel();
          } else {
            switchMenuTab(tab);
          }
        }
      });
    });

    el.settingsCloseBtn.addEventListener('click', toggleSettingsPanel);
    setupMusicControls();
    el.themeToggle.addEventListener('click', handleThemeToggle);
    el.purifyTalismanBtn.addEventListener('click', exitForbiddenMode);
    
    setupSettingsSliders();
    setupCollectibleRelics();

    // Mouse movement listener on desk surface for particle vortex
    el.deskSurface.addEventListener('mousemove', (e) => {
      const rect = el.deskSurface.getBoundingClientRect();
      state.mouseX = e.clientX - rect.left;
      state.mouseY = e.clientY - rect.top;
    });

    el.deskSurface.addEventListener('mouseleave', () => {
      state.mouseX = -999;
      state.mouseY = -999;
    });

    el.endingCloseBtn.addEventListener('click', () => {
      el.endingOverlay.classList.remove('visible');
      exitForbiddenMode();
    });
  }

  // --- 4. MORNING / NIGHT / REALITY TOGGLE ---
  function handleThemeToggle() {
    if (state.isForbiddenMode) {
      exitForbiddenMode();
    } else {
      state.isLightTheme = !state.isLightTheme;
      if (state.isLightTheme) {
        el.body.classList.add('light-theme');
        el.themeSunIcon.style.display = 'block';
        el.themeMoonIcon.style.display = 'none';
      } else {
        el.body.classList.remove('light-theme');
        el.themeSunIcon.style.display = 'none';
        el.themeMoonIcon.style.display = 'block';
      }
      if (window.AudioEngine) window.AudioEngine.triggerPageTurn();
    }
  }

  // --- 5. MUSIC CONTROLS PLAYER ---
  function setupMusicControls() {
    el.musicToggleBtn.addEventListener('click', () => {
      state.isMusicPlaying = !state.isMusicPlaying;
      el.musicToggleBtn.textContent = state.isMusicPlaying ? '⏸' : '▶';
      
      if (window.AudioEngine) {
        if (state.isMusicPlaying) {
          window.AudioEngine.setVolume('radio', state.config.ambientMusicVolume);
          window.AudioEngine.setVolume('choir', state.config.ambientMusicVolume);
        } else {
          window.AudioEngine.setVolume('radio', 0);
          window.AudioEngine.setVolume('choir', 0);
        }
      }
    });

    el.musicMuteBtn.addEventListener('click', () => {
      state.isMusicMuted = !state.isMusicMuted;
      el.musicMuteBtn.textContent = state.isMusicMuted ? '🔇' : '🔊';
      
      if (window.AudioEngine) {
        window.AudioEngine.setVolume('master', state.isMusicMuted ? 0 : state.config.ambientMusicVolume * 2);
      }
    });

    el.musicVolSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.config.ambientMusicVolume = val;
      
      if (window.AudioEngine && !state.isMusicMuted) {
        window.AudioEngine.setVolume('radio', val);
        window.AudioEngine.setVolume('choir', val);
      }
    });

    el.musicNextBtn.addEventListener('click', () => {
      state.currentTrackIndex = (state.currentTrackIndex + 1) % state.tracks.length;
      el.currentTrackName.textContent = state.tracks[state.currentTrackIndex].name;
      
      if (window.AudioEngine) {
        window.AudioEngine.changeTrack(state.tracks[state.currentTrackIndex].audioType);
      }
    });

    el.musicPrevBtn.addEventListener('click', () => {
      state.currentTrackIndex = (state.currentTrackIndex - 1 + state.tracks.length) % state.tracks.length;
      el.currentTrackName.textContent = state.tracks[state.currentTrackIndex].name;
      
      if (window.AudioEngine) {
        window.AudioEngine.changeTrack(state.tracks[state.currentTrackIndex].audioType);
      }
    });
  }

  // --- 6. HIDDEN SKULL SEQUENCER ---
  function handleSkullClick() {
    state.skullClicks++;
    console.log(`Skull clicked: ${state.skullClicks}/3`);

    if (state.skullClicks === 1) {
      el.skull.style.transform = 'rotate(45deg)';
      if (window.AudioEngine) {
        window.AudioEngine.triggerWrite(); 
      }
    } else if (state.skullClicks === 2) {
      el.skull.style.transform = 'rotate(-30deg)';
      el.skullEyes.classList.add('glow');
      
      if (window.AudioEngine) {
        window.AudioEngine.triggerWhisper(); 
      }
      setTimeout(() => el.skullEyes.classList.remove('glow'), 1200);
    } else if (state.skullClicks === 3) {
      el.skull.style.transform = 'rotate(0deg)';
      state.skullClicks = 0; 
      triggerHiddenActivation();
    }
  }

  // --- 7. CINEMATIC HIDDEN ACTIVATION ---
  function triggerHiddenActivation() {
    if (state.isForbiddenMode) return;
    
    console.log("Initiating Forbidden Mode Activation sequence...");
    el.body.classList.add('cursor-hidden'); 
    
    document.querySelectorAll('.steam-path, .candle-flame, nav a, .bottom-card').forEach(item => {
      item.style.animationPlayState = 'paused';
    });

    if (state.clockInterval) {
      clearInterval(state.clockInterval);
      state.clockInterval = null;
    }

    if (window.AudioEngine) {
      window.AudioEngine.stopNormalAmbient();
      window.AudioEngine.triggerBassDrop();
    }

    setTimeout(() => {
      state.isForbiddenMode = true;
      el.body.classList.add('forbidden-mode');
      
      document.querySelectorAll('.steam-path, .candle-flame').forEach(item => {
        item.style.animationPlayState = 'running';
      });

      const lampSvg = document.querySelector('.lamp-svg');
      if (lampSvg) {
        lampSvg.classList.add('lamp-flicker');
        setTimeout(() => lampSvg.classList.remove('lamp-flicker'), 1500);
      }

      setTimeout(() => {
        el.body.classList.remove('cursor-hidden');
      }, 4000);

      if (window.AudioEngine) {
        window.AudioEngine.startForbiddenAmbient();
      }

      if (window.RitualSystem) {
        window.RitualSystem.unlockAchievement('curious');
        window.RitualSystem.startTimer();
      }

      initParticles();
      updateMonitorDisplay();
      setupRunicScanlines();
      startSpookyIntervals(); // Haunted event timers
      triggerLightningFlash();

    }, 1200);
  }

  // --- 8. EXIT FORBIDDEN MODE ---
  function exitForbiddenMode() {
    if (!state.isForbiddenMode) return;
    console.log("Restoring Normal Mode...");

    state.isForbiddenMode = false;
    el.body.classList.remove('forbidden-mode');
    
    if (window.AudioEngine) {
      window.AudioEngine.stopForbiddenAmbient();
      window.AudioEngine.startNormalAmbient();
    }

    if (window.RitualSystem) {
      window.RitualSystem.stopTimer();
    }

    startClock();
    initParticles();
    stopSpookyIntervals();
    
    if (state.glitchInterval) {
      clearInterval(state.glitchInterval);
      state.glitchInterval = null;
    }
  }

  // --- 9. HAUNTED / SPOOKY EVENTS TIMERS ---
  function startSpookyIntervals() {
    if (state.spookyInterval) clearInterval(state.spookyInterval);
    
    state.spookyInterval = setInterval(() => {
      if (!state.isForbiddenMode) return;
      
      const rand = Math.random();
      
      // 1. Spooky shadow figure creep in window (35% chance)
      if (rand < 0.35) {
        console.log("Haunted shadows manifest...");
        el.spookyShadow.classList.add('active');
        setTimeout(() => el.spookyShadow.classList.remove('active'), 3200);
      }
      
      // 2. Glitch warning text on monitor (30% chance)
      if (rand >= 0.35 && rand < 0.65) {
        const warningTexts = ["THE SHADOW WATCHES", "HE IS CLOSE", "AETHELGARD DEMANDS COVENANT", "DO NOT LOOK BEHIND"];
        const chosen = warningTexts[Math.floor(Math.random() * warningTexts.length)];
        
        const monitorBottom = el.monitorContentForbidden.querySelector('.current-ritual-name');
        if (monitorBottom) {
          const original = monitorBottom.textContent;
          monitorBottom.textContent = chosen;
          monitorBottom.style.color = '#ff0000';
          
          el.monitorScreen.classList.add('glitch-active');
          setTimeout(() => {
            monitorBottom.textContent = original;
            monitorBottom.style.color = 'var(--accent-gold)';
            el.monitorScreen.classList.remove('glitch-active');
          }, 2500);
        }
      }
    }, 12000); // Check for haunting events every 12 seconds
  }

  function stopSpookyIntervals() {
    if (state.spookyInterval) {
      clearInterval(state.spookyInterval);
      state.spookyInterval = null;
    }
    if (el.spookyShadow) {
      el.spookyShadow.classList.remove('active');
    }
  }

  // --- 10. PARTICLE PHYSICS ENGINE ---
  function initParticles() {
    windowRainArray = [];
    roomParticlesArray = [];
    
    const densityMult = state.config.particleDensity;

    // Window Rain drops
    const rainCount = state.isForbiddenMode ? 120 * densityMult : 40;
    for (let i = 0; i < rainCount; i++) {
      windowRainArray.push({
        x: Math.random() * el.rainCanvas.width,
        y: Math.random() * el.rainCanvas.height - el.rainCanvas.height,
        speed: (state.isForbiddenMode ? 4 : 1.5) + Math.random() * 3,
        length: (state.isForbiddenMode ? 15 : 6) + Math.random() * 10,
        opacity: Math.random() * 0.4 + 0.1,
        wind: state.isForbiddenMode ? -1.5 : 0
      });
    }

    // Room Particles
    const particleCount = (state.isForbiddenMode ? 80 : 35) * densityMult;
    for (let i = 0; i < particleCount; i++) {
      const isFeather = state.isForbiddenMode && Math.random() < 0.25;
      roomParticlesArray.push({
        x: Math.random() * el.particlesCanvas.width,
        y: Math.random() * el.particlesCanvas.height,
        size: isFeather ? 8 + Math.random() * 12 : 1 + Math.random() * 3,
        speedX: (Math.random() * 2 - 1) * (state.isForbiddenMode ? 0.3 : 0.15),
        speedY: (state.isForbiddenMode ? 0.6 : 0.2) + Math.random() * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() * 2 - 1) * 0.01,
        isFeather: isFeather
      });
    }
  }

  function animationLoop() {
    drawRain();
    drawRoomParticles();
    drawWritingParticles();
    
    if (state.isForbiddenMode) {
      lightningTimer += Math.random() * 0.1;
      const freq = state.config.thunderFrequency;
      if (lightningTimer > 150 / (freq + 0.1) && Math.random() < 0.008) {
        triggerLightningFlash();
        lightningTimer = 0;
      }
    }

    requestAnimationFrame(animationLoop);
  }

  function drawRain() {
    rainCtx.clearRect(0, 0, el.rainCanvas.width, el.rainCanvas.height);
    rainCtx.strokeStyle = state.isForbiddenMode ? 'rgba(174, 186, 212, 0.4)' : (state.isLightTheme ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.2)');
    rainCtx.lineWidth = state.isForbiddenMode ? 2.0 : 1.2;
    
    windowRainArray.forEach(p => {
      rainCtx.beginPath();
      rainCtx.moveTo(p.x, p.y);
      rainCtx.lineTo(p.x + p.wind, p.y + p.length);
      rainCtx.stroke();
      
      p.y += p.speed;
      p.x += p.wind;
      
      if (p.y > el.rainCanvas.height) {
        p.y = -10;
        p.x = Math.random() * el.rainCanvas.width;
      }
    });
  }

  // Draw room particles + VORTEX ATTRACTION IN FORBIDDEN MODE
  function drawRoomParticles() {
    particlesCtx.clearRect(0, 0, el.particlesCanvas.width, el.particlesCanvas.height);
    
    roomParticlesArray.forEach(p => {
      particlesCtx.fillStyle = state.isForbiddenMode ? `rgba(10, 5, 5, ${p.opacity})` : (state.isLightTheme ? `rgba(116, 88, 60, ${p.opacity})` : `rgba(217, 119, 6, ${p.opacity})`);
      
      // Particle Vortex attraction to mouse coordinates
      if (state.isForbiddenMode && state.mouseX !== -999 && state.mouseY !== -999) {
        const dx = state.mouseX - p.x;
        const dy = state.mouseY - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          // Pull particle gently towards cursor
          p.x += (dx / dist) * 0.9;
          p.y += (dy / dist) * 0.9;
        }
      }

      if (p.isFeather) {
        particlesCtx.save();
        particlesCtx.translate(p.x, p.y);
        particlesCtx.rotate(p.angle);
        
        particlesCtx.beginPath();
        particlesCtx.moveTo(0, -p.size/2);
        particlesCtx.quadraticCurveTo(p.size/4, 0, 0, p.size/2);
        particlesCtx.moveTo(0, -p.size/2);
        particlesCtx.lineTo(-p.size/3, -p.size/4);
        particlesCtx.lineTo(0, 0);
        particlesCtx.lineTo(-p.size/3, p.size/4);
        
        particlesCtx.strokeStyle = `rgba(0, 0, 0, ${p.opacity * 1.5})`;
        particlesCtx.lineWidth = 2;
        particlesCtx.stroke();
        
        particlesCtx.restore();
      } else {
        particlesCtx.beginPath();
        particlesCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        particlesCtx.fill();
        particlesCtx.strokeStyle = '#000000';
        particlesCtx.lineWidth = 1;
        particlesCtx.stroke();
      }
      
      p.x += p.speedX;
      p.y += p.speedY;
      p.angle += p.spin;
      
      if (p.y > el.particlesCanvas.height) {
        p.y = -10;
        p.x = Math.random() * el.particlesCanvas.width;
      }
    });
  }

  function drawWritingParticles() {
    writingParticlesCtx.clearRect(0, 0, el.writingParticlesCanvas.width, el.writingParticlesCanvas.height);
    
    writingParticlesArray.forEach((p, idx) => {
      writingParticlesCtx.fillStyle = p.color;
      writingParticlesCtx.beginPath();
      writingParticlesCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      writingParticlesCtx.fill();
      
      p.y -= p.speedY;
      p.x += Math.sin(p.y * 0.05) * 0.4;
      p.opacity -= 0.01;
      p.size = Math.max(0.1, p.size - 0.02);
      
      const rgb = p.color.match(/\d+/g);
      if (rgb) {
        p.color = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${p.opacity})`;
      }

      if (p.opacity <= 0) {
        writingParticlesArray.splice(idx, 1);
      }
    });
  }

  function spawnWritingParticle(x, y) {
    const isCrimson = state.config.notebookTheme === 'crimson-eclipse' || state.config.notebookTheme === 'ancient-ritual';
    const color = isCrimson 
      ? `rgba(139, 0, 0, 0.8)`
      : `rgba(0, 139, 139, 0.8)`;

    writingParticlesArray.push({
      x: x + (Math.random() * 20 - 10),
      y: y + (Math.random() * 10 - 5),
      size: 2.0 + Math.random() * 3.0,
      speedY: 0.6 + Math.random() * 0.9,
      opacity: 0.9,
      color: color
    });
  }

  // --- 11. LIGHTNING FLASH TRIGGER ---
  function triggerLightningFlash() {
    if (!state.isForbiddenMode) return;
    
    const winFrame = document.querySelector('.window-frame');
    if (winFrame) {
      winFrame.style.backgroundColor = '#fff';
      setTimeout(() => {
        winFrame.style.backgroundColor = 'var(--window-bg)';
        // Randomly trigger spooky shadow silhouette exactly with lighting!
        if (Math.random() < 0.65) {
          el.spookyShadow.classList.add('active');
          setTimeout(() => el.spookyShadow.classList.remove('active'), 2500);
        }
        setTimeout(() => {
          winFrame.style.backgroundColor = '#fff';
          setTimeout(() => winFrame.style.backgroundColor = 'var(--window-bg)', 50);
        }, 150);
      }, 80);
    }

    el.cinematicContainer.classList.add('camera-shake');
    setTimeout(() => el.cinematicContainer.classList.remove('camera-shake'), 600);

    if (window.AudioEngine) {
      window.AudioEngine.triggerThunder();
    }
  }

  // --- 12. MONITOR RENDERING & SCANLINES ---
  function setupRunicScanlines() {
    if (state.glitchInterval) clearInterval(state.glitchInterval);
    
    state.glitchInterval = setInterval(() => {
      if (state.isForbiddenMode && Math.random() < 0.25) {
        el.monitorScreen.classList.add('glitch-active');
        setTimeout(() => el.monitorScreen.classList.remove('glitch-active'), 250);
      }
    }, 6000);
  }

  function updateMonitorDisplay() {
    if (!window.RitualSystem) return;
    
    const rit = window.RitualSystem;
    
    const relicsHTML = Object.keys(rit.relics).map(id => {
      const found = rit.collectedRelics.has(id);
      return `
        <li style="color: ${found ? 'var(--accent-gold)' : '#555'}; font-weight: bold;">
          ${found ? '✔' : '❔'} ${rit.relics[id].name}
        </li>
      `;
    }).join('');

    const achievementsHTML = Array.from(rit.unlockedAchievements).map(id => {
      return `<li style="font-weight: bold;">✦ ${rit.achievements[id].name}</li>`;
    }).join('');
    
    if (achievementsHTML.length === 0) {
      el.monitorContentForbidden.querySelector('.achievements-list').innerHTML = "<li>No secrets unlocked</li>";
    } else {
      el.monitorContentForbidden.querySelector('.achievements-list').innerHTML = achievementsHTML;
    }
    
    el.monitorContentForbidden.querySelector('.relics-list').innerHTML = relicsHTML;
    
    const activeRitualText = rit.activeRitual ? rit.rituals[rit.activeRitual].name : 'None';
    el.monitorContentForbidden.querySelector('.current-ritual-name').textContent = activeRitualText;
    
    const ritualCountText = `${rit.completedRituals.size}/${Object.keys(rit.rituals).length}`;
    el.monitorContentForbidden.querySelector('.rituals-completed-count').textContent = ritualCountText;
    
    const streakCard = document.querySelector('.streak-number');
    if (streakCard) {
      streakCard.textContent = state.isForbiddenMode ? "✦✦✦" : "12 Days";
    }
  }
  
  window.updateMonitorDisplay = updateMonitorDisplay;

  // --- 13. DIARY & NOTEBOOK OPEN/CLOSE ---
  function openNotebook(page = 'entries') {
    state.isNotebookOpen = true;
    el.notebookOverlay.classList.add('visible');
    
    if (window.AudioEngine) window.AudioEngine.triggerPageTurn();
    if (state.isForbiddenMode && window.RitualSystem) {
      window.RitualSystem.unlockAchievement('first_open');
    }

    renderNotebookPage(page);
  }

  function closeNotebook() {
    state.isNotebookOpen = false;
    el.notebookOverlay.classList.remove('visible');
    
    if (window.AudioEngine) window.AudioEngine.triggerPageTurn();
  }

  function renderNotebookPage(page) {
    state.activeNotebookPage = page;
    
    if (state.isForbiddenMode) {
      if (page === 'entries') {
        renderForbiddenEntriesList();
      } else if (page === 'write') {
        renderForbiddenWritePage();
      } else if (page === 'lore') {
        renderForbiddenLorePage();
      } else if (page === 'rituals') {
        renderForbiddenRitualPage();
      }
    } else {
      if (page === 'entries') {
        renderNormalEntriesList();
      } else if (page === 'write') {
        renderNormalWritePage();
      }
    }
  }

  // --- 14. NORMAL DIARY RENDER FUNCTIONS ---
  function renderNormalEntriesList() {
    el.notebookLeftPage.innerHTML = `
      <h3 class="notebook-page-title">Fell Free Diary</h3>
      <div class="notebook-body">
        <p style="margin-bottom: 20px; font-style: italic;">Welcome to your safe haven. Look back on your words, reflect, and be free.</p>
        <button class="btn btn-primary" id="btn-goto-write" style="width: 100%;">Create New Entry</button>
      </div>
    `;

    const entriesHTML = state.diaryEntries.map(e => `
      <div class="normal-entry-item">
        <h4>${e.date} • ${e.title}</h4>
        <p>${e.body}</p>
      </div>
    `).join('');

    el.notebookRightPage.innerHTML = `
      <h3 class="notebook-page-title">Recent Thoughts</h3>
      <div class="notebook-body" style="max-height: 60vh;">
        ${entriesHTML.length > 0 ? entriesHTML : '<p style="color: #7c6d62;">No entries found. Begin writing today.</p>'}
      </div>
    `;

    document.getElementById('btn-goto-write').addEventListener('click', () => {
      renderNotebookPage('write');
    });
  }

  function renderNormalWritePage() {
    el.notebookLeftPage.innerHTML = `
      <h3 class="notebook-page-title">New Thoughts</h3>
      <div class="notebook-body">
        <p style="font-style: italic; color: #7c6d62;">"The pen is mightier than the storm inside your mind."</p>
        <p style="margin-top: 15px; font-size: 0.85rem; color: #9d8c82;">Let your thoughts stream naturally. Do not judge or edit. Simply type.</p>
        <button class="btn btn-secondary" id="btn-back-entries" style="margin-top: 30px; width: 100%;">View Recent Entries</button>
      </div>
    `;

    // FIX TYPING INVISIBLE COLOR contrast: input text values styled explicitly dark charcoal
    el.notebookRightPage.innerHTML = `
      <form class="entry-form" id="normal-entry-form">
        <input type="text" placeholder="Title your thought..." class="entry-title-input" required id="entry-title" style="color:#2c1f19;">
        <textarea placeholder="Write here..." class="entry-body-textarea" required id="entry-body" style="color:#2c1f19;"></textarea>
        <div class="entry-form-bottom">
          <button type="submit" class="btn btn-primary">Save to Diary</button>
        </div>
      </form>
    `;

    document.getElementById('btn-back-entries').addEventListener('click', () => {
      renderNotebookPage('entries');
    });

    document.getElementById('normal-entry-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('entry-title').value;
      const body = document.getElementById('entry-body').value;
      
      state.diaryEntries.unshift({
        date: "Today",
        title: title,
        body: body
      });

      if (window.AudioEngine) window.AudioEngine.triggerPageTurn();
      renderNotebookPage('entries');
      renderEntriesList();
    });
  }

  function renderEntriesList() {
    const listContainer = document.querySelector('.thoughts-card p');
    if (listContainer && state.diaryEntries.length > 0) {
      listContainer.innerHTML = `
        <strong>${state.diaryEntries[0].title}</strong><br>
        ${state.diaryEntries[0].body.substring(0, 80)}...
      `;
    }
  }

  // --- 15. FORBIDDEN NOTEBOOK RENDER FUNCTIONS ---
  function renderForbiddenEntriesList() {
    el.notebookLeftPage.innerHTML = `
      <h3 class="notebook-page-title">Forbidden Archive</h3>
      <div class="notebook-body">
        <p style="margin-bottom: 25px; color: #7f7f8f;">This notebook records Fates, Memories, Dreams and Forgotten Truths. What is written here becomes real.</p>
        <div class="ritual-list">
          <button class="ritual-item-btn" id="btn-goto-write-forbidden">✦ Record a Fate</button>
          <button class="ritual-item-btn" id="btn-goto-lore">✦ The Lore Journal</button>
          <button class="ritual-item-btn" id="btn-goto-rituals">✦ Summon Rituals</button>
        </div>
      </div>
    `;

    const occultHTML = state.occultEntries.map(e => `
      <div class="normal-entry-item" style="border-bottom: 2px dashed rgba(139,0,0,0.15); padding-bottom: 15px;">
        <h4 style="color: var(--accent-gold); font-family: var(--font-runic);">${e.title}</h4>
        <p style="font-family: var(--font-special); color: #889;">${e.body}</p>
      </div>
    `).join('');

    el.notebookRightPage.innerHTML = `
      <h3 class="notebook-page-title">Echoes of Fates</h3>
      <div class="notebook-body" style="max-height: 60vh;">
        ${occultHTML.length > 0 ? occultHTML : '<p style="color: #6b7280; font-style: italic;">No souls archived yet.</p>'}
      </div>
    `;

    document.getElementById('btn-goto-write-forbidden').addEventListener('click', () => renderNotebookPage('write'));
    document.getElementById('btn-goto-lore').addEventListener('click', () => renderNotebookPage('lore'));
    document.getElementById('btn-goto-rituals').addEventListener('click', () => renderNotebookPage('rituals'));
  }

  function renderForbiddenWritePage() {
    el.notebookLeftPage.innerHTML = `
      <h3 class="notebook-page-title">Ritual Writing</h3>
      <div class="notebook-body">
        <p style="color: #666; font-style: italic;">Type names of fictional kingdoms, forgotten gods, magical beasts, legends, or your own nightmares.</p>
        <p style="margin-top: 15px; font-size: 0.75rem; color: #889;">The letters absorb ink organically. Tiny whispers will guide your pen. Every line seals a truth.</p>
        <button class="btn btn-secondary" id="btn-back-entries-forbidden" style="margin-top: 40px; width: 100%; border-color: #000;">Back to Archive</button>
      </div>
    `;

    el.notebookRightPage.innerHTML = `
      <form class="entry-form" id="forbidden-entry-form">
        <input type="text" placeholder="Declare entity or dream..." class="entry-title-input" required id="entry-title-forbidden">
        <textarea placeholder="Begin ritual writing..." class="entry-body-textarea" required id="entry-body-forbidden"></textarea>
        <div class="entry-form-bottom">
          <button type="submit" class="btn btn-primary" style="background-color: #8b0000; border-color: #000; color: #fff;">Seal Fate</button>
        </div>
      </form>
    `;

    document.getElementById('btn-back-entries-forbidden').addEventListener('click', () => renderNotebookPage('entries'));

    const textarea = document.getElementById('entry-body-forbidden');
    
    textarea.addEventListener('input', (e) => {
      if (window.RitualSystem) {
        window.RitualSystem.recordWriting(1);
      }

      if (window.AudioEngine) {
        window.AudioEngine.triggerWrite();
        if (Math.random() < 0.12) {
          window.AudioEngine.triggerWhisper();
        }
      }

      const rightPageRect = el.notebookRightPage.getBoundingClientRect();
      const randX = rightPageRect.left + (Math.random() * rightPageRect.width * 0.8);
      const randY = rightPageRect.top + (rightPageRect.height * 0.4) + (Math.random() * 80);
      spawnWritingParticle(randX, randY);
    });

    document.getElementById('forbidden-entry-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('entry-title-forbidden').value;
      const body = document.getElementById('entry-body-forbidden').value;

      state.occultEntries.unshift({ title, body });
      renderNotebookPage('entries');
      
      if (window.AudioEngine) window.AudioEngine.triggerPageTurn();
      checkForEndingsTrigger(body);
    });
  }

  function checkForEndingsTrigger(text) {
    const textLower = text.toLowerCase();
    let triggeredEnding = null;
    
    if (textLower.includes('eternal library') || textLower.includes('stone shelf')) {
      triggeredEnding = 'library';
    } else if (textLower.includes('endless rain') || textLower.includes('drown')) {
      triggeredEnding = 'rain';
    } else if (textLower.includes('forgotten kingdom') || textLower.includes('castle')) {
      triggeredEnding = 'kingdom';
    } else if (textLower.includes('final candle') || textLower.includes('extinguish')) {
      triggeredEnding = 'candle';
    } else if (textLower.includes('silent moon') || textLower.includes('silver light')) {
      triggeredEnding = 'moon';
    } else if (textLower.includes('hidden archive')) {
      triggeredEnding = 'archive';
    }

    if (triggeredEnding && window.RitualSystem) {
      closeNotebook();
      setTimeout(() => {
        window.RitualSystem.triggerEnding(triggeredEnding, () => {
          console.log("Ending triggered.");
        });
      }, 1000);
    }
  }

  function renderForbiddenLorePage() {
    if (!window.RitualSystem) return;
    
    const rit = window.RitualSystem;
    const page = rit.lorePages[state.selectedLoreIndex];

    const menuHTML = rit.lorePages.map((p, idx) => `
      <div class="lore-list-item" data-index="${idx}" style="color: ${idx === state.selectedLoreIndex ? 'var(--accent-gold)' : '#667'}">
        <h4>PAGE ${idx + 1}</h4>
        <p style="font-size: 0.65rem; color: #555;">${p.title}</p>
      </div>
    `).join('');

    el.notebookLeftPage.innerHTML = `
      <h3 class="notebook-page-title">Lore Table</h3>
      <div class="notebook-body">
        <p style="color: #667; margin-bottom: 20px; font-size: 0.75rem;">Flick through pages of the codex to research its origin.</p>
        <div class="lore-list-wrapper">
          ${menuHTML}
        </div>
        <button class="btn btn-secondary" id="btn-back-entries-lore" style="margin-top: 30px; width: 100%; border-color: #000;">Back to Archive</button>
      </div>
    `;

    el.notebookRightPage.innerHTML = `
      <h3 class="notebook-page-title">${page.title}</h3>
      <div class="notebook-body">
        <p style="font-style: italic; line-height: 2.2; color: #a0a0b8; letter-spacing: 0.5px;">"${page.content}"</p>
      </div>
    `;

    document.querySelectorAll('.lore-list-item').forEach(item => {
      item.addEventListener('click', (e) => {
        state.selectedLoreIndex = parseInt(e.currentTarget.getAttribute('data-index'));
        if (window.AudioEngine) window.AudioEngine.triggerPageTurn();
        renderNotebookPage('lore');

        if (state.selectedLoreIndex === rit.lorePages.length - 1) {
          rit.unlockAchievement('night_scholar');
        }
      });
    });

    document.getElementById('btn-back-entries-lore').addEventListener('click', () => {
      renderNotebookPage('entries');
    });
  }

  function renderForbiddenRitualPage() {
    if (!window.RitualSystem) return;
    
    const rit = window.RitualSystem;

    const ritualHTML = Object.keys(rit.rituals).map(id => {
      const completed = rit.completedRituals.has(id);
      return `
        <button class="ritual-item-btn ${completed ? 'completed' : ''}" data-ritual="${id}">
          ${completed ? '✔' : '✦'} ${rit.rituals[id].name}
        </button>
      `;
    }).join('');

    el.notebookLeftPage.innerHTML = `
      <h3 class="notebook-page-title">Summon Rituals</h3>
      <div class="notebook-body">
        <p style="color: #667; margin-bottom: 20px; font-size: 0.75rem;">Cast symbolic rituals to align elements of the room. WARNING: Rituals alter ambient properties.</p>
        <div class="ritual-list">
          ${ritualHTML}
        </div>
        <button class="btn btn-secondary" id="btn-back-entries-rituals" style="margin-top: 30px; width: 100%; border-color: #000;">Back to Archive</button>
      </div>
    `;

    el.notebookRightPage.innerHTML = `
      <h3 class="notebook-page-title">Ritual Instructions</h3>
      <div class="notebook-body">
        <p style="color: #889; line-height: 1.8;">To activate a ritual:</p>
        <ol style="margin-left: 20px; margin-top: 10px; color: #6b7280; display: flex; flex-direction: column; gap: 8px;">
          <li>Select a ritual from the index menu on the left.</li>
          <li>Prepare for room element freezing and magic circle summon.</li>
          <li>Do not interrupt the countdown.</li>
          <li>Witness the dramatic manifestation event.</li>
        </ol>
      </div>
    `;

    document.getElementById('btn-back-entries-rituals').addEventListener('click', () => {
      renderNotebookPage('entries');
    });

    document.querySelectorAll('.ritual-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ritId = e.currentTarget.getAttribute('data-ritual');
        closeNotebook();
        
        rit.startRitual(ritId, () => {
          setTimeout(() => {
            openNotebook('rituals');
          }, 4500);
        });
      });
    });
  }

  // --- 16. RITUAL CINEMATIC MAGIC HANDLERS ---
  window.onRitualBegin = function(ritualId, duration) {
    if (el.ritualOverlay) {
      el.ritualChantTitle.textContent = "SUMMONING " + window.RitualSystem.rituals[ritualId].name.toUpperCase();
      el.ritualChantCountdown.textContent = duration;
      el.ritualOverlay.classList.add('visible');
      
      const svg = document.querySelector('.anime-ritual-circle');
      if (svg) {
        svg.style.animation = 'none';
        svg.offsetHeight; 
        svg.style.animation = 'spin-ritual 15s linear infinite';
      }
    }
  };

  window.updateRitualCountdown = function(secondsLeft) {
    if (el.ritualChantCountdown) {
      el.ritualChantCountdown.textContent = secondsLeft;
    }
  };

  window.onRitualComplete = function(ritualId) {
    if (el.ritualOverlay) {
      el.ritualOverlay.classList.remove('visible');
    }
    
    console.log(`Executing Manifestation Event for ${ritualId}...`);

    const eventType = window.RitualSystem.rituals[ritualId].event;
    
    if (eventType === 'shake') {
      el.cinematicContainer.classList.add('camera-shake');
      setTimeout(() => el.cinematicContainer.classList.remove('camera-shake'), 1200);
    } 
    else if (eventType === 'particles') {
      const originalCount = roomParticlesArray.length;
      for (let i = 0; i < 200; i++) {
        roomParticlesArray.push({
          x: Math.random() * el.particlesCanvas.width,
          y: el.particlesCanvas.height + 10,
          size: 1 + Math.random() * 5,
          speedX: (Math.random() * 4 - 2),
          speedY: -(1.5 + Math.random() * 2.5),
          opacity: Math.random() * 0.8 + 0.2,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() * 2 - 1) * 0.05,
          isFeather: Math.random() < 0.2
        });
      }
      setTimeout(() => roomParticlesArray.splice(originalCount), 6000);
    } 
    else if (eventType === 'glitch') {
      el.monitorScreen.classList.add('glitch-active');
      let flashState = false;
      const interval = setInterval(() => {
        flashState = !flashState;
        el.monitorScreen.style.backgroundColor = flashState ? '#8b0000' : '#000';
      }, 80);
      
      setTimeout(() => {
        clearInterval(interval);
        el.monitorScreen.classList.remove('glitch-active');
        el.monitorScreen.style.backgroundColor = '';
      }, 1500);
    } 
    else if (eventType === 'pages') {
      triggerLightningFlash();
      setTimeout(() => triggerLightningFlash(), 500);
    } 
    else if (eventType === 'fog') {
      const winFrame = document.querySelector('.window-frame');
      if (winFrame) {
        winFrame.style.filter = 'blur(6px) brightness(0.4)';
        setTimeout(() => winFrame.style.filter = '', 6000);
      }
    } 
    else if (eventType === 'shadows') {
      el.body.style.filter = 'brightness(0.02)';
      setTimeout(() => el.body.style.filter = '', 2000);
    } 
    else if (eventType === 'clock_accel') {
      if (window.AudioEngine) {
        for (let i = 0; i < 15; i++) {
          setTimeout(() => window.AudioEngine.triggerPageTurn(), i * 150);
        }
      }
    } 
    else if (eventType === 'extinguish') {
      const originalGlow = el.lampBulbGlow.style.fill;
      el.lampBulbGlow.style.fill = '#000';
      el.candleFlame.style.display = 'none';
      
      setTimeout(() => {
        el.lampBulbGlow.style.fill = originalGlow;
        el.candleFlame.style.display = 'block';
      }, 4000);
    }
  };

  // --- 17. ENDINGS CINEMATICS ---
  window.onEndingTriggered = function(endingId, endingObj, onFinish) {
    el.endingTitle.textContent = endingObj.name.toUpperCase();
    el.endingDesc.textContent = endingObj.desc;
    
    if (endingId === 'rain') {
      el.body.style.transition = 'filter 4s ease';
      el.body.style.filter = 'blur(10px) hue-rotate(180deg)';
    } else if (endingId === 'candle') {
      el.body.style.transition = 'filter 3s ease';
      el.body.style.filter = 'brightness(0.01)';
    } else if (endingId === 'moon') {
      el.body.style.transition = 'filter 5s ease';
      el.body.style.filter = 'saturate(0) brightness(0.6)';
    }
    
    setTimeout(() => {
      el.endingOverlay.classList.add('visible');
      el.body.style.filter = '';
      if (onFinish) onFinish();
    }, 4500);
  };

  // --- 18. SETTINGS PANEL LOGIC ---
  function toggleSettingsPanel() {
    el.settingsPanel.classList.toggle('open');
    if (window.AudioEngine) window.AudioEngine.triggerPageTurn();
  }

  // Bind settings sliders to update CSS custom variables in real-time
  function applySlidersToCSS() {
    const root = document.documentElement;
    root.style.setProperty('--ambient-overlay', `rgba(0, 0, 0, ${state.config.darkIntensity})`);
    root.style.setProperty('--sigil-glow-intensity', `${state.config.notebookGlow * 16}px`);
    root.style.setProperty('--ink-glow-intensity', `${state.config.inkGlow * 8}px`);
  }

  function setupSettingsSliders() {
    const sliders = [
      { id: 'slide-darkness', param: 'darkIntensity' },
      { id: 'slide-rain', param: 'rainVolume', audio: 'rain' },
      { id: 'slide-thunder', param: 'thunderFrequency', audio: 'thunder' },
      { id: 'slide-glow', param: 'notebookGlow' },
      { id: 'slide-ink', param: 'inkGlow' },
      { id: 'slide-particles', param: 'particleDensity', callback: initParticles },
      { id: 'slide-candle', param: 'candleBrightness', callback: updateCandleBrightness },
      { id: 'slide-music', param: 'ambientMusicVolume', audio: 'choir' }
    ];

    sliders.forEach(s => {
      const slider = document.getElementById(s.id);
      if (slider) {
        slider.value = state.config[s.param];
        
        slider.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          state.config[s.param] = val;
          
          // Apply sliders to CSS variables
          applySlidersToCSS();
          
          if (s.audio && window.AudioEngine) {
            window.AudioEngine.setVolume(s.audio, val);
          }
          if (s.param === 'ambientMusicVolume' && window.AudioEngine) {
            window.AudioEngine.setVolume('choir', val);
            window.AudioEngine.setVolume('drone', val * 1.2);
            el.musicVolSlider.value = val;
          }
          
          if (s.callback) s.callback();
        });
      }
    });

    document.querySelectorAll('.theme-select-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.theme-select-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        const theme = e.currentTarget.getAttribute('data-theme');
        state.config.notebookTheme = theme;
        
        if (window.RitualSystem) {
          window.RitualSystem.activeTheme = theme;
          window.RitualSystem.unlockAchievement('shadow_walker');
        }

        applyThemeVisualShift(theme);
        if (window.AudioEngine) window.AudioEngine.triggerPageTurn();
      });
    });
  }

  function updateCandleBrightness() {
    const val = state.config.candleBrightness;
    el.candleFlame.style.transform = `scale(${0.5 + val * 0.7})`;
  }

  function applyThemeVisualShift(theme) {
    const root = document.documentElement;
    
    if (theme === 'ancient-ritual') {
      root.style.setProperty('--accent-gold', '#8b0000'); 
      root.style.setProperty('--lamp-glow', 'radial-gradient(circle at 18% 30%, rgba(0, 100, 255, 0.18) 0%, rgba(139, 0, 0, 0.25) 30%, rgba(0, 0, 0, 0) 75%)');
    } else if (theme === 'forgotten-library') {
      root.style.setProperty('--accent-gold', '#d97706'); 
      root.style.setProperty('--lamp-glow', 'radial-gradient(circle at 18% 30%, rgba(200, 150, 100, 0.15) 0%, rgba(50, 50, 60, 0.1) 40%, rgba(0, 0, 0, 0) 80%)');
    } else if (theme === 'occult-scholar') {
      root.style.setProperty('--accent-gold', '#008b8b'); 
      root.style.setProperty('--lamp-glow', 'radial-gradient(circle at 18% 30%, rgba(0, 139, 139, 0.2) 0%, rgba(139, 0, 139, 0.15) 45%, rgba(0, 0, 0, 0) 75%)');
    } else if (theme === 'shadow-realm') {
      root.style.setProperty('--accent-gold', '#4b0082'); 
      root.style.setProperty('--lamp-glow', 'radial-gradient(circle at 18% 30%, rgba(75, 0, 130, 0.2) 0%, rgba(15, 15, 20, 0.5) 50%, rgba(0, 0, 0, 0) 80%)');
    }

    if (window.AudioEngine) {
      if (theme === 'occult-scholar') {
        window.AudioEngine.setVolume('choir', state.config.ambientMusicVolume * 0.2); 
      } else {
        window.AudioEngine.setVolume('choir', state.config.ambientMusicVolume);
      }
    }
  }

  // --- 19. COLLECTIBLES ---
  function setupCollectibleRelics() {
    document.querySelectorAll('.relic-hotspot').forEach(spot => {
      spot.classList.add('glint');
      spot.addEventListener('click', (e) => {
        if (!state.isForbiddenMode) return; 
        const relicId = e.currentTarget.id.replace('relic-', '');
        if (window.RitualSystem) {
          window.RitualSystem.collectRelic(relicId);
        }
      });
    });
  }

  // --- 20. MAIN DIARY MENU NAVIGATION ---
  function switchMenuTab(tab) {
    state.activeMenuTab = tab;
    
    document.querySelectorAll('nav li').forEach(li => li.classList.remove('active'));
    const activeLink = document.querySelector(`nav a[data-tab="${tab}"]`);
    if (activeLink) {
      activeLink.parentElement.classList.add('active');
    }

    const welcomeTitle = document.getElementById('welcome-title');
    const welcomeDesc = document.getElementById('welcome-desc');
    
    if (tab === 'diary') {
      welcomeTitle.innerHTML = "Welcome back,<br>Writer";
      welcomeDesc.textContent = "This is your space. Write your thoughts, your stories, your life.";
    } else if (tab === 'journal') {
      welcomeTitle.textContent = "Personal Journal";
      welcomeDesc.textContent = "Detailed notes of your journey, timelines, and milestones.";
    } else if (tab === 'music') {
      welcomeTitle.textContent = "Focus Ambient";
      welcomeDesc.textContent = "Relaxing acoustics to block out the world. Calming rain, ticking clock, and lo-fi frequencies.";
    } else if (tab === 'calendar') {
      welcomeTitle.textContent = "Writing Calendar";
      welcomeDesc.textContent = "Review your writing history. Set milestones and visual timelines of your thoughts.";
    } else if (tab === 'goals') {
      welcomeTitle.textContent = "Writing Milestones";
      welcomeDesc.textContent = "Your milestones: Achieve a daily streak, write 1000 words, and unlock lore achievements.";
    }

    if (tab === 'music') {
      if (el.musicPlayerWidget) el.musicPlayerWidget.style.display = 'flex';
      if (el.diaryActions) el.diaryActions.style.display = 'none';
    } else {
      if (el.musicPlayerWidget) el.musicPlayerWidget.style.display = 'none';
      if (el.diaryActions) el.diaryActions.style.display = 'flex';
    }
  }

  // --- START THE APPLICATION ---
  initApp();
});
