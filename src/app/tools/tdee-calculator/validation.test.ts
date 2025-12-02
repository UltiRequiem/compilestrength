import { describe, expect, it } from "vitest";
import { tdeeInputSchema } from "./validation";

describe("TDEE Calculator Validation", () => {
	describe("Valid Inputs", () => {
		it("should validate correct imperial male inputs", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "70",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.age).toBe(30);
				expect(result.data.weight).toBe(180);
				expect(result.data.height).toBe(70);
				expect(result.data.activityLevel).toBe(1.55);
			}
		});

		it("should validate correct metric female inputs", () => {
			const result = tdeeInputSchema.safeParse({
				age: "25",
				weight: "65",
				height: "165",
				activityLevel: "1.375",
				gender: "female",
				unit: "metric",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.age).toBe(25);
				expect(result.data.weight).toBe(65);
				expect(result.data.height).toBe(165);
			}
		});

		it("should accept decimal weight and height", () => {
			const result = tdeeInputSchema.safeParse({
				age: "35",
				weight: "175.5",
				height: "71.25",
				activityLevel: "1.725",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.weight).toBe(175.5);
				expect(result.data.height).toBe(71.25);
			}
		});

		it("should trim whitespace from inputs", () => {
			const result = tdeeInputSchema.safeParse({
				age: "  30  ",
				weight: "  180  ",
				height: "  70  ",
				activityLevel: "  1.55  ",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.age).toBe(30);
			}
		});

		it("should accept minimum age (15)", () => {
			const result = tdeeInputSchema.safeParse({
				age: "15",
				weight: "130",
				height: "65",
				activityLevel: "1.2",
				gender: "female",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept maximum age (80)", () => {
			const result = tdeeInputSchema.safeParse({
				age: "80",
				weight: "160",
				height: "68",
				activityLevel: "1.2",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});
	});

	describe("Invalid Inputs - Missing Required Fields", () => {
		it("should fail when age is missing", () => {
			const result = tdeeInputSchema.safeParse({
				age: "",
				weight: "180",
				height: "70",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Age is required");
			}
		});

		it("should fail when weight is missing", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "",
				height: "70",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Weight is required");
			}
		});

		it("should fail when height is missing", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Height is required");
			}
		});
	});

	describe("Invalid Inputs - Age Validation", () => {
		it("should fail when age is below minimum (15)", () => {
			const result = tdeeInputSchema.safeParse({
				age: "14",
				weight: "130",
				height: "65",
				activityLevel: "1.2",
				gender: "female",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Age must be at least 15 years",
				);
			}
		});

		it("should fail when age is above maximum (80)", () => {
			const result = tdeeInputSchema.safeParse({
				age: "81",
				weight: "160",
				height: "68",
				activityLevel: "1.2",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Age must be 80 years or less",
				);
			}
		});

		it("should truncate age decimal to whole number", () => {
			const result = tdeeInputSchema.safeParse({
				age: "25.5",
				weight: "160",
				height: "68",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			// parseInt truncates decimal values, so 25.5 becomes 25
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.age).toBe(25);
			}
		});

		it("should fail when age is negative", () => {
			const result = tdeeInputSchema.safeParse({
				age: "-25",
				weight: "160",
				height: "68",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
		});

		it("should fail when age is zero", () => {
			const result = tdeeInputSchema.safeParse({
				age: "0",
				weight: "160",
				height: "68",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Invalid Inputs - Weight Validation", () => {
		it("should fail when weight is negative", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "-180",
				height: "70",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Weight must be positive");
			}
		});

		it("should fail when weight is zero", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "0",
				height: "70",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Weight must be positive");
			}
		});

		it("should fail when weight is not a number", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "abc",
				height: "70",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Invalid Inputs - Height Validation", () => {
		it("should fail when height is negative", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "-70",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Height must be positive");
			}
		});

		it("should fail when height is zero", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "0",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Height must be positive");
			}
		});

		it("should fail when height is not a number", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "xyz",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Invalid Inputs - Activity Level Validation", () => {
		it("should fail when activity level is negative", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "70",
				activityLevel: "-1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Activity level must be positive",
				);
			}
		});

		it("should fail when activity level is zero", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "70",
				activityLevel: "0",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Activity level must be positive",
				);
			}
		});

		it("should fail when activity level is not a number", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "70",
				activityLevel: "invalid",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Activity Level Values", () => {
		it("should accept sedentary activity level (1.2)", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "70",
				activityLevel: "1.2",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept lightly active (1.375)", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "70",
				activityLevel: "1.375",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept moderately active (1.55)", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "70",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept very active (1.725)", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "70",
				activityLevel: "1.725",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept extremely active (1.9)", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "70",
				activityLevel: "1.9",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});
	});

	describe("Gender and Unit Validation", () => {
		it("should accept male gender", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "70",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept female gender", () => {
			const result = tdeeInputSchema.safeParse({
				age: "25",
				weight: "140",
				height: "65",
				activityLevel: "1.375",
				gender: "female",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should accept metric unit", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "82",
				height: "178",
				activityLevel: "1.55",
				gender: "male",
				unit: "metric",
			});

			expect(result.success).toBe(true);
		});

		it("should accept imperial unit", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "70",
				activityLevel: "1.55",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should fail with invalid gender", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "70",
				activityLevel: "1.55",
				gender: "other",
				unit: "imperial",
			});

			expect(result.success).toBe(false);
		});

		it("should fail with invalid unit", () => {
			const result = tdeeInputSchema.safeParse({
				age: "30",
				weight: "180",
				height: "70",
				activityLevel: "1.55",
				gender: "male",
				unit: "unknown",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Edge Cases", () => {
		it("should accept minimum valid values", () => {
			const result = tdeeInputSchema.safeParse({
				age: "15",
				weight: "0.1",
				height: "0.1",
				activityLevel: "0.1",
				gender: "female",
				unit: "metric",
			});

			expect(result.success).toBe(true);
		});

		it("should accept very large values", () => {
			const result = tdeeInputSchema.safeParse({
				age: "80",
				weight: "500",
				height: "250",
				activityLevel: "10",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should handle young adult at boundary", () => {
			const result = tdeeInputSchema.safeParse({
				age: "18",
				weight: "150",
				height: "68",
				activityLevel: "1.725",
				gender: "male",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});

		it("should handle senior at boundary", () => {
			const result = tdeeInputSchema.safeParse({
				age: "75",
				weight: "165",
				height: "67",
				activityLevel: "1.2",
				gender: "female",
				unit: "imperial",
			});

			expect(result.success).toBe(true);
		});
	});
});
