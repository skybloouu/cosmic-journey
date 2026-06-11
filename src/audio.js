let audioCtx = null;
let droneOscillators = [];
let droneGain = null;
let stopTimeout = null;

export function initAudio() {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    // Play a silent sound to unlock audio engine on mobile
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.01);
  } catch (e) {
    console.error("Audio init failed", e);
  }
}

function forceKillDrone() {
  droneOscillators.forEach(d => {
    try { d.osc.stop(); d.osc.disconnect(); } catch(e){}
    try { d.gain.disconnect(); } catch(e){}
  });
  droneOscillators = [];
  if (droneGain) {
    try { droneGain.disconnect(); } catch(e){}
    droneGain = null;
  }
}

export function startCosmicDrone() {
  try {
    if (!audioCtx) initAudio(); // Auto-recover if HMR reset the context
    if (!audioCtx) return;
    
    // Clear any pending stops if the user navigated back quickly
    if (stopTimeout) {
      clearTimeout(stopTimeout);
      stopTimeout = null;
      forceKillDrone();
    }

    if (droneOscillators.length > 0) return; // already playing
    if (audioCtx.state === 'suspended') audioCtx.resume();

    droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0, audioCtx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 2); // 2s fade in
    droneGain.connect(audioCtx.destination);

    // Ethereal space chords with natural beating (chorus effect)
    // D4 (293.66), D4 detuned (294.5), A4 (440), A4 detuned (441), D5 (587.33)
    const freqs = [293.66, 294.5, 440.00, 441.00, 587.33]; 
    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine'; // pure sine for glass/ethereal sound
      osc.frequency.value = freq;
      
      const oscGain = audioCtx.createGain();
      // Distribute volumes so it's not clipping
      oscGain.gain.value = idx > 1 ? 0.15 : 0.25; 
      
      osc.connect(oscGain);
      oscGain.connect(droneGain);
      
      osc.start();
      droneOscillators.push({ osc, gain: oscGain });
    });
  } catch (e) {
    console.error("Cosmic drone failed", e);
  }
}

export function stopCosmicDrone() {
  try {
    if (droneGain && audioCtx) {
      // Avoid scheduling errors by grabbing current gain
      droneGain.gain.cancelScheduledValues(audioCtx.currentTime);
      droneGain.gain.setValueAtTime(droneGain.gain.value, audioCtx.currentTime);
      droneGain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1); // 1s fade out
      
      stopTimeout = setTimeout(() => {
        forceKillDrone();
      }, 1000);
    }
  } catch (e) {
    console.error("Stop drone failed", e);
  }
}
