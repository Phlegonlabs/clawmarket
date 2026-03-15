import { z } from "zod";

/** Multi-channel display format for agent-facing responses */
export const DisplayFormatSchema = z.object({
  markdown: z.string(),
  telegram: z.string().optional(),
  discord: z.string().optional(),
});
export type DisplayFormat = z.infer<typeof DisplayFormatSchema>;

/** Standard agent-facing response wrapper: structured data + display */
export const AgentResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    display: DisplayFormatSchema,
  });

export type AgentResponse<T> = {
  data: T;
  display: DisplayFormat;
};
