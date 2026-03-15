import { describe, expect, it, vi } from "vitest";
import { runTextGeneration } from "../../lib/workers-ai.js";

function createMockAi(response?: string, shouldThrow = false): Ai {
  return {
    run: vi.fn().mockImplementation(() => {
      if (shouldThrow) throw new Error("AI unavailable");
      return Promise.resolve({ response });
    }),
  } as unknown as Ai;
}

describe("runTextGeneration", () => {
  it("returns text on success", async () => {
    const ai = createMockAi("Hello world");
    const result = await runTextGeneration(ai, [{ role: "user", content: "Hi" }]);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe("Hello world");
  });

  it("trims whitespace from response", async () => {
    const ai = createMockAi("  trimmed  ");
    const result = await runTextGeneration(ai, [{ role: "user", content: "Hi" }]);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toBe("trimmed");
  });

  it("returns error on empty response", async () => {
    const ai = createMockAi("");
    const result = await runTextGeneration(ai, [{ role: "user", content: "Hi" }]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("empty");
  });

  it("returns error on undefined response", async () => {
    const ai = createMockAi(undefined);
    const result = await runTextGeneration(ai, [{ role: "user", content: "Hi" }]);
    expect(result.ok).toBe(false);
  });

  it("returns error on AI exception", async () => {
    const ai = createMockAi(undefined, true);
    const result = await runTextGeneration(ai, [{ role: "user", content: "Hi" }]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("AI unavailable");
  });

  it("passes custom model to AI.run", async () => {
    const ai = createMockAi("ok");
    await runTextGeneration(ai, [{ role: "user", content: "Hi" }], "@cf/custom-model");
    expect(ai.run).toHaveBeenCalledWith("@cf/custom-model", expect.anything());
  });
});
