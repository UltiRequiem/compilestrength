import { z } from "zod";

// AI Chat schemas - matches AI SDK UIMessage structure
export const aiChatMessageSchema = z.object({
	id: z.string(),
	role: z.enum(["user", "assistant", "system", "tool"]),
	content: z.string(),
	parts: z.array(z.any()).optional(),
	createdAt: z.date().optional(),
});

export const aiChatRequestSchema = z.object({
	messages: z.array(aiChatMessageSchema),
	agentType: z.string().default("bodybuilding"),
});

// Compiler schemas
export const compilerChatRequestSchema = z.object({
	messages: z.array(aiChatMessageSchema),
	agentType: z.string().optional().default("bodybuilding"),
});

// Inferred types
export type AiChatMessage = z.infer<typeof aiChatMessageSchema>;
export type AiChatRequest = z.infer<typeof aiChatRequestSchema>;
export type CompilerChatRequest = z.infer<typeof compilerChatRequestSchema>;
