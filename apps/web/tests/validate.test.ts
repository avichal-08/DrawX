import { test } from "node:test";
import assert from "node:assert/strict";
import { isValidShape, isValidStrokeId } from "../app/lib/validate.ts";

test("accepts every well-formed shape type", () => {
  const ok = [
    { type: "rect", x: 1, y: 2, width: 3, height: 4 },
    { type: "circle", centreX: 1, centreY: 2, radius: 3 },
    { type: "line", startX: 0, startY: 0, endX: 1, endY: 1 },
    { type: "arrow", startX: 0, startY: 0, endX: 1, endY: 1 },
    { type: "text", x: 1, y: 2, text: "hi" },
    { type: "pencil", points: [{ x: 1, y: 2 }] },
    { type: "rect", x: 1_000_000, y: -1_000_000, width: 0.1, height: 100 },
  ];
  for (const s of ok) assert.equal(isValidShape(s), true, s.type);
});

test("rejects unknown types, missing/NaN fields and wrong value types", () => {
  const bad: unknown[] = [
    null,
    "rect",
    { type: "script" },
    { type: "rect", x: 1, y: 2, width: 3 },
    { type: "rect", x: NaN, y: 2, width: 3, height: 4 },
    { type: "circle", centreX: "1", centreY: 2, radius: 3 },
    { type: "circle", centreX: 1, centreY: 2, radius: -1 },
    { type: "text", x: 1, y: 2, text: 5 },
    { type: "pencil", points: [] },
    { type: "pencil", points: [{ x: 1 }] },
    { type: "rect", x: 1_000_001, y: 0, width: 1, height: 1 },
    { type: "rect", x: 0, y: 0, width: 0, height: 1 },
    { type: "pencil", points: [{ x: 1_000_001, y: 0 }] },
  ];
  for (const s of bad) assert.equal(isValidShape(s), false, JSON.stringify(s));
});

test("limits pencil size and text length", () => {
  const points = Array.from({ length: 20_001 }, () => ({ x: 0, y: 0 }));
  assert.equal(isValidShape({ type: "pencil", points }), false);
  assert.equal(isValidShape({ type: "circle", centreX: 0, centreY: 0, radius: 0 }), false);
  assert.equal(isValidShape({ type: "circle", centreX: 0, centreY: 0, radius: 10_001 }), false);
  assert.equal(isValidShape({ type: "text", x: 0, y: 0, text: "x".repeat(2_001) }), false);
});

test("stroke ids must be short non-empty strings", () => {
  assert.equal(isValidStrokeId("abc"), true);
  assert.equal(isValidStrokeId(""), false);
  assert.equal(isValidStrokeId("x".repeat(65)), false);
  assert.equal(isValidStrokeId(42), false);
});
