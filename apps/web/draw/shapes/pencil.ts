import type { Shape } from "../types";

export function previewPencil(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  strokeStyle: string
) {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 2;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  if(points[0]){
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      if(points[i])
        ctx.lineTo(points[i]!.x, points[i]!.y);
      }
      ctx.stroke();
  }
}

export function finalizePencil(points: { x: number; y: number }[]): Shape {
  return {
    type: "pencil",
    points,
  };
}
