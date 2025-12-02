import { beforeEach, describe, expect, it } from "vitest";
import {
	BULKING_SURPLUS_MULTIPLIER,
	CUTTING_DEFICIT_MULTIPLIER,
	INCHES_TO_CM,
	LBS_TO_KG,
	type TDEEInputs,
} from "./config";
import {
	calculateBMR,
	calculateBulkingCalories,
	calculateCuttingCalories,
	calculateTDEE,
	calculateTDEEResults,
	convertInchesToCm,
	convertLbsToKg,
} from "./logic";

describe("TDEE Calculator Logic", () => {
	describe("convertLbsToKg", () => {
		it("should convert pounds to kilograms correctly", () => {
			expect(convertLbsToKg(1)).toBeCloseTo(LBS_TO_KG, 4);
			expect(convertLbsToKg(100)).toBeCloseTo(45.36, 2);
			expect(convertLbsToKg(150)).toBeCloseTo(68.04, 2);
			expect(convertLbsToKg(200)).toBeCloseTo(90.72, 2);
		});

		it("should handle edge cases", () => {
			expect(convertLbsToKg(0)).toBe(0);
			expect(convertLbsToKg(220)).toBeCloseTo(99.79, 2);
		});
	});

	describe("convertInchesToCm", () => {
		it("should convert inches to centimeters correctly", () => {
			expect(convertInchesToCm(1)).toBeCloseTo(INCHES_TO_CM, 2);
			expect(convertInchesToCm(60)).toBeCloseTo(152.4, 1);
			expect(convertInchesToCm(70)).toBeCloseTo(177.8, 1);
			expect(convertInchesToCm(72)).toBeCloseTo(182.88, 1);
		});

		it("should handle edge cases", () => {
			expect(convertInchesToCm(0)).toBe(0);
			expect(convertInchesToCm(80)).toBeCloseTo(203.2, 1);
		});
	});

	describe("calculateBMR - Male", () => {
		it("should calculate BMR for average 30-year-old male", () => {
			// 180 lbs (81.65kg), 70 inches (177.8cm), 30 years
			const weightKg = 81.65;
			const heightCm = 177.8;
			const age = 30;

			const bmr = calculateBMR(weightKg, heightCm, age, "male");

			// Mifflin-St Jeor: BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
			// = (10 × 81.65) + (6.25 × 177.8) - (5 × 30) + 5
			// = 816.5 + 1111.25 - 150 + 5 = 1782.75
			expect(bmr).toBeCloseTo(1782.75, 0);
		});

		it("should calculate BMR for young 20-year-old male", () => {
			// 160 lbs (72.57kg), 68 inches (172.72cm), 20 years
			const weightKg = 72.57;
			const heightCm = 172.72;
			const age = 20;

			const bmr = calculateBMR(weightKg, heightCm, age, "male");

			// Expected: (10 × 72.57) + (6.25 × 172.72) - (5 × 20) + 5
			// = 725.7 + 1079.5 - 100 + 5 = 1710.2
			expect(bmr).toBeCloseTo(1710, 0);
		});

		it("should calculate BMR for older 50-year-old male", () => {
			// 200 lbs (90.72kg), 72 inches (182.88cm), 50 years
			const weightKg = 90.72;
			const heightCm = 182.88;
			const age = 50;

			const bmr = calculateBMR(weightKg, heightCm, age, "male");

			// Expected: (10 × 90.72) + (6.25 × 182.88) - (5 × 50) + 5
			// = 907.2 + 1143 - 250 + 5 = 1805.2
			expect(bmr).toBeCloseTo(1805, 0);
		});

		it("should calculate BMR for heavy male", () => {
			// 240 lbs (108.86kg), 74 inches (187.96cm), 35 years
			const weightKg = 108.86;
			const heightCm = 187.96;
			const age = 35;

			const bmr = calculateBMR(weightKg, heightCm, age, "male");
			expect(bmr).toBeGreaterThan(1900);
			expect(bmr).toBeLessThan(2200);
		});

		it("should calculate BMR for lean male", () => {
			// 140 lbs (63.5kg), 68 inches (172.72cm), 25 years
			const weightKg = 63.5;
			const heightCm = 172.72;
			const age = 25;

			const bmr = calculateBMR(weightKg, heightCm, age, "male");
			expect(bmr).toBeGreaterThan(1500);
			expect(bmr).toBeLessThan(1700);
		});
	});

	describe("calculateBMR - Female", () => {
		it("should calculate BMR for average 30-year-old female", () => {
			// 140 lbs (63.5kg), 65 inches (165.1cm), 30 years
			const weightKg = 63.5;
			const heightCm = 165.1;
			const age = 30;

			const bmr = calculateBMR(weightKg, heightCm, age, "female");

			// Mifflin-St Jeor: BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161
			// = (10 × 63.5) + (6.25 × 165.1) - (5 × 30) - 161
			// = 635 + 1031.875 - 150 - 161 = 1355.875
			expect(bmr).toBeCloseTo(1356, 0);
		});

		it("should calculate BMR for young 20-year-old female", () => {
			// 120 lbs (54.43kg), 63 inches (160.02cm), 20 years
			const weightKg = 54.43;
			const heightCm = 160.02;
			const age = 20;

			const bmr = calculateBMR(weightKg, heightCm, age, "female");

			// Expected: (10 × 54.43) + (6.25 × 160.02) - (5 × 20) - 161
			// = 544.3 + 1000.125 - 100 - 161 = 1283.425
			expect(bmr).toBeCloseTo(1283, 0);
		});

		it("should calculate BMR for older 50-year-old female", () => {
			// 160 lbs (72.57kg), 66 inches (167.64cm), 50 years
			const weightKg = 72.57;
			const heightCm = 167.64;
			const age = 50;

			const bmr = calculateBMR(weightKg, heightCm, age, "female");

			// Expected: (10 × 72.57) + (6.25 × 167.64) - (5 × 50) - 161
			// = 725.7 + 1047.75 - 250 - 161 = 1362.45
			expect(bmr).toBeCloseTo(1362, 0);
		});

		it("should have lower BMR than males with same parameters", () => {
			const weightKg = 70;
			const heightCm = 170;
			const age = 30;

			const maleBMR = calculateBMR(weightKg, heightCm, age, "male");
			const femaleBMR = calculateBMR(weightKg, heightCm, age, "female");

			// Male offset is +5, female offset is -161, difference = 166
			expect(maleBMR - femaleBMR).toBe(166);
		});
	});

	describe("calculateTDEE", () => {
		it("should calculate TDEE for sedentary activity (1.2)", () => {
			const bmr = 1800;
			const activityLevel = 1.2;

			const tdee = calculateTDEE(bmr, activityLevel);
			expect(tdee).toBe(2160);
		});

		it("should calculate TDEE for lightly active (1.375)", () => {
			const bmr = 1800;
			const activityLevel = 1.375;

			const tdee = calculateTDEE(bmr, activityLevel);
			expect(tdee).toBe(2475);
		});

		it("should calculate TDEE for moderately active (1.55)", () => {
			const bmr = 1800;
			const activityLevel = 1.55;

			const tdee = calculateTDEE(bmr, activityLevel);
			expect(tdee).toBe(2790);
		});

		it("should calculate TDEE for very active (1.725)", () => {
			const bmr = 1800;
			const activityLevel = 1.725;

			const tdee = calculateTDEE(bmr, activityLevel);
			expect(tdee).toBe(3105);
		});

		it("should calculate TDEE for extremely active (1.9)", () => {
			const bmr = 1800;
			const activityLevel = 1.9;

			const tdee = calculateTDEE(bmr, activityLevel);
			expect(tdee).toBe(3420);
		});

		it("should scale linearly with activity level", () => {
			const bmr = 2000;

			const sedentary = calculateTDEE(bmr, 1.2);
			const moderate = calculateTDEE(bmr, 1.55);

			expect(moderate).toBeGreaterThan(sedentary);
			expect(moderate / bmr).toBeCloseTo(1.55, 2);
		});
	});

	describe("calculateCuttingCalories", () => {
		it("should apply 20% deficit to TDEE", () => {
			const tdee = 2500;
			const cutting = calculateCuttingCalories(tdee);

			// 2500 × 0.8 = 2000
			expect(cutting).toBe(2000);
		});

		it("should use correct multiplier constant", () => {
			const tdee = 3000;
			const cutting = calculateCuttingCalories(tdee);

			expect(cutting).toBe(tdee * CUTTING_DEFICIT_MULTIPLIER);
			expect(cutting).toBe(2400);
		});

		it("should work with various TDEE values", () => {
			expect(calculateCuttingCalories(2000)).toBe(1600);
			expect(calculateCuttingCalories(2800)).toBe(2240);
			expect(calculateCuttingCalories(3500)).toBe(2800);
		});
	});

	describe("calculateBulkingCalories", () => {
		it("should apply 10% surplus to TDEE", () => {
			const tdee = 2500;
			const bulking = calculateBulkingCalories(tdee);

			// 2500 × 1.1 = 2750
			expect(bulking).toBe(2750);
		});

		it("should use correct multiplier constant", () => {
			const tdee = 3000;
			const bulking = calculateBulkingCalories(tdee);

			expect(bulking).toBeCloseTo(tdee * BULKING_SURPLUS_MULTIPLIER, 0);
			expect(bulking).toBeCloseTo(3300, 0);
		});

		it("should work with various TDEE values", () => {
			expect(calculateBulkingCalories(2000)).toBeCloseTo(2200, 0);
			expect(calculateBulkingCalories(2800)).toBeCloseTo(3080, 0);
			expect(calculateBulkingCalories(3500)).toBeCloseTo(3850, 0);
		});
	});

	describe("calculateTDEEResults - Main Function", () => {
		describe("Imperial Units - Male", () => {
			let maleImperialInputs: TDEEInputs;

			beforeEach(() => {
				maleImperialInputs = {
					age: 30,
					weight: 180, // lbs
					height: 70, // inches
					activityLevel: 1.55, // moderately active
					gender: "male",
					unit: "imperial",
				};
			});

			it("should calculate complete TDEE results", () => {
				const result = calculateTDEEResults(maleImperialInputs);

				expect(result.bmr).toBeGreaterThan(1700);
				expect(result.bmr).toBeLessThan(1900);
				expect(result.tdee).toBeGreaterThan(2600);
				expect(result.tdee).toBeLessThan(2900);
				expect(result.formula).toBe("Mifflin-St Jeor");
			});

			it("should calculate cutting calories correctly", () => {
				const result = calculateTDEEResults(maleImperialInputs);

				// Allow for rounding differences
				const expectedCutting = Math.round(
					result.tdee * CUTTING_DEFICIT_MULTIPLIER,
				);
				expect(Math.abs(result.cutting - expectedCutting)).toBeLessThanOrEqual(
					1,
				);
				expect(result.cutting).toBeLessThan(result.tdee);
			});

			it("should calculate bulking calories correctly", () => {
				const result = calculateTDEEResults(maleImperialInputs);

				// Allow for rounding differences
				const expectedBulking = Math.round(
					result.tdee * BULKING_SURPLUS_MULTIPLIER,
				);
				expect(Math.abs(result.bulking - expectedBulking)).toBeLessThanOrEqual(
					1,
				);
				expect(result.bulking).toBeGreaterThan(result.tdee);
			});

			it("should round all results to integers", () => {
				const result = calculateTDEEResults(maleImperialInputs);

				expect(Number.isInteger(result.bmr)).toBe(true);
				expect(Number.isInteger(result.tdee)).toBe(true);
				expect(Number.isInteger(result.cutting)).toBe(true);
				expect(Number.isInteger(result.bulking)).toBe(true);
			});

			it("should have logical relationship between values", () => {
				const result = calculateTDEEResults(maleImperialInputs);

				// BMR < TDEE
				expect(result.tdee).toBeGreaterThan(result.bmr);
				// Cutting < TDEE < Bulking
				expect(result.cutting).toBeLessThan(result.tdee);
				expect(result.bulking).toBeGreaterThan(result.tdee);
			});
		});

		describe("Imperial Units - Female", () => {
			let femaleImperialInputs: TDEEInputs;

			beforeEach(() => {
				femaleImperialInputs = {
					age: 30,
					weight: 140, // lbs
					height: 65, // inches
					activityLevel: 1.375, // lightly active
					gender: "female",
					unit: "imperial",
				};
			});

			it("should calculate complete TDEE results", () => {
				const result = calculateTDEEResults(femaleImperialInputs);

				expect(result.bmr).toBeGreaterThan(1300);
				expect(result.bmr).toBeLessThan(1500);
				expect(result.tdee).toBeGreaterThan(1800);
				expect(result.tdee).toBeLessThan(2100);
				expect(result.formula).toBe("Mifflin-St Jeor");
			});

			it("should have lower values than equivalent male", () => {
				const maleInputs: TDEEInputs = {
					...femaleImperialInputs,
					gender: "male",
				};

				const femaleResult = calculateTDEEResults(femaleImperialInputs);
				const maleResult = calculateTDEEResults(maleInputs);

				expect(femaleResult.bmr).toBeLessThan(maleResult.bmr);
				expect(femaleResult.tdee).toBeLessThan(maleResult.tdee);
			});
		});

		describe("Metric Units - Male", () => {
			let maleMetricInputs: TDEEInputs;

			beforeEach(() => {
				maleMetricInputs = {
					age: 30,
					weight: 81.65, // kg (180 lbs)
					height: 177.8, // cm (70 inches)
					activityLevel: 1.55,
					gender: "male",
					unit: "metric",
				};
			});

			it("should calculate complete TDEE results", () => {
				const result = calculateTDEEResults(maleMetricInputs);

				expect(result.bmr).toBeGreaterThan(1700);
				expect(result.bmr).toBeLessThan(1900);
				expect(result.tdee).toBeGreaterThan(2600);
				expect(result.tdee).toBeLessThan(2900);
			});

			it("should produce same result as imperial conversion", () => {
				const imperialInputs: TDEEInputs = {
					age: 30,
					weight: 180,
					height: 70,
					activityLevel: 1.55,
					gender: "male",
					unit: "imperial",
				};

				const metricResult = calculateTDEEResults(maleMetricInputs);
				const imperialResult = calculateTDEEResults(imperialInputs);

				expect(metricResult.bmr).toBe(imperialResult.bmr);
				expect(metricResult.tdee).toBe(imperialResult.tdee);
				expect(metricResult.cutting).toBe(imperialResult.cutting);
				expect(metricResult.bulking).toBe(imperialResult.bulking);
			});
		});

		describe("Metric Units - Female", () => {
			let femaleMetricInputs: TDEEInputs;

			beforeEach(() => {
				femaleMetricInputs = {
					age: 30,
					weight: 63.5, // kg (140 lbs)
					height: 165.1, // cm (65 inches)
					activityLevel: 1.375,
					gender: "female",
					unit: "metric",
				};
			});

			it("should calculate complete TDEE results", () => {
				const result = calculateTDEEResults(femaleMetricInputs);

				expect(result.bmr).toBeGreaterThan(1300);
				expect(result.bmr).toBeLessThan(1500);
				expect(result.tdee).toBeGreaterThan(1800);
				expect(result.tdee).toBeLessThan(2100);
			});

			it("should produce same result as imperial conversion", () => {
				const imperialInputs: TDEEInputs = {
					age: 30,
					weight: 140,
					height: 65,
					activityLevel: 1.375,
					gender: "female",
					unit: "imperial",
				};

				const metricResult = calculateTDEEResults(femaleMetricInputs);
				const imperialResult = calculateTDEEResults(imperialInputs);

				expect(metricResult.bmr).toBe(imperialResult.bmr);
				expect(metricResult.tdee).toBe(imperialResult.tdee);
			});
		});

		describe("Activity Level Variations", () => {
			it("should calculate for sedentary activity", () => {
				const inputs: TDEEInputs = {
					age: 30,
					weight: 180,
					height: 70,
					activityLevel: 1.2,
					gender: "male",
					unit: "imperial",
				};

				const result = calculateTDEEResults(inputs);
				// Allow rounding tolerance
				expect(result.tdee).toBeGreaterThanOrEqual(
					Math.floor(result.bmr * 1.2),
				);
				expect(result.tdee).toBeLessThanOrEqual(Math.ceil(result.bmr * 1.2));
			});

			it("should calculate for extremely active", () => {
				const inputs: TDEEInputs = {
					age: 30,
					weight: 180,
					height: 70,
					activityLevel: 1.9,
					gender: "male",
					unit: "imperial",
				};

				const result = calculateTDEEResults(inputs);
				// Allow rounding tolerance
				expect(result.tdee).toBeGreaterThanOrEqual(
					Math.floor(result.bmr * 1.9),
				);
				expect(result.tdee).toBeLessThanOrEqual(Math.ceil(result.bmr * 1.9));
			});

			it("should scale TDEE proportionally with activity level", () => {
				const baseInputs: TDEEInputs = {
					age: 30,
					weight: 180,
					height: 70,
					activityLevel: 1.2,
					gender: "male",
					unit: "imperial",
				};

				const sedentary = calculateTDEEResults(baseInputs);
				const moderate = calculateTDEEResults({
					...baseInputs,
					activityLevel: 1.55,
				});
				const veryActive = calculateTDEEResults({
					...baseInputs,
					activityLevel: 1.9,
				});

				expect(sedentary.tdee).toBeLessThan(moderate.tdee);
				expect(moderate.tdee).toBeLessThan(veryActive.tdee);
			});
		});

		describe("Age Variations", () => {
			it("should decrease BMR with age", () => {
				const baseInputs: TDEEInputs = {
					age: 20,
					weight: 180,
					height: 70,
					activityLevel: 1.55,
					gender: "male",
					unit: "imperial",
				};

				const young = calculateTDEEResults(baseInputs);
				const middleAge = calculateTDEEResults({ ...baseInputs, age: 40 });
				const older = calculateTDEEResults({ ...baseInputs, age: 60 });

				expect(young.bmr).toBeGreaterThan(middleAge.bmr);
				expect(middleAge.bmr).toBeGreaterThan(older.bmr);
			});

			it("should apply age coefficient correctly", () => {
				const inputs1: TDEEInputs = {
					age: 20,
					weight: 180,
					height: 70,
					activityLevel: 1.55,
					gender: "male",
					unit: "imperial",
				};

				const inputs2: TDEEInputs = { ...inputs1, age: 40 };

				const result1 = calculateTDEEResults(inputs1);
				const result2 = calculateTDEEResults(inputs2);

				// BMR decreases by 5 calories per year (age coefficient)
				const expectedDifference = (40 - 20) * 5;
				expect(result1.bmr - result2.bmr).toBeCloseTo(expectedDifference, 0);
			});
		});

		describe("Edge Cases", () => {
			it("should handle very young adult", () => {
				const inputs: TDEEInputs = {
					age: 18,
					weight: 150,
					height: 68,
					activityLevel: 1.725,
					gender: "male",
					unit: "imperial",
				};

				const result = calculateTDEEResults(inputs);
				expect(result.bmr).toBeGreaterThan(1600);
				expect(result.tdee).toBeGreaterThan(2700);
			});

			it("should handle older adult", () => {
				const inputs: TDEEInputs = {
					age: 65,
					weight: 170,
					height: 69,
					activityLevel: 1.2,
					gender: "male",
					unit: "imperial",
				};

				const result = calculateTDEEResults(inputs);
				expect(result.bmr).toBeGreaterThan(1400);
				expect(result.tdee).toBeGreaterThan(1600);
			});

			it("should handle very light person", () => {
				const inputs: TDEEInputs = {
					age: 25,
					weight: 110,
					height: 62,
					activityLevel: 1.375,
					gender: "female",
					unit: "imperial",
				};

				const result = calculateTDEEResults(inputs);
				expect(result.bmr).toBeGreaterThan(1100);
				expect(result.tdee).toBeGreaterThan(1500);
			});

			it("should handle very heavy person", () => {
				const inputs: TDEEInputs = {
					age: 35,
					weight: 280,
					height: 74,
					activityLevel: 1.55,
					gender: "male",
					unit: "imperial",
				};

				const result = calculateTDEEResults(inputs);
				expect(result.bmr).toBeGreaterThan(2200);
				expect(result.tdee).toBeGreaterThan(3400);
			});
		});
	});
});
