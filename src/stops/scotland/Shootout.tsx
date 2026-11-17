import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { type PointerEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VehicleSilhouette } from '../../art/VehicleSilhouette';
import { prefersReducedMotion } from '../../motion';
import { EjectorSeat } from '../../perks/EjectorSeat';
import '../../perks/perks.css';
import { drawGallery, type Shot } from './drawGallery';
import {
  callSupport,
  createGallery,
  ENEMY_Y,
  type Gallery,
  type GalleryStatus,
  LANE_X,
  LANES,
  type Lane,
  nextWave,
  SUPPORT_WAVE,
  shoot,
  tick,
  WAVE_SIZES,
} from './rules';

const MAX_DPR = 2;

interface ShootoutProps {
  traps: readonly Lane[];
  lives?: number;
  hitRadius?: number;
  db5Support?: boolean;
  onEject?: () => void;
  onWon: () => void;
  onLost: () => void;
}

interface Hud {
  wave: number;
  lives: number;
  status: GalleryStatus;
}

export function Shootout({
  traps,
  lives,
  hitRadius,
  db5Support = false,
  onEject,
  onWon,
  onLost,
}: ShootoutProps) {
  const { t } = useTranslation('scotland');
  const scope = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gallery = useRef<Gallery>(createGallery(traps, { lives, hitRadius }));
  const shot = useRef<Shot | null>(null);
  const clock = useRef(0);
  const maxLives = useRef(gallery.current.lives);
  const [hud, setHud] = useState<Hud>({ wave: 0, lives: gallery.current.lives, status: 'running' });
  const [supportUsed, setSupportUsed] = useState(false);

  const { contextSafe } = useGSAP({ scope });

  const flash = contextSafe(() => {
    if (prefersReducedMotion())
      return gsap.fromTo('[data-flash]', { opacity: 0.7 }, { opacity: 0, duration: 0.6 });
    gsap.fromTo('[data-flash]', { opacity: 1 }, { opacity: 0, duration: 0.5 });
    gsap.fromTo('[data-stage]', { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
  });

  const sync = (next: Gallery) => {
    const previous = gallery.current;
    gallery.current = next;
    if (next.lives < previous.lives) flash();
    if (next.lives === previous.lives && next.wave === previous.wave && next.status === previous.status)
      return;
    setHud({ wave: next.wave, lives: next.lives, status: next.status });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: the loop reads live state through refs and runs once
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const still = prefersReducedMotion();
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const onTick = (time: number, deltaMs: number) => {
      clock.current = time;
      sync(tick(gallery.current, deltaMs / 1000));
      drawGallery(
        { ctx, width: canvas.clientWidth, height: canvas.clientHeight, time, still },
        gallery.current,
        shot.current,
      );
    };
    gsap.ticker.add(onTick);
    return () => {
      gsap.ticker.remove(onTick);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (hud.status === 'won') {
      const call = gsap.delayedCall(0.8, onWon);
      return () => void call.kill();
    }
    if (hud.status === 'lost') {
      const call = gsap.delayedCall(0.6, onLost);
      return () => void call.kill();
    }
  }, [hud.status, onWon, onLost]);

  const fireAt = (x: number, y: number) => {
    shot.current = { x, y, at: clock.current };
    sync(shoot(gallery.current, x, y).gallery);
  };

  const summonDb5 = contextSafe(() => {
    if (supportUsed) return;
    setSupportUsed(true);
    const strike = () => sync(callSupport(gallery.current));
    if (prefersReducedMotion()) return strike();
    gsap
      .timeline()
      .fromTo(
        '[data-db5]',
        { xPercent: -120, opacity: 1 },
        { xPercent: 260, duration: 1.4, ease: 'power1.inOut' },
      )
      .add(strike, 0.6)
      .fromTo('[data-db5-blast]', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1.4, duration: 0.25 }, 1.2)
      .to('[data-db5-blast]', { opacity: 0, duration: 0.5 })
      .set('[data-db5]', { opacity: 0 }, 1.3);
  });

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    fireAt((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
  };

  return (
    <main className="screen shootout" ref={scope}>
      <div className="shootout__hud">
        <span>{t('wave', { n: hud.wave + 1, total: WAVE_SIZES.length })}</span>
        <span
          className="shootout__lives"
          role="img"
          aria-label={t('livesLabel', { n: hud.lives, total: maxLives.current })}
        >
          {Array.from({ length: maxLives.current }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length health bar
            <span key={i} className={`shootout__life ${i < hud.lives ? '' : 'is-lost'}`} />
          ))}
        </span>
      </div>

      <div className="shootout__stage" data-stage>
        <canvas
          ref={canvasRef}
          className="shootout__canvas"
          role="img"
          aria-label={t('galleryLabel')}
          onPointerDown={onPointerDown}
        />
        <div className="shootout__flash" data-flash aria-hidden="true" />
        <fieldset className="lane-buttons">
          <legend className="sr-only">{t('laneButtons')}</legend>
          {LANES.map((lane) => (
            <button key={lane} type="button" onClick={() => fireAt(LANE_X[lane], ENEMY_Y)}>
              {t('shootLane', { lane: t(`lanes.${lane}`) })}
            </button>
          ))}
        </fieldset>

        <div className="shootout__db5" data-db5 aria-hidden="true">
          <VehicleSilhouette era="connery" rim="#d4a017" />
        </div>
        <div className="shootout__db5-blast" data-db5-blast aria-hidden="true" />

        {hud.status === 'between' && (
          <div className="shootout__overlay">
            <p className="stamp" style={{ color: 'var(--scotland-fire)' }}>
              {t('waveCleared')}
            </p>
            <button type="button" className="btn" onClick={() => sync(nextWave(gallery.current))}>
              {t('nextWave')}
            </button>
          </div>
        )}
      </div>

      {(db5Support || onEject) && (
        <div className="perk-bar shootout__perks">
          {db5Support && (
            <button
              type="button"
              className="perk-btn"
              style={{ color: 'var(--fortknox-gold)' }}
              aria-label={t('db5Label')}
              disabled={supportUsed || hud.status !== 'running' || hud.wave !== SUPPORT_WAVE}
              onClick={summonDb5}
            >
              {t('db5')}
            </button>
          )}
          {onEject && <EjectorSeat onEject={onEject} />}
        </div>
      )}

      <p className="shootout__hint">{t('shootHint')}</p>
    </main>
  );
}
