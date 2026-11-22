/**
 * Birthday Sound Engine using Web Audio API
 * Generates cute synthesized sound effects and gentle background melody
 * No external audio files required - works 100% offline and reliably!
 */

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.isMusicPlaying = false;
        this.bgmTimer = null;
        this.bgmNoteIndex = 0;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted && this.isMusicPlaying) {
            this.stopBGM();
        }
        return this.isMuted;
    }

    // Cute bubble pop sound
    playPop(frequency = 440) {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, now);
        osc.frequency.exponentialRampToValueAtTime(frequency * 1.8, now + 0.08);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Balloon pop sound (sharp burst)
    playBalloonPop() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        // White noise burst
        const bufferSize = this.ctx.sampleRate * 0.08;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.08);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
    }

    // Sparkle / chime sound
    playSparkle() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6

        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.04;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.12, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.35);
        });
    }

    // Card flip sound
    playCardFlip() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.07);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Catch item sound in arcade
    playCatch() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.00, now + 0.05); // A5

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // Spin wheel click tick
    playTick() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.03);
    }

    // Victory Fanfare
    playVictory() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        // C4, E4, G4, C5, E5, G5
        const notes = [
            { f: 523.25, t: 0.0, d: 0.15 },
            { f: 659.25, t: 0.15, d: 0.15 },
            { f: 783.99, t: 0.3, d: 0.15 },
            { f: 1046.50, t: 0.45, d: 0.4 }
        ];

        notes.forEach(n => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + n.t;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.f, start);

            gain.gain.setValueAtTime(0.2, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + n.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + n.d);
        });
    }

    // Gentle Birthday Melody Background Music
    startBGM() {
        if (this.isMusicPlaying) return;
        this.init();
        this.isMusicPlaying = true;
        this.bgmNoteIndex = 0;

        // "Happy Birthday to you" sweet soft music box melody notes
        // [freq, duration, rest]
        const melody = [
            [261.63, 0.25], [261.63, 0.25], [293.66, 0.5], [261.63, 0.5], [349.23, 0.5], [329.63, 1.0],
            [261.63, 0.25], [261.63, 0.25], [293.66, 0.5], [261.63, 0.5], [392.00, 0.5], [349.23, 1.0],
            [261.63, 0.25], [261.63, 0.25], [523.25, 0.5], [440.00, 0.5], [349.23, 0.5], [329.63, 0.5], [293.66, 0.8],
            [466.16, 0.25], [466.16, 0.25], [440.00, 0.5], [349.23, 0.5], [392.00, 0.5], [349.23, 1.2]
        ];

        const playNext = () => {
            if (!this.isMusicPlaying || this.isMuted) return;

            const [freq, dur] = melody[this.bgmNoteIndex];
            const now = this.ctx.currentTime;

            // Dual oscillator music box sound
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + dur * 0.9);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + dur);

            this.bgmNoteIndex = (this.bgmNoteIndex + 1) % melody.length;
            this.bgmTimer = setTimeout(playNext, dur * 600);
        };

        playNext();
    }

    stopBGM() {
        this.isMusicPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    toggleBGM() {
        if (this.isMusicPlaying) {
            this.stopBGM();
            return false;
        } else {
            this.startBGM();
            return true;
        }
    }
}

// Global instance
const sound = new SoundEngine();
