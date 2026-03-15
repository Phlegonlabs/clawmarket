import type { Result } from "@clawmarket/contracts";
import { err, ok } from "@clawmarket/contracts";

/** Model registry — select model by use case */
const MODEL_REGISTRY: Record<string, string> = {
  recommendation: "@cf/meta/llama-3.1-8b-instruct",
  analysis: "@cf/meta/llama-3.1-8b-instruct",
  comparison: "@cf/meta/llama-3.1-8b-instruct",
  default: "@cf/meta/llama-3.1-8b-instruct",
};

export type AiUseCase = keyof typeof MODEL_REGISTRY;

export function getModelForUseCase(useCase: AiUseCase): string {
  return MODEL_REGISTRY[useCase] ?? MODEL_REGISTRY.default;
}

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
  model?: string,
): Promise<Result<string, string>> {
  const modelId = model ?? MODEL_REGISTRY.default;
  try {
    const result = (await ai.run(modelId as keyof AiModels, { messages })) as AiTextResponse;
    const text = result.response?.trim();
    if (!text) return err("AI returned empty response");
    return ok(text);
  } catch (e) {
    return err(`Workers AI error: ${e instanceof Error ? e.message : String(e)}`);
  }
}
