import type { Shape } from "../types";

export function previewCircle(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  strokeStyle: string
) {
  const dx = currentX - startX;
  const dy = currentY - startY;
  const radius = Math.sqrt(dx * dx + dy * dy);

  ctx.beginPath();
  ctx.strokeStyle = strokeStyle;
  ctx.arc(startX, startY, radius, 0, Math.PI * 2);
  ctx.stroke();
}

export function finalizeCircle(
  startX: number,
  startY: number,
  currentX: number,
  currentY: number
): Shape {
  const dx = currentX - startX;
  const dy = currentY - startY;
  const radius = Math.sqrt(dx * dx + dy * dy);

  return {
    type: "circle",
    centreX: startX,
    centreY: startY,
    radius,
  };
}
