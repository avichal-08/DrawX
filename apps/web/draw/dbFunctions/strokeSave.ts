import { useRef } from "react";
import axios from "axios";
import type { ShapeDetail } from "../types";

export function useDebouncedStrokeSave(slug: string, isAdmin: boolean) {
  const pendingStrokes = useRef<any[]>([]);
  const timer = useRef<NodeJS.Timeout | null>(null);

  if(!isAdmin) return;

  const addStroke = (strokeDetail: ShapeDetail) => {
    pendingStrokes.current.push(strokeDetail);

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      if (pendingStrokes.current.length === 0) return;

      try {
        await axios.post("/api/strokes/save", {
          slug,
          strokesDetail: pendingStrokes.current,
        });
        pendingStrokes.current = [];
      } catch (err) {
        console.error("Failed to save strokes:", err);
      }
    }, 500);
  };

  return addStroke;
}
