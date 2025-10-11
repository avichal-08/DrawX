import type { Shape } from "../types";

export function previewArrow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  strokeStyle: string
) {
  ctx.beginPath();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 2;
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);

  const angle = Math.atan2(endY - startY, endX - startX);
  const headLength = 12;
  ctx.lineTo(
    endX - headLength * Math.cos(angle - Math.PI / 6),
    endY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headLength * Math.cos(angle + Math.PI / 6),
    endY - headLength * Math.sin(angle + Math.PI / 6)
  );

  ctx.stroke();
}

export function finalizeArrow(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): Shape {
  return {
    type: "arrow",
    startX,
    startY,
    endX,
    endY,
  };
}
