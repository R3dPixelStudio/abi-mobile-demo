import test from "node:test";
import assert from "node:assert/strict";
import { isSameOrigin } from "../src/lib/request-origin";
test("same-origin uses routing host when Next normalizes loopback URL", () => {
  assert.equal(
    isSameOrigin(
      new Request("http://localhost:3000/api/assistant", {
        headers: { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000" },
      }),
    ),
    true,
  );
  assert.equal(
    isSameOrigin(
      new Request("https://demo.example/api/assistant", {
        headers: { host: "demo.example", origin: "https://demo.example" },
      }),
    ),
    true,
  );
});
test("rejects cross-site, absent, malformed and different-scheme origins", () => {
  for (const origin of [
    "null",
    "http://demo.example",
    "https://elsewhere.example",
    "https://demo.example/path",
  ])
    assert.equal(
      isSameOrigin(
        new Request("https://demo.example/api/assistant", {
          headers: { origin },
        }),
      ),
      false,
    );
  assert.equal(
    isSameOrigin(new Request("https://demo.example/api/assistant")),
    false,
  );
  assert.equal(
    isSameOrigin(
      new Request("https://demo.example/api/assistant", {
        headers: {
          origin: "https://demo.example",
          "sec-fetch-site": "cross-site",
        },
      }),
    ),
    false,
  );
});
