import { describe, expect, it } from "vitest";
import { MAX_BODY_FAT_PERCENTAGE, MIN_BODY_FAT_PERCENTAGE } from "./config";
import { ffmiCalculatorInputSchema } from "./validation";

describe("FFMI Calculator Validation", () => {
	describe("Valid Inputs", () => {
		it("should validate correct imperial inputs", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "15",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.weight).toBe(180);
				expect(result.data.height).toBe(70);
				expect(result.data.bodyFat).toBe(15);
			}
		});

		it("should validate correct metric inputs", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "82",
				height: "178",
				bodyFat: "12",
				unit: "metric",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.weight).toBe(82);
				expect(result.data.height).toBe(178);
				expect(result.data.bodyFat).toBe(12);
			}
		});

		it("should accept decimal values", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "175.5",
				height: "70.25",
				bodyFat: "14.3",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.weight).toBe(175.5);
				expect(result.data.height).toBe(70.25);
				expect(result.data.bodyFat).toBe(14.3);
			}
		});

		it("should trim whitespace from inputs", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "  180  ",
				height: "  70  ",
				bodyFat: "  15  ",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.weight).toBe(180);
			}
		});

		it("should accept minimum body fat (0%)", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "0",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept maximum body fat (100%)", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "100",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});
	});

	describe("Invalid Inputs - Missing Required Fields", () => {
		it("should fail when weight is missing", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "",
				height: "70",
				bodyFat: "15",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Please enter your weight");
			}
		});

		it("should fail when height is missing", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "",
				bodyFat: "15",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Please enter your height");
			}
		});

		it("should fail when body fat is missing", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Please enter your body fat percentage",
				);
			}
		});
	});

	describe("Invalid Inputs - Weight Validation", () => {
		it("should fail when weight is negative", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "-180",
				height: "70",
				bodyFat: "15",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Weight must be greater than 0",
				);
			}
		});

		it("should fail when weight is zero", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "0",
				height: "70",
				bodyFat: "15",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Weight must be greater than 0",
				);
			}
		});

		it("should fail when weight is not a number", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "abc",
				height: "70",
				bodyFat: "15",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Invalid Inputs - Height Validation", () => {
		it("should fail when height is negative", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "-70",
				bodyFat: "15",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Height must be greater than 0",
				);
			}
		});

		it("should fail when height is zero", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "0",
				bodyFat: "15",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Height must be greater than 0",
				);
			}
		});

		it("should fail when height is not a number", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "xyz",
				bodyFat: "15",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Invalid Inputs - Body Fat Validation", () => {
		it("should fail when body fat is below minimum (0%)", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "-1",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					`Body fat percentage must be at least ${MIN_BODY_FAT_PERCENTAGE}%`,
				);
			}
		});

		it("should fail when body fat is above maximum (100%)", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "101",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					`Body fat percentage must be at most ${MAX_BODY_FAT_PERCENTAGE}%`,
				);
			}
		});

		it("should fail when body fat is not a number", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "notanumber",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Body Fat Percentage Ranges", () => {
		it("should accept very lean (5%)", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "5",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept athletic range (10-15%)", () => {
			const result1 = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "10",
				unit: "imperial",
			});

			const result2 = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "15",
				unit: "imperial",
			});

			expect(result1.success).toBe(true);
			expect(result2.success).toBe(true);
		});

		it("should accept average range (20-25%)", () => {
			const result1 = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "20",
				unit: "imperial",
			});

			const result2 = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "25",
				unit: "imperial",
			});

			expect(result1.success).toBe(true);
			expect(result2.success).toBe(true);
		});

		it("should accept higher body fat (30-40%)", () => {
			const result1 = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "30",
				unit: "imperial",
			});

			const result2 = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "40",
				unit: "imperial",
			});

			expect(result1.success).toBe(true);
			expect(result2.success).toBe(true);
		});

		it("should accept high body fat (50%)", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "50",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});
	});

	describe("Unit Validation", () => {
		it("should accept imperial unit", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "15",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept metric unit", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "82",
				height: "178",
				bodyFat: "15",
				unit: "metric",
			});

			expect(result.success).toBe(true);
		});

		it("should fail with invalid unit", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "15",
				unit: "unknown",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Edge Cases", () => {
		it("should accept minimum positive values", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "0.1",
				height: "0.1",
				bodyFat: "0.1",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept very large values", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "500",
				height: "250",
				bodyFat: "99",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept typical bodybuilder measurements", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "220",
				height: "72",
				bodyFat: "8",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept typical female athlete measurements", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "130",
				height: "65",
				bodyFat: "18",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should handle decimal body fat percentages", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "12.5",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.bodyFat).toBe(12.5);
			}
		});

		it("should handle boundary at 0% body fat", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "0",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should handle boundary at 100% body fat", () => {
			const result = ffmiCalculatorInputSchema.safeParse({
				weight: "180",
				height: "70",
				bodyFat: "100",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});
	});
});
