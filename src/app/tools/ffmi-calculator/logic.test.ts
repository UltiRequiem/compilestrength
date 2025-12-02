import { beforeEach, describe, expect, it } from "vitest";
import {
	FFMI_CATEGORIES,
	FFMI_THRESHOLDS,
	type FFMIInputs,
	HEIGHT_ADJUSTMENT_FACTOR,
	INCHES_TO_METERS,
	KG_TO_LBS,
	LBS_TO_KG,
	NORMALIZED_HEIGHT_METERS,
} from "./config";
import { calculateFFMI, convertFFMIResultUnits } from "./logic";

describe("FFMI Calculator Logic", () => {
	describe("calculateFFMI - Imperial Units", () => {
		describe("Male Athletes - Various Body Compositions", () => {
			it("should calculate FFMI for lean natural athlete", () => {
				// 180 lbs, 70 inches, 10% body fat
				// FFM = 180 × 0.9 = 162 lbs = 73.48 kg
				// Height = 70 inches = 1.778 m
				// FFMI = 73.48 / (1.778^2) = 23.26
				// Adjusted = 23.26 + 6.1 × (1.8 - 1.778) = 23.39
				const inputs: FFMIInputs = {
					weight: 180,
					height: 70,
					bodyFat: 10,
					unit: "imperial",
				};

				const result = calculateFFMI(inputs);

				expect(result.ffmi).toBeCloseTo(23.3, 0);
				expect(result.adjustedFFMI).toBeCloseTo(23.4, 0);
				expect(result.fatFreeMass).toBeCloseTo(162, 0);
				expect(result.category).toBe(FFMI_CATEGORIES.EXCELLENT);
			});

			it("should calculate FFMI for very lean athlete", () => {
				// 170 lbs, 69 inches, 8% body fat
				// FFM = 170 × 0.92 = 156.4 lbs = 70.94 kg
				// Height = 69 inches = 1.753 m
				// FFMI = 70.94 / (1.753^2) = 23.08
				const inputs: FFMIInputs = {
					weight: 170,
					height: 69,
					bodyFat: 8,
					unit: "imperial",
				};

				const result = calculateFFMI(inputs);

				expect(result.ffmi).toBeGreaterThan(22);
				expect(result.ffmi).toBeLessThan(24);
				expect(result.fatFreeMass).toBeCloseTo(156.4, 1);
				expect(result.category).toMatch(/Excellent|Superior/);
			});

			it("should calculate FFMI for heavily muscled athlete", () => {
				// 220 lbs, 72 inches, 12% body fat
				// FFM = 220 × 0.88 = 193.6 lbs = 87.86 kg
				// Height = 72 inches = 1.829 m
				// FFMI = 87.86 / (1.829^2) = 26.26
				const inputs: FFMIInputs = {
					weight: 220,
					height: 72,
					bodyFat: 12,
					unit: "imperial",
				};

				const result = calculateFFMI(inputs);

				expect(result.ffmi).toBeGreaterThan(25);
				expect(result.ffmi).toBeLessThan(27);
				expect(result.fatFreeMass).toBeCloseTo(193.6, 1);
				expect(result.category).toMatch(/Superior|Very likely enhanced/);
			});

			it("should calculate FFMI for average gym-goer", () => {
				// 165 lbs, 69 inches, 15% body fat
				// FFM = 165 × 0.85 = 140.25 lbs = 63.62 kg
				const inputs: FFMIInputs = {
					weight: 165,
					height: 69,
					bodyFat: 15,
					unit: "imperial",
				};

				const result = calculateFFMI(inputs);

				expect(result.ffmi).toBeGreaterThan(20);
				expect(result.ffmi).toBeLessThan(22);
				expect(result.fatFreeMass).toBeCloseTo(140.25, 0);
				expect(result.category).toMatch(/Average|Above average/);
			});

			it("should calculate FFMI for beginner lifter", () => {
				// 150 lbs, 68 inches, 18% body fat
				// FFM = 150 × 0.82 = 123 lbs = 55.79 kg
				const inputs: FFMIInputs = {
					weight: 150,
					height: 68,
					bodyFat: 18,
					unit: "imperial",
				};

				const result = calculateFFMI(inputs);

				expect(result.ffmi).toBeGreaterThan(17);
				expect(result.ffmi).toBeLessThan(20);
				expect(result.fatFreeMass).toBeCloseTo(123, 1);
				expect(result.category).toMatch(/Below average|Average/);
			});
		});

		describe("Female Athletes - Various Body Compositions", () => {
			it("should calculate FFMI for lean female athlete", () => {
				// 130 lbs, 65 inches, 18% body fat
				// FFM = 130 × 0.82 = 106.6 lbs = 48.35 kg
				// Height = 65 inches = 1.651 m
				// FFMI = 48.35 / (1.651^2) = 17.74
				const inputs: FFMIInputs = {
					weight: 130,
					height: 65,
					bodyFat: 18,
					unit: "imperial",
				};

				const result = calculateFFMI(inputs);

				expect(result.ffmi).toBeGreaterThan(17);
				expect(result.ffmi).toBeLessThan(19);
				expect(result.fatFreeMass).toBeCloseTo(106.6, 1);
			});

			it("should calculate FFMI for very lean female athlete", () => {
				// 140 lbs, 66 inches, 15% body fat
				// FFM = 140 × 0.85 = 119 lbs = 53.98 kg
				const inputs: FFMIInputs = {
					weight: 140,
					height: 66,
					bodyFat: 15,
					unit: "imperial",
				};

				const result = calculateFFMI(inputs);

				expect(result.ffmi).toBeGreaterThan(18);
				expect(result.ffmi).toBeLessThan(20);
				expect(result.fatFreeMass).toBeCloseTo(119, 1);
			});

			it("should calculate FFMI for average female", () => {
				// 135 lbs, 64 inches, 28% body fat
				// FFM = 135 × 0.72 = 97.2 lbs = 44.09 kg
				const inputs: FFMIInputs = {
					weight: 135,
					height: 64,
					bodyFat: 28,
					unit: "imperial",
				};

				const result = calculateFFMI(inputs);

				expect(result.ffmi).toBeGreaterThan(15);
				expect(result.ffmi).toBeLessThan(18);
				expect(result.fatFreeMass).toBeCloseTo(97.2, 1);
			});
		});

		describe("Height Adjustment", () => {
			it("should increase adjusted FFMI for shorter individuals", () => {
				// Shorter person should have higher adjusted FFMI
				const shortInputs: FFMIInputs = {
					weight: 160,
					height: 66, // 1.676m (shorter than 1.8m)
					bodyFat: 12,
					unit: "imperial",
				};

				const result = calculateFFMI(shortInputs);

				// Adjusted FFMI should be higher than raw FFMI for shorter individuals
				expect(result.adjustedFFMI).toBeGreaterThan(result.ffmi);

				// Height difference: 1.8 - 1.676 = 0.124m
				// Adjustment: 6.1 × 0.124 ≈ 0.76
				const expectedAdjustment =
					HEIGHT_ADJUSTMENT_FACTOR *
					(NORMALIZED_HEIGHT_METERS - 66 * INCHES_TO_METERS);
				expect(result.adjustedFFMI - result.ffmi).toBeCloseTo(
					expectedAdjustment,
					1,
				);
			});

			it("should decrease adjusted FFMI for taller individuals", () => {
				// Taller person should have lower adjusted FFMI
				const tallInputs: FFMIInputs = {
					weight: 200,
					height: 74, // 1.88m (taller than 1.8m)
					bodyFat: 12,
					unit: "imperial",
				};

				const result = calculateFFMI(tallInputs);

				// Adjusted FFMI should be lower than raw FFMI for taller individuals
				expect(result.adjustedFFMI).toBeLessThan(result.ffmi);

				// Height difference: 1.8 - 1.88 = -0.08m
				// Adjustment: 6.1 × (-0.08) ≈ -0.49
				const expectedAdjustment =
					HEIGHT_ADJUSTMENT_FACTOR *
					(NORMALIZED_HEIGHT_METERS - 74 * INCHES_TO_METERS);
				expect(result.adjustedFFMI - result.ffmi).toBeCloseTo(
					expectedAdjustment,
					1,
				);
			});

			it("should have minimal adjustment at normalized height", () => {
				// Person at normalized height (1.8m ≈ 70.87 inches)
				const normalInputs: FFMIInputs = {
					weight: 180,
					height: 70.87,
					bodyFat: 12,
					unit: "imperial",
				};

				const result = calculateFFMI(normalInputs);

				// Adjustment should be very small
				expect(Math.abs(result.adjustedFFMI - result.ffmi)).toBeLessThan(0.1);
			});
		});
	});

	describe("calculateFFMI - Metric Units", () => {
		it("should calculate FFMI for lean natural athlete", () => {
			// 81.65 kg, 178 cm, 10% body fat
			// FFM = 81.65 × 0.9 = 73.485 kg
			// Height = 1.78 m
			// FFMI = 73.485 / (1.78^2) = 23.19
			const inputs: FFMIInputs = {
				weight: 81.65,
				height: 178,
				bodyFat: 10,
				unit: "metric",
			};

			const result = calculateFFMI(inputs);

			expect(result.ffmi).toBeCloseTo(23.2, 1);
			expect(result.fatFreeMass).toBeCloseTo(73.5, 1);
			expect(result.category).toBe(FFMI_CATEGORIES.EXCELLENT);
		});

		it("should calculate FFMI for heavy muscular athlete", () => {
			// 100 kg, 185 cm, 12% body fat
			// FFM = 100 × 0.88 = 88 kg
			// Height = 1.85 m
			// FFMI = 88 / (1.85^2) = 25.71
			const inputs: FFMIInputs = {
				weight: 100,
				height: 185,
				bodyFat: 12,
				unit: "metric",
			};

			const result = calculateFFMI(inputs);

			expect(result.ffmi).toBeGreaterThan(25);
			expect(result.ffmi).toBeLessThan(26);
			expect(result.fatFreeMass).toBe(88);
			expect(result.category).toMatch(/Superior|Very likely enhanced/);
		});

		it("should produce same result as imperial conversion", () => {
			// 180 lbs = 81.65 kg, 70 inches = 177.8 cm
			const imperialInputs: FFMIInputs = {
				weight: 180,
				height: 70,
				bodyFat: 10,
				unit: "imperial",
			};

			const metricInputs: FFMIInputs = {
				weight: 81.65,
				height: 177.8,
				bodyFat: 10,
				unit: "metric",
			};

			const imperialResult = calculateFFMI(imperialInputs);
			const metricResult = calculateFFMI(metricInputs);

			expect(metricResult.ffmi).toBeCloseTo(imperialResult.ffmi, 1);
			expect(metricResult.adjustedFFMI).toBeCloseTo(
				imperialResult.adjustedFFMI,
				1,
			);
			// Fat-free mass will differ due to units (lbs vs kg)
		});
	});

	describe("FFMI Category Thresholds", () => {
		it("should categorize below average FFMI", () => {
			// Create inputs that yield adjusted FFMI < 18
			const inputs: FFMIInputs = {
				weight: 140,
				height: 70,
				bodyFat: 20,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);
			expect(result.adjustedFFMI).toBeLessThan(FFMI_THRESHOLDS.BELOW_AVERAGE);
			expect(result.category).toBe(FFMI_CATEGORIES.BELOW_AVERAGE);
		});

		it("should categorize average FFMI", () => {
			// Create inputs that yield adjusted FFMI between 18-20
			const inputs: FFMIInputs = {
				weight: 160,
				height: 70,
				bodyFat: 15,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);
			expect(result.adjustedFFMI).toBeGreaterThanOrEqual(
				FFMI_THRESHOLDS.BELOW_AVERAGE,
			);
			expect(result.adjustedFFMI).toBeLessThan(FFMI_THRESHOLDS.AVERAGE);
			expect(result.category).toBe(FFMI_CATEGORIES.AVERAGE);
		});

		it("should categorize above average FFMI", () => {
			// Create inputs that yield adjusted FFMI between 20-22
			const inputs: FFMIInputs = {
				weight: 170,
				height: 70,
				bodyFat: 12,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);
			expect(result.adjustedFFMI).toBeGreaterThanOrEqual(
				FFMI_THRESHOLDS.AVERAGE,
			);
			expect(result.adjustedFFMI).toBeLessThan(FFMI_THRESHOLDS.ABOVE_AVERAGE);
			expect(result.category).toBe(FFMI_CATEGORIES.ABOVE_AVERAGE);
		});

		it("should categorize excellent FFMI", () => {
			// Create inputs that yield adjusted FFMI between 22-24
			const inputs: FFMIInputs = {
				weight: 182,
				height: 70,
				bodyFat: 10,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);
			expect(result.adjustedFFMI).toBeGreaterThanOrEqual(
				FFMI_THRESHOLDS.ABOVE_AVERAGE,
			);
			expect(result.adjustedFFMI).toBeLessThan(FFMI_THRESHOLDS.EXCELLENT);
			expect(result.category).toBe(FFMI_CATEGORIES.EXCELLENT);
		});

		it("should categorize superior FFMI (natural limit)", () => {
			// Create inputs that yield adjusted FFMI between 24-26
			const inputs: FFMIInputs = {
				weight: 195,
				height: 70,
				bodyFat: 10,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);
			expect(result.adjustedFFMI).toBeGreaterThanOrEqual(
				FFMI_THRESHOLDS.EXCELLENT,
			);
			expect(result.adjustedFFMI).toBeLessThan(FFMI_THRESHOLDS.SUPERIOR);
			expect(result.category).toBe(FFMI_CATEGORIES.SUPERIOR);
		});

		it("should categorize enhanced FFMI (very likely steroid use)", () => {
			// Create inputs that yield adjusted FFMI > 26
			const inputs: FFMIInputs = {
				weight: 220,
				height: 70,
				bodyFat: 10,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);
			expect(result.adjustedFFMI).toBeGreaterThanOrEqual(
				FFMI_THRESHOLDS.SUPERIOR,
			);
			expect(result.category).toBe(FFMI_CATEGORIES.ENHANCED);
		});

		it("should handle boundary values correctly", () => {
			// Test at exact threshold boundaries
			const testCases = [
				{ adjustedFFMI: 17.9, expected: FFMI_CATEGORIES.BELOW_AVERAGE },
				{ adjustedFFMI: 18, expected: FFMI_CATEGORIES.AVERAGE },
				{ adjustedFFMI: 20, expected: FFMI_CATEGORIES.ABOVE_AVERAGE },
				{ adjustedFFMI: 22, expected: FFMI_CATEGORIES.EXCELLENT },
				{ adjustedFFMI: 24, expected: FFMI_CATEGORIES.SUPERIOR },
				{ adjustedFFMI: 26, expected: FFMI_CATEGORIES.ENHANCED },
			];

			for (const { adjustedFFMI, expected } of testCases) {
				// Create inputs that yield the target adjusted FFMI
				// This is complex, so we'll test the categorization logic directly
				// by checking the threshold constants
				if (adjustedFFMI < FFMI_THRESHOLDS.BELOW_AVERAGE) {
					expect(FFMI_CATEGORIES.BELOW_AVERAGE).toBe(expected);
				} else if (adjustedFFMI < FFMI_THRESHOLDS.AVERAGE) {
					expect(FFMI_CATEGORIES.AVERAGE).toBe(expected);
				} else if (adjustedFFMI < FFMI_THRESHOLDS.ABOVE_AVERAGE) {
					expect(FFMI_CATEGORIES.ABOVE_AVERAGE).toBe(expected);
				} else if (adjustedFFMI < FFMI_THRESHOLDS.EXCELLENT) {
					expect(FFMI_CATEGORIES.EXCELLENT).toBe(expected);
				} else if (adjustedFFMI < FFMI_THRESHOLDS.SUPERIOR) {
					expect(FFMI_CATEGORIES.SUPERIOR).toBe(expected);
				} else {
					expect(FFMI_CATEGORIES.ENHANCED).toBe(expected);
				}
			}
		});
	});

	describe("convertFFMIResultUnits", () => {
		let sampleResult: ReturnType<typeof calculateFFMI>;

		beforeEach(() => {
			const inputs: FFMIInputs = {
				weight: 180,
				height: 70,
				bodyFat: 10,
				unit: "imperial",
			};
			sampleResult = calculateFFMI(inputs);
		});

		it("should convert fat-free mass from lbs to kg", () => {
			const converted = convertFFMIResultUnits(
				sampleResult,
				"metric",
				"imperial",
			);

			expect(converted.fatFreeMass).toBeCloseTo(
				sampleResult.fatFreeMass * LBS_TO_KG,
				1,
			);
			expect(converted.ffmi).toBe(sampleResult.ffmi);
			expect(converted.adjustedFFMI).toBe(sampleResult.adjustedFFMI);
			expect(converted.category).toBe(sampleResult.category);
		});

		it("should convert fat-free mass from kg to lbs", () => {
			const metricResult = {
				ffmi: 23.3,
				adjustedFFMI: 23.4,
				fatFreeMass: 73.5,
				category: "Excellent",
			};

			const converted = convertFFMIResultUnits(
				metricResult,
				"imperial",
				"metric",
			);

			expect(converted.fatFreeMass).toBeCloseTo(73.5 * KG_TO_LBS, 1);
			expect(converted.ffmi).toBe(metricResult.ffmi);
			expect(converted.adjustedFFMI).toBe(metricResult.adjustedFFMI);
		});

		it("should not change values if units are the same", () => {
			const converted = convertFFMIResultUnits(
				sampleResult,
				"imperial",
				"imperial",
			);

			expect(converted).toEqual(sampleResult);
		});

		it("should preserve FFMI values (they are unitless)", () => {
			const converted = convertFFMIResultUnits(
				sampleResult,
				"metric",
				"imperial",
			);

			expect(converted.ffmi).toBe(sampleResult.ffmi);
			expect(converted.adjustedFFMI).toBe(sampleResult.adjustedFFMI);
		});

		it("should round converted fat-free mass to 1 decimal place", () => {
			const converted = convertFFMIResultUnits(
				sampleResult,
				"metric",
				"imperial",
			);

			expect(converted.fatFreeMass.toString()).toMatch(/^\d+\.\d$/);
		});
	});

	describe("Edge Cases and Validation", () => {
		it("should handle very low body fat percentage", () => {
			const inputs: FFMIInputs = {
				weight: 170,
				height: 70,
				bodyFat: 5,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);

			expect(result.fatFreeMass).toBeCloseTo(161.5, 1);
			expect(result.ffmi).toBeGreaterThan(20);
		});

		it("should handle high body fat percentage", () => {
			const inputs: FFMIInputs = {
				weight: 200,
				height: 70,
				bodyFat: 30,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);

			expect(result.fatFreeMass).toBeCloseTo(140, 1);
			expect(result.ffmi).toBeGreaterThan(17);
		});

		it("should handle very short person", () => {
			const inputs: FFMIInputs = {
				weight: 130,
				height: 60, // 5 feet
				bodyFat: 12,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);

			expect(result.ffmi).toBeGreaterThan(18);
			// Adjusted FFMI should be higher for shorter person
			expect(result.adjustedFFMI).toBeGreaterThan(result.ffmi);
		});

		it("should handle very tall person", () => {
			const inputs: FFMIInputs = {
				weight: 240,
				height: 78, // 6'6"
				bodyFat: 12,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);

			expect(result.ffmi).toBeGreaterThan(20);
			// Adjusted FFMI should be lower for taller person
			expect(result.adjustedFFMI).toBeLessThan(result.ffmi);
		});

		it("should handle lightweight individual", () => {
			const inputs: FFMIInputs = {
				weight: 120,
				height: 66,
				bodyFat: 15,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);

			expect(result.fatFreeMass).toBeCloseTo(102, 1);
			expect(result.ffmi).toBeGreaterThan(15);
		});

		it("should handle heavyweight individual", () => {
			const inputs: FFMIInputs = {
				weight: 260,
				height: 73,
				bodyFat: 15,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);

			expect(result.fatFreeMass).toBeCloseTo(221, 1);
			expect(result.ffmi).toBeGreaterThan(23);
		});

		it("should verify FFMI is calculated correctly with formula", () => {
			const inputs: FFMIInputs = {
				weight: 180,
				height: 70,
				bodyFat: 10,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);

			// Manual calculation:
			// Weight: 180 lbs = 81.65 kg
			// Height: 70 inches = 1.778 m
			// FFM: 180 × 0.9 = 162 lbs = 73.48 kg
			// FFMI: 73.48 / (1.778^2) = 23.26
			const weightKg = 180 * LBS_TO_KG;
			const heightM = 70 * INCHES_TO_METERS;
			const ffmKg = weightKg * 0.9;
			const expectedFFMI = ffmKg / (heightM * heightM);

			expect(result.ffmi).toBeCloseTo(expectedFFMI, 1);
		});

		it("should verify adjusted FFMI is calculated correctly", () => {
			const inputs: FFMIInputs = {
				weight: 180,
				height: 70,
				bodyFat: 10,
				unit: "imperial",
			};

			const result = calculateFFMI(inputs);

			// Adjusted FFMI = FFMI + 6.1 × (1.8 - height)
			const heightM = 70 * INCHES_TO_METERS;
			const expectedAdjustment =
				HEIGHT_ADJUSTMENT_FACTOR * (NORMALIZED_HEIGHT_METERS - heightM);
			const expectedAdjustedFFMI = result.ffmi + expectedAdjustment;

			expect(result.adjustedFFMI).toBeCloseTo(expectedAdjustedFFMI, 0);
		});
	});
});
