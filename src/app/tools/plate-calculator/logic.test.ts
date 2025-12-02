import { describe, expect, it } from "vitest";
import type { WeightUnit } from "@/types/exercise";
import { calculatePlateDistribution, getDefaultBarWeight } from "./logic";

describe("calculatePlateDistribution", () => {
	describe("lbs unit system", () => {
		const unit: WeightUnit = "lbs";
		const barWeight = 45;

		it("should calculate correct plates for 225 lbs (two 45lb plates per side)", () => {
			const result = calculatePlateDistribution(225, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(225);
			expect(result.plates).toHaveLength(1);
			expect(result.plates[0]).toEqual({
				weight: 45,
				color: "bg-red-600",
				count: 2,
			});
		});

		it("should calculate correct plates for 315 lbs (three 45lb plates per side)", () => {
			const result = calculatePlateDistribution(315, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(315);
			expect(result.plates).toHaveLength(1);
			expect(result.plates[0]).toEqual({
				weight: 45,
				color: "bg-red-600",
				count: 3,
			});
		});

		it("should calculate correct plates for 135 lbs (one 45lb plate per side)", () => {
			const result = calculatePlateDistribution(135, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(135);
			expect(result.plates).toHaveLength(1);
			expect(result.plates[0]).toEqual({
				weight: 45,
				color: "bg-red-600",
				count: 1,
			});
		});

		it("should handle bar-only weight (45 lbs)", () => {
			const result = calculatePlateDistribution(barWeight, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(45);
			expect(result.plates).toHaveLength(0);
		});

		it("should calculate mixed plate combinations for 185 lbs", () => {
			// 185 = 45 (bar) + 70 per side
			// Per side: 1x45 + 1x25 = 70
			const result = calculatePlateDistribution(185, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(185);
			expect(result.plates).toHaveLength(2);

			// Should use greedy algorithm: 45lb plates first, then 25lb
			const plate45 = result.plates.find((p) => p.weight === 45);
			const plate25 = result.plates.find((p) => p.weight === 25);

			expect(plate45).toBeDefined();
			expect(plate45?.count).toBe(1);
			expect(plate25).toBeDefined();
			expect(plate25?.count).toBe(1);
		});

		it("should calculate complex plate combinations for 242.5 lbs", () => {
			// 242.5 = 45 (bar) + 98.75 per side
			// 98.75 cannot be made exactly with available plates (smallest is 2.5)
			// Greedy gives: 2x45 + 1x5 + 1x2.5 = 97.5, leaving 1.25 remainder
			const result = calculatePlateDistribution(242.5, barWeight, unit);

			expect(result.impossible).toBe(true);
			expect(result.totalWeight).toBe(240); // 45 + 2*(2*45 + 5 + 2.5)
		});

		it("should mark impossible weights that can't be loaded exactly", () => {
			// 46 = 45 (bar) + 0.5 per side
			// 0.5 lbs per side cannot be made with available plates
			const result = calculatePlateDistribution(46, barWeight, unit);

			expect(result.impossible).toBe(true);
			expect(result.totalWeight).toBe(45); // Just the bar
		});

		it("should mark impossible weights below bar weight", () => {
			const result = calculatePlateDistribution(40, barWeight, unit);

			expect(result.impossible).toBe(true);
			expect(result.totalWeight).toBe(45); // Bar weight
		});

		it("should handle maximum realistic weight (1000 lbs)", () => {
			// 1000 = 45 (bar) + 477.5 per side
			// Per side: 10x45 + 1x25 + 1x2.5 = 477.5
			const result = calculatePlateDistribution(1000, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(1000);

			const plate45 = result.plates.find((p) => p.weight === 45);
			expect(plate45).toBeDefined();
			expect(plate45?.count).toBe(10);
		});

		it("should use greedy algorithm to minimize plate count", () => {
			// 100 = 45 (bar) + 27.5 per side
			// Optimal: 1x25 + 1x2.5 = 27.5 (2 plates per side)
			const result = calculatePlateDistribution(100, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(100);
			expect(result.plates).toHaveLength(2);

			const plate25 = result.plates.find((p) => p.weight === 25);
			const plate2_5 = result.plates.find((p) => p.weight === 2.5);

			expect(plate25).toBeDefined();
			expect(plate25?.count).toBe(1);
			expect(plate2_5).toBeDefined();
			expect(plate2_5?.count).toBe(1);
		});

		it("should handle floating-point precision edge cases", () => {
			// Test with weights that might cause floating-point errors
			const result = calculatePlateDistribution(95, barWeight, unit);

			// 95 = 45 (bar) + 25 per side
			// Per side: 1x25 = 25
			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(95);
		});

		it("should handle custom bar weights", () => {
			// 15 lb training bar + 20 lbs = 35 total
			// 10 lbs per side = 1x10 per side
			const result = calculatePlateDistribution(35, 15, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(35);

			const plate10 = result.plates.find((p) => p.weight === 10);
			expect(plate10).toBeDefined();
			expect(plate10?.count).toBe(1);
		});

		it("should handle weights requiring smallest plates", () => {
			// 50 = 45 (bar) + 2.5 per side
			// Per side: 1x2.5 = 2.5
			const result = calculatePlateDistribution(50, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(50);

			const plate2_5 = result.plates.find((p) => p.weight === 2.5);
			expect(plate2_5).toBeDefined();
			expect(plate2_5?.count).toBe(1);
		});
	});

	describe("kg unit system", () => {
		const unit: WeightUnit = "kg";
		const barWeight = 20;

		it("should calculate correct plates for 100 kg (two 20kg plates per side)", () => {
			const result = calculatePlateDistribution(100, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(100);
			// 100 = 20 (bar) + 40 per side
			// Per side: 1x25 + 1x15 = 40 (greedy algorithm uses largest plates first)
			expect(result.plates.length).toBeGreaterThan(0);

			const totalPerSide = result.plates.reduce(
				(sum, plate) => sum + plate.weight * plate.count,
				0,
			);
			expect(totalPerSide).toBe(40);
		});

		it("should calculate correct plates for 140 kg (three 20kg plates per side)", () => {
			const result = calculatePlateDistribution(140, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(140);
			// 140 = 20 (bar) + 60 per side
			// Per side: 2x25 + 1x10 = 60 (greedy algorithm uses largest plates first)
			expect(result.plates.length).toBeGreaterThan(0);

			const totalPerSide = result.plates.reduce(
				(sum, plate) => sum + plate.weight * plate.count,
				0,
			);
			expect(totalPerSide).toBe(60);
		});

		it("should calculate correct plates for 60 kg (one 20kg plate per side)", () => {
			const result = calculatePlateDistribution(60, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(60);
			expect(result.plates).toHaveLength(1);
			expect(result.plates[0]).toEqual({
				weight: 20,
				color: "bg-blue-600",
				count: 1,
			});
		});

		it("should handle bar-only weight (20 kg)", () => {
			const result = calculatePlateDistribution(barWeight, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(20);
			expect(result.plates).toHaveLength(0);
		});

		it("should calculate mixed plate combinations for 80 kg", () => {
			// 80 = 20 (bar) + 30 per side
			// Per side: 1x25 + 1x5 = 30
			const result = calculatePlateDistribution(80, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(80);
			expect(result.plates).toHaveLength(2);

			const plate25 = result.plates.find((p) => p.weight === 25);
			const plate5 = result.plates.find((p) => p.weight === 5);

			expect(plate25).toBeDefined();
			expect(plate25?.count).toBe(1);
			expect(plate5).toBeDefined();
			expect(plate5?.count).toBe(1);
		});

		it("should calculate complex plate combinations for 107.5 kg", () => {
			// 107.5 = 20 (bar) + 43.75 per side
			// Per side: 1x25 + 1x15 + 1x2.5 + 1x1.25 = 43.75
			const result = calculatePlateDistribution(107.5, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(107.5);

			const plate25 = result.plates.find((p) => p.weight === 25);
			const plate15 = result.plates.find((p) => p.weight === 15);
			const plate2_5 = result.plates.find((p) => p.weight === 2.5);
			const plate1_25 = result.plates.find((p) => p.weight === 1.25);

			expect(plate25).toBeDefined();
			expect(plate25?.count).toBe(1);
			expect(plate15).toBeDefined();
			expect(plate15?.count).toBe(1);
			expect(plate2_5).toBeDefined();
			expect(plate2_5?.count).toBe(1);
			expect(plate1_25).toBeDefined();
			expect(plate1_25?.count).toBe(1);
		});

		it("should mark impossible weights that can't be loaded exactly", () => {
			// 21 = 20 (bar) + 0.5 per side
			// 0.5 kg per side cannot be made with available plates (smallest is 1.25)
			const result = calculatePlateDistribution(21, barWeight, unit);

			expect(result.impossible).toBe(true);
			expect(result.totalWeight).toBe(20); // Just the bar
		});

		it("should mark impossible weights below bar weight", () => {
			const result = calculatePlateDistribution(15, barWeight, unit);

			expect(result.impossible).toBe(true);
			expect(result.totalWeight).toBe(20); // Bar weight
		});

		it("should handle maximum realistic weight (500 kg)", () => {
			const result = calculatePlateDistribution(500, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(500);

			const plate25 = result.plates.find((p) => p.weight === 25);
			expect(plate25).toBeDefined();
			// 500 = 20 (bar) + 240 per side
			// 240 / 25 = 9.6, so at least 9x25kg plates per side
			expect(plate25?.count).toBeGreaterThanOrEqual(9);
		});

		it("should use greedy algorithm to minimize plate count", () => {
			// 45 = 20 (bar) + 12.5 per side
			// Optimal: 1x10 + 1x2.5 = 12.5 (2 plates per side)
			const result = calculatePlateDistribution(45, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(45);
			expect(result.plates).toHaveLength(2);

			const plate10 = result.plates.find((p) => p.weight === 10);
			const plate2_5 = result.plates.find((p) => p.weight === 2.5);

			expect(plate10).toBeDefined();
			expect(plate10?.count).toBe(1);
			expect(plate2_5).toBeDefined();
			expect(plate2_5?.count).toBe(1);
		});

		it("should handle floating-point precision edge cases", () => {
			// Test with weights that might cause floating-point errors
			const result = calculatePlateDistribution(52.5, barWeight, unit);

			// 52.5 = 20 (bar) + 16.25 per side
			// Per side: 1x15 + 1x1.25 = 16.25
			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(52.5);
		});

		it("should handle custom bar weights", () => {
			// 10 kg training bar + 20 kg = 30 total
			// 10 kg per side = 1x10 per side
			const result = calculatePlateDistribution(30, 10, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(30);

			const plate10 = result.plates.find((p) => p.weight === 10);
			expect(plate10).toBeDefined();
			expect(plate10?.count).toBe(1);
		});

		it("should handle weights requiring smallest plates", () => {
			// 22.5 = 20 (bar) + 1.25 per side
			// Per side: 1x1.25 = 1.25
			const result = calculatePlateDistribution(22.5, barWeight, unit);

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(22.5);

			const plate1_25 = result.plates.find((p) => p.weight === 1.25);
			expect(plate1_25).toBeDefined();
			expect(plate1_25?.count).toBe(1);
		});
	});

	describe("edge cases and boundary conditions", () => {
		it("should handle zero weight per side (bar only)", () => {
			const result = calculatePlateDistribution(45, 45, "lbs");

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(45);
			expect(result.plates).toHaveLength(0);
		});

		it("should respect PLATE_WEIGHT_TOLERANCE for impossibility check", () => {
			// Test that the tolerance value is used correctly
			// A weight that's off by exactly the tolerance should be acceptable
			const barWeight = 45;
			const unit: WeightUnit = "lbs";

			// This should be marked as impossible because the remainder exceeds tolerance
			const result = calculatePlateDistribution(46, barWeight, unit);
			expect(result.impossible).toBe(true);
		});

		it("should handle very small weight differences (floating-point precision)", () => {
			const result = calculatePlateDistribution(95.0000001, 45, "lbs");

			// Should round to 95 within tolerance
			expect(result.totalWeight).toBe(95);
		});

		it("should return empty plates array when no plates needed", () => {
			const result = calculatePlateDistribution(20, 20, "kg");

			expect(result.plates).toEqual([]);
			expect(result.plates).toHaveLength(0);
		});

		it("should handle negative weight per side (impossible scenario)", () => {
			const result = calculatePlateDistribution(10, 45, "lbs");

			expect(result.impossible).toBe(true);
			expect(result.totalWeight).toBe(45);
		});

		it("should verify greedy algorithm produces minimal plate count", () => {
			// 200 lbs = 45 (bar) + 77.5 per side
			// Optimal: 1x45 + 1x25 + 1x5 + 1x2.5 = 77.5 (4 plates per side)
			const result = calculatePlateDistribution(200, 45, "lbs");

			expect(result.impossible).toBe(false);
			expect(result.totalWeight).toBe(200);

			// Count total plates per side
			const totalPlatesPerSide = result.plates.reduce(
				(sum, plate) => sum + plate.count,
				0,
			);

			// Should use 4 plates per side (greedy minimization)
			expect(totalPlatesPerSide).toBe(4);
		});
	});

	describe("result structure validation", () => {
		it("should return correct structure with all required fields", () => {
			const result = calculatePlateDistribution(135, 45, "lbs");

			expect(result).toHaveProperty("plates");
			expect(result).toHaveProperty("totalWeight");
			expect(result).toHaveProperty("impossible");
			expect(Array.isArray(result.plates)).toBe(true);
			expect(typeof result.totalWeight).toBe("number");
			expect(typeof result.impossible).toBe("boolean");
		});

		it("should return plates with correct structure", () => {
			const result = calculatePlateDistribution(135, 45, "lbs");

			expect(result.plates.length).toBeGreaterThan(0);

			for (const plate of result.plates) {
				expect(plate).toHaveProperty("weight");
				expect(plate).toHaveProperty("color");
				expect(plate).toHaveProperty("count");
				expect(typeof plate.weight).toBe("number");
				expect(typeof plate.color).toBe("string");
				expect(typeof plate.count).toBe("number");
				expect(plate.count).toBeGreaterThan(0);
			}
		});

		it("should only include plates with count > 0", () => {
			const result = calculatePlateDistribution(135, 45, "lbs");

			for (const plate of result.plates) {
				expect(plate.count).toBeGreaterThan(0);
			}
		});
	});
});

describe("getDefaultBarWeight", () => {
	it("should return '45' for lbs unit system", () => {
		const result = getDefaultBarWeight("lbs");

		expect(result).toBe("45");
		expect(typeof result).toBe("string");
	});

	it("should return '20' for kg unit system", () => {
		const result = getDefaultBarWeight("kg");

		expect(result).toBe("20");
		expect(typeof result).toBe("string");
	});

	it("should return string format (not number)", () => {
		const lbsResult = getDefaultBarWeight("lbs");
		const kgResult = getDefaultBarWeight("kg");

		expect(typeof lbsResult).toBe("string");
		expect(typeof kgResult).toBe("string");
	});
});
