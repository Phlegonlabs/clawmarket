import { describe, expect, it } from "vitest";
import { generateId } from "../../lib/id.js";

describe("generateId", () => {
  it("generates id with correct prefix", () => {
    const id = generateId("strat");
    expect(id.startsWith("strat_")).toBe(true);
  });

  it("generates id with prefix + 16 random chars", () => {
    const id = generateId("int");
    // "int_" (4) + 16 chars = 20
    expect(id).toHaveLength(4 + 16);
  });

  it("generates unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId("test")));
    expect(ids.size).toBe(100);
  });

  it("uses only lowercase alphanumeric chars after prefix", () => {
    const id = generateId("x");
    const suffix = id.slice(2); // skip "x_"
    expect(suffix).toMatch(/^[0-9a-z]+$/);
  });
});
