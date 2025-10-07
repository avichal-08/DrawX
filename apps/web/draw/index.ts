import { previewRect, finalizeRect } from "./shapes/rect";
import { previewCircle, finalizeCircle } from "./shapes/circle";
import { previewLine, finalizeLine } from "./shapes/line";
import { previewText, finalizeText } from "./shapes/text";
import type { Shape } from "./types";

export function initDraw(
  canvas: HTMLCanvasElement,
  mode: "light" | "dark",
  shapeMode: "rect" | "circle" | "line" | "text" | "pan",
  existingShape: Shape[],
  socket: WebSocket | null
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let isDrawing = false;
  let isPanning = false;
  let startX = 0;
  let startY = 0;

  let offsetX = 0;
  let offsetY = 0;
  let panStartX = 0;
  let panStartY = 0;

  const white = "rgba(255, 255, 255)";
  const black = "rgba(0, 0, 0)";

  function redraw() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = mode === "light" ? white : black;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.translate(offsetX, offsetY);

    existingShape.forEach((shape) => {
      ctx.strokeStyle = mode === "light" ? black : white;
      ctx.fillStyle = mode === "light" ? black : white;

      if (shape.type === "rect") {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        ctx.beginPath();
        ctx.arc(shape.centreX, shape.centreY, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (shape.type === "line") {
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.stroke();
      } else if (shape.type === "text") {
        ctx.font = "20px Arial";
        ctx.fillText(shape.text, shape.x, shape.y);
      }
    });

    ctx.restore();
  }

  redraw();

  const handleWS = (event: MessageEvent) => {
    if (!socket) return;
    const msg = JSON.parse(event.data);
    if (msg.type === "draw-update") {
      existingShape.push(msg.data);
      redraw();
    }
  };

  socket?.addEventListener("message", handleWS);

  const handleMouseDown = (e: MouseEvent) => {
    if (shapeMode === "pan") {
      isPanning = true;
      panStartX = e.clientX - offsetX;
      panStartY = e.clientY - offsetY;
    } else {
      isDrawing = true;
      startX = e.clientX - offsetX;
      startY = e.clientY - offsetY;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isPanning) {
      offsetX = e.clientX - panStartX;
      offsetY = e.clientY - panStartY;
      redraw();
      return;
    }

    if (!isDrawing) return;
    redraw();

    const strokeStyle = mode === "light" ? black : white;
    const currentX = e.clientX - offsetX;
    const currentY = e.clientY - offsetY;

    if (shapeMode === "rect") {
      previewRect(ctx, startX, startY, currentX, currentY, strokeStyle);
    } else if (shapeMode === "circle") {
      previewCircle(ctx, startX, startY, currentX, currentY, strokeStyle);
    } else if (shapeMode === "line") {
      previewLine(ctx, startX, startY, currentX, currentY, strokeStyle);
    } else if (shapeMode === "text") {
      previewText(ctx, startX, startY, "Type here", strokeStyle);
    }
  };

  const handleMouseUp = (e: MouseEvent) => {

    if (!(socket && socket.readyState === WebSocket.OPEN)) return; 

    if (isPanning) {
      isPanning = false;
      return;
    }
    if (!isDrawing) return;
    isDrawing = false;

    const endX = e.clientX - offsetX;
    const endY = e.clientY - offsetY;

    if (shapeMode === "rect") {
      const shape = (finalizeRect(startX, startY, endX, endY));
      existingShape.push(shape);
      socket.send(JSON.stringify({
      type: "draw-update",
      data: shape
    }));
    } else if (shapeMode === "circle") {
      const shape = finalizeCircle(startX, startY, endX, endY);
      existingShape.push(shape);
      socket.send(JSON.stringify({
      type: "draw-update",
      data: shape
    }));
    } else if (shapeMode === "line") {
      const shape = finalizeLine(startX, startY, endX, endY);
      existingShape.push(shape);
      socket.send(JSON.stringify({
      type: "draw-update",
      data: shape
    }));
    } else if (shapeMode === "text") {
      finalizeText(startX, startY, (shape) => {
        existingShape.push(shape);
        redraw();
      }, mode);
    }

    redraw();
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseup", handleMouseUp);

  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", handleMouseUp);
  };
}
