import { test } from "node:test";
import assert from "node:assert/strict";
import { StrokeQueue, type Post } from "../draw/dbFunctions/queue.ts";
import type { ShapeDetail } from "../draw/types.ts";

const stroke = (id: string): ShapeDetail => ({
  strokeId: id,
  shape: { type: "rect", x: 0, y: 0, width: 1, height: 1 },
});
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** A fake API that records calls; `gate` lets a test hold a request open. */
function fakeApi() {
  const calls: { url: string; ids: string[]; keepalive: boolean }[] = [];
  const started: [string, string[]][] = []; // when a request is *sent*, before it completes
  let gate: Promise<void> | null = null;
  let failNext = 0;
  const post: Post = async (url, body: any, keepalive = false) => {
    const ids = body.strokesDetail ? body.strokesDetail.map((s: any) => s.strokeId) : [body.eraseStrokeId];
    started.push([url.split("/").pop()!, ids]);
    if (gate) await gate;
    if (failNext > 0) {
      failNext--;
      throw new Error("HTTP 503");
    }
    calls.push({ url: url.split("/").pop()!, ids, keepalive } as any);
  };
  return {
    calls,
    started,
    post,
    hold() {
      let release!: () => void;
      gate = new Promise<void>((r) => (release = r));
      return () => {
        gate = null;
        release();
      };
    },
    failNext(n: number) {
      failNext = n;
    },
  };
}
const opts = { debounceMs: 10, retryMs: 10 };

test("rapid saves are sent as a single batch", async () => {
  const api = fakeApi();
  const q = new StrokeQueue("room", api.post, opts);
  q.save(stroke("a"));
  q.save(stroke("b"));
  await sleep(40);
  assert.deepEqual(api.calls.map((c) => [c.url, c.ids]), [["save", ["a", "b"]]]);
});

test("a retryable failure re-queues the batch and retries", async () => {
  const api = fakeApi();
  api.failNext(1);
  const q = new StrokeQueue("room", api.post, opts);
  q.save(stroke("a"));
  await sleep(80);
  assert.deepEqual(api.calls.map((c) => [c.url, c.ids]), [["save", ["a"]]]);
});

test("erasing a stroke that was never sent cancels its save", async () => {
  const api = fakeApi();
  const q = new StrokeQueue("room", api.post, opts);
  q.save(stroke("a"));
  q.save(stroke("b"));
  await q.erase("a");
  await sleep(40);
  assert.deepEqual(api.calls.map((c) => [c.url, c.ids]), [["save", ["b"]]]);
});

test("an erase waits for an in-flight save so the stroke can't be resurrected", async () => {
  const api = fakeApi();
  const release = api.hold();
  const q = new StrokeQueue("room", api.post, opts);
  q.save(stroke("a"));
  await sleep(30); // flush started, request is held open
  const erased = q.erase("a");
  await sleep(20);
  assert.deepEqual(api.started, [["save", ["a"]]], "erase must not be sent while the save is in flight");
  release();
  await erased;
  assert.deepEqual(api.calls.map((c) => [c.url, c.ids]), [["save", ["a"]], ["erase", ["a"]]]);
});

test("forget(): a peer erasing our unsent stroke drops it without any request", async () => {
  const api = fakeApi();
  const q = new StrokeQueue("room", api.post, opts);
  q.save(stroke("a"));
  q.forget("a");
  await sleep(40);
  assert.deepEqual(api.calls, []);
});

test("forget(): a peer erasing our in-flight stroke triggers a follow-up delete", async () => {
  const api = fakeApi();
  const release = api.hold();
  const q = new StrokeQueue("room", api.post, opts);
  q.save(stroke("a"));
  await sleep(30);
  q.forget("a");
  await sleep(20);
  assert.deepEqual(api.started, [["save", ["a"]]], "follow-up delete must wait for the save to land");
  release();
  await sleep(30);
  assert.deepEqual(api.calls.map((c) => [c.url, c.ids]), [["save", ["a"]], ["erase", ["a"]]]);
});

test("forget() for a stroke we don't own sends nothing", async () => {
  const api = fakeApi();
  const q = new StrokeQueue("room", api.post, opts);
  q.forget("someone-elses");
  await sleep(20);
  assert.deepEqual(api.calls, []);
});

test("flush(true) sends immediately with keepalive (page is closing)", async () => {
  const api = fakeApi();
  const q = new StrokeQueue("room", api.post, { debounceMs: 10_000, retryMs: 10 });
  q.save(stroke("a"));
  await q.flush(true);
  assert.deepEqual(api.calls.map((c) => [c.url, c.keepalive]), [["save", true]]);
  q.dispose();
});
