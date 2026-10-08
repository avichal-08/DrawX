import type { ShapeDetail } from "../types";

/** Resolves when the request succeeded or can never succeed; throws only for retryable failures. */
export type Post = (url: string, body: unknown, keepalive?: boolean) => Promise<void>;

export type QueueOptions = { debounceMs?: number; retryMs?: number };

/**
 * Framework-free persistence queue for the strokes *this* client draws/erases.
 *
 * - saves are debounced into batches and retried on retryable failures
 * - erasing a stroke that hasn't been sent yet just cancels the save
 * - an erase never overtakes an in-flight save (otherwise the stroke could be
 *   re-created after it was deleted)
 */
export class StrokeQueue {
  private slug: string;
  private post: Post;
  private debounceMs: number;
  private retryMs: number;
  private pending: ShapeDetail[] = [];
  private inflight: Promise<void> = Promise.resolve();
  private inflightIds = new Set<string>();
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(slug: string, post: Post, opts: QueueOptions = {}) {
    this.slug = slug;
    this.post = post;
    this.debounceMs = opts.debounceMs ?? 500;
    this.retryMs = opts.retryMs ?? 2000;
  }

  save = (detail: ShapeDetail): void => {
    this.pending.push(detail);
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.flush(), this.debounceMs);
  };

  flush = (keepalive = false): Promise<void> => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.pending.length === 0) return this.inflight;

    const batch = this.pending;
    this.pending = [];
    batch.forEach((s) => this.inflightIds.add(s.strokeId));

    this.inflight = this.inflight.then(async () => {
      try {
        await this.post("/api/strokes/save", { slug: this.slug, strokesDetail: batch }, keepalive);
      } catch (err) {
        console.error("Failed to save strokes, will retry:", err);
        this.pending = [...batch, ...this.pending];
        if (!this.timer) this.timer = setTimeout(() => void this.flush(), this.retryMs);
      } finally {
        batch.forEach((s) => this.inflightIds.delete(s.strokeId));
      }
    });
    return this.inflight;
  };

  /** This client erased a stroke. */
  erase = async (strokeId: string): Promise<void> => {
    const before = this.pending.length;
    this.pending = this.pending.filter((s) => s.strokeId !== strokeId);
    if (this.pending.length !== before) return; // never sent: nothing to delete

    await this.inflight; // let a save that's on its way land first
    try {
      await this.post("/api/strokes/erase", { slug: this.slug, eraseStrokeId: strokeId });
    } catch (err) {
      console.error("Failed to erase stroke:", err);
    }
  };

  /**
   * Someone else erased a stroke that *we* drew. If we haven't saved it yet,
   * drop it; if our save is in flight, delete it again once it lands (their
   * delete may have run before our insert).
   */
  forget = (strokeId: string): void => {
    this.pending = this.pending.filter((s) => s.strokeId !== strokeId);
    if (this.inflightIds.has(strokeId)) {
      this.inflight = this.inflight.then(() =>
        this.post("/api/strokes/erase", { slug: this.slug, eraseStrokeId: strokeId }).catch(() => {})
      );
    }
  };

  dispose = (): void => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  };
}
