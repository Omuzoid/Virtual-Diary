// Forbidden Notebook - Web Audio API Synthesis Engine
// Purely programmatic audio generation, no external files required.

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.nodes = {};
    this.isInitialized = false;
    this.activeLoops = new Set();
    
    // Default chord progression
    this.currentProgression = [
      [261.63, 329.63, 392.00], // C Maj
      [220.00, 261.63, 329.63], // A Min
      [293.66, 349.23, 440.00], // D Min
      [196.00, 246.94, 293.66]  // G Maj
    ];
    
    // Volume state (0 to 1)
    this.volumes = {
      master: 0.8,
      rain: 0.4,
      thunder: 0.5,
      drone: 0.5,
      choir: 0.4,
      radio: 0.3,
      clock: 0.5,
      whispers: 0.4,
      sfx: 0.6
    };
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // Master Gain Node
      this.nodes.masterGain = this.ctx.createGain();
      this.nodes.masterGain.gain.value = this.volumes.master;
      this.nodes.masterGain.connect(this.ctx.destination);
      
      // Reverb Convolver Node (Synthesized Impulse Response)
      this.nodes.reverb = this.ctx.createConvolver();
      this.nodes.reverb.buffer = this.createReverbImpulseResponse(2.5, 2.0); // 2.5s decay
      this.nodes.reverb.connect(this.nodes.masterGain);
      
      // Secondary Reverb for huge spaces
      this.nodes.longReverb = this.ctx.createConvolver();
      this.nodes.longReverb.buffer = this.createReverbImpulseResponse(5.0, 1.5);
      this.nodes.longReverb.connect(this.nodes.masterGain);

      this.isInitialized = true;
      console.log("Audio Engine Initialized successfully.");
    } catch (e) {
      console.error("Failed to initialize AudioContext:", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  createReverbImpulseResponse(duration, decay) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const dummyCtx = new AudioContextClass();
    const rate = dummyCtx.sampleRate;
    const len = rate * duration;
    const buffer = dummyCtx.createBuffer(2, len, rate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < len; i++) {
        const percent = i / len;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - percent, decay);
      }
    }
    dummyCtx.close();
    return buffer;
  }

  setVolume(type, val) {
    this.volumes[type] = parseFloat(val);
    if (!this.isInitialized) return;
    
    if (type === 'master' && this.nodes.masterGain) {
      this.nodes.masterGain.gain.setTargetAtTime(val, this.ctx.currentTime, 0.1);
    }
    if (type === 'rain' && this.nodes.rainGain) {
      this.nodes.rainGain.gain.setTargetAtTime(val * 0.4, this.ctx.currentTime, 0.1);
    }
    if (type === 'drone' && this.nodes.droneGain) {
      this.nodes.droneGain.gain.setTargetAtTime(val * 0.5, this.ctx.currentTime, 0.2);
    }
    if (type === 'choir' && this.nodes.choirGain) {
      this.nodes.choirGain.gain.setTargetAtTime(val * 0.35, this.ctx.currentTime, 0.2);
    }
    if (type === 'radio' && this.nodes.radioGain) {
      this.nodes.radioGain.gain.setTargetAtTime(val * 0.25, this.ctx.currentTime, 0.1);
    }
    if (type === 'clock' && this.nodes.clockGain) {
      this.nodes.clockGain.gain.setTargetAtTime(val * 0.3, this.ctx.currentTime, 0.1);
    }
  }

  createNoiseNode() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    return noise;
  }

  // --- NORMAL MODE AUDIO ---
  startNormalAmbient() {
    this.init();
    this.resume();
    if (!this.isInitialized) return;

    console.log("Starting Normal Ambient Sounds...");
    this.stopAllActive();

    // 1. Soft Rain Synthesizer
    this.startRainSynth(false);

    // 2. Lo-fi Radio music
    this.startRadioSynth();

    // 3. Ticking Clock
    this.startClockTicks();
  }

  stopNormalAmbient() {
    this.stopRainSynth();
    this.stopRadioSynth();
    this.stopClockTicks();
  }

  // --- FORBIDDEN MODE AUDIO ---
  startForbiddenAmbient() {
    this.init();
    this.resume();
    if (!this.isInitialized) return;

    console.log("Starting Forbidden Ambient Sounds...");
    this.stopNormalAmbient();

    // 1. Heavy Rain & Storm Synthesizer
    this.startRainSynth(true);

    // 2. Low Cinematic Drone
    this.startDarkDrone();

    // 3. Ethereal Choir
    this.startEtherealChoir();
  }

  stopForbiddenAmbient() {
    this.stopRainSynth();
    this.stopDarkDrone();
    this.stopEtherealChoir();
  }

  stopAllActive() {
    this.stopNormalAmbient();
    this.stopForbiddenAmbient();
  }

  // --- TRACK SWITCHING SYSTEM (6 Tracks total) ---
  changeTrack(trackType) {
    if (!this.isInitialized) return;
    
    // Stop radio / music intervals
    this.stopRadioSynth();
    this.stopPianoSynth();
    this.stopMusicBoxSynth();
    
    if (trackType === 'lofi-1') {
      this.currentProgression = [
        [261.63, 329.63, 392.00], // C Maj
        [220.00, 261.63, 329.63], // A Min
        [293.66, 349.23, 440.00], // D Min
        [196.00, 246.94, 293.66]  // G Maj
      ];
      this.startRadioSynth();
    } 
    else if (trackType === 'lofi-2') {
      this.currentProgression = [
        [220.00, 261.63, 329.63], // A Min
        [174.61, 220.00, 261.63], // F Maj
        [261.63, 329.63, 392.00], // C Maj
        [196.00, 246.94, 293.66]  // G Maj
      ];
      this.startRadioSynth();
    } 
    else if (trackType === 'gothic') {
      this.currentProgression = [
        [110.00, 165.00, 220.00], // A2, E3, A3
        [130.81, 196.00, 261.63], // C3, G3, C4
        [146.83, 220.00, 293.66]  // D3, A3, D4
      ];
      this.startRadioSynth();
    }
    else if (trackType === 'piano') {
      this.startPianoSynth();
    }
    else if (trackType === 'jazz') {
      // Jazzy 7th chords
      this.currentProgression = [
        [220.00, 261.63, 329.63, 392.00], // Am7
        [146.83, 174.61, 220.00, 261.63], // Dm7
        [196.00, 246.94, 293.66, 349.23], // G7
        [261.63, 329.63, 392.00, 493.88]  // Cmaj7
      ];
      this.startRadioSynth();
    }
    else if (trackType === 'musicbox') {
      this.startMusicBoxSynth();
    }
  }

  // --- SYNTHESIZERS ---

  // Clock Ticking
  startClockTicks() {
    if (this.nodes.clockInterval) return;
    
    this.nodes.clockGain = this.ctx.createGain();
    this.nodes.clockGain.gain.value = this.volumes.clock * 0.3;
    this.nodes.clockGain.connect(this.nodes.masterGain);

    const playTick = () => {
      if (!this.ctx || this.ctx.state === 'suspended') return;
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.015);
      
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, now);
      
      clickGain.gain.setValueAtTime(1.0, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
      
      osc.connect(filter);
      filter.connect(clickGain);
      clickGain.connect(this.nodes.clockGain);
      
      osc.start(now);
      osc.stop(now + 0.02);
    };

    this.nodes.clockInterval = setInterval(playTick, 1000);
    this.activeLoops.add('clock');
  }

  stopClockTicks() {
    if (this.nodes.clockInterval) {
      clearInterval(this.nodes.clockInterval);
      this.nodes.clockInterval = null;
    }
    this.activeLoops.delete('clock');
  }

  // Rain
  startRainSynth(isHeavy) {
    if (this.nodes.rainSource) return;

    this.nodes.rainSource = this.createNoiseNode();
    this.nodes.rainGain = this.ctx.createGain();
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    
    if (isHeavy) {
      filter.frequency.value = 600;
      filter.Q.value = 0.8;
      this.nodes.rainGain.gain.value = this.volumes.rain * 0.45;
      
      this.nodes.windSource = this.createNoiseNode();
      this.nodes.windFilter = this.ctx.createBiquadFilter();
      this.nodes.windGain = this.ctx.createGain();
      
      this.nodes.windFilter.type = 'lowpass';
      this.nodes.windFilter.frequency.value = 100;
      this.nodes.windFilter.Q.value = 2.0;
      
      this.nodes.windGain.gain.value = this.volumes.rain * 0.3;
      
      const windLFO = this.ctx.createOscillator();
      const windLFOGain = this.ctx.createGain();
      windLFO.frequency.value = 0.08;
      windLFOGain.gain.value = 50;
      
      windLFO.connect(windLFOGain);
      windLFOGain.connect(this.nodes.windFilter.frequency);
      
      this.nodes.windSource.connect(this.nodes.windFilter);
      this.nodes.windFilter.connect(this.nodes.windGain);
      this.nodes.windGain.connect(this.nodes.masterGain);
      
      windLFO.start();
      this.nodes.windSource.start();
      this.nodes.windLFO = windLFO;
    } else {
      filter.frequency.value = 900;
      filter.Q.value = 1.2;
      this.nodes.rainGain.gain.value = this.volumes.rain * 0.2;
    }

    this.nodes.rainSource.connect(filter);
    filter.connect(this.nodes.rainGain);
    this.nodes.rainGain.connect(this.nodes.masterGain);
    
    this.nodes.rainSource.start();
    this.activeLoops.add('rain');
  }

  stopRainSynth() {
    if (this.nodes.rainSource) {
      try { this.nodes.rainSource.stop(); } catch(e){}
      this.nodes.rainSource = null;
    }
    if (this.nodes.windSource) {
      try { this.nodes.windSource.stop(); } catch(e){}
      this.nodes.windSource = null;
    }
    if (this.nodes.windLFO) {
      try { this.nodes.windLFO.stop(); } catch(e){}
      this.nodes.windLFO = null;
    }
    this.activeLoops.delete('rain');
  }

  // Radio / Guitar style Chords Synthesizer
  startRadioSynth() {
    if (this.nodes.radioInterval) return;

    this.nodes.radioGain = this.ctx.createGain();
    this.nodes.radioGain.gain.value = this.volumes.radio * 0.25;
    
    const radioFilter = this.ctx.createBiquadFilter();
    radioFilter.type = 'bandpass';
    radioFilter.frequency.value = 1200;
    radioFilter.Q.value = 1.5;
    
    this.nodes.radioStatic = this.createNoiseNode();
    const staticGain = this.ctx.createGain();
    const staticFilter = this.ctx.createBiquadFilter();
    staticFilter.type = 'highpass';
    staticFilter.frequency.value = 3000;
    staticGain.gain.value = 0.04;
    
    this.nodes.radioStatic.connect(staticFilter);
    staticFilter.connect(staticGain);
    staticGain.connect(this.nodes.radioGain);
    this.nodes.radioStatic.start();

    let chordIndex = 0;
    const playChord = () => {
      if (!this.ctx || this.ctx.state === 'suspended') return;
      const now = this.ctx.currentTime;
      const chord = this.currentProgression[chordIndex];
      chordIndex = (chordIndex + 1) % this.currentProgression.length;
      
      const chordGain = this.ctx.createGain();
      chordGain.gain.setValueAtTime(0, now);
      chordGain.gain.linearRampToValueAtTime(0.7, now + 1.0);
      chordGain.gain.setValueAtTime(0.7, now + 4.0);
      chordGain.gain.exponentialRampToValueAtTime(0.001, now + 6.0);
      
      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(chordGain);
        osc.start(now);
        osc.stop(now + 6.0);
      });
      
      chordGain.connect(radioFilter);
    };

    playChord();
    this.nodes.radioInterval = setInterval(playChord, 7000);
    
    radioFilter.connect(this.nodes.radioGain);
    this.nodes.radioGain.connect(this.nodes.masterGain);
    this.activeLoops.add('radio');
  }

  stopRadioSynth() {
    if (this.nodes.radioInterval) {
      clearInterval(this.nodes.radioInterval);
      this.nodes.radioInterval = null;
    }
    if (this.nodes.radioStatic) {
      try { this.nodes.radioStatic.stop(); } catch(e){}
      this.nodes.radioStatic = null;
    }
    this.activeLoops.delete('radio');
  }

  // --- PIANO SYNTHESIZER (Slow ambient notes) ---
  startPianoSynth() {
    if (this.nodes.pianoInterval) return;

    this.nodes.pianoGain = this.ctx.createGain();
    this.nodes.pianoGain.gain.value = this.volumes.radio * 0.4;
    this.nodes.pianoGain.connect(this.nodes.reverb); // Run heavily through reverb

    // A Minor / C Major pentatonic melody
    const notes = [220.00, 261.63, 329.63, 392.00, 440.00, 523.25]; // A3, C4, E4, G4, A4, C5
    
    const playNote = () => {
      if (!this.ctx || this.ctx.state === 'suspended') return;
      const now = this.ctx.currentTime;
      
      // Select 1-2 random notes to play together
      const count = Math.random() < 0.3 ? 2 : 1;
      for (let i = 0; i < count; i++) {
        const note = notes[Math.floor(Math.random() * notes.length)];
        
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, now);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 1.2);
        
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.5, now + 0.05); // soft hammer attack
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5); // long piano decay
        
        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.nodes.pianoGain);
        
        osc.start(now);
        osc.stop(now + 2.6);
      }
    };

    playNote();
    this.nodes.pianoInterval = setInterval(playNote, 2500); // Play note every 2.5s
    this.activeLoops.add('piano');
  }

  stopPianoSynth() {
    if (this.nodes.pianoInterval) {
      clearInterval(this.nodes.pianoInterval);
      this.nodes.pianoInterval = null;
    }
    this.activeLoops.delete('piano');
  }

  // --- HAUNTED MUSIC BOX SYNTH (Creepy metallic chiming bells) ---
  startMusicBoxSynth() {
    if (this.nodes.musicBoxInterval) return;

    this.nodes.musicBoxGain = this.ctx.createGain();
    this.nodes.musicBoxGain.gain.value = this.volumes.radio * 0.35;
    this.nodes.musicBoxGain.connect(this.nodes.longReverb); // Run through huge cathedral space

    // Creepy nursery rhyme minor melody (Frere Jacques in A minor)
    const melody = [
      440.00, 493.88, 523.25, 440.00, // A, B, C, A
      440.00, 493.88, 523.25, 440.00, // A, B, C, A
      523.25, 587.33, 659.25,          // C, D, E
      523.25, 587.33, 659.25           // C, D, E
    ];
    let noteIndex = 0;

    const playBell = () => {
      if (!this.ctx || this.ctx.state === 'suspended') return;
      const now = this.ctx.currentTime;
      const freq = melody[noteIndex];
      noteIndex = (noteIndex + 1) % melody.length;
      
      const osc = this.ctx.createOscillator();
      const sineMod = this.ctx.createOscillator(); // FM Synthesis for metallic chime bell
      const modGain = this.ctx.createGain();
      const bellGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      sineMod.type = 'sine';
      sineMod.frequency.setValueAtTime(freq * 2.001, now); // FM modulator detuned
      modGain.gain.setValueAtTime(freq * 0.8, now); // modulation index
      
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2000, now);
      filter.Q.value = 1.0;

      bellGain.gain.setValueAtTime(0, now);
      bellGain.gain.linearRampToValueAtTime(0.8, now + 0.005); // sharp strike
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8); // ring out
      
      sineMod.connect(modGain);
      modGain.connect(osc.frequency);
      osc.connect(filter);
      filter.connect(bellGain);
      bellGain.connect(this.nodes.musicBoxGain);
      
      sineMod.start(now);
      osc.start(now);
      sineMod.stop(now + 2.0);
      osc.stop(now + 2.0);
    };

    playBell();
    this.nodes.musicBoxInterval = setInterval(playBell, 900); // Fast creepy clock chimes
    this.activeLoops.add('musicbox');
  }

  stopMusicBoxSynth() {
    if (this.nodes.musicBoxInterval) {
      clearInterval(this.nodes.musicBoxInterval);
      this.nodes.musicBoxInterval = null;
    }
    this.activeLoops.delete('musicbox');
  }

  // --- FORBIDDEN DEEP DRONE ---
  startDarkDrone() {
    if (this.nodes.droneOsc1) return;

    this.nodes.droneGain = this.ctx.createGain();
    this.nodes.droneGain.gain.value = this.volumes.drone * 0.5;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    
    osc1.type = 'sawtooth';
    osc1.frequency.value = 55.00;
    
    osc2.type = 'sawtooth';
    osc2.frequency.value = 55.45;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 110;
    filter.Q.value = 1.0;

    const filterLFO = this.ctx.createOscillator();
    const filterLFOGain = this.ctx.createGain();
    filterLFO.frequency.value = 0.05;
    filterLFOGain.gain.value = 25;
    
    filterLFO.connect(filterLFOGain);
    filterLFOGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(this.nodes.droneGain);
    this.nodes.droneGain.connect(this.nodes.masterGain);

    osc1.start();
    osc2.start();
    filterLFO.start();

    this.nodes.droneOsc1 = osc1;
    this.nodes.droneOsc2 = osc2;
    this.nodes.droneLFO = filterLFO;
    this.activeLoops.add('drone');
  }

  stopDarkDrone() {
    if (this.nodes.droneOsc1) {
      try {
        this.nodes.droneOsc1.stop();
        this.nodes.droneOsc2.stop();
        this.nodes.droneLFO.stop();
      } catch(e){}
      this.nodes.droneOsc1 = null;
      this.nodes.droneOsc2 = null;
      this.nodes.droneLFO = null;
    }
    this.activeLoops.delete('drone');
  }

  // --- HAUNTING CHOIR ---
  startEtherealChoir() {
    if (this.nodes.choirSource) return;

    this.nodes.choirSource = this.createNoiseNode();
    this.nodes.choirGain = this.ctx.createGain();
    this.nodes.choirGain.gain.value = this.volumes.choir * 0.35;

    const f1 = this.ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.value = 750;
    f1.Q.value = 6.0;

    const f2 = this.ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.value = 1150;
    f2.Q.value = 6.0;

    const f3 = this.ctx.createBiquadFilter();
    f3.type = 'bandpass';
    f3.frequency.value = 2500;
    f3.Q.value = 4.0;

    this.nodes.choirSource.connect(f1);
    this.nodes.choirSource.connect(f2);
    this.nodes.choirSource.connect(f3);

    const g1 = this.ctx.createGain(); g1.gain.value = 0.5;
    const g2 = this.ctx.createGain(); g2.gain.value = 0.3;
    const g3 = this.ctx.createGain(); g3.gain.value = 0.15;

    f1.connect(g1);
    f2.connect(g2);
    f3.connect(g3);

    g1.connect(this.nodes.choirGain);
    g2.connect(this.nodes.choirGain);
    g3.connect(this.nodes.choirGain);

    this.nodes.choirGain.connect(this.nodes.reverb);
    this.nodes.choirGain.connect(this.nodes.longReverb);

    const choirLFO = this.ctx.createOscillator();
    const choirLFOGain = this.ctx.createGain();
    choirLFO.frequency.value = 0.07;
    choirLFOGain.gain.value = 150;
    
    choirLFO.connect(choirLFOGain);
    choirLFOGain.connect(f1.frequency);
    choirLFOGain.connect(f2.frequency);

    choirLFO.start();
    this.nodes.choirSource.start();

    this.nodes.choirLFO = choirLFO;
    this.activeLoops.add('choir');
  }

  stopEtherealChoir() {
    if (this.nodes.choirSource) {
      try {
        this.nodes.choirSource.stop();
        this.nodes.choirLFO.stop();
      } catch(e){}
      this.nodes.choirSource = null;
      this.nodes.choirLFO = null;
    }
    this.activeLoops.delete('choir');
  }

  // --- SOUND EFFECTS ---

  // Sub-bass Drop (For activation)
  triggerBassDrop() {
    this.init();
    this.resume();
    if (!this.isInitialized) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 1.8);
    
    subGain.gain.setValueAtTime(0, now);
    subGain.gain.linearRampToValueAtTime(0.9, now + 0.1);
    subGain.gain.setValueAtTime(0.9, now + 0.5);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
    
    osc.connect(subGain);
    subGain.connect(this.nodes.masterGain);
    
    const reverbGain = this.ctx.createGain();
    reverbGain.gain.value = 0.5;
    subGain.connect(reverbGain);
    reverbGain.connect(this.nodes.longReverb);

    osc.start(now);
    osc.stop(now + 2.1);
  }

  // Thunder Crack
  triggerThunder() {
    if (!this.isInitialized) return;

    const now = this.ctx.currentTime;
    const p1Vol = this.volumes.thunder * 0.9;
    
    const crackSource = this.createNoiseNode();
    const crackGain = this.ctx.createGain();
    const crackFilter = this.ctx.createBiquadFilter();
    
    crackFilter.type = 'bandpass';
    crackFilter.frequency.value = 1000;
    crackFilter.Q.value = 1.0;
    
    crackGain.gain.setValueAtTime(0.001, now);
    crackGain.gain.linearRampToValueAtTime(p1Vol * 0.8, now + 0.02);
    crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    crackSource.connect(crackFilter);
    crackFilter.connect(crackGain);
    crackGain.connect(this.nodes.masterGain);
    
    crackSource.start(now);
    crackSource.stop(now + 0.4);

    const rumbleSource = this.createNoiseNode();
    const rumbleGain = this.ctx.createGain();
    const rumbleFilter = this.ctx.createBiquadFilter();
    
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(150, now);
    rumbleFilter.frequency.exponentialRampToValueAtTime(40, now + 1.5);
    rumbleFilter.Q.value = 3.0;
    
    rumbleGain.gain.setValueAtTime(0.001, now);
    rumbleGain.gain.linearRampToValueAtTime(p1Vol * 0.9, now + 0.15);
    rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
    
    rumbleSource.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(this.nodes.masterGain);
    
    const revGain = this.ctx.createGain();
    revGain.gain.value = 0.8;
    rumbleGain.connect(revGain);
    revGain.connect(this.nodes.longReverb);

    rumbleSource.start(now + 0.05);
    rumbleSource.stop(now + 3.5);
  }

  // Whispering Glyphs
  triggerWhisper() {
    if (!this.isInitialized || this.volumes.whispers <= 0.01) return;

    const now = this.ctx.currentTime;
    const whisperSource = this.createNoiseNode();
    const whisperGain = this.ctx.createGain();
    const whisperFilter = this.ctx.createBiquadFilter();
    
    whisperFilter.type = 'bandpass';
    const randFreq = 1200 + Math.random() * 2600;
    whisperFilter.frequency.setValueAtTime(randFreq, now);
    whisperFilter.Q.value = 15.0;
    
    const whisperVol = this.volumes.whispers * 0.05;
    whisperGain.gain.setValueAtTime(0, now);
    whisperGain.gain.linearRampToValueAtTime(whisperVol, now + 0.05);
    whisperGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    
    whisperSource.connect(whisperFilter);
    whisperFilter.connect(whisperGain);
    whisperGain.connect(this.nodes.reverb);
    
    whisperSource.start(now);
    whisperSource.stop(now + 0.45);
  }

  // Pen Writing Sound
  triggerWrite() {
    if (!this.isInitialized) return;
    
    const now = this.ctx.currentTime;
    const writeSource = this.createNoiseNode();
    const writeGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    filter.type = 'bandpass';
    const centerFreq = 1400 + Math.random() * 800;
    filter.frequency.setValueAtTime(centerFreq, now);
    filter.Q.value = 2.0;

    const duration = 0.04 + Math.random() * 0.05;
    const writeVol = this.volumes.sfx * 0.12;
    
    writeGain.gain.setValueAtTime(0.001, now);
    writeGain.gain.linearRampToValueAtTime(writeVol, now + 0.01);
    writeGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    writeSource.connect(filter);
    filter.connect(writeGain);
    writeGain.connect(this.nodes.masterGain);
    
    writeSource.start(now);
    writeSource.stop(now + duration + 0.02);
  }

  // Page Turn Sound
  triggerPageTurn() {
    if (!this.isInitialized) return;

    const now = this.ctx.currentTime;
    const pageSource = this.createNoiseNode();
    const pageGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(4000, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);
    
    const pVol = this.volumes.sfx * 0.25;
    pageGain.gain.setValueAtTime(0.001, now);
    pageGain.gain.linearRampToValueAtTime(pVol, now + 0.05);
    pageGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    pageSource.connect(filter);
    filter.connect(pageGain);
    pageGain.connect(this.nodes.reverb);
    
    pageSource.start(now);
    pageSource.stop(now + 0.45);
  }

  // Ritual Orchestral Tension Builder
  triggerRitualStart(duration) {
    if (!this.isInitialized) return;

    const now = this.ctx.currentTime;
    this.nodes.ritualOscs = [];
    
    const baseFreqs = [110, 165, 220]; 
    const tensionGain = this.ctx.createGain();
    tensionGain.gain.setValueAtTime(0.001, now);
    tensionGain.gain.linearRampToValueAtTime(this.volumes.sfx * 0.4, now + duration * 0.8);
    tensionGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    
    tensionGain.connect(this.nodes.reverb);

    baseFreqs.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 2.0, now + duration);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(1500, now + duration);
      
      osc.connect(filter);
      filter.connect(tensionGain);
      osc.start(now);
      osc.stop(now + duration + 0.5);
      this.nodes.ritualOscs.push(osc);
    });
  }

  // Ritual Finish
  triggerRitualFinish() {
    if (!this.isInitialized) return;
    const now = this.ctx.currentTime;
    
    this.triggerBassDrop();
    
    const splashSource = this.createNoiseNode();
    const splashGain = this.ctx.createGain();
    const splashFilter = this.ctx.createBiquadFilter();
    
    splashFilter.type = 'highpass';
    splashFilter.frequency.value = 2500;
    
    splashGain.gain.setValueAtTime(0.001, now);
    splashGain.gain.linearRampToValueAtTime(this.volumes.sfx * 0.8, now + 0.05);
    splashGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
    
    splashSource.connect(splashFilter);
    splashFilter.connect(splashGain);
    splashGain.connect(this.nodes.longReverb);
    
    splashSource.start(now);
    splashSource.stop(now + 2.6);
  }
}

window.AudioEngine = new AudioEngine();
