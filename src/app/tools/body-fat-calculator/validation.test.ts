import { describe, expect, it } from "vitest";
import { bodyFatInputSchema } from "./validation";

describe("Body Fat Calculator Validation", () => {
	describe("Valid Inputs", () => {
		it("should validate correct male imperial inputs", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70",
				waist: "32",
				neck: "15",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.height).toBe(70);
				expect(result.data.waist).toBe(32);
				expect(result.data.neck).toBe(15);
				expect(result.data.hip).toBeUndefined();
			}
		});

		it("should validate correct female imperial inputs with hip", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "65",
				waist: "28",
				neck: "13",
				hip: "36",
				gender: "female",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.height).toBe(65);
				expect(result.data.waist).toBe(28);
				expect(result.data.neck).toBe(13);
				expect(result.data.hip).toBe(36);
			}
		});

		it("should validate correct metric inputs", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "178",
				waist: "81",
				neck: "38",
				gender: "male",
				unit: "metric",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.height).toBe(178);
			}
		});

		it("should accept decimal values", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70.5",
				waist: "32.25",
				neck: "15.75",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.height).toBe(70.5);
				expect(result.data.waist).toBe(32.25);
			}
		});

		it("should trim whitespace from inputs", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "  70  ",
				waist: "  32  ",
				neck: "  15  ",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.height).toBe(70);
			}
		});
	});

	describe("Invalid Inputs - Missing Required Fields", () => {
		it("should fail when height is missing", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "",
				waist: "32",
				neck: "15",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Height is required");
			}
		});

		it("should fail when waist is missing", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70",
				waist: "",
				neck: "15",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Waist measurement is required",
				);
			}
		});

		it("should fail when neck is missing", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70",
				waist: "32",
				neck: "",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Neck measurement is required",
				);
			}
		});

		it("should fail when hip is missing for females", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "65",
				waist: "28",
				neck: "13",
				hip: "",
				gender: "female",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(
					result.error.issues.some((issue) =>
						issue.message.includes("Hip measurement is required"),
					),
				).toBe(true);
			}
		});

		it("should fail when hip is undefined for females", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "65",
				waist: "28",
				neck: "13",
				gender: "female",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(
					result.error.issues.some((issue) =>
						issue.message.includes("Hip measurement is required"),
					),
				).toBe(true);
			}
		});
	});

	describe("Invalid Inputs - Negative Values", () => {
		it("should fail when height is negative", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "-70",
				waist: "32",
				neck: "15",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Height must be positive");
			}
		});

		it("should fail when waist is negative", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70",
				waist: "-32",
				neck: "15",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Waist measurement must be positive",
				);
			}
		});

		it("should fail when neck is negative", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70",
				waist: "32",
				neck: "-15",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Neck measurement must be positive",
				);
			}
		});

		it("should fail when hip is negative for females", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "65",
				waist: "28",
				neck: "13",
				hip: "-36",
				gender: "female",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Hip measurement must be positive",
				);
			}
		});
	});

	describe("Invalid Inputs - Zero Values", () => {
		it("should fail when height is zero", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "0",
				waist: "32",
				neck: "15",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Height must be positive");
			}
		});

		it("should fail when waist is zero", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70",
				waist: "0",
				neck: "15",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Waist measurement must be positive",
				);
			}
		});
	});

	describe("Invalid Inputs - Non-Numeric Values", () => {
		it("should fail when height is not a number", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "abc",
				waist: "32",
				neck: "15",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
		});

		it("should fail when waist is not a number", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70",
				waist: "xyz",
				neck: "15",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
		});

		it("should fail when neck is not a number", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70",
				waist: "32",
				neck: "notanumber",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Gender and Unit Validation", () => {
		it("should accept male gender", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70",
				waist: "32",
				neck: "15",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept female gender", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "65",
				waist: "28",
				neck: "13",
				hip: "36",
				gender: "female",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept metric unit", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "178",
				waist: "81",
				neck: "38",
				gender: "male",
				unit: "metric",
			});

			expect(result.success).toBe(true);
		});

		it("should accept imperial unit", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70",
				waist: "32",
				neck: "15",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should fail with invalid gender", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70",
				waist: "32",
				neck: "15",
				gender: "other",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
		});

		it("should fail with invalid unit", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70",
				waist: "32",
				neck: "15",
				gender: "male",
				unit: "unknown",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Edge Cases", () => {
		it("should accept very small measurements", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "0.1",
				waist: "0.1",
				neck: "0.1",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept very large measurements", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "999",
				waist: "999",
				neck: "999",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should allow male with optional hip measurement", () => {
			const result = bodyFatInputSchema.safeParse({
				height: "70",
				waist: "32",
				neck: "15",
				hip: "36",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.hip).toBe(36);
			}
		});
	});
});
