import { z } from "zod";

// Common validation schemas used across the application

export const idSchema = z.string().min(1, "ID is required");

export const paginationSchema = z.object({
	page: z.number().int().min(1).default(1),
	limit: z.number().int().min(1).max(100).default(20),
});

export const sortSchema = z.object({
	field: z.string(),
	direction: z.enum(["asc", "desc"]).default("desc"),
});

export const dateRangeSchema = z.object({
	from: z.date(),
	to: z.date(),
});

export const searchSchema = z.object({
	query: z.string().min(1, "Search query is required"),
	filters: z.record(z.string(), z.any()).optional(),
});

// Query parameter schemas
export const queryParamsSchema = z.object({
	id: z.string().optional(),
	userId: z.string().optional(),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	offset: z.coerce.number().int().min(0).default(0),
});

// Response schemas
export const successResponseSchema = z.object({
	success: z.literal(true),
	message: z.string().optional(),
	data: z.any().optional(),
});

export const errorResponseSchema = z.object({
	success: z.literal(false),
	error: z.string(),
	details: z.any().optional(),
});

export const apiResponseSchema = z.union([
	successResponseSchema,
	errorResponseSchema,
]);

// Inferred types
export type Id = z.infer<typeof idSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type Sort = z.infer<typeof sortSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
export type Search = z.infer<typeof searchSchema>;
export type QueryParams = z.infer<typeof queryParamsSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;
