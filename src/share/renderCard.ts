export const CARD_SIZE = { width: 1080, height: 1920 };

const COLORS = {
  manila: '#d9b97a',
  paper: '#f1e4c3',
  ink: '#2b2118',
  inkMuted: '#5a4b3a',
  black: '#0b0b0c',
  stamp: '#b3261e',
};

const FONTS = {
  display: '"Bodoni Moda", "Didot", serif',
  report: '"Courier Prime", "Courier New", monospace',
  stamp: '"Special Elite", "Courier New", monospace',
};

const PAD = 84;
const GRAIN_DOTS = 9000;

export interface CardContent {
  header: string;
  titleTop: string;
  titleBottom: string;
  rows: { label: string; value: string }[];
  rankLabel: string;
  rankValue: string;
  approved: string;
  footer: string;
  vehiclePath: string | null;
  vehicleColor: string;
}

export async function loadCardFonts() {
  await Promise.all([
    document.fonts.load(`500 120px ${FONTS.display}`),
    document.fonts.load(`italic 500 120px ${FONTS.display}`),
    document.fonts.load(`400 40px ${FONTS.report}`),
    document.fonts.load(`700 40px ${FONTS.report}`),
    document.fonts.load(`400 60px ${FONTS.stamp}`),
  ]);
}

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function drawGrain(ctx: CanvasRenderingContext2D) {
  const random = seededRandom(7);
  ctx.fillStyle = 'rgba(90, 64, 25, 0.12)';
  for (let i = 0; i < GRAIN_DOTS; i++) {
    ctx.fillRect(random() * CARD_SIZE.width, random() * CARD_SIZE.height, 2, 2);
  }
}

function drawTitle(ctx: CanvasRenderingContext2D, content: CardContent) {
  ctx.fillStyle = COLORS.ink;
  ctx.font = `700 30px ${FONTS.report}`;
  ctx.textBaseline = 'top';
  ctx.fillText(content.header.split('').join(String.fromCharCode(8202)), PAD, PAD);
  ctx.font = `500 132px ${FONTS.display}`;
  ctx.fillText(content.titleTop, PAD, 190);
  ctx.font = `italic 500 132px ${FONTS.display}`;
  ctx.fillText(content.titleBottom, PAD, 330);
}

function drawVehicle(ctx: CanvasRenderingContext2D, content: CardContent) {
  const top = 520;
  const height = 430;
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(PAD, top, CARD_SIZE.width - PAD * 2, height);
  if (!content.vehiclePath) return;
  ctx.save();
  ctx.translate(PAD + 70, top + 150);
  ctx.scale(1.95, 1.95);
  ctx.fillStyle = content.vehicleColor;
  ctx.fill(new Path2D(content.vehiclePath));
  ctx.fillStyle = COLORS.black;
  [92, 316].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, 102, 24, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawRows(ctx: CanvasRenderingContext2D, content: CardContent) {
  const top = 1000;
  const rowHeight = 86;
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(PAD, top, CARD_SIZE.width - PAD * 2, rowHeight * content.rows.length + 60);
  content.rows.forEach((row, i) => {
    const y = top + 40 + i * rowHeight;
    ctx.fillStyle = COLORS.inkMuted;
    ctx.font = `400 34px ${FONTS.report}`;
    ctx.fillText(row.label, PAD + 40, y);
    ctx.fillStyle = COLORS.ink;
    ctx.font = `700 40px ${FONTS.report}`;
    ctx.fillText(row.value, PAD + 330, y - 3, CARD_SIZE.width - PAD * 2 - 370);
  });
}

function drawRank(ctx: CanvasRenderingContext2D, content: CardContent) {
  const y = 1560;
  ctx.fillStyle = COLORS.ink;
  ctx.font = `400 30px ${FONTS.report}`;
  ctx.fillText(content.rankLabel, PAD, y);
  ctx.font = `italic 500 84px ${FONTS.display}`;
  ctx.fillText(content.rankValue, PAD, y + 44);

  ctx.save();
  ctx.translate(CARD_SIZE.width - PAD - 160, y + 140);
  ctx.rotate(-0.14);
  ctx.strokeStyle = COLORS.stamp;
  ctx.fillStyle = COLORS.stamp;
  ctx.lineWidth = 7;
  ctx.font = `400 54px ${FONTS.stamp}`;
  const width = ctx.measureText(content.approved).width + 48;
  ctx.strokeRect(-width / 2, -46, width, 92);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(content.approved, 0, 4);
  ctx.restore();
}

function drawFooter(ctx: CanvasRenderingContext2D, content: CardContent) {
  ctx.fillStyle = COLORS.inkMuted;
  ctx.font = `400 26px ${FONTS.report}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(content.footer, PAD, CARD_SIZE.height - PAD);
}

export async function renderCard(content: CardContent): Promise<HTMLCanvasElement> {
  await loadCardFonts();
  const canvas = document.createElement('canvas');
  canvas.width = CARD_SIZE.width;
  canvas.height = CARD_SIZE.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.fillStyle = COLORS.manila;
  ctx.fillRect(0, 0, CARD_SIZE.width, CARD_SIZE.height);
  drawGrain(ctx);
  drawTitle(ctx, content);
  drawVehicle(ctx, content);
  drawRows(ctx, content);
  drawRank(ctx, content);
  drawFooter(ctx, content);
  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}
