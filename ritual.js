// Forbidden Notebook - Rituals, Lore, Achievements, Collectibles & Endings Controller

class RitualSystem {
  constructor() {
    this.activeTheme = 'ancient-ritual';
    this.collectedRelics = new Set();
    this.unlockedAchievements = new Set();
    this.completedRituals = new Set();
    this.writingCharacters = 0;
    this.timeSpent = 0; // seconds
    this.activeRitual = null;
    
    // Fictional Lore Journal Entries
    this.lorePages = [
      {
        title: "The Genesis of the Void",
        content: "In the age before the archives were named, the ink was drawn from the depths of forgotten dreams. It does not record what was, but what was felt. To hold this book is to bind oneself to the echoes of Aethelgard, the city of falling stars."
      },
      {
        title: "The Seven Whispers",
        content: "Seven relics were cast across the desk, each holding a fragment of the Architect's memory. The Key, the Crown, the Coin, the Eye, the Seal, the Stone, and the Feather. Find them, and the gate to the Silent Moon will swing wide."
      },
      {
        title: "On the Nature of Dreams",
        content: "When writing in the dark, do not look behind you. The rustle of paper is not the wind, but the notebook breathing. It absorbs your memory, turning your past into charcoal, your future into silver dust."
      },
      {
        title: "The King who Forgot",
        content: "King Valen wrote his own name on the black page. The next morning, his crown remained, but his kingdom had vanished from his mind. He spent his final days writing stories of a world he claimed to have dreamed."
      },
      {
        title: "The Final Candle",
        content: "When the sixth candle is extinguished, the ink will dry forever. To exit this world, one must close the cover, but remember: the shadow left behind in the room never truly departs."
      }
    ];

    // Collectibles config
    this.relics = {
      key: { name: "Ancient Key", hint: "Hidden in the desk's drawer handle" },
      crown: { name: "Broken Crown", hint: "Scratched into the left pile of books" },
      coin: { name: "Moon Coin", hint: "Engraved on the radio's tuning dial" },
      eye: { name: "Crystal Eye", hint: "Gleaming inside the candle lantern" },
      seal: { name: "Forgotten Seal", hint: "Embossed on the steam mug" },
      stone: { name: "Runic Stone", hint: "Wedged in the rainy window pane" },
      feather: { name: "Black Feather", hint: "Tucked behind the skull's jaw" }
    };

    // Achievements config
    this.achievements = {
      curious: { name: "The Curious One", desc: "Awakened the hidden skull." },
      first_open: { name: "First Discovery", desc: "Opened the Forbidden Notebook." },
      moon_keeper: { name: "Moon Keeper", desc: "Discovered the ancient Moon Coin." },
      master_archivist: { name: "Master Archivist", desc: "Completed all 8 rituals." },
      ink_collector: { name: "Ink Collector", desc: "Wrote over 200 characters in the notebook." },
      silent_writer: { name: "Silent Writer", desc: "Spent 5 minutes in Forbidden Mode." },
      night_scholar: { name: "Night Scholar", desc: "Read all pages of the Lore Journal." },
      shadow_walker: { name: "Shadow Walker", desc: "Changed the notebook theme." },
      ancient_witness: { name: "Ancient Witness", desc: "Witnessed a cinematic ending." },
      forgotten_librarian: { name: "Forgotten Librarian", desc: "Collected all 7 relics." }
    };

    // Rituals
    this.rituals = {
      memory: { name: "Memory Ritual", duration: 5, event: "shake" },
      dream: { name: "Dream Ritual", duration: 5, event: "particles" },
      future: { name: "Future Vision", duration: 6, event: "glitch" },
      prophecy: { name: "Ancient Prophecy", duration: 5, event: "pages" },
      story: { name: "Lost Story", duration: 5, event: "fog" },
      soul: { name: "Soul Archive", duration: 6, event: "shadows" },
      time: { name: "Echo of Time", duration: 7, event: "clock_accel" },
      myth: { name: "Myth Creator", duration: 5, event: "extinguish" }
    };

    // Endings details
    this.endings = {
      library: { name: "The Eternal Library", desc: "Your memories are archived into the infinite stone shelves." },
      rain: { name: "The Endless Rain", desc: "The storm swallows the room, drowning the desk under dark water." },
      kingdom: { name: "The Forgotten Kingdom", desc: "You awake as the ruler of a dust-covered castle." },
      candle: { name: "The Final Candle", desc: "Absolute darkness claims the room, leaving only a glowing signature." },
      moon: { name: "The Silent Moon", desc: "The moon rises inside the window, freezing the desk in silver light." },
      archive: { name: "The Hidden Archive", desc: "You become the next ink-smith, bound to record the fates of others." }
    };

    // Load saved state if any
    this.loadState();
  }

  loadState() {
    try {
      const data = localStorage.getItem('forbidden_notebook_state');
      if (data) {
        const state = JSON.parse(data);
        if (state.relics) this.collectedRelics = new Set(state.relics);
        if (state.achievements) this.unlockedAchievements = new Set(state.achievements);
        if (state.completed) this.completedRituals = new Set(state.completed);
      }
    } catch(e) {
      console.error("Error loading state:", e);
    }
  }

  saveState() {
    try {
      const state = {
        relics: Array.from(this.collectedRelics),
        achievements: Array.from(this.unlockedAchievements),
        completed: Array.from(this.completedRituals)
      };
      localStorage.setItem('forbidden_notebook_state', JSON.stringify(state));
    } catch(e) {}
  }

  // Relic collecting logic
  collectRelic(id) {
    if (this.relics[id] && !this.collectedRelics.has(id)) {
      this.collectedRelics.add(id);
      this.saveState();
      
      // Notify UI
      this.showToast(`Relic Found: ${this.relics[id].name}`, "relic");
      
      // Play sound
      if (window.AudioEngine) window.AudioEngine.triggerWhisper();

      // Check Achievements
      if (id === 'coin') {
        this.unlockAchievement('moon_keeper');
      }
      if (this.collectedRelics.size === Object.keys(this.relics).length) {
        this.unlockAchievement('forgotten_librarian');
      }
      
      // Update UI panels
      if (window.updateMonitorDisplay) window.updateMonitorDisplay();
      return true;
    }
    return false;
  }

  // Achievement unlocking logic
  unlockAchievement(id) {
    if (this.achievements[id] && !this.unlockedAchievements.has(id)) {
      this.unlockedAchievements.add(id);
      this.saveState();
      
      // Toast notification
      this.showToast(`Achievement Unlocked: ${this.achievements[id].name}`, "achievement");
      
      // Sound cue
      setTimeout(() => {
        if (window.AudioEngine) {
          window.AudioEngine.triggerWhisper();
        }
      }, 300);

      if (window.updateMonitorDisplay) window.updateMonitorDisplay();
    }
  }

  // Show customized in-app toast notification
  showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `ritual-toast ${type}`;
    
    let icon = "✴";
    if (type === "relic") icon = "🗝";
    if (type === "achievement") icon = "🏆";
    if (type === "ending") icon = "⚖";
    
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${type.toUpperCase()}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;
    
    document.body.appendChild(toast);
    
    // Slide in
    setTimeout(() => toast.classList.add('visible'), 50);
    
    // Slide out
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 500);
    }, 4500);
  }

  // Begin a symbolic ritual
  startRitual(id, onComplete) {
    if (this.activeRitual || !this.rituals[id]) return;
    this.activeRitual = id;
    const ritual = this.rituals[id];
    
    console.log(`Starting ${ritual.name}...`);
    
    // Trigger build sound sweep
    if (window.AudioEngine) {
      window.AudioEngine.triggerRitualStart(ritual.duration);
    }
    
    // Call app.js visual ritual state
    if (window.onRitualBegin) {
      window.onRitualBegin(id, ritual.duration);
    }

    let secondsLeft = ritual.duration;
    const interval = setInterval(() => {
      secondsLeft--;
      if (window.updateRitualCountdown) {
        window.updateRitualCountdown(secondsLeft);
      }
      
      if (secondsLeft <= 0) {
        clearInterval(interval);
        this.completeActiveRitual(onComplete);
      }
    }, 1000);
  }

  // Complete ritual
  completeActiveRitual(onComplete) {
    const id = this.activeRitual;
    if (!id) return;
    
    const ritual = this.rituals[id];
    this.completedRituals.add(id);
    this.activeRitual = null;
    this.saveState();
    
    // Sound crash
    if (window.AudioEngine) {
      window.AudioEngine.triggerRitualFinish();
    }
    
    // Check achievements
    if (this.completedRituals.size === Object.keys(this.rituals).length) {
      this.unlockAchievement('master_archivist');
    }

    // Trigger visual crash event in app.js
    if (window.onRitualComplete) {
      window.onRitualComplete(id);
    }
    
    this.showToast(`Completed ${ritual.name}`, "ritual");

    if (onComplete) onComplete();
    if (window.updateMonitorDisplay) window.updateMonitorDisplay();
  }

  // Determine and trigger cinematic ending
  triggerEnding(endingId, onFinish) {
    if (!this.endings[endingId]) return;
    this.unlockAchievement('ancient_witness');
    
    this.showToast(`Ending Unlocked: ${this.endings[endingId].name}`, "ending");
    
    if (window.onEndingTriggered) {
      window.onEndingTriggered(endingId, this.endings[endingId], onFinish);
    }
  }

  // Time tracker for Silent Writer achievement
  startTimer() {
    if (this.timerInterval) return;
    this.timerInterval = setInterval(() => {
      this.timeSpent++;
      if (this.timeSpent >= 300) { // 5 minutes
        this.unlockAchievement('silent_writer');
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  recordWriting(chars) {
    this.writingCharacters += chars;
    if (this.writingCharacters >= 200) {
      this.unlockAchievement('ink_collector');
    }
  }
}

// Global handle for rituals
window.RitualSystem = new RitualSystem();
