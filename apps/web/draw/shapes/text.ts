import type { Shape } from "../types";

export function previewText(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  text: string,
  fillStyle: string
) {
  ctx.fillStyle = fillStyle;
  ctx.font = "20px Arial";
  ctx.fillText(text, startX, startY);
}


export function finalizeText(
  startX: number,
  startY: number,
  onComplete: (shape: Shape) => void,
  mode: "light" | "dark"
) {
  console.log("final")
  const input = document.createElement("input");
  input.type = "text";
  input.style.position = "absolute";
  input.style.left = startX + "px";
  input.style.top = startY + "px";
  input.style.font = "20px Arial";
  input.style.background = "transparent";
  input.style.border = "1px solid gray";
  input.style.color = mode === "light" ? "black" : "white";
  input.style.outline = "none";

  document.body.appendChild(input);
  input.focus();

  const cleanup = () => {
    if (document.body.contains(input)) document.body.removeChild(input);
  };

  const finalize = () => {
    const text = input.value.trim();
    if (text) {
      const shape: Shape = { type: "text", x: startX, y: startY, text };
      onComplete(shape);
    }
    cleanup();
  };

  input.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") finalize();
  });
  input.addEventListener("blur", finalize);
}
