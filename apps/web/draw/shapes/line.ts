import type { Shape } from "../types";

export function previewLine(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  strokeStyle: string
) {
  ctx.beginPath();
  ctx.strokeStyle = strokeStyle;
  ctx.moveTo(startX, startY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();
}

export function finalizeLine(
  startX: number,
  startY: number,
  currentX: number,
  currentY: number
): Shape {
  return {
    type: "line",
    startX,
    startY,
    endX: currentX,
    endY: currentY,
  };
}
