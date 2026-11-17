const BPM = 116;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;
const SWING = 0.62;
const MUSIC_LEVEL = 0.22;
const LOOK_AHEAD_S = 0.05;
const FADE_IN_S = 0.25;

const BASS = [
  [40, 43, 45, 47],
  [52, 50, 47, 45],
  [36, 40, 43, 45],
  [48, 47, 45, 43],
  [45, 48, 52, 48],
  [45, 43, 42, 40],
  [47, 51, 54, 57],
  [47, 45, 43, 42],
];

const MELODY: [number, number, number][][] = [
  [
    [71, 0, 1.5],
    [67, 1.5, 0.5],
    [69, 2, 1],
    [64, 3, 1],
  ],
  [
    [62, 0, 0.5],
    [64, 0.5, 0.5],
    [67, 1, 2.5],
  ],
  [
    [72, 0, 1.5],
    [71, 1.5, 0.5],
    [67, 2, 1],
    [64, 3, 1],
  ],
  [
    [66, 0, 0.5],
    [67, 0.5, 0.5],
    [71, 1, 2.5],
  ],
  [
    [72, 0, 1],
    [76, 1, 1],
    [74, 2, 0.5],
    [72, 2.5, 0.5],
    [69, 3, 1],
  ],
  [
    [67, 0, 1.5],
    [69, 1.5, 0.5],
    [64, 2, 2],
  ],
  [
    [71, 0, 1],
    [75, 1, 1],
    [78, 2, 1],
    [81, 3, 1],
  ],
  [
    [83, 0, 1.5],
    [81, 1.5, 0.5],
    [78, 2, 2],
  ],
];

const LOOP_S = BASS.length * BAR;

const freq = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

function swung(beat: number): number {
  const whole = Math.floor(beat);
  if (Math.abs(beat - whole - 0.5) < 0.01) return whole + SWING;
  return beat;
}

function impulse(ctx: AudioContext, seconds: number): AudioBuffer {
  const length = Math.ceil(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
  }
  return buffer;
}

function envelope(
  ctx: AudioContext,
  at: number,
  peak: number,
  attack: number,
  hold: number,
  release: number,
) {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + attack);
  gain.gain.setValueAtTime(peak, at + attack + hold);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + attack + hold + release);
  return gain;
}

interface Bus {
  ctx: AudioContext;
  dry: AudioNode;
  wet: AudioNode;
}

function guitar({ ctx, dry, wet }: Bus, midi: number, at: number, length: number) {
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = freq(midi);
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2600, at);
  filter.frequency.exponentialRampToValueAtTime(900, at + length);
  const tremolo = ctx.createGain();
  tremolo.gain.value = 0.65;
  const lfo = ctx.createOscillator();
  const depth = ctx.createGain();
  lfo.frequency.value = 7;
  depth.gain.value = 0.35;
  lfo.connect(depth).connect(tremolo.gain);
  const env = envelope(ctx, at, 0.22, 0.008, length * 0.6, length * 0.6 + 0.2);
  osc.connect(filter).connect(tremolo).connect(env);
  env.connect(dry);
  env.connect(wet);
  const end = at + length * 1.3 + 0.4;
  osc.start(at);
  lfo.start(at);
  osc.stop(end);
  lfo.stop(end);
}

function bass({ ctx, dry }: Bus, midi: number, at: number) {
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = freq(midi);
  const env = envelope(ctx, at, 0.5, 0.01, BEAT * 0.5, BEAT * 0.35);
  osc.connect(env).connect(dry);
  osc.start(at);
  osc.stop(at + BEAT * 1.1);
}

function noise(
  bus: Bus,
  at: number,
  length: number,
  type: BiquadFilterType,
  frequency: number,
  peak: number,
) {
  const { ctx, dry } = bus;
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * (length + 0.05)), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = frequency;
  source
    .connect(filter)
    .connect(envelope(ctx, at, peak, 0.003, 0, length))
    .connect(dry);
  source.start(at);
}

function kick({ ctx, dry }: Bus, at: number) {
  const osc = ctx.createOscillator();
  osc.frequency.setValueAtTime(110, at);
  osc.frequency.exponentialRampToValueAtTime(45, at + 0.15);
  osc.connect(envelope(ctx, at, 0.5, 0.004, 0, 0.25)).connect(dry);
  osc.start(at);
  osc.stop(at + 0.3);
}

function scheduleLoop(bus: Bus, start: number) {
  BASS.forEach((bar, index) => {
    const barStart = start + index * BAR;
    bar.forEach((midi, beat) => {
      bass(bus, midi, barStart + beat * BEAT);
    });
    MELODY[index]?.forEach(([midi, beat, length]) => {
      guitar(bus, midi, barStart + swung(beat) * BEAT, length * BEAT);
    });
    [0, 1, 2, 3].forEach((beat) => {
      noise(bus, barStart + beat * BEAT, 0.18, 'highpass', 7000, 0.07);
      noise(bus, barStart + swung(beat + 0.5) * BEAT, 0.08, 'highpass', 8000, 0.04);
    });
    [1, 3].forEach((beat) => {
      noise(bus, barStart + beat * BEAT, 0.22, 'bandpass', 2200, 0.09);
    });
    kick(bus, barStart);
  });
}

export function startMotif(ctx: AudioContext, destination: AudioNode): () => void {
  const volume = ctx.createGain();
  volume.gain.setValueAtTime(0, ctx.currentTime);
  volume.gain.linearRampToValueAtTime(MUSIC_LEVEL, ctx.currentTime + FADE_IN_S);
  volume.connect(destination);
  const reverb = ctx.createConvolver();
  reverb.buffer = impulse(ctx, 2.2);
  const wetLevel = ctx.createGain();
  wetLevel.gain.value = 0.28;
  reverb.connect(wetLevel).connect(volume);
  const bus: Bus = { ctx, dry: volume, wet: reverb };

  let next = ctx.currentTime + LOOK_AHEAD_S;
  scheduleLoop(bus, next);
  next += LOOP_S;
  const timer = window.setInterval(() => {
    if (next - ctx.currentTime > 2) return;
    scheduleLoop(bus, next);
    next += LOOP_S;
  }, 500);

  return () => {
    window.clearInterval(timer);
    const now = ctx.currentTime;
    volume.gain.cancelScheduledValues(now);
    volume.gain.setValueAtTime(Math.max(volume.gain.value, 0.0001), now);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    window.setTimeout(() => volume.disconnect(), 1400);
  };
}
