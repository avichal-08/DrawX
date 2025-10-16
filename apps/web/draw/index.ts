import { previewRect, finalizeRect } from "./shapes/rect";
import { previewCircle, finalizeCircle } from "./shapes/circle";
import { previewLine, finalizeLine } from "./shapes/line";
import { previewText, finalizeText } from "./shapes/text";
import { previewArrow, finalizeArrow } from "./shapes/arrow";
import { previewPencil, finalizePencil } from "./shapes/pencil";
import { findStrokeUnderCursor } from "./eraser";
import type { ShapeDetail } from "./types";
import React from "react";

export function initDraw(
  canvas: HTMLCanvasElement,
  mode: "light" | "dark",
  shapeMode: "rect" | "circle" | "line" | "text" | "pan" | "arrow" | "pencil" | "eraser",
  existingShape: ShapeDetail[],
  socket: WebSocket | null,
  isAdmin: boolean,
  roomId: string,
  saveStroke: any,
  eraseStroke: any,
  panStartX: React.RefObject<number>,
  panStartY: React.RefObject<number>,
  offsetX: React.RefObject<number>,
  offsetY: React.RefObject<number>
) {
  const generateId = () =>
    crypto.randomUUID?.() ||
    self.crypto.randomUUID?.() ||
    Math.random().toString(36).substring(2, 15);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let pencilPoints: { x: number; y: number }[] = [];
  let isDrawing = false;
  let isPanning = false;
  let startX = 0;
  let startY = 0;

  const white = "rgba(255, 255, 255)";
  const black = "rgba(18, 18, 19, 1)";

  function redraw() {
    if (ctx) {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = mode === "light" ? white : black;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.translate(offsetX.current, offsetY.current);
      existingShape.forEach((shapeDetail) => {
        ctx.strokeStyle = mode === "light" ? black : white;
        ctx.fillStyle = mode === "light" ? black : white;
        const shape = shapeDetail.shape;
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
        } else if (shape.type === "arrow") {
          ctx.beginPath();
          ctx.moveTo(shape.startX, shape.startY);
          ctx.lineTo(shape.endX, shape.endY);
          const angle = Math.atan2(
            shape.endY - shape.startY,
            shape.endX - shape.startX
          );
          const headLength = 12;
          ctx.lineTo(
            shape.endX - headLength * Math.cos(angle - Math.PI / 6),
            shape.endY - headLength * Math.sin(angle - Math.PI / 6)
          );
          ctx.moveTo(shape.endX, shape.endY);
          ctx.lineTo(
            shape.endX - headLength * Math.cos(angle + Math.PI / 6),
            shape.endY - headLength * Math.sin(angle + Math.PI / 6)
          );
          ctx.stroke();
        } else if (shape.type === "pencil") {
          ctx.beginPath();
          ctx.lineWidth = 2;
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.strokeStyle = mode === "light" ? black : white;
          const pts = shape.points;
          if (pts.length > 1) {
            if (pts[0]) {
              ctx.moveTo(pts[0].x, pts[0].y);
              for (let i = 1; i < pts.length; i++) {
                if (pts[i]) {
                  ctx.lineTo(pts[i].x, pts[i].y);
                }
              }
              ctx.stroke();
            }
          }
        }
      });
      ctx.restore();
    }
  }

  redraw();

  const handleWS = (event: MessageEvent) => {
    if (!socket) return;
    const msg = JSON.parse(event.data);
    if (msg.type === "draw-update") {
      existingShape.push(msg.data);
      redraw();
      saveStroke({
        strokeId: msg.data.strokeId,
        shape: msg.data.shape,
      });
    }
    if (msg.type === "erase-update") {
      const eraseStrokeId = msg.data.strokeId;
      const index = existingShape.findIndex((s) => s.strokeId === eraseStrokeId);
      if (index !== -1) {
        existingShape.splice(index, 1);
      }
      redraw();
      if (isAdmin) {
        eraseStroke(eraseStrokeId);
      }
    }
  };

  socket?.addEventListener("message", handleWS);

  const handlePointerDown = (e: PointerEvent) => {
    e.preventDefault();
    if (shapeMode === "pan") {
      isPanning = true;
      panStartX.current = e.clientX - offsetX.current;
      panStartY.current = e.clientY - offsetY.current;
    } else {
      isDrawing = true;
      startX = e.clientX - offsetX.current;
      startY = e.clientY - offsetY.current;
    }
    if (shapeMode === "eraser") {
      if (!(socket && socket.readyState === WebSocket.OPEN)) return;
      const strokeToDelete = findStrokeUnderCursor(
        existingShape,
        e.clientX,
        e.clientY
      );
      if (!strokeToDelete) return;
      const index = existingShape.findIndex(
        (s) => s.strokeId === strokeToDelete.strokeId
      );
      if (index !== -1) {
        existingShape.splice(index, 1);
      }
      redraw();
      socket.send(
        JSON.stringify({
          type: "erase-update",
          data: {
            strokeId: strokeToDelete.strokeId,
          },
        })
      );
      if (isAdmin) {
        eraseStroke(strokeToDelete.strokeId);
      }
    }
    if (shapeMode === "pencil") {
      isDrawing = true;
      pencilPoints = [
        { x: e.clientX - offsetX.current, y: e.clientY - offsetY.current },
      ];
      return;
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    e.preventDefault();
    if (isPanning) {
      offsetX.current = e.clientX - panStartX.current;
      offsetY.current = e.clientY - panStartY.current;
      redraw();
      return;
    }
    if (!isDrawing) return;
    redraw();
    const strokeStyle = mode === "light" ? black : white;
    const currentX = e.clientX - offsetX.current;
    const currentY = e.clientY - offsetY.current;
    if (shapeMode === "rect") {
      previewRect(ctx, startX, startY, currentX, currentY, strokeStyle);
    } else if (shapeMode === "circle") {
      previewCircle(ctx, startX, startY, currentX, currentY, strokeStyle);
    } else if (shapeMode === "line") {
      previewLine(ctx, startX, startY, currentX, currentY, strokeStyle);
    } else if (shapeMode === "text") {
      previewText(ctx, startX, startY, "Type here", strokeStyle);
    } else if (shapeMode === "arrow") {
      previewArrow(ctx, startX, startY, currentX, currentY, strokeStyle);
    } else if (shapeMode === "pencil" && isDrawing) {
      const cx = e.clientX - offsetX.current;
      const cy = e.clientY - offsetY.current;
      pencilPoints.push({ x: cx, y: cy });
      redraw();
      previewPencil(ctx, pencilPoints, mode === "light" ? black : white);
      return;
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    e.preventDefault();
    if (!(socket && socket.readyState === WebSocket.OPEN)) return;
    if (isPanning) {
      isPanning = false;
      return;
    }
    if (!isDrawing) return;
    isDrawing = false;
    const endX = e.clientX - offsetX.current;
    const endY = e.clientY - offsetY.current;
    if (shapeMode === "rect") {
      const shape = finalizeRect(startX, startY, endX, endY);
      const genId = generateId();
      existingShape.push({ strokeId: genId, shape });
      socket.send(
        JSON.stringify({ type: "draw-update", data: { strokeId: genId, shape } })
      );
      if (isAdmin && typeof saveStroke === "function")
        saveStroke({ strokeId: genId, shape });
    } else if (shapeMode === "circle") {
      const shape = finalizeCircle(startX, startY, endX, endY);
      const genId = generateId();
      existingShape.push({ strokeId: genId, shape });
      socket.send(
        JSON.stringify({ type: "draw-update", data: { strokeId: genId, shape } })
      );
      if (isAdmin && typeof saveStroke === "function")
        saveStroke({ strokeId: genId, shape });
    } else if (shapeMode === "line") {
      const shape = finalizeLine(startX, startY, endX, endY);
      const genId = generateId();
      existingShape.push({ strokeId: genId, shape });
      socket.send(
        JSON.stringify({ type: "draw-update", data: { strokeId: genId, shape } })
      );
      if (isAdmin && typeof saveStroke === "function")
        saveStroke({ strokeId: genId, shape });
    } else if (shapeMode === "arrow") {
      const shape = finalizeArrow(startX, startY, endX, endY);
      const genId = generateId();
      existingShape.push({ strokeId: genId, shape });
      socket.send(
        JSON.stringify({ type: "draw-update", data: { strokeId: genId, shape } })
      );
      if (isAdmin && typeof saveStroke === "function")
        saveStroke({ strokeId: genId, shape });
    } else if (shapeMode === "text") {
      finalizeText(startX, startY, (shape) => {
        const genId = generateId();
        existingShape.push({ strokeId: genId, shape });
        socket.send(
          JSON.stringify({
            type: "draw-update",
            data: { strokeId: genId, shape },
          })
        );
        if (isAdmin && typeof saveStroke === "function")
          saveStroke({ strokeId: genId, shape });
        redraw();
      }, mode);
    } else if (shapeMode === "pencil") {
      const shape = finalizePencil(pencilPoints);
      const genId = generateId();
      existingShape.push({ strokeId: genId, shape });
      socket.send(
        JSON.stringify({ type: "draw-update", data: { strokeId: genId, shape } })
      );
      if (isAdmin && typeof saveStroke === "function")
        saveStroke({ strokeId: genId, shape });
      pencilPoints = [];
    }
    redraw();
  };

  canvas.style.touchAction = "none";
  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  canvas.addEventListener("pointerup", handlePointerUp);

  return () => {
    canvas.removeEventListener("pointerdown", handlePointerDown);
    canvas.removeEventListener("pointermove", handlePointerMove);
    canvas.removeEventListener("pointerup", handlePointerUp);
  };
}
