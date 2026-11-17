export const LANES = ['upperLeft', 'upperRight', 'lowerLeft', 'door', 'lowerRight'] as const;
export type Lane = (typeof LANES)[number];

export const TRAP_COUNT = 2;
export const START_LIVES = 5;
export const BASE_HIT_RADIUS = 0.06;
export const WAVE_SIZES = [5, 7, 9] as const;
export const WAVE_EXPOSURE_S = [2.4, 2, 1.6] as const;
const WAVE_SPAWN_SPACING_S = [1.6, 1.25, 1] as const;
const FIRST_SPAWN_S = 0.8;

export const LANE_X: Record<Lane, number> = {
  upperLeft: 0.14,
  upperRight: 0.86,
  lowerLeft: 0.3,
  door: 0.5,
  lowerRight: 0.7,
};
export const ENEMY_Y = 0.6;
export const ENEMY_HALF_WIDTH = 0.06;
export const ENEMY_HALF_HEIGHT = 0.14;

export type Random = () => number;

export type EnemyState = 'hidden' | 'up' | 'down' | 'trapped' | 'fired';

export interface Enemy {
  id: number;
  lane: Lane;
  spawnAt: number;
  fireAt: number;
  state: EnemyState;
  changedAt: number;
}

export type GalleryStatus = 'running' | 'between' | 'won' | 'lost';

export interface Gallery {
  wave: number;
  waveTime: number;
  enemies: Enemy[];
  lives: number;
  traps: Lane[];
  sprung: Lane[];
  status: GalleryStatus;
  hitRadius: number;
}

export interface GalleryOptions {
  lives?: number;
  hitRadius?: number;
  random?: Random;
}

export function buildWave(wave: number, random: Random = Math.random): Enemy[] {
  const size = WAVE_SIZES[wave] ?? 0;
  const spacing = WAVE_SPAWN_SPACING_S[wave] ?? 1;
  const exposure = WAVE_EXPOSURE_S[wave] ?? 1.5;
  return Array.from({ length: size }, (_, i) => {
    const lane = LANES[Math.floor(random() * LANES.length)] ?? 'door';
    const spawnAt = FIRST_SPAWN_S + i * spacing + random() * 0.4;
    return { id: wave * 100 + i, lane, spawnAt, fireAt: spawnAt + exposure, state: 'hidden', changedAt: 0 };
  });
}

export function createGallery(traps: readonly Lane[], options: GalleryOptions = {}): Gallery {
  return {
    wave: 0,
    waveTime: 0,
    enemies: buildWave(0, options.random),
    lives: options.lives ?? START_LIVES,
    traps: traps.slice(0, TRAP_COUNT),
    sprung: [],
    status: 'running',
    hitRadius: options.hitRadius ?? BASE_HIT_RADIUS,
  };
}

function isResolved(enemy: Enemy): boolean {
  return enemy.state !== 'hidden' && enemy.state !== 'up';
}

function advanceEnemy(gallery: Gallery, enemy: Enemy, time: number, sprung: Lane[]): Enemy {
  if (enemy.state === 'hidden' && time >= enemy.spawnAt) {
    const trapReady = gallery.traps.includes(enemy.lane) && !sprung.includes(enemy.lane);
    if (trapReady) {
      sprung.push(enemy.lane);
      return { ...enemy, state: 'trapped', changedAt: time };
    }
    return { ...enemy, state: 'up', changedAt: time };
  }
  if (enemy.state === 'up' && time >= enemy.fireAt) return { ...enemy, state: 'fired', changedAt: time };
  return enemy;
}

function settle(gallery: Gallery): Gallery {
  if (gallery.lives <= 0) return { ...gallery, lives: 0, status: 'lost' };
  if (!gallery.enemies.every(isResolved)) return gallery;
  if (gallery.wave >= WAVE_SIZES.length - 1) return { ...gallery, status: 'won' };
  return { ...gallery, status: 'between' };
}

export function tick(gallery: Gallery, elapsedS: number): Gallery {
  if (gallery.status !== 'running') return gallery;
  const waveTime = gallery.waveTime + elapsedS;
  const sprung = [...gallery.sprung];
  const enemies = gallery.enemies.map((enemy) => advanceEnemy(gallery, enemy, waveTime, sprung));
  const newlyFired = enemies.filter(
    (enemy, i) => enemy.state === 'fired' && gallery.enemies[i]?.state !== 'fired',
  ).length;
  return settle({ ...gallery, waveTime, enemies, sprung, lives: gallery.lives - newlyFired });
}

export function nextWave(gallery: Gallery, random: Random = Math.random): Gallery {
  if (gallery.status !== 'between') return gallery;
  const wave = gallery.wave + 1;
  return { ...gallery, wave, waveTime: 0, enemies: buildWave(wave, random), sprung: [], status: 'running' };
}

export function shoot(gallery: Gallery, x: number, y: number): { gallery: Gallery; hit: Enemy | null } {
  if (gallery.status !== 'running') return { gallery, hit: null };
  const target = gallery.enemies.find(
    (enemy) =>
      enemy.state === 'up' &&
      Math.abs(LANE_X[enemy.lane] - x) <= ENEMY_HALF_WIDTH + gallery.hitRadius &&
      Math.abs(ENEMY_Y - y) <= ENEMY_HALF_HEIGHT + gallery.hitRadius,
  );
  if (!target) return { gallery, hit: null };
  const down: Enemy = { ...target, state: 'down', changedAt: gallery.waveTime };
  const enemies = gallery.enemies.map((enemy) => (enemy.id === target.id ? down : enemy));
  return { gallery: settle({ ...gallery, enemies }), hit: down };
}
