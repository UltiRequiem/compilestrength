import { describe, expect, it } from "vitest";
import { plateCalculatorInputSchema } from "./validation";

describe("plateCalculatorInputSchema", () => {
	describe("valid inputs", () => {
		it("should accept valid target weight and bar weight", () => {
			const input = {
				targetWeight: "225",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(225);
				expect(result.data.barWeight).toBe(45);
			}
		});

		it("should accept decimal weights", () => {
			const input = {
				targetWeight: "242.5",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(242.5);
				expect(result.data.barWeight).toBe(45);
			}
		});

		it("should accept very small increments (e.g., 2.5 lbs)", () => {
			const input = {
				targetWeight: "47.5",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(47.5);
				expect(result.data.barWeight).toBe(45);
			}
		});

		it("should accept large weights (e.g., 1000 lbs)", () => {
			const input = {
				targetWeight: "1000",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(1000);
			}
		});

		it("should trim whitespace from inputs", () => {
			const input = {
				targetWeight: "  225  ",
				barWeight: "  45  ",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(225);
				expect(result.data.barWeight).toBe(45);
			}
		});

		it("should accept kg weights (20 kg bar)", () => {
			const input = {
				targetWeight: "100",
				barWeight: "20",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(100);
				expect(result.data.barWeight).toBe(20);
			}
		});

		it("should accept kg decimal weights", () => {
			const input = {
				targetWeight: "107.5",
				barWeight: "20",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(107.5);
				expect(result.data.barWeight).toBe(20);
			}
		});

		it("should accept training bar weights (15 lbs, 10 kg)", () => {
			const input = {
				targetWeight: "35",
				barWeight: "15",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(35);
				expect(result.data.barWeight).toBe(15);
			}
		});
	});

	describe("invalid target weight", () => {
		it("should reject negative target weight", () => {
			const input = {
				targetWeight: "-100",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					"Target weight must be greater than 0",
				);
			}
		});

		it("should reject zero target weight", () => {
			const input = {
				targetWeight: "0",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					"Target weight must be greater than 0",
				);
			}
		});

		it("should reject empty target weight", () => {
			const input = {
				targetWeight: "",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					"Please enter target weight",
				);
			}
		});

		it("should reject whitespace-only target weight", () => {
			const input = {
				targetWeight: "   ",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					"Please enter target weight",
				);
			}
		});

		it("should reject non-numeric target weight", () => {
			const input = {
				targetWeight: "abc",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues.length).toBeGreaterThan(0);
			}
		});

		it("should accept target weight with trailing special characters (parseFloat behavior)", () => {
			// Note: parseFloat("100@#$") returns 100, stopping at first invalid char
			const input = {
				targetWeight: "100@#$",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(100);
			}
		});

		it("should accept target weight with trailing text (parseFloat behavior)", () => {
			// Note: parseFloat("100lbs") returns 100, stopping at first invalid char
			const input = {
				targetWeight: "100lbs",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(100);
			}
		});
	});

	describe("invalid bar weight", () => {
		it("should reject negative bar weight", () => {
			const input = {
				targetWeight: "100",
				barWeight: "-45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					"Bar weight must be greater than 0",
				);
			}
		});

		it("should reject zero bar weight", () => {
			const input = {
				targetWeight: "100",
				barWeight: "0",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					"Bar weight must be greater than 0",
				);
			}
		});

		it("should reject empty bar weight", () => {
			const input = {
				targetWeight: "100",
				barWeight: "",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					"Please enter bar weight",
				);
			}
		});

		it("should reject whitespace-only bar weight", () => {
			const input = {
				targetWeight: "100",
				barWeight: "   ",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toContain(
					"Please enter bar weight",
				);
			}
		});

		it("should reject non-numeric bar weight", () => {
			const input = {
				targetWeight: "100",
				barWeight: "xyz",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
		});

		it("should accept bar weight with trailing special characters (parseFloat behavior)", () => {
			// Note: parseFloat("45!@#") returns 45, stopping at first invalid char
			const input = {
				targetWeight: "100",
				barWeight: "45!@#",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.barWeight).toBe(45);
			}
		});
	});

	describe("target weight must be greater than bar weight", () => {
		it("should reject when target weight equals bar weight", () => {
			const input = {
				targetWeight: "45",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				const targetWeightError = result.error.issues.find(
					(issue) => issue.path[0] === "targetWeight",
				);
				expect(targetWeightError?.message).toBe(
					"Target weight must be greater than bar weight",
				);
			}
		});

		it("should reject when target weight is less than bar weight", () => {
			const input = {
				targetWeight: "40",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				const targetWeightError = result.error.issues.find(
					(issue) => issue.path[0] === "targetWeight",
				);
				expect(targetWeightError?.message).toBe(
					"Target weight must be greater than bar weight",
				);
			}
		});

		it("should accept when target weight is slightly more than bar weight", () => {
			const input = {
				targetWeight: "45.01",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
		});

		it("should reject when target weight equals bar weight (kg)", () => {
			const input = {
				targetWeight: "20",
				barWeight: "20",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
		});

		it("should reject when target weight is less than bar weight (kg)", () => {
			const input = {
				targetWeight: "15",
				barWeight: "20",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
		});
	});

	describe("multiple validation errors", () => {
		it("should report multiple errors when both fields are invalid", () => {
			const input = {
				targetWeight: "-100",
				barWeight: "-45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
			}
		});

		it("should report both empty field errors", () => {
			const input = {
				targetWeight: "",
				barWeight: "",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
			}
		});

		it("should report both non-numeric errors", () => {
			const input = {
				targetWeight: "abc",
				barWeight: "xyz",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
			}
		});
	});

	describe("edge cases", () => {
		it("should handle very large weights", () => {
			const input = {
				targetWeight: "999999",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(999999);
			}
		});

		it("should handle very small decimal increments", () => {
			const input = {
				targetWeight: "45.001",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(45.001);
			}
		});

		it("should handle scientific notation", () => {
			const input = {
				targetWeight: "1e2",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(100);
			}
		});

		it("should reject Infinity", () => {
			const input = {
				targetWeight: "Infinity",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
		});

		it("should reject NaN", () => {
			const input = {
				targetWeight: "NaN",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
		});

		it("should handle leading zeros", () => {
			const input = {
				targetWeight: "00225",
				barWeight: "045",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(225);
				expect(result.data.barWeight).toBe(45);
			}
		});

		it("should handle decimal point without trailing digits", () => {
			const input = {
				targetWeight: "225.",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(225);
			}
		});

		it("should handle decimal point without leading digits", () => {
			const input = {
				targetWeight: "100",
				barWeight: ".5",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.barWeight).toBe(0.5);
			}
		});
	});

	describe("type coercion", () => {
		it("should transform string to number", () => {
			const input = {
				targetWeight: "225",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(typeof result.data.targetWeight).toBe("number");
				expect(typeof result.data.barWeight).toBe("number");
			}
		});

		it("should maintain decimal precision after transformation", () => {
			const input = {
				targetWeight: "242.5",
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.targetWeight).toBe(242.5);
				expect(result.data.targetWeight % 1).toBe(0.5);
			}
		});
	});

	describe("missing fields", () => {
		it("should reject missing targetWeight field", () => {
			const input = {
				barWeight: "45",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
		});

		it("should reject missing barWeight field", () => {
			const input = {
				targetWeight: "225",
			};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
		});

		it("should reject completely empty input", () => {
			const input = {};

			const result = plateCalculatorInputSchema.safeParse(input);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues.length).toBeGreaterThanOrEqual(2);
			}
		});

		it("should reject null input", () => {
			const result = plateCalculatorInputSchema.safeParse(null);

			expect(result.success).toBe(false);
		});

		it("should reject undefined input", () => {
			const result = plateCalculatorInputSchema.safeParse(undefined);

			expect(result.success).toBe(false);
		});
	});
});
