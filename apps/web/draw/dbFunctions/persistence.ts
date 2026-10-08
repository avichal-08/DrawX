import { useCallback, useEffect, useRef } from "react";
import type { ShapeDetail } from "../types";

const DEBOUNCE_MS = 500;
const RETRY_MS = 2000;

/**
 * Persists strokes for the client that drew (or erased) them.
 *
 * Previously only the admin's browser saved everything it received over the
 * socket, so drawings were lost whenever the admin wasn't connected. Now each
 * author saves their own strokes; the API's `skipDuplicates` / `deleteMany`
 * make double-saves and double-erases harmless.
 */
export function useStrokePersistence(slug: string) {
  const pending = useRef<ShapeDetail[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inflight = useRef<Promise<void>>(Promise.resolve());

  const post = useCallback(
    async (url: string, body: unknown, keepalive = false) => {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        keepalive,
      });
      // 4xx will never succeed on retry; only network/5xx errors are retried.
      if (!res.ok && res.status >= 500) throw new Error(`HTTP ${res.status}`);
    },
    []
  );

  const flush = useCallback(
    (keepalive = false) => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      if (pending.current.length === 0) return inflight.current;

      const batch = pending.current;
      pending.current = [];

      inflight.current = inflight.current.then(async () => {
        try {
          await post("/api/strokes/save", { slug, strokesDetail: batch }, keepalive);
        } catch (err) {
          console.error("Failed to save strokes, will retry:", err);
          pending.current = [...batch, ...pending.current];
          if (!timer.current) timer.current = setTimeout(() => flush(), RETRY_MS);
        }
      });
      return inflight.current;
    },
    [slug, post]
  );

  const saveStroke = useCallback(
    (detail: ShapeDetail) => {
      pending.current.push(detail);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => flush(), DEBOUNCE_MS);
    },
    [flush]
  );

  const eraseStroke = useCallback(
    async (strokeId: string) => {
      // Erasing something that was never flushed: just forget it.
      const before = pending.current.length;
      pending.current = pending.current.filter((s) => s.strokeId !== strokeId);
      if (pending.current.length !== before) return;

      // Otherwise make sure any in-flight save lands first, so the stroke
      // can't be re-created after we delete it.
      await inflight.current;
      try {
        await post("/api/strokes/erase", { slug, eraseStrokeId: strokeId });
      } catch (err) {
        console.error("Failed to erase stroke:", err);
      }
    },
    [slug, post]
  );

  // Don't lose the last <500ms of drawing when the tab closes or the user leaves.
  useEffect(() => {
    const onHide = () => {
      flush(true);
    };
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      flush(true);
    };
  }, [flush]);

  return { saveStroke, eraseStroke };
}
