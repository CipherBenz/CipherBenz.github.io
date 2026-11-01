/**
 * sound.js — Cyber Telemetry Acoustic FX (Web Audio API)
 * Generates synthetic clicks, terminal beeps, and decrypt chirps with zero external mp3 dependencies.
 */

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('cyber_audio_muted') !== 'false'; // default muted to be polite
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.muted = !this.muted;
    localStorage.setItem('cyber_audio_muted', this.muted);
    if (!this.muted) {
      this.init();
      this.playBeep(880, 0.05, 'sine');
    }
    return !this.muted;
  }

  isAudioEnabled() {
    return !this.muted;
  }

  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }

  playBeep(freq = 600, duration = 0.06, type = 'sine') {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playDecrypt() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const freqs = [520, 680, 840, 1080];
    freqs.forEach((f, i) => {
      setTimeout(() => this.playBeep(f, 0.03, 'square'), i * 35);
    });
  }

  playSuccess() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const freqs = [440, 660, 880];
    freqs.forEach((f, i) => {
      setTimeout(() => this.playBeep(f, 0.08, 'sine'), i * 70);
    });
  }
}

export const sound = new SoundSystem();
