import { test } from "node:test";
import assert from "node:assert/strict";
import { findStrokeUnderCursor } from "../draw/eraser/index.ts";
import type { ShapeDetail } from "../draw/types.ts";

const rect = (id: string, x: number, y: number, width: number, height: number): ShapeDetail => ({
  strokeId: id,
  shape: { type: "rect", x, y, width, height },
});

test("hits and misses a rect", () => {
  const shapes = [rect("r", 10, 10, 100, 50)];
  assert.equal(findStrokeUnderCursor(shapes, 50, 30)?.strokeId, "r");
  assert.equal(findStrokeUnderCursor(shapes, 200, 30), null);
});

test("hits a rect that was dragged up/left (negative width and height)", () => {
  const shapes = [rect("neg", 200, 200, -100, -50)];
  assert.equal(findStrokeUnderCursor(shapes, 150, 180)?.strokeId, "neg");
  assert.equal(findStrokeUnderCursor(shapes, 250, 180), null);
});

test("hits a circle inside its radius only", () => {
  const shapes: ShapeDetail[] = [
    { strokeId: "c", shape: { type: "circle", centreX: 100, centreY: 100, radius: 20 } },
  ];
  assert.equal(findStrokeUnderCursor(shapes, 110, 110)?.strokeId, "c");
  assert.equal(findStrokeUnderCursor(shapes, 130, 130), null);
});

test("lines, arrows and pencil strokes are hit within 5px tolerance", () => {
  const shapes: ShapeDetail[] = [
    { strokeId: "l", shape: { type: "line", startX: 0, startY: 0, endX: 100, endY: 0 } },
    { strokeId: "a", shape: { type: "arrow", startX: 0, startY: 50, endX: 100, endY: 50 } },
    {
      strokeId: "p",
      shape: { type: "pencil", points: [{ x: 0, y: 100 }, { x: 50, y: 100 }, { x: 50, y: 150 }] },
    },
  ];
  assert.equal(findStrokeUnderCursor(shapes, 50, 4)?.strokeId, "l");
  assert.equal(findStrokeUnderCursor(shapes, 50, 10), null);
  assert.equal(findStrokeUnderCursor(shapes, 60, 53)?.strokeId, "a");
  assert.equal(findStrokeUnderCursor(shapes, 52, 130)?.strokeId, "p");
});

test("hits text inside its approximate bounding box", () => {
  const shapes: ShapeDetail[] = [
    { strokeId: "t", shape: { type: "text", x: 100, y: 100, text: "hello" } },
  ];
  assert.equal(findStrokeUnderCursor(shapes, 120, 95)?.strokeId, "t");
  assert.equal(findStrokeUnderCursor(shapes, 120, 140), null);
});

test("the topmost (latest) overlapping shape wins", () => {
  const shapes = [rect("under", 0, 0, 100, 100), rect("over", 0, 0, 100, 100)];
  assert.equal(findStrokeUnderCursor(shapes, 50, 50)?.strokeId, "over");
});

test("expects world coordinates: callers must subtract the pan offset", () => {
  const shapes = [rect("r", 10, 10, 100, 50)];
  const pan = { x: 300, y: 200 };
  const screen = { x: 50 + pan.x, y: 30 + pan.y }; // where the pointer is on screen
  assert.equal(findStrokeUnderCursor(shapes, screen.x, screen.y), null);
  assert.equal(findStrokeUnderCursor(shapes, screen.x - pan.x, screen.y - pan.y)?.strokeId, "r");
});
