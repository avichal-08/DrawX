const SHAPE_TYPES = ["rect", "circle", "line", "text", "arrow", "pencil"] as const;

const NUMERIC_FIELDS: Record<string, string[]> = {
  rect: ["x", "y", "width", "height"],
  circle: ["centreX", "centreY", "radius"],
  line: ["startX", "startY", "endX", "endY"],
  arrow: ["startX", "startY", "endX", "endY"],
  text: ["x", "y"],
};

const MAX_POINTS = 20_000;
const MAX_TEXT = 2_000;
const MAX_RADIUS = 10_000;
const MAX_COORD = 1_000_000;
const MIN_DIM = 0.1;
const num = (v: unknown) => typeof v === "number" && Number.isFinite(v);
const validCoord = (v: unknown) => num(v) && (v as number) >= -MAX_COORD && (v as number) <= MAX_COORD;
const positive = (v: unknown) => num(v) && (v as number) >= MIN_DIM;

/** Structural check for a Shape (see draw/types.ts) coming from an untrusted client. */
export function isValidShape(shape: any): boolean {
  if (!shape || typeof shape !== "object" || !SHAPE_TYPES.includes(shape.type)) return false;

  if (shape.type === "pencil") {
    return (
      Array.isArray(shape.points) &&
      shape.points.length > 0 &&
      shape.points.length <= MAX_POINTS &&
      shape.points.every((p: any) => p && validCoord(p.x) && validCoord(p.y))
    );
  }

  if (shape.type === "rect") {
    if (!validCoord(shape.x) || !validCoord(shape.y) || !positive(shape.width) || !positive(shape.height)) return false;
  } else if (shape.type === "circle") {
    if (!validCoord(shape.centreX) || !validCoord(shape.centreY) || !positive(shape.radius) || shape.radius > MAX_RADIUS) return false;
  } else if (shape.type === "line" || shape.type === "arrow") {
    if (!validCoord(shape.startX) || !validCoord(shape.startY) || !validCoord(shape.endX) || !validCoord(shape.endY)) return false;
  } else if (shape.type === "text") {
    if (!validCoord(shape.x) || !validCoord(shape.y) || typeof shape.text !== "string" || shape.text.length > MAX_TEXT) return false;
  }

  return true;
}

export function isValidStrokeId(id: unknown): id is string {
  return typeof id === "string" && id.length > 0 && id.length <= 64;
}
