import { ENEMY_HALF_HEIGHT, ENEMY_HALF_WIDTH, ENEMY_Y, type Enemy, type Gallery, LANE_X } from './rules';

const COLORS = {
  night: '#0b1a33',
  hill: '#071022',
  ink: '#0b0b0c',
  mist: '#aeb8c6',
  fire: '#f2662a',
  star: '#f4eee1',
  warning: '#e0534a',
};

const RISE_S = 0.35;
const FALL_S = 0.45;
const BURST_S = 0.5;
const WARNING_S = 0.6;
const STARS = [
  [0.08, 0.06],
  [0.3, 0.12],
  [0.55, 0.04],
  [0.78, 0.1],
  [0.92, 0.18],
  [0.2, 0.22],
];

export interface Shot {
  x: number;
  y: number;
  at: number;
}

export interface Frame {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  time: number;
  still: boolean;
}

function drawBackdrop({ ctx, width, height }: Frame) {
  ctx.fillStyle = COLORS.night;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = COLORS.star;
  ctx.globalAlpha = 0.6;
  STARS.forEach(([x = 0, y = 0]) => {
    ctx.beginPath();
    ctx.arc(x * width, y * height, 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = COLORS.hill;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.62);
  ctx.lineTo(width * 0.3, height * 0.56);
  ctx.lineTo(width * 0.62, height * 0.6);
  ctx.lineTo(width, height * 0.54);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.fill();
}

function drawMist({ ctx, width, height, time, still }: Frame, band: number) {
  const drift = still ? 0 : Math.sin(time * 0.4 + band) * width * 0.05;
  const y = height * (0.68 + band * 0.09);
  ctx.strokeStyle = COLORS.mist;
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.12 + band * 0.03;
  ctx.lineWidth = height * (0.06 + band * 0.02);
  ctx.beginPath();
  ctx.moveTo(-width * 0.2 + drift, y);
  ctx.bezierCurveTo(
    width * 0.2 + drift,
    y - height * 0.05,
    width * 0.5 + drift,
    y + height * 0.05,
    width * 1.2 + drift,
    y,
  );
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function silhouette(ctx: CanvasRenderingContext2D, cx: number, top: number, w: number, h: number) {
  const headR = w * 0.32;
  ctx.beginPath();
  ctx.arc(cx, top + headR, headR, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.5, top + h);
  ctx.lineTo(cx - w * 0.42, top + headR * 2.2);
  ctx.quadraticCurveTo(cx, top + headR * 1.9, cx + w * 0.42, top + headR * 2.2);
  ctx.lineTo(cx + w * 0.5, top + h);
  ctx.fill();
  ctx.fillRect(cx + w * 0.3, top + h * 0.42, w * 0.6, w * 0.12);
}

function drawEnemy(frame: Frame, enemy: Enemy, waveTime: number) {
  const { ctx, width, height, still } = frame;
  const cx = LANE_X[enemy.lane] * width;
  const w = ENEMY_HALF_WIDTH * 2 * width;
  const h = ENEMY_HALF_HEIGHT * 2 * height;
  const top = ENEMY_Y * height - h / 2;
  const since = waveTime - enemy.changedAt;
  ctx.fillStyle = COLORS.ink;

  if (enemy.state === 'up') {
    const rise = still ? 1 : Math.min(since / RISE_S, 1);
    silhouette(ctx, cx, top + (1 - rise) * h * 0.6, w, h);
    if (enemy.fireAt - waveTime > WARNING_S) return;
    ctx.fillStyle = COLORS.warning;
    ctx.beginPath();
    ctx.arc(cx + w * 0.95, top + h * 0.48, w * 0.12, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (enemy.state === 'down' && since < FALL_S) {
    ctx.save();
    ctx.globalAlpha = 1 - since / FALL_S;
    ctx.translate(cx, top + h);
    ctx.rotate((since / FALL_S) * 0.9);
    silhouette(ctx, 0, -h, w, h);
    ctx.restore();
    return;
  }

  if (enemy.state === 'trapped' && since < BURST_S) {
    ctx.save();
    ctx.globalAlpha = 1 - since / BURST_S;
    ctx.fillStyle = COLORS.fire;
    ctx.beginPath();
    ctx.arc(cx, top + h * 0.6, w * (0.4 + since * 2), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (enemy.state === 'fired' && since < 0.15) {
    ctx.fillStyle = COLORS.warning;
    ctx.beginPath();
    ctx.arc(cx + w * 0.95, top + h * 0.48, w * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawShot({ ctx, width, height, time }: Frame, shot: Shot | null) {
  if (!shot) return;
  const age = time - shot.at;
  if (age > 0.35) return;
  const x = shot.x * width;
  const y = shot.y * height;
  const r = width * 0.05;
  ctx.globalAlpha = 1 - age / 0.35;
  ctx.strokeStyle = COLORS.fire;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.moveTo(x - r * 1.5, y);
  ctx.lineTo(x - r * 0.5, y);
  ctx.moveTo(x + r * 0.5, y);
  ctx.lineTo(x + r * 1.5, y);
  ctx.moveTo(x, y - r * 1.5);
  ctx.lineTo(x, y - r * 0.5);
  ctx.moveTo(x, y + r * 0.5);
  ctx.lineTo(x, y + r * 1.5);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export function drawGallery(frame: Frame, gallery: Gallery, shot: Shot | null) {
  drawBackdrop(frame);
  drawMist(frame, 0);
  gallery.enemies.forEach((enemy) => {
    drawEnemy(frame, enemy, gallery.waveTime);
  });
  drawMist(frame, 1);
  drawMist(frame, 2);
  drawShot(frame, shot);
}
