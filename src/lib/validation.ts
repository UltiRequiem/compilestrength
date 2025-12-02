import type { ZodError, ZodSchema } from "zod";

export class ValidationError extends Error {
	constructor(public errors: ZodError["issues"]) {
		super("Validation failed");
		this.name = "ValidationError";
	}
}

export function validateRequest<T>(schema: ZodSchema<T>, data: unknown): T {
	const result = schema.safeParse(data);

	if (!result.success) {
		throw new ValidationError(result.error.issues);
	}

	return result.data;
}

export function createValidationErrorResponse(error: ValidationError) {
	return new Response(
		JSON.stringify({
			success: false,
			error: "Validation failed",
			details: error.errors.map((err) => ({
				field: err.path.join("."),
				message: err.message,
				code: err.code,
			})),
		}),
		{
			status: 400,
			headers: { "Content-Type": "application/json" },
		},
	);
}

export function createErrorResponse(message: string, status = 500) {
	const response = {
			success: false,
			error: message,
		};

	return new Response(
		JSON.stringify(response),
		{
			status,
			headers: { "Content-Type": "application/json" },
		},
	);
}

export function createSuccessResponse(
	data?: Record<string, unknown> | null,
	message?: string,
) {
	const response: Record<string, unknown> = {
		success: true,
	};

	if (message !== undefined) {
		response.message = message;
	}

	if (data !== undefined && data !== null) {
		response.data = data;
	}

	return new Response(JSON.stringify(response), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
