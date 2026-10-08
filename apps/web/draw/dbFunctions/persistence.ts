import { useEffect, useMemo } from "react";
import { StrokeQueue, type Post } from "./queue";

const httpPost: Post = async (url, body, keepalive = false) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive,
  });
  // 4xx will never succeed on retry; only network/5xx errors are retried.
  if (!res.ok && res.status >= 500) throw new Error(`HTTP ${res.status}`);
};

/**
 * Persists strokes for the client that drew (or erased) them, so the board no
 * longer depends on the admin being online. See StrokeQueue for the details.
 */
export function useStrokePersistence(slug: string) {
  const queue = useMemo(() => new StrokeQueue(slug, httpPost), [slug]);

  // Don't lose the last <500ms of drawing when the tab closes or the user leaves.
  useEffect(() => {
    const onHide = () => void queue.flush(true);
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      void queue.flush(true);
      queue.dispose();
    };
  }, [queue]);

  return useMemo(
    () => ({ saveStroke: queue.save, eraseStroke: queue.erase, forgetStroke: queue.forget }),
    [queue]
  );
}
