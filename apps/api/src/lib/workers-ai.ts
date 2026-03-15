import type { Result } from "@clawmarket/contracts";
import { err, ok } from "@clawmarket/contracts";

const DEFAULT_MODEL = "@cf/meta/llama-3.1-8b-instruct";

interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface AiTextResponse {
  response?: string;
}

export async function runTextGeneration(
  ai: Ai,
  messages: AiMessage[],
  model = DEFAULT_MODEL,
): Promise<Result<string, string>> {
  try {
    const result = (await ai.run(model as keyof AiModels, { messages })) as AiTextResponse;
    const text = result.response?.trim();
    if (!text) return err("AI returned empty response");
    return ok(text);
  } catch (e) {
    return err(`Workers AI error: ${e instanceof Error ? e.message : String(e)}`);
  }
}
