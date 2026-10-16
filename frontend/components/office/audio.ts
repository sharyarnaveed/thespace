/**
 * Optional ambient music and small sound effects, synthesised with Web Audio —
 * no audio files and no network requests. Nothing is created until `start()`
 * is called from a user gesture (browser autoplay rules).
 */
const CHORDS = [
  [220, 261.63, 329.63],
  [174.61, 220, 261.63],
  [196, 246.94, 293.66],
  [164.81, 196, 246.94],
];

export class OfficeAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;

  get playing() {
    return this.timer !== null;
  }

  private context() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.08;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1200;
      this.master.connect(filter).connect(this.ctx.destination);
    }
    void this.ctx.resume();
    return this.ctx;
  }

  private note(freq: number, at: number, length: number, type: OscillatorType = "triangle", level = 0.5) {
    const ctx = this.context();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(level, at + Math.min(0.6, length / 3));
    gain.gain.linearRampToValueAtTime(0, at + length);
    osc.connect(gain).connect(this.master!);
    osc.start(at);
    osc.stop(at + length + 0.05);
  }

  private bar() {
    const ctx = this.context();
    const chord = CHORDS[this.step++ % CHORDS.length];
    const t = ctx.currentTime + 0.05;
    chord.forEach((f) => this.note(f, t, 3.8, "sine", 0.35));
    [0, 1, 2, 1].forEach((n, i) => this.note(chord[n] * 2, t + i * 0.95, 0.8, "triangle", 0.18));
  }

  start() {
    if (this.timer) return;
    this.bar();
    this.timer = setInterval(() => this.bar(), 3800);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  /** Short two-note chime for interactions. Only plays once audio is enabled. */
  chime() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.note(659.25, t, 0.25, "square", 0.12);
    this.note(987.77, t + 0.1, 0.3, "square", 0.1);
  }

  dispose() {
    this.stop();
    void this.ctx?.close();
    this.ctx = null;
  }
}
