import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { prefersReducedMotion } from '../../motion';

const PALETTE = {
  night: '#0b1a33',
  petrol: '#12566a',
  turquoise: '#1fb5b0',
  sea: '#128a86',
  sand: '#e8d3a2',
  fire: '#f2662a',
  amber: '#f2a64a',
  ink: '#0b0b0c',
};
const MAX_SPARKS = 90;
const MAX_DPR = 2;

interface SceneState {
  sky: string;
  houseShift: number;
  fire: number;
  emberX: number;
  emberY: number;
  emberR: number;
  emberColor: string;
  glow: number;
  seaTop: number;
  sandTop: number;
  islandShow: number;
  palmX: number;
}

interface Spark {
  x: number;
  y: number;
  vy: number;
  phase: number;
  life: number;
  r: number;
}

const START: SceneState = {
  sky: PALETTE.night,
  houseShift: 0,
  fire: 1,
  emberX: 0.5,
  emberY: 0.56,
  emberR: 3,
  emberColor: PALETTE.fire,
  glow: 8,
  seaTop: 1.1,
  sandTop: 1.2,
  islandShow: 0,
  palmX: -0.5,
};

const END: SceneState = {
  sky: PALETTE.turquoise,
  houseShift: 1.2,
  fire: 0,
  emberX: 0.5,
  emberY: 0.2,
  emberR: 52,
  emberColor: PALETTE.sand,
  glow: 30,
  seaTop: 0.58,
  sandTop: 0.82,
  islandShow: 1,
  palmX: 0,
};

function drawHouse(ctx: CanvasRenderingContext2D, w: number, top: number, fire: number, time: number) {
  const mid = w * 0.5;
  ctx.fillStyle = '#071022';
  ctx.beginPath();
  ctx.moveTo(0, top + 150);
  ctx.lineTo(w * 0.3, top + 120);
  ctx.lineTo(w, top + 140);
  ctx.lineTo(w, top + 600);
  ctx.lineTo(0, top + 600);
  ctx.fill();
  ctx.fillStyle = PALETTE.ink;
  ctx.beginPath();
  ctx.moveTo(w * 0.24, top + 160);
  ctx.lineTo(w * 0.24, top + 60);
  ctx.lineTo(mid, top);
  ctx.lineTo(w * 0.76, top + 60);
  ctx.lineTo(w * 0.76, top + 160);
  ctx.fill();
  if (fire <= 0.01) return;
  ctx.lineCap = 'round';
  ctx.globalAlpha = fire;
  [
    [-40, 14, PALETTE.fire],
    [0, 10, PALETTE.amber],
    [40, 12, PALETTE.fire],
    [-14, 6, PALETTE.amber],
  ].forEach(([dx = 0, lw = 0, color = PALETTE.fire], i) => {
    const sway = Math.sin(time * 6 + i) * 8;
    const x = mid + Number(dx);
    ctx.strokeStyle = String(color);
    ctx.lineWidth = Number(lw);
    ctx.beginPath();
    ctx.moveTo(x, top + 50);
    ctx.bezierCurveTo(x - 20 + sway, top + 10, x + 20 - sway, top - 30, x + sway, top - 70 - i * 6);
    ctx.stroke();
  });
  ctx.globalAlpha = 1;
}

function drawPalm(ctx: CanvasRenderingContext2D, baseX: number, baseY: number) {
  const topX = baseX - 14;
  const topY = baseY - 260;
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(baseX, baseY + 10);
  ctx.quadraticCurveTo(baseX + 24, baseY - 140, topX, topY);
  ctx.stroke();
  ctx.fillStyle = PALETTE.ink;
  [
    [-90, 30],
    [100, 40],
    [20, -70],
    [-60, -40],
    [70, -30],
  ].forEach(([dx = 0, dy = 0]) => {
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(topX + dx * 0.5, topY + dy - 30, topX + dx, topY + dy);
    ctx.quadraticCurveTo(topX + dx * 0.5, topY + dy * 0.4, topX, topY + 4);
    ctx.fill();
  });
}

function drawBeach(ctx: CanvasRenderingContext2D, w: number, h: number, s: SceneState) {
  const seaY = h * s.seaTop;
  ctx.fillStyle = PALETTE.sea;
  ctx.fillRect(0, seaY, w, h);
  if (s.islandShow > 0) {
    ctx.globalAlpha = s.islandShow;
    ctx.fillStyle = PALETTE.ink;
    ctx.beginPath();
    ctx.moveTo(w * 0.55, seaY);
    ctx.quadraticCurveTo(w * 0.66, seaY - 34, w * 0.78, seaY - 22);
    ctx.quadraticCurveTo(w * 0.86, seaY - 30, w * 0.94, seaY);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  const sandY = h * s.sandTop;
  ctx.fillStyle = PALETTE.sand;
  ctx.beginPath();
  ctx.moveTo(0, sandY);
  ctx.quadraticCurveTo(w * 0.45, sandY - 40, w, sandY + 20);
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.fill();
  drawPalm(ctx, w * (0.12 + s.palmX), sandY);
}

interface EmberToSunProps {
  label: string;
  onDone: () => void;
}

export function EmberToSun({ label, onDone }: EmberToSunProps) {
  const scope = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      const reduced = prefersReducedMotion();
      const state: SceneState = { ...START };
      let sparks: Spark[] = [];
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = canvas.clientWidth * ratio;
      canvas.height = canvas.clientHeight * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const render = (time: number) => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        ctx.fillStyle = state.sky;
        ctx.fillRect(0, 0, w, h);
        const houseTop = h * (0.62 + state.houseShift);
        drawHouse(ctx, w, houseTop, state.fire, reduced ? 0 : time);
        if (!reduced && sparks.length < MAX_SPARKS && Math.random() < state.fire * 0.6) {
          sparks.push({
            x: w * (0.35 + Math.random() * 0.3),
            y: houseTop + 10,
            vy: 0.6 + Math.random() * 1.2,
            phase: Math.random() * 6,
            life: 1,
            r: 1 + Math.random() * 1.6,
          });
        }
        sparks = sparks.filter((spark) => spark.life > 0);
        sparks.forEach((spark) => {
          spark.y -= spark.vy;
          spark.phase += 0.05;
          spark.x += Math.sin(spark.phase) * 0.4;
          spark.life -= 0.006;
          ctx.globalAlpha = Math.max(spark.life, 0) * Math.max(state.fire, 0.2);
          ctx.fillStyle = PALETTE.fire;
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, spark.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        drawBeach(ctx, w, h, state);
        ctx.save();
        ctx.shadowColor = state.emberColor;
        ctx.shadowBlur = state.glow;
        ctx.fillStyle = state.emberColor;
        ctx.beginPath();
        ctx.arc(w * state.emberX, h * state.emberY, state.emberR, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      gsap.ticker.add(render);

      if (reduced) {
        gsap
          .timeline({ onComplete: onDone })
          .to(state, { ...END, duration: 0.8, ease: 'none' }, 0.6)
          .to({}, { duration: 0.8 });
      }
      if (!reduced) {
        gsap
          .timeline({ onComplete: onDone })
          .to(state, { emberY: 0.4, emberX: 0.47, houseShift: 0.5, duration: 1.4, ease: 'sine.inOut' }, 0.4)
          .to(state, {
            emberR: 22,
            glow: 26,
            houseShift: 1.2,
            fire: 0,
            emberX: 0.5,
            duration: 1.1,
            ease: 'sine.inOut',
          })
          .to(state, {
            sky: PALETTE.petrol,
            emberColor: PALETTE.amber,
            emberR: 34,
            duration: 0.8,
            ease: 'none',
          })
          .to(state, {
            sky: END.sky,
            emberColor: END.emberColor,
            emberR: END.emberR,
            emberY: END.emberY,
            glow: END.glow,
            seaTop: END.seaTop,
            duration: 1.1,
            ease: 'power2.out',
          })
          .to(
            state,
            { islandShow: 1, sandTop: END.sandTop, palmX: 0, duration: 0.9, ease: 'power3.out' },
            '-=0.4',
          )
          .to({}, { duration: 0.4 });
      }
      return () => gsap.ticker.remove(render);
    },
    { scope },
  );

  return (
    <main className="screen ember-sun" ref={scope} role="img" aria-label={label}>
      <canvas ref={canvasRef} />
    </main>
  );
}
