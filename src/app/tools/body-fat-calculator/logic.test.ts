import { beforeEach, describe, expect, it } from "vitest";
import {
	FEMALE_CATEGORIES,
	INCHES_TO_CM,
	MALE_CATEGORIES,
	type MeasurementInputs,
} from "./config";
import {
	calculateBodyFat,
	calculateFemaleBodyFat,
	calculateMaleBodyFat,
	convertInchesToCm,
	determineBodyFatCategory,
} from "./logic";

describe("Body Fat Calculator Logic", () => {
	describe("convertInchesToCm", () => {
		it("should convert inches to centimeters correctly", () => {
			expect(convertInchesToCm(1)).toBe(INCHES_TO_CM);
			expect(convertInchesToCm(10)).toBeCloseTo(25.4, 1);
			expect(convertInchesToCm(70)).toBeCloseTo(177.8, 1);
		});

		it("should handle edge cases", () => {
			expect(convertInchesToCm(0)).toBe(0);
			expect(convertInchesToCm(100)).toBeCloseTo(254, 1);
		});
	});

	describe("calculateMaleBodyFat", () => {
		it("should calculate body fat for lean male athlete", () => {
			// Example: 70 inches (177.8cm), 32 inch waist (81.28cm), 15 inch neck (38.1cm)
			const heightCm = 177.8;
			const waistCm = 81.28;
			const neckCm = 38.1;

			const result = calculateMaleBodyFat(heightCm, waistCm, neckCm);
			expect(result).toBeGreaterThan(5);
			expect(result).toBeLessThan(20);
		});

		it("should calculate body fat for average male", () => {
			// Example: 70 inches (177.8cm), 38 inch waist (96.52cm), 15 inch neck (38.1cm)
			const heightCm = 177.8;
			const waistCm = 96.52;
			const neckCm = 38.1;

			const result = calculateMaleBodyFat(heightCm, waistCm, neckCm);
			expect(result).toBeGreaterThan(15);
			expect(result).toBeLessThan(30);
		});

		it("should calculate body fat for muscular male with thick neck", () => {
			// Example: 72 inches (182.88cm), 34 inch waist (86.36cm), 17 inch neck (43.18cm)
			const heightCm = 182.88;
			const waistCm = 86.36;
			const neckCm = 43.18;

			const result = calculateMaleBodyFat(heightCm, waistCm, neckCm);
			expect(result).toBeGreaterThan(5);
			expect(result).toBeLessThan(20);
		});

		it("should handle extreme measurements", () => {
			// Very lean: small waist relative to neck
			const heightCm = 180;
			const waistCm = 75;
			const neckCm = 40;

			const result = calculateMaleBodyFat(heightCm, waistCm, neckCm);
			expect(result).toBeGreaterThan(0);
			expect(result).toBeLessThan(15);
		});
	});

	describe("calculateFemaleBodyFat", () => {
		it("should calculate body fat for lean female athlete", () => {
			// Example: 65 inches (165.1cm), 28 inch waist (71.12cm), 32 inch hip (81.28cm), 13 inch neck (33.02cm)
			const heightCm = 165.1;
			const waistCm = 71.12;
			const hipCm = 81.28;
			const neckCm = 33.02;

			const result = calculateFemaleBodyFat(heightCm, waistCm, hipCm, neckCm);
			expect(result).toBeGreaterThan(10);
			expect(result).toBeLessThan(30);
		});

		it("should calculate body fat for average female", () => {
			// Example: 65 inches (165.1cm), 32 inch waist (81.28cm), 38 inch hip (96.52cm), 13 inch neck (33.02cm)
			const heightCm = 165.1;
			const waistCm = 81.28;
			const hipCm = 96.52;
			const neckCm = 33.02;

			const result = calculateFemaleBodyFat(heightCm, waistCm, hipCm, neckCm);
			expect(result).toBeGreaterThan(20);
			expect(result).toBeLessThan(40);
		});

		it("should calculate body fat for fit female with low body fat", () => {
			// Example: 66 inches (167.64cm), 26 inch waist (66.04cm), 35 inch hip (88.9cm), 12.5 inch neck (31.75cm)
			const heightCm = 167.64;
			const waistCm = 66.04;
			const hipCm = 88.9;
			const neckCm = 31.75;

			const result = calculateFemaleBodyFat(heightCm, waistCm, hipCm, neckCm);
			expect(result).toBeGreaterThan(12);
			expect(result).toBeLessThan(22);
		});

		it("should handle extreme measurements", () => {
			// Very lean: small waist/hip relative to neck
			const heightCm = 170;
			const waistCm = 65;
			const hipCm = 85;
			const neckCm = 30;

			const result = calculateFemaleBodyFat(heightCm, waistCm, hipCm, neckCm);
			expect(result).toBeGreaterThan(0);
			expect(result).toBeLessThan(30);
		});
	});

	describe("determineBodyFatCategory - Male", () => {
		it('should categorize very low body fat as "Essential fat (too low)"', () => {
			expect(determineBodyFatCategory(4, "male")).toBe(
				"Essential fat (too low)",
			);
			expect(determineBodyFatCategory(5.9, "male")).toBe(
				"Essential fat (too low)",
			);
		});

		it('should categorize athletic range as "Athletic"', () => {
			expect(determineBodyFatCategory(6, "male")).toBe("Athletic");
			expect(determineBodyFatCategory(10, "male")).toBe("Athletic");
			expect(determineBodyFatCategory(13.9, "male")).toBe("Athletic");
		});

		it('should categorize fitness range as "Fitness"', () => {
			expect(determineBodyFatCategory(14, "male")).toBe("Fitness");
			expect(determineBodyFatCategory(16, "male")).toBe("Fitness");
			expect(determineBodyFatCategory(17.9, "male")).toBe("Fitness");
		});

		it('should categorize average range as "Average"', () => {
			expect(determineBodyFatCategory(18, "male")).toBe("Average");
			expect(determineBodyFatCategory(21, "male")).toBe("Average");
			expect(determineBodyFatCategory(24.9, "male")).toBe("Average");
		});

		it('should categorize high body fat as "Above average"', () => {
			expect(determineBodyFatCategory(25, "male")).toBe("Above average");
			expect(determineBodyFatCategory(30, "male")).toBe("Above average");
			expect(determineBodyFatCategory(40, "male")).toBe("Above average");
		});

		it("should handle boundary values correctly", () => {
			expect(
				determineBodyFatCategory(MALE_CATEGORIES.ESSENTIAL_FAT_MAX, "male"),
			).toBe("Athletic");
			expect(
				determineBodyFatCategory(MALE_CATEGORIES.ATHLETIC_MAX, "male"),
			).toBe("Fitness");
			expect(
				determineBodyFatCategory(MALE_CATEGORIES.FITNESS_MAX, "male"),
			).toBe("Average");
			expect(
				determineBodyFatCategory(MALE_CATEGORIES.AVERAGE_MAX, "male"),
			).toBe("Above average");
		});
	});

	describe("determineBodyFatCategory - Female", () => {
		it('should categorize very low body fat as "Essential fat (too low)"', () => {
			expect(determineBodyFatCategory(10, "female")).toBe(
				"Essential fat (too low)",
			);
			expect(determineBodyFatCategory(13.9, "female")).toBe(
				"Essential fat (too low)",
			);
		});

		it('should categorize athletic range as "Athletic"', () => {
			expect(determineBodyFatCategory(14, "female")).toBe("Athletic");
			expect(determineBodyFatCategory(17, "female")).toBe("Athletic");
			expect(determineBodyFatCategory(20.9, "female")).toBe("Athletic");
		});

		it('should categorize fitness range as "Fitness"', () => {
			expect(determineBodyFatCategory(21, "female")).toBe("Fitness");
			expect(determineBodyFatCategory(23, "female")).toBe("Fitness");
			expect(determineBodyFatCategory(24.9, "female")).toBe("Fitness");
		});

		it('should categorize average range as "Average"', () => {
			expect(determineBodyFatCategory(25, "female")).toBe("Average");
			expect(determineBodyFatCategory(28, "female")).toBe("Average");
			expect(determineBodyFatCategory(31.9, "female")).toBe("Average");
		});

		it('should categorize high body fat as "Above average"', () => {
			expect(determineBodyFatCategory(32, "female")).toBe("Above average");
			expect(determineBodyFatCategory(40, "female")).toBe("Above average");
			expect(determineBodyFatCategory(50, "female")).toBe("Above average");
		});

		it("should handle boundary values correctly", () => {
			expect(
				determineBodyFatCategory(FEMALE_CATEGORIES.ESSENTIAL_FAT_MAX, "female"),
			).toBe("Athletic");
			expect(
				determineBodyFatCategory(FEMALE_CATEGORIES.ATHLETIC_MAX, "female"),
			).toBe("Fitness");
			expect(
				determineBodyFatCategory(FEMALE_CATEGORIES.FITNESS_MAX, "female"),
			).toBe("Average");
			expect(
				determineBodyFatCategory(FEMALE_CATEGORIES.AVERAGE_MAX, "female"),
			).toBe("Above average");
		});
	});

	describe("calculateBodyFat - Main Function", () => {
		describe("Imperial Units - Male", () => {
			let maleImperialInputs: MeasurementInputs;

			beforeEach(() => {
				maleImperialInputs = {
					height: 70, // inches
					waist: 32, // inches
					neck: 15, // inches
					gender: "male",
					unit: "imperial",
				};
			});

			it("should calculate body fat with imperial units", () => {
				const result = calculateBodyFat(maleImperialInputs);
				expect(result.bodyFat).toBeGreaterThan(5);
				expect(result.bodyFat).toBeLessThan(20);
				expect(result.method).toBe("US Navy");
			});

			it("should return Athletic category for lean male", () => {
				const result = calculateBodyFat(maleImperialInputs);
				expect(result.category).toBe("Athletic");
			});

			it("should round to 1 decimal place", () => {
				const result = calculateBodyFat(maleImperialInputs);
				expect(result.bodyFat.toString()).toMatch(/^\d+\.\d$/);
			});
		});

		describe("Imperial Units - Female", () => {
			let femaleImperialInputs: MeasurementInputs;

			beforeEach(() => {
				femaleImperialInputs = {
					height: 65, // inches
					waist: 28, // inches
					hip: 36, // inches
					neck: 13, // inches
					gender: "female",
					unit: "imperial",
				};
			});

			it("should calculate body fat with imperial units", () => {
				const result = calculateBodyFat(femaleImperialInputs);
				expect(result.bodyFat).toBeGreaterThan(10);
				expect(result.bodyFat).toBeLessThan(30);
				expect(result.method).toBe("US Navy");
			});

			it("should return appropriate category for female", () => {
				const result = calculateBodyFat(femaleImperialInputs);
				expect(result.category).toMatch(/Athletic|Fitness|Average/);
			});

			it("should round to 1 decimal place", () => {
				const result = calculateBodyFat(femaleImperialInputs);
				// Check that it's a number with at most 1 decimal place
				const decimalPlaces =
					result.bodyFat.toString().split(".")[1]?.length || 0;
				expect(decimalPlaces).toBeLessThanOrEqual(1);
			});
		});

		describe("Metric Units - Male", () => {
			let maleMetricInputs: MeasurementInputs;

			beforeEach(() => {
				maleMetricInputs = {
					height: 177.8, // cm
					waist: 81.28, // cm
					neck: 38.1, // cm
					gender: "male",
					unit: "metric",
				};
			});

			it("should calculate body fat with metric units", () => {
				const result = calculateBodyFat(maleMetricInputs);
				expect(result.bodyFat).toBeGreaterThan(5);
				expect(result.bodyFat).toBeLessThan(20);
				expect(result.method).toBe("US Navy");
			});

			it("should produce same result as imperial conversion", () => {
				const imperialInputs: MeasurementInputs = {
					height: 70,
					waist: 32,
					neck: 15,
					gender: "male",
					unit: "imperial",
				};

				const metricResult = calculateBodyFat(maleMetricInputs);
				const imperialResult = calculateBodyFat(imperialInputs);

				expect(metricResult.bodyFat).toBeCloseTo(imperialResult.bodyFat, 1);
			});
		});

		describe("Metric Units - Female", () => {
			let femaleMetricInputs: MeasurementInputs;

			beforeEach(() => {
				femaleMetricInputs = {
					height: 165.1, // cm
					waist: 71.12, // cm
					hip: 91.44, // cm
					neck: 33.02, // cm
					gender: "female",
					unit: "metric",
				};
			});

			it("should calculate body fat with metric units", () => {
				const result = calculateBodyFat(femaleMetricInputs);
				expect(result.bodyFat).toBeGreaterThan(10);
				expect(result.bodyFat).toBeLessThan(30);
				expect(result.method).toBe("US Navy");
			});

			it("should produce same result as imperial conversion", () => {
				const imperialInputs: MeasurementInputs = {
					height: 65,
					waist: 28,
					hip: 36,
					neck: 13,
					gender: "female",
					unit: "imperial",
				};

				const metricResult = calculateBodyFat(femaleMetricInputs);
				const imperialResult = calculateBodyFat(imperialInputs);

				expect(metricResult.bodyFat).toBeCloseTo(imperialResult.bodyFat, 1);
			});
		});

		describe("Edge Cases and Validation", () => {
			it("should handle very muscular male (thick neck)", () => {
				const inputs: MeasurementInputs = {
					height: 72,
					waist: 34,
					neck: 17,
					gender: "male",
					unit: "imperial",
				};

				const result = calculateBodyFat(inputs);
				expect(result.bodyFat).toBeGreaterThan(0);
				expect(result.bodyFat).toBeLessThan(20);
			});

			it("should handle very lean male (small waist)", () => {
				const inputs: MeasurementInputs = {
					height: 70,
					waist: 28,
					neck: 15,
					gender: "male",
					unit: "imperial",
				};

				const result = calculateBodyFat(inputs);
				expect(result.bodyFat).toBeGreaterThan(0);
				expect(result.bodyFat).toBeLessThan(15);
			});

			it("should handle tall male with proportional measurements", () => {
				const inputs: MeasurementInputs = {
					height: 76,
					waist: 36,
					neck: 16,
					gender: "male",
					unit: "imperial",
				};

				const result = calculateBodyFat(inputs);
				expect(result.bodyFat).toBeGreaterThan(5);
				expect(result.bodyFat).toBeLessThan(25);
			});

			it("should handle short male with proportional measurements", () => {
				const inputs: MeasurementInputs = {
					height: 64,
					waist: 30,
					neck: 14,
					gender: "male",
					unit: "imperial",
				};

				const result = calculateBodyFat(inputs);
				expect(result.bodyFat).toBeGreaterThan(5);
				expect(result.bodyFat).toBeLessThan(25);
			});

			it("should handle very lean female athlete", () => {
				const inputs: MeasurementInputs = {
					height: 66,
					waist: 26,
					hip: 35,
					neck: 12.5,
					gender: "female",
					unit: "imperial",
				};

				const result = calculateBodyFat(inputs);
				expect(result.bodyFat).toBeGreaterThan(10);
				expect(result.bodyFat).toBeLessThan(25);
			});

			it("should handle tall female with proportional measurements", () => {
				const inputs: MeasurementInputs = {
					height: 70,
					waist: 30,
					hip: 40,
					neck: 14,
					gender: "female",
					unit: "imperial",
				};

				const result = calculateBodyFat(inputs);
				expect(result.bodyFat).toBeGreaterThan(10);
				expect(result.bodyFat).toBeLessThan(35);
			});
		});
	});
});
