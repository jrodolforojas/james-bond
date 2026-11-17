export type Synth = (ctx: AudioContext, out: AudioNode) => void;

function noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function envelope(ctx: AudioContext, out: AudioNode, peak: number, attack: number, decay: number): GainNode {
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
  gain.connect(out);
  return gain;
}

function noiseBurst(
  ctx: AudioContext,
  out: AudioNode,
  options: { type: BiquadFilterType; freq: number; q?: number; peak: number; decay: number },
) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx, options.decay + 0.05);
  const filter = ctx.createBiquadFilter();
  filter.type = options.type;
  filter.frequency.value = options.freq;
  filter.Q.value = options.q ?? 1;
  source.connect(filter).connect(envelope(ctx, out, options.peak, 0.003, options.decay));
  source.start();
}

function tone(
  ctx: AudioContext,
  out: AudioNode,
  options: { type: OscillatorType; freq: number; to?: number; peak: number; decay: number },
) {
  const osc = ctx.createOscillator();
  osc.type = options.type;
  const now = ctx.currentTime;
  osc.frequency.setValueAtTime(options.freq, now);
  if (options.to) osc.frequency.exponentialRampToValueAtTime(options.to, now + options.decay);
  osc.connect(envelope(ctx, out, options.peak, 0.005, options.decay));
  osc.start();
  osc.stop(now + options.decay + 0.05);
}

export const SYNTHS = {
  key: (ctx, out) => noiseBurst(ctx, out, { type: 'highpass', freq: 3000, peak: 0.25, decay: 0.03 }),
  static: (ctx, out) =>
    noiseBurst(ctx, out, { type: 'bandpass', freq: 2500, q: 0.6, peak: 0.35, decay: 0.45 }),
  stamp: (ctx, out) => {
    tone(ctx, out, { type: 'sine', freq: 140, to: 50, peak: 0.9, decay: 0.25 });
    noiseBurst(ctx, out, { type: 'lowpass', freq: 900, peak: 0.5, decay: 0.08 });
  },
  thud: (ctx, out) => tone(ctx, out, { type: 'sine', freq: 70, to: 38, peak: 0.8, decay: 0.7 }),
  whoosh: (ctx, out) => noiseBurst(ctx, out, { type: 'bandpass', freq: 800, q: 0.8, peak: 0.4, decay: 0.5 }),
  click: (ctx, out) => tone(ctx, out, { type: 'square', freq: 1400, peak: 0.12, decay: 0.03 }),
  tick: (ctx, out) => tone(ctx, out, { type: 'sine', freq: 1800, peak: 0.18, decay: 0.04 }),
  snap: (ctx, out) => noiseBurst(ctx, out, { type: 'bandpass', freq: 4200, q: 2, peak: 0.6, decay: 0.05 }),
  buzz: (ctx, out) => tone(ctx, out, { type: 'square', freq: 110, peak: 0.25, decay: 0.3 }),
  ping: (ctx, out) => tone(ctx, out, { type: 'sine', freq: 1760, to: 1600, peak: 0.25, decay: 0.6 }),
  chips: (ctx, out) => {
    tone(ctx, out, { type: 'triangle', freq: 2400, peak: 0.15, decay: 0.05 });
    setTimeout(() => tone(ctx, out, { type: 'triangle', freq: 2100, peak: 0.12, decay: 0.05 }), 60);
  },
  shot: (ctx, out) => {
    noiseBurst(ctx, out, { type: 'lowpass', freq: 2500, peak: 0.8, decay: 0.18 });
    tone(ctx, out, { type: 'sine', freq: 90, to: 40, peak: 0.6, decay: 0.2 });
  },
  hit: (ctx, out) => noiseBurst(ctx, out, { type: 'lowpass', freq: 600, peak: 0.7, decay: 0.35 }),
  correct: (ctx, out) => {
    tone(ctx, out, { type: 'sine', freq: 660, peak: 0.2, decay: 0.15 });
    setTimeout(() => tone(ctx, out, { type: 'sine', freq: 990, peak: 0.2, decay: 0.25 }), 110);
  },
  wrong: (ctx, out) => tone(ctx, out, { type: 'sawtooth', freq: 180, to: 90, peak: 0.2, decay: 0.4 }),
  tone: (ctx, out) => tone(ctx, out, { type: 'sine', freq: 55, peak: 0.5, decay: 3 }),
  select: (ctx, out) => {
    tone(ctx, out, { type: 'sine', freq: 880, peak: 0.12, decay: 0.06 });
    setTimeout(() => tone(ctx, out, { type: 'sine', freq: 1320, peak: 0.1, decay: 0.08 }), 45);
  },
  paper: (ctx, out) => {
    noiseBurst(ctx, out, { type: 'bandpass', freq: 1800, q: 0.5, peak: 0.18, decay: 0.12 });
    setTimeout(
      () => noiseBurst(ctx, out, { type: 'bandpass', freq: 2600, q: 0.6, peak: 0.12, decay: 0.18 }),
      70,
    );
  },
  ignite: (ctx, out) => noiseBurst(ctx, out, { type: 'lowpass', freq: 1500, peak: 0.5, decay: 0.9 }),
} satisfies Record<string, Synth>;

export type CueName = keyof typeof SYNTHS;

export type AmbienceName = 'wind' | 'fire' | 'waves';

export function startAmbience(ctx: AudioContext, out: AudioNode, name: AmbienceName): () => void {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx, 4);
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  const settings = {
    wind: {
      type: 'bandpass' as BiquadFilterType,
      freq: 500,
      q: 0.7,
      level: 0.18,
      lfoRate: 0.15,
      lfoDepth: 250,
    },
    fire: { type: 'lowpass' as BiquadFilterType, freq: 1200, q: 0.4, level: 0.12, lfoRate: 7, lfoDepth: 500 },
    waves: {
      type: 'lowpass' as BiquadFilterType,
      freq: 700,
      q: 0.5,
      level: 0.16,
      lfoRate: 0.12,
      lfoDepth: 450,
    },
  }[name];
  filter.type = settings.type;
  filter.frequency.value = settings.freq;
  filter.Q.value = settings.q;
  lfo.frequency.value = settings.lfoRate;
  lfoGain.gain.value = settings.lfoDepth;
  lfo.connect(lfoGain).connect(filter.frequency);
  gain.gain.value = 0;
  gain.gain.linearRampToValueAtTime(settings.level, ctx.currentTime + 1.5);
  source.connect(filter).connect(gain).connect(out);
  source.start();
  lfo.start();
  return () => {
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    source.stop(ctx.currentTime + 0.9);
    lfo.stop(ctx.currentTime + 0.9);
  };
}
