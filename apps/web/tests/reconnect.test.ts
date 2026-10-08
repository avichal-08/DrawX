import { test } from "node:test";
import assert from "node:assert/strict";
import { backoffDelay, closeAction, MAX_RETRIES } from "../app/lib/reconnect.ts";

test("backoff grows exponentially, is jittered, and is capped at 15s", () => {
  const max = () => 1; // upper bound of jitter
  const min = () => 0; // lower bound of jitter
  assert.deepEqual([1, 2, 3, 4].map((a) => backoffDelay(a, max)), [1000, 2000, 4000, 8000]);
  assert.equal(backoffDelay(1, min), 500);
  assert.equal(backoffDelay(20, max), 15_000);
  assert.equal(backoffDelay(20, min), 7_500);
});

test("removed / forbidden closes are never retried", () => {
  assert.equal(closeAction(4403, 1), "forbidden");
});

test("a refused ticket is retried twice with a fresh ticket, then abandoned", () => {
  assert.equal(closeAction(4401, 1), "retry");
  assert.equal(closeAction(4401, 2), "retry");
  assert.equal(closeAction(4401, 3), "forbidden");
});

test("network drops are retried until the budget is exhausted", () => {
  for (const code of [1006, 1001, 1011]) {
    assert.equal(closeAction(code, 1), "retry");
    assert.equal(closeAction(code, MAX_RETRIES - 1), "retry");
    assert.equal(closeAction(code, MAX_RETRIES), "exhausted");
  }
});
