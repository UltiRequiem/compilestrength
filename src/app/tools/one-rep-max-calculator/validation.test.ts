import { describe, expect, it } from "vitest";
import { MAX_REPS, MIN_REPS } from "./config";
import { oneRepMaxInputSchema } from "./validation";

describe("One Rep Max Calculator Validation", () => {
	describe("Valid Inputs", () => {
		it("should validate correct weight and reps", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "225",
				reps: "5",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.weight).toBe(225);
				expect(result.data.reps).toBe(5);
			}
		});

		it("should accept decimal weight", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "225.5",
				reps: "5",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.weight).toBe(225.5);
			}
		});

		it("should trim whitespace from inputs", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "  225  ",
				reps: "  5  ",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.weight).toBe(225);
				expect(result.data.reps).toBe(5);
			}
		});

		it("should accept minimum reps (1)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "315",
				reps: "1",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.reps).toBe(MIN_REPS);
			}
		});

		it("should accept maximum reps (20)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "135",
				reps: "20",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.reps).toBe(MAX_REPS);
			}
		});

		it("should accept typical bench press (225 × 5)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "225",
				reps: "5",
			});

			expect(result.success).toBe(true);
		});

		it("should accept typical squat (315 × 3)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "315",
				reps: "3",
			});

			expect(result.success).toBe(true);
		});

		it("should accept typical deadlift (405 × 1)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "405",
				reps: "1",
			});

			expect(result.success).toBe(true);
		});
	});

	describe("Invalid Inputs - Missing Required Fields", () => {
		it("should fail when weight is missing", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "",
				reps: "5",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Please enter weight");
			}
		});

		it("should fail when reps is missing", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "225",
				reps: "",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Please enter reps");
			}
		});
	});

	describe("Invalid Inputs - Weight Validation", () => {
		it("should fail when weight is negative", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "-225",
				reps: "5",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Weight must be greater than 0",
				);
			}
		});

		it("should fail when weight is zero", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "0",
				reps: "5",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					"Weight must be greater than 0",
				);
			}
		});

		it("should fail when weight is not a number", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "abc",
				reps: "5",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Invalid Inputs - Reps Validation", () => {
		it("should fail when reps is below minimum (0)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "225",
				reps: "0",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					`Reps must be at least ${MIN_REPS}`,
				);
			}
		});

		it("should fail when reps is negative", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "225",
				reps: "-5",
			});

			expect(result.success).toBe(false);
		});

		it("should fail when reps is above maximum (21)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "135",
				reps: "21",
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe(
					`Reps must be ${MAX_REPS} or less for accuracy`,
				);
			}
		});

		it("should truncate reps decimal to whole number", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "225",
				reps: "5.5",
			});

			// parseInt truncates decimal values, so 5.5 becomes 5
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.reps).toBe(5);
			}
		});

		it("should fail when reps is not a number", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "225",
				reps: "notanumber",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Rep Range Validation", () => {
		it("should accept 1 rep (true 1RM)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "315",
				reps: "1",
			});

			expect(result.success).toBe(true);
		});

		it("should accept 2-5 reps (strength range)", () => {
			for (let reps = 2; reps <= 5; reps++) {
				const result = oneRepMaxInputSchema.safeParse({
					weight: "225",
					reps: reps.toString(),
				});
				expect(result.success).toBe(true);
			}
		});

		it("should accept 6-12 reps (hypertrophy range)", () => {
			for (let reps = 6; reps <= 12; reps++) {
				const result = oneRepMaxInputSchema.safeParse({
					weight: "185",
					reps: reps.toString(),
				});
				expect(result.success).toBe(true);
			}
		});

		it("should accept 13-20 reps (endurance range)", () => {
			for (let reps = 13; reps <= 20; reps++) {
				const result = oneRepMaxInputSchema.safeParse({
					weight: "135",
					reps: reps.toString(),
				});
				expect(result.success).toBe(true);
			}
		});

		it("should reject 21+ reps (beyond accuracy range)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "135",
				reps: "21",
			});

			expect(result.success).toBe(false);
		});
	});

	describe("Weight Value Ranges", () => {
		it("should accept light weight (45 lbs - empty barbell)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "45",
				reps: "10",
			});

			expect(result.success).toBe(true);
		});

		it("should accept moderate weight (135 lbs)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "135",
				reps: "12",
			});

			expect(result.success).toBe(true);
		});

		it("should accept heavy weight (315 lbs)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "315",
				reps: "3",
			});

			expect(result.success).toBe(true);
		});

		it("should accept very heavy weight (500+ lbs)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "600",
				reps: "1",
			});

			expect(result.success).toBe(true);
		});

		it("should accept metric weights (100 kg)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "100",
				reps: "5",
			});

			expect(result.success).toBe(true);
		});

		it("should accept small metric weights (20 kg)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "20",
				reps: "15",
			});

			expect(result.success).toBe(true);
		});
	});

	describe("Edge Cases", () => {
		it("should accept very small weight (0.1)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "0.1",
				reps: "10",
			});

			expect(result.success).toBe(true);
		});

		it("should accept very large weight (1000)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "1000",
				reps: "1",
			});

			expect(result.success).toBe(true);
		});

		it("should accept boundary at 1 rep", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "315",
				reps: "1",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.reps).toBe(1);
			}
		});

		it("should accept boundary at 20 reps", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "135",
				reps: "20",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.reps).toBe(20);
			}
		});

		it("should handle typical accessory lift (75 lbs × 12)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "75",
				reps: "12",
			});

			expect(result.success).toBe(true);
		});

		it("should handle powerlifting competition lift (500 lbs × 1)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "500",
				reps: "1",
			});

			expect(result.success).toBe(true);
		});

		it("should handle high-rep endurance training (95 lbs × 20)", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "95",
				reps: "20",
			});

			expect(result.success).toBe(true);
		});
	});

	describe("Type Coercion", () => {
		it("should convert string weight to number", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "225",
				reps: "5",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(typeof result.data.weight).toBe("number");
				expect(result.data.weight).toBe(225);
			}
		});

		it("should convert string reps to integer", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "225",
				reps: "5",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(typeof result.data.reps).toBe("number");
				expect(Number.isInteger(result.data.reps)).toBe(true);
				expect(result.data.reps).toBe(5);
			}
		});

		it("should handle numeric string with leading zeros", () => {
			const result = oneRepMaxInputSchema.safeParse({
				weight: "0225",
				reps: "05",
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.weight).toBe(225);
				expect(result.data.reps).toBe(5);
			}
		});
	});
});
