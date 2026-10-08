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
const num = (v: unknown) => typeof v === "number" && Number.isFinite(v);

/** Structural check for a Shape (see draw/types.ts) coming from an untrusted client. */
export function isValidShape(shape: any): boolean {
  if (!shape || typeof shape !== "object" || !SHAPE_TYPES.includes(shape.type)) return false;

  if (shape.type === "pencil") {
    return (
      Array.isArray(shape.points) &&
      shape.points.length > 0 &&
      shape.points.length <= MAX_POINTS &&
      shape.points.every((p: any) => p && num(p.x) && num(p.y))
    );
  }
  if (!NUMERIC_FIELDS[shape.type]!.every((k) => num(shape[k]))) return false;
  if (shape.type === "text") return typeof shape.text === "string" && shape.text.length <= MAX_TEXT;
  return true;
}

export function isValidStrokeId(id: unknown): id is string {
  return typeof id === "string" && id.length > 0 && id.length <= 64;
}
