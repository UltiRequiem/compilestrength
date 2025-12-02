import { describe, expect, it } from "vitest";
import z, { type ZodError } from "zod";
import {
	createErrorResponse,
	createSuccessResponse,
	createValidationErrorResponse,
	ValidationError,
	validateRequest,
} from "./validation";

describe("ValidationError", () => {
	it("should create a ValidationError with correct properties", () => {
		const mockErrors = [
			{
				code: "invalid_type" as const,
				expected: "string",
				path: ["name"],
				message: "Invalid input: expected string",
			},
		] as ZodError["issues"];

		const error = new ValidationError(mockErrors);

		expect(error).toBeInstanceOf(Error);
		expect(error.name).toBe("ValidationError");
		expect(error.message).toBe("Validation failed");
		expect(error.errors).toEqual(mockErrors);
	});

	it("should handle multiple validation errors", () => {
		const mockErrors = [
			{
				code: "invalid_type" as const,
				expected: "string",
				path: ["name"],
				message: "Invalid input: expected string",
			},
			{
				code: "too_small" as const,
				minimum: 1,
				type: "number" as const,
				inclusive: true,
				exact: false,
				path: ["age"],
				message: "Number must be greater than or equal to 1",
			},
		] as ZodError["issues"];

		const error = new ValidationError(mockErrors);

		expect(error.errors).toHaveLength(2);
		expect(error.errors[0].path).toEqual(["name"]);
		expect(error.errors[1].path).toEqual(["age"]);
	});
});

describe("validateRequest", () => {
	it("should return valid data when schema validation passes", () => {
		const schema = z.object({
			name: z.string(),
			age: z.number(),
		});

		const validData = { name: "John", age: 30 };
		const result = validateRequest(schema, validData);

		expect(result).toEqual(validData);
	});

	it("should throw ValidationError when schema validation fails", () => {
		const schema = z.object({
			name: z.string(),
			age: z.number(),
		});

		const invalidData = { name: "John", age: "thirty" };

		expect(() => validateRequest(schema, invalidData)).toThrow(ValidationError);
		expect(() => validateRequest(schema, invalidData)).toThrow(
			"Validation failed",
		);
	});

	it("should handle nested object validation", () => {
		const schema = z.object({
			user: z.object({
				name: z.string(),
				email: z.string().email(),
			}),
		});

		const validData = {
			user: { name: "John", email: "john@example.com" },
		};

		const result = validateRequest(schema, validData);
		expect(result).toEqual(validData);
	});

	it("should throw ValidationError for nested object validation failures", () => {
		const schema = z.object({
			user: z.object({
				name: z.string(),
				email: z.string().email(),
			}),
		});

		const invalidData = {
			user: { name: "John", email: "invalid-email" },
		};

		expect(() => validateRequest(schema, invalidData)).toThrow(ValidationError);
	});

	it("should handle empty objects when required fields are missing", () => {
		const schema = z.object({
			name: z.string(),
			age: z.number(),
		});

		expect(() => validateRequest(schema, {})).toThrow(ValidationError);
	});

	it("should handle null values", () => {
		const schema = z.object({
			name: z.string(),
		});

		expect(() => validateRequest(schema, null)).toThrow(ValidationError);
	});

	it("should handle undefined values", () => {
		const schema = z.object({
			name: z.string(),
		});

		expect(() => validateRequest(schema, undefined)).toThrow(ValidationError);
	});

	it("should validate arrays correctly", () => {
		const schema = z.array(z.number());
		const validData = [1, 2, 3];

		const result = validateRequest(schema, validData);
		expect(result).toEqual(validData);
	});

	it("should throw ValidationError for invalid array items", () => {
		const schema = z.array(z.number());
		const invalidData = [1, "two", 3];

		expect(() => validateRequest(schema, invalidData)).toThrow(ValidationError);
	});

	it("should handle optional fields", () => {
		const schema = z.object({
			name: z.string(),
			age: z.number().optional(),
		});

		const dataWithoutOptional = { name: "John" };
		const result = validateRequest(schema, dataWithoutOptional);

		expect(result).toEqual(dataWithoutOptional);
	});

	it("should validate complex nested structures", () => {
		const schema = z.object({
			user: z.object({
				name: z.string(),
				contacts: z.array(
					z.object({
						type: z.enum(["email", "phone"]),
						value: z.string(),
					}),
				),
			}),
		});

		const validData = {
			user: {
				name: "John",
				contacts: [
					{ type: "email" as const, value: "john@example.com" },
					{ type: "phone" as const, value: "123-456-7890" },
				],
			},
		};

		const result = validateRequest(schema, validData);
		expect(result).toEqual(validData);
	});
});

describe("createValidationErrorResponse", () => {
	it("should format single validation error correctly", () => {
		const mockError = new ValidationError([
			{
				code: "invalid_type" as const,
				expected: "string",
				path: ["name"],
				message: "Invalid input: expected string",
			},
		]);

		const response = createValidationErrorResponse(mockError);

		expect(response).toBeInstanceOf(Response);
		expect(response.status).toBe(400);
		expect(response.headers.get("Content-Type")).toBe("application/json");
	});

	it("should format response body with correct structure", async () => {
		const mockError = new ValidationError([
			{
				code: "invalid_type" as const,
				expected: "string",
				path: ["name"],
				message: "Invalid input: expected string",
			},
		]);

		const response = createValidationErrorResponse(mockError);
		const body = await response.json();

		expect(body).toEqual({
			success: false,
			error: "Validation failed",
			details: [
				{
					field: "name",
					message: "Invalid input: expected string",
					code: "invalid_type",
				},
			],
		});
	});

	it("should format multiple validation errors correctly", async () => {
		const mockError = new ValidationError([
			{
				code: "invalid_type" as const,
				expected: "string",
				path: ["name"],
				message: "Invalid input: expected string",
			},
			{
				code: "too_small" as const,
				minimum: 1,
				type: "number" as const,
				inclusive: true,
				exact: false,
				path: ["age"],
				message: "Number must be greater than or equal to 1",
			},
		] as ZodError["issues"]);

		const response = createValidationErrorResponse(mockError);
		const body: {
			success: boolean;
			error: string;
			details: { field: string; message: string; code: string }[];
		} = await response.json();

		expect(body.details).toHaveLength(2);
		expect(body.details[0].field).toBe("name");
		expect(body.details[1].field).toBe("age");
	});

	it("should format nested field paths correctly", async () => {
		const mockError = new ValidationError([
			{
				code: "invalid_type" as const,
				expected: "string",
				path: ["user", "address", "street"],
				message: "Invalid input: expected string",
			},
		]);

		const response = createValidationErrorResponse(mockError);
		const body: {
			success: boolean;
			error: string;
			details: { field: string; message: string; code: string }[];
		} = await response.json();

		expect(body.details[0].field).toBe("user.address.street");
	});

	it("should handle empty path arrays", async () => {
		const mockError = new ValidationError([
			{
				code: "invalid_type" as const,
				expected: "string",
				path: [],
				message: "Invalid input: expected string",
			},
		]);

		const response = createValidationErrorResponse(mockError);
		const body: {
			success: boolean;
			error: string;
			details: { field: string; message: string; code: string }[];
		} = await response.json();

		expect(body.details[0].field).toBe("");
	});
});

describe("createErrorResponse", () => {
	it("should create error response with default status 500", async () => {
		const response = createErrorResponse("Internal server error");

		expect(response).toBeInstanceOf(Response);
		expect(response.status).toBe(500);
		expect(response.headers.get("Content-Type")).toBe("application/json");

		const body = await response.json();
		expect(body).toEqual({
			success: false,
			error: "Internal server error",
		});
	});

	it("should create error response with custom status", async () => {
		const response = createErrorResponse("Not found", 404);

		expect(response.status).toBe(404);

		const body = await response.json();
		expect(body).toEqual({
			success: false,
			error: "Not found",
		});
	});

	it("should create error response with 400 status", async () => {
		const response = createErrorResponse("Bad request", 400);

		expect(response.status).toBe(400);

		const body = await response.json();
		expect(body).toEqual({
			success: false,
			error: "Bad request",
		});
	});

	it("should create error response with 401 status", async () => {
		const response = createErrorResponse("Unauthorized", 401);

		expect(response.status).toBe(401);

		const body = await response.json();
		expect(body).toEqual({
			success: false,
			error: "Unauthorized",
		});
	});

	it("should handle empty error message", async () => {
		const response = createErrorResponse("");

		const body: { success: boolean; error: string } = await response.json();
		expect(body.error).toBe("");
	});
});

describe("createSuccessResponse", () => {
	it("should create success response without data or message", async () => {
		const response = createSuccessResponse();

		expect(response).toBeInstanceOf(Response);
		expect(response.status).toBe(200);
		expect(response.headers.get("Content-Type")).toBe("application/json");

		const body = await response.json();
		expect(body).toEqual({
			success: true,
		});
	});

	it("should create success response with data only", async () => {
		const data = { id: 1, name: "John" };
		const response = createSuccessResponse(data);

		const body = await response.json();
		expect(body).toEqual({
			success: true,
			data: { id: 1, name: "John" },
		});
	});

	it("should create success response with message only", async () => {
		const response = createSuccessResponse(undefined, "Operation successful");

		const body = await response.json();
		expect(body).toEqual({
			success: true,
			message: "Operation successful",
		});
	});

	it("should create success response with both data and message", async () => {
		const data = { id: 1, name: "John" };
		const response = createSuccessResponse(data, "User created");

		const body = await response.json();
		expect(body).toEqual({
			success: true,
			message: "User created",
			data: { id: 1, name: "John" },
		});
	});

	it("should handle null data correctly", async () => {
		const response = createSuccessResponse(null);

		const body = await response.json();
		expect(body).toEqual({
			success: true,
		});
	});

	it("should handle undefined data explicitly", async () => {
		const response = createSuccessResponse(undefined);

		const body = await response.json();
		expect(body).toEqual({
			success: true,
		});
	});

	it("should handle nested object data", async () => {
		const data = {
			user: {
				name: "John",
				contacts: [{ type: "email", value: "john@example.com" }],
			},
		};
		const response = createSuccessResponse(data);

		const body = await response.json();
		expect(body).toEqual({
			success: true,
			data,
		});
	});

	it("should handle empty message string", async () => {
		const response = createSuccessResponse({ id: 1 }, "Hello World");

		const body = await response.json();
		expect(body).toEqual({
			success: true,
			data: { id: 1 },
			message: "Hello World",
		});
	});
});
