import { describe, expect, it } from 'vitest';
import {
  createGallery,
  ENEMY_Y,
  type Gallery,
  LANE_X,
  nextWave,
  type Random,
  START_LIVES,
  shoot,
  tick,
  WAVE_SIZES,
} from './rules';

const alwaysDoor: Random = () => 0.7;

function runUntil(gallery: Gallery, predicate: (g: Gallery) => boolean, stepS = 0.05, limitS = 60): Gallery {
  let current = gallery;
  for (let t = 0; t < limitS && !predicate(current); t += stepS) current = tick(current, stepS);
  return current;
}

function shootEveryone(gallery: Gallery): Gallery {
  return gallery.enemies
    .filter((enemy) => enemy.state === 'up')
    .reduce((state, enemy) => shoot(state, LANE_X[enemy.lane], ENEMY_Y).gallery, gallery);
}

describe('Scotland shootout', () => {
  it('starts in wave 1 with five lives', () => {
    const gallery = createGallery([], { random: alwaysDoor });
    expect(gallery.wave).toBe(0);
    expect(gallery.lives).toBe(START_LIVES);
    expect(gallery.enemies).toHaveLength(WAVE_SIZES[0]);
  });

  it('lets an extra life be granted', () => {
    expect(createGallery([], { lives: 6 }).lives).toBe(6);
  });

  it('raises an enemy when its spawn time arrives', () => {
    const gallery = runUntil(createGallery([], { random: alwaysDoor }), (g) =>
      g.enemies.some((e) => e.state === 'up'),
    );
    expect(gallery.enemies.filter((e) => e.state === 'up')).toHaveLength(1);
  });

  it('takes a life when an exposed enemy fires', () => {
    const gallery = runUntil(createGallery([], { random: alwaysDoor }), (g) => g.lives < START_LIVES);
    expect(gallery.lives).toBe(START_LIVES - 1);
    expect(gallery.enemies.some((e) => e.state === 'fired')).toBe(true);
  });

  it('drops an enemy hit inside its silhouette', () => {
    const raised = runUntil(createGallery([], { random: alwaysDoor }), (g) =>
      g.enemies.some((e) => e.state === 'up'),
    );
    const { gallery, hit } = shoot(raised, LANE_X.door, ENEMY_Y);
    expect(hit?.state).toBe('down');
    expect(gallery.enemies.filter((e) => e.state === 'down')).toHaveLength(1);
  });

  it('misses a shot far from any enemy', () => {
    const raised = runUntil(createGallery([], { random: alwaysDoor }), (g) =>
      g.enemies.some((e) => e.state === 'up'),
    );
    expect(shoot(raised, LANE_X.upperLeft, 0.1).hit).toBeNull();
  });

  it('a bigger hit radius forgives a near miss', () => {
    const base = runUntil(createGallery([], { random: alwaysDoor }), (g) =>
      g.enemies.some((e) => e.state === 'up'),
    );
    const nearMiss = LANE_X.door + 0.15;
    expect(shoot(base, nearMiss, ENEMY_Y).hit).toBeNull();
    expect(shoot({ ...base, hitRadius: 0.1 }, nearMiss, ENEMY_Y).hit).not.toBeNull();
  });

  it('a trap takes the first enemy of its lane once per wave', () => {
    const gallery = runUntil(createGallery(['door'], { random: alwaysDoor }), (g) =>
      g.enemies.some((e) => e.state !== 'hidden'),
    );
    expect(gallery.enemies.filter((e) => e.state === 'trapped')).toHaveLength(1);
    const later = runUntil(gallery, (g) => g.enemies.some((e) => e.state === 'up'));
    expect(later.enemies.filter((e) => e.state === 'trapped')).toHaveLength(1);
  });

  it('pauses between waves and wins after the third with a perfect aim', () => {
    let gallery = createGallery([], { random: alwaysDoor });
    for (let wave = 0; wave < WAVE_SIZES.length; wave++) {
      while (gallery.status === 'running') gallery = shootEveryone(tick(gallery, 0.05));
      if (wave < WAVE_SIZES.length - 1) {
        expect(gallery.status).toBe('between');
        gallery = nextWave(gallery, alwaysDoor);
      }
    }
    expect(gallery.status).toBe('won');
    expect(gallery.lives).toBe(START_LIVES);
  });

  it('is lost when the lives run out', () => {
    const gallery = runUntil(createGallery([], { random: alwaysDoor, lives: 1 }), (g) => g.status === 'lost');
    expect(gallery.status).toBe('lost');
    expect(gallery.lives).toBe(0);
  });
});
