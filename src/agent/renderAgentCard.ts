import { CARD_SIZE, COLORS, drawGrain, FONTS, loadCardFonts, PAD } from '../share/renderCard';

export interface AgentCardContent {
  header: string;
  title: string;
  subtitle: string;
  rows: { label: string; value: string }[];
  stamp: string;
  footer: string;
  photo: HTMLCanvasElement | null;
}

const PHOTO = { x: 520, y: 330, size: 420, frame: 26, bottom: 90, angle: 0.06 };

function drawPolaroid(ctx: CanvasRenderingContext2D, photo: HTMLCanvasElement | null) {
  const width = PHOTO.size + PHOTO.frame * 2;
  const height = PHOTO.size + PHOTO.frame + PHOTO.bottom;
  ctx.save();
  ctx.translate(PHOTO.x + width / 2, PHOTO.y + height / 2);
  ctx.rotate(PHOTO.angle);
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 14;
  ctx.fillStyle = '#fffdf6';
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.shadowColor = 'transparent';
  const left = -width / 2 + PHOTO.frame;
  const top = -height / 2 + PHOTO.frame;
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(left, top, PHOTO.size, PHOTO.size);
  if (photo) ctx.drawImage(photo, left, top, PHOTO.size, PHOTO.size);
  ctx.restore();

  ctx.strokeStyle = '#6b6b70';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const clipX = PHOTO.x + 70;
  const clipY = PHOTO.y - 50;
  ctx.moveTo(clipX, clipY + 150);
  ctx.lineTo(clipX, clipY + 20);
  ctx.arc(clipX + 18, clipY + 20, 18, Math.PI, 0);
  ctx.lineTo(clipX + 36, clipY + 130);
  ctx.arc(clipX + 18, clipY + 130, 18, 0, Math.PI);
  ctx.stroke();
}

function drawHeader(ctx: CanvasRenderingContext2D, content: AgentCardContent) {
  ctx.fillStyle = COLORS.ink;
  ctx.textBaseline = 'top';
  ctx.font = `700 30px ${FONTS.report}`;
  ctx.fillText(content.header, PAD, PAD);
  ctx.font = `500 128px ${FONTS.display}`;
  ctx.fillText(content.title, PAD, 190);
  ctx.font = `italic 500 56px ${FONTS.display}`;
  ctx.fillText(content.subtitle, PAD, 330, 400);
}

function drawRows(ctx: CanvasRenderingContext2D, content: AgentCardContent) {
  const top = 900;
  const rowHeight = 92;
  ctx.fillStyle = COLORS.paper;
  ctx.fillRect(PAD, top, CARD_SIZE.width - PAD * 2, rowHeight * content.rows.length + 60);
  content.rows.forEach((row, i) => {
    const y = top + 40 + i * rowHeight;
    ctx.fillStyle = COLORS.inkMuted;
    ctx.font = `400 34px ${FONTS.report}`;
    ctx.fillText(row.label, PAD + 40, y);
    ctx.fillStyle = COLORS.ink;
    ctx.font = `700 42px ${FONTS.report}`;
    ctx.fillText(row.value, PAD + 330, y - 4, CARD_SIZE.width - PAD * 2 - 370);
  });
}

function drawStamp(ctx: CanvasRenderingContext2D, content: AgentCardContent) {
  ctx.save();
  ctx.translate(CARD_SIZE.width / 2, 1620);
  ctx.rotate(-0.12);
  ctx.strokeStyle = COLORS.stamp;
  ctx.fillStyle = COLORS.stamp;
  ctx.lineWidth = 8;
  ctx.font = `400 76px ${FONTS.stamp}`;
  const width = ctx.measureText(content.stamp).width + 70;
  ctx.strokeRect(-width / 2, -64, width, 128);
  ctx.lineWidth = 3;
  ctx.strokeRect(-width / 2 - 12, -76, width + 24, 152);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(content.stamp, 0, 6);
  ctx.restore();
}

export async function renderAgentCard(content: AgentCardContent): Promise<HTMLCanvasElement> {
  await loadCardFonts();
  const canvas = document.createElement('canvas');
  canvas.width = CARD_SIZE.width;
  canvas.height = CARD_SIZE.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.fillStyle = COLORS.manila;
  ctx.fillRect(0, 0, CARD_SIZE.width, CARD_SIZE.height);
  drawGrain(ctx);
  drawHeader(ctx, content);
  drawPolaroid(ctx, content.photo);
  drawRows(ctx, content);
  drawStamp(ctx, content);
  ctx.fillStyle = COLORS.inkMuted;
  ctx.font = `400 26px ${FONTS.report}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(content.footer, PAD, CARD_SIZE.height - PAD);
  return canvas;
}
