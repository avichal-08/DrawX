import type { ShapeDetail } from "../types";

export function findStrokeUnderCursor(
    shapes: ShapeDetail[],
    mouseX: number,
    mouseY: number
): ShapeDetail | null {
    for (let i = shapes.length - 1; i >= 0; i--) {
        const strokeDetail = shapes[i];
        if (strokeDetail) {
            const shape = strokeDetail.shape;

            switch (shape.type) {
                case "rect":
                    if (
                        mouseX >= shape.x &&
                        mouseX <= shape.x + shape.width &&
                        mouseY >= shape.y &&
                        mouseY <= shape.y + shape.height
                    )
                        return strokeDetail;
                    break;

                case "circle":
                    const dx = mouseX - shape.centreX;
                    const dy = mouseY - shape.centreY;
                    if (dx * dx + dy * dy <= shape.radius * shape.radius) return strokeDetail;
                    break;

                case "line":
                case "arrow":
                    if (isPointNearLine(mouseX, mouseY, shape.startX, shape.startY, shape.endX, shape.endY, 5))
                        return strokeDetail;
                    break;

                case "pencil":
                    for (let j = 0; j < shape.points.length - 1; j++) {
                        const p1 = shape.points[j];
                        const p2 = shape.points[j + 1];
                        if( p1 && p2)
                            if (isPointNearLine(mouseX, mouseY, p1.x, p1.y, p2.x, p2.y, 5)) return strokeDetail;
                    }
                    break;

                case "text":
                    const padding = 4;
                    if (
                        mouseX >= shape.x - padding &&
                        mouseX <= shape.x + shape.text.length * 10 + padding &&
                        mouseY >= shape.y - 16 &&
                        mouseY <= shape.y + 4
                    )
                        return strokeDetail;
                    break;
            }
        }
    }

    return null;
}

function isPointNearLine(
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    tolerance: number
) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lengthSquared = dx * dx + dy * dy;
    if (lengthSquared === 0) return distance(px, py, x1, y1) <= tolerance;

    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSquared));
    const projX = x1 + t * dx;
    const projY = y1 + t * dy;
    return distance(px, py, projX, projY) <= tolerance;
}

function distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
