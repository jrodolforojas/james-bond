import { CUE_FILES } from './manifest';
import { startMotif } from './motif';
import { type AmbienceName, type CueName, SYNTHS, startAmbience } from './synth';

const MASTER_LEVEL = 0.8;

let context: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
const buffers = new Map<CueName, AudioBuffer>();
const ambiences = new Map<AmbienceName, () => void>();
let stopMusicNow: (() => void) | null = null;
let musicWanted = false;
const wantedAmbiences = new Set<AmbienceName>();

function ensureContext(): AudioContext | null {
  if (context) return context;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  context = new Ctor();
  master = context.createGain();
  master.gain.value = MASTER_LEVEL;
  master.connect(context.destination);
  return context;
}

async function preload(ctx: AudioContext) {
  await Promise.all(
    Object.entries(CUE_FILES).map(async ([cue, file]) => {
      try {
        const response = await fetch(`/audio/${file}`);
        if (!response.ok) return;
        buffers.set(cue as CueName, await ctx.decodeAudioData(await response.arrayBuffer()));
      } catch {
        return;
      }
    }),
  );
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (!on) {
    ambiences.forEach((stop) => {
      stop();
    });
    ambiences.clear();
    stopMusicNow?.();
    stopMusicNow = null;
    return;
  }
  const ctx = ensureContext();
  if (!ctx) return;
  void ctx.resume();
  if (buffers.size === 0) void preload(ctx);
  if (musicWanted) startMusic();
  wantedAmbiences.forEach((name) => {
    startAmbient(name);
  });
}

export function playCue(cue: CueName) {
  if (!enabled || !context || !master) return;
  const buffer = buffers.get(cue);
  if (!buffer) return SYNTHS[cue](context, master);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(master);
  source.start();
}

export function startAmbient(name: AmbienceName) {
  wantedAmbiences.add(name);
  if (!enabled || !context || !master || ambiences.has(name)) return;
  ambiences.set(name, startAmbience(context, master, name));
}

export function stopAmbient(name: AmbienceName) {
  wantedAmbiences.delete(name);
  ambiences.get(name)?.();
  ambiences.delete(name);
}

export function startMusic() {
  musicWanted = true;
  if (!enabled || !context || !master || stopMusicNow) return;
  stopMusicNow = startMotif(context, master);
}

export function stopMusic() {
  musicWanted = false;
  stopMusicNow?.();
  stopMusicNow = null;
}
