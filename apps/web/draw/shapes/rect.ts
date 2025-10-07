import type { Shape } from "../types";

export function previewRect(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  strokeStyle: string
) {
  const width = currentX - startX;
  const height = currentY - startY;
  ctx.strokeStyle = strokeStyle;
  ctx.strokeRect(startX, startY, width, height);
}

export function finalizeRect(
  startX: number,
  startY: number,
  currentX: number,
  currentY: number
): Shape {
  return {
    type: "rect",
    x: startX,
    y: startY,
    width: currentX - startX,
    height: currentY - startY,
  };
}
