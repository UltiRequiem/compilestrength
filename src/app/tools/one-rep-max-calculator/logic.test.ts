import { beforeEach, describe, expect, it } from "vitest";
import {
	FORMULA_CONSTANTS,
	KG_TO_LBS,
	LBS_TO_KG,
	MAX_REPS,
	MIN_REPS,
	type OneRepMaxResult,
	RESULT_DECIMAL_PLACES,
} from "./config";
import {
	calculateBrzycki,
	calculateEpley,
	calculateLander,
	calculateLombardi,
	calculateMayhew,
	calculateOConner,
	calculateOneRepMax,
	calculateWathen,
	convertOneRepMaxResults,
} from "./logic";

describe("One Rep Max Calculator Logic", () => {
	describe("calculateBrzycki", () => {
		it("should calculate 1RM using Brzycki formula", () => {
			// Formula: 1RM = weight × (36 / (37 - reps))
			// Example: 225 lbs × (36 / (37 - 5)) = 225 × (36 / 32) = 253.125
			const weight = 225;
			const reps = 5;

			const result = calculateBrzycki(weight, reps);

			expect(result).toBeCloseTo(253.125, 1);
		});

		it("should handle 1 rep (should equal weight)", () => {
			const weight = 315;
			const reps = 1;

			const result = calculateBrzycki(weight, reps);

			// 315 × (36 / (37 - 1)) = 315 × (36 / 36) = 315
			expect(result).toBe(weight);
		});

		it("should calculate for low rep range (2-5 reps)", () => {
			const weight = 200;

			expect(calculateBrzycki(weight, 2)).toBeCloseTo(205.7, 1);
			expect(calculateBrzycki(weight, 3)).toBeCloseTo(211.8, 1);
			expect(calculateBrzycki(weight, 4)).toBeCloseTo(218.2, 1);
			expect(calculateBrzycki(weight, 5)).toBeCloseTo(225, 1);
		});

		it("should calculate for medium rep range (8-12 reps)", () => {
			const weight = 150;

			expect(calculateBrzycki(weight, 8)).toBeCloseTo(186.2, 1);
			expect(calculateBrzycki(weight, 10)).toBeCloseTo(200, 1);
			expect(calculateBrzycki(weight, 12)).toBeCloseTo(216, 1);
		});

		it("should use correct formula constants", () => {
			const weight = 100;
			const reps = 10;

			const result = calculateBrzycki(weight, reps);
			const expected =
				weight *
				(FORMULA_CONSTANTS.BRZYCKI.NUMERATOR /
					(FORMULA_CONSTANTS.BRZYCKI.DENOMINATOR_BASE - reps));

			expect(result).toBe(expected);
		});
	});

	describe("calculateEpley", () => {
		it("should calculate 1RM using Epley formula", () => {
			// Formula: 1RM = weight × (1 + reps/30)
			// Example: 225 lbs × (1 + 5/30) = 225 × 1.1667 = 262.5
			const weight = 225;
			const reps = 5;

			const result = calculateEpley(weight, reps);

			expect(result).toBeCloseTo(262.5, 1);
		});

		it("should handle 1 rep (should equal weight)", () => {
			const weight = 315;
			const reps = 1;

			const result = calculateEpley(weight, reps);

			// 315 × (1 + 1/30) = 315 × 1.0333 = 325.5
			expect(result).toBeCloseTo(325.5, 1);
		});

		it("should calculate for various rep ranges", () => {
			const weight = 200;

			expect(calculateEpley(weight, 3)).toBeCloseTo(220, 1);
			expect(calculateEpley(weight, 5)).toBeCloseTo(233.3, 1);
			expect(calculateEpley(weight, 10)).toBeCloseTo(266.7, 1);
		});

		it("should use correct formula constant", () => {
			const weight = 100;
			const reps = 10;

			const result = calculateEpley(weight, reps);
			const expected = weight * (1 + reps / FORMULA_CONSTANTS.EPLEY.DIVISOR);

			expect(result).toBe(expected);
		});
	});

	describe("calculateLander", () => {
		it("should calculate 1RM using Lander formula", () => {
			// Formula: 1RM = (100 × weight) / (101.3 - 2.67123 × reps)
			// Example: (100 × 225) / (101.3 - 2.67123 × 5) = 22500 / 88.64385 = 255.84
			const weight = 225;
			const reps = 5;

			const result = calculateLander(weight, reps);

			expect(result).toBeCloseTo(255.8, 0);
		});

		it("should calculate for various rep ranges", () => {
			const weight = 200;

			expect(calculateLander(weight, 3)).toBeCloseTo(214.4, 0);
			expect(calculateLander(weight, 5)).toBeCloseTo(227.4, 0);
			expect(calculateLander(weight, 10)).toBeCloseTo(268, 0);
		});

		it("should use correct formula constants", () => {
			const weight = 100;
			const reps = 10;

			const result = calculateLander(weight, reps);
			const expected =
				(FORMULA_CONSTANTS.LANDER.NUMERATOR * weight) /
				(FORMULA_CONSTANTS.LANDER.DENOMINATOR_BASE -
					FORMULA_CONSTANTS.LANDER.REP_COEFFICIENT * reps);

			expect(result).toBe(expected);
		});
	});

	describe("calculateLombardi", () => {
		it("should calculate 1RM using Lombardi formula", () => {
			// Formula: 1RM = weight × reps^0.1
			// Example: 225 × 5^0.1 = 225 × 1.1746 = 264.3
			const weight = 225;
			const reps = 5;

			const result = calculateLombardi(weight, reps);

			expect(result).toBeCloseTo(264.3, 1);
		});

		it("should handle 1 rep (should equal weight)", () => {
			const weight = 315;
			const reps = 1;

			const result = calculateLombardi(weight, reps);

			// 315 × 1^0.1 = 315 × 1 = 315
			expect(result).toBe(weight);
		});

		it("should calculate for various rep ranges", () => {
			const weight = 200;

			expect(calculateLombardi(weight, 2)).toBeCloseTo(214.4, 0);
			expect(calculateLombardi(weight, 5)).toBeCloseTo(234.9, 0);
			expect(calculateLombardi(weight, 10)).toBeCloseTo(251.6, 0);
		});

		it("should use correct formula constant", () => {
			const weight = 100;
			const reps = 10;

			const result = calculateLombardi(weight, reps);
			const expected = weight * reps ** FORMULA_CONSTANTS.LOMBARDI.EXPONENT;

			expect(result).toBe(expected);
		});
	});

	describe("calculateMayhew", () => {
		it("should calculate 1RM using Mayhew formula", () => {
			// Formula: 1RM = (100 × weight) / (52.2 + 41.9 × e^(-0.055 × reps))
			// Example: (100 × 225) / (52.2 + 41.9 × e^(-0.055 × 5))
			const weight = 225;
			const reps = 5;

			const result = calculateMayhew(weight, reps);

			expect(result).toBeGreaterThan(250);
			expect(result).toBeLessThan(270);
		});

		it("should calculate for various rep ranges", () => {
			const weight = 200;

			expect(calculateMayhew(weight, 3)).toBeCloseTo(228, 0);
			expect(calculateMayhew(weight, 5)).toBeCloseTo(238, 0);
			expect(calculateMayhew(weight, 10)).toBeCloseTo(262, 0);
		});

		it("should use correct formula constants", () => {
			const weight = 100;
			const reps = 10;

			const result = calculateMayhew(weight, reps);
			const expected =
				(FORMULA_CONSTANTS.MAYHEW.NUMERATOR * weight) /
				(FORMULA_CONSTANTS.MAYHEW.DENOMINATOR_BASE +
					FORMULA_CONSTANTS.MAYHEW.DENOMINATOR_COEFFICIENT *
						Math.exp(FORMULA_CONSTANTS.MAYHEW.EXPONENT_COEFFICIENT * reps));

			expect(result).toBe(expected);
		});
	});

	describe("calculateOConner", () => {
		it("should calculate 1RM using O'Connor formula", () => {
			// Formula: 1RM = weight × (1 + 0.025 × reps)
			// Example: 225 × (1 + 0.025 × 5) = 225 × 1.125 = 253.125
			const weight = 225;
			const reps = 5;

			const result = calculateOConner(weight, reps);

			expect(result).toBeCloseTo(253.125, 1);
		});

		it("should handle 1 rep", () => {
			const weight = 315;
			const reps = 1;

			const result = calculateOConner(weight, reps);

			// 315 × (1 + 0.025 × 1) = 315 × 1.025 = 322.875
			expect(result).toBeCloseTo(322.875, 1);
		});

		it("should calculate for various rep ranges", () => {
			const weight = 200;

			expect(calculateOConner(weight, 3)).toBeCloseTo(215, 1);
			expect(calculateOConner(weight, 5)).toBeCloseTo(225, 1);
			expect(calculateOConner(weight, 10)).toBeCloseTo(250, 1);
		});

		it("should use correct formula constant", () => {
			const weight = 100;
			const reps = 10;

			const result = calculateOConner(weight, reps);
			const expected =
				weight * (1 + FORMULA_CONSTANTS.O_CONNOR.COEFFICIENT * reps);

			expect(result).toBe(expected);
		});
	});

	describe("calculateWathen", () => {
		it("should calculate 1RM using Wathen formula", () => {
			// Formula: 1RM = (100 × weight) / (48.8 + 53.8 × e^(-0.075 × reps))
			const weight = 225;
			const reps = 5;

			const result = calculateWathen(weight, reps);

			expect(result).toBeGreaterThan(250);
			expect(result).toBeLessThan(270);
		});

		it("should calculate for various rep ranges", () => {
			const weight = 200;

			expect(calculateWathen(weight, 3)).toBeCloseTo(218, 0);
			expect(calculateWathen(weight, 5)).toBeCloseTo(233, 0);
			expect(calculateWathen(weight, 10)).toBeCloseTo(269, 0);
		});

		it("should use correct formula constants", () => {
			const weight = 100;
			const reps = 10;

			const result = calculateWathen(weight, reps);
			const expected =
				(FORMULA_CONSTANTS.WATHEN.NUMERATOR * weight) /
				(FORMULA_CONSTANTS.WATHEN.DENOMINATOR_BASE +
					FORMULA_CONSTANTS.WATHEN.DENOMINATOR_COEFFICIENT *
						Math.exp(FORMULA_CONSTANTS.WATHEN.EXPONENT_COEFFICIENT * reps));

			expect(result).toBe(expected);
		});
	});

	describe("calculateOneRepMax - Main Function", () => {
		describe("Bench Press Examples", () => {
			it("should calculate 1RM for 225 lbs × 5 reps", () => {
				const weight = 225;
				const reps = 5;

				const result = calculateOneRepMax(weight, reps);

				// Verify all formulas are calculated
				expect(result.brzycki).toBeGreaterThan(250);
				expect(result.epley).toBeGreaterThan(260);
				expect(result.lander).toBeGreaterThan(250);
				expect(result.lombardi).toBeGreaterThan(260);
				expect(result.mayhew).toBeGreaterThan(250);
				expect(result.oConnor).toBeGreaterThan(250);
				expect(result.wathen).toBeGreaterThan(250);

				// Average should be within reasonable range
				expect(result.average).toBeGreaterThan(250);
				expect(result.average).toBeLessThan(270);
			});

			it("should calculate 1RM for 185 lbs × 10 reps", () => {
				const weight = 185;
				const reps = 10;

				const result = calculateOneRepMax(weight, reps);

				// All results should be higher than weight
				expect(result.brzycki).toBeGreaterThan(weight);
				expect(result.epley).toBeGreaterThan(weight);
				expect(result.lander).toBeGreaterThan(weight);
				expect(result.lombardi).toBeGreaterThan(weight);
				expect(result.mayhew).toBeGreaterThan(weight);
				expect(result.oConnor).toBeGreaterThan(weight);
				expect(result.wathen).toBeGreaterThan(weight);

				// Average should be reasonable
				expect(result.average).toBeGreaterThan(240);
				expect(result.average).toBeLessThan(260);
			});

			it("should calculate 1RM for 135 lbs × 15 reps", () => {
				const weight = 135;
				const reps = 15;

				const result = calculateOneRepMax(weight, reps);

				// Average should be significantly higher for 15 reps
				expect(result.average).toBeGreaterThan(180);
				expect(result.average).toBeLessThan(210);
			});
		});

		describe("Squat Examples", () => {
			it("should calculate 1RM for 315 lbs × 3 reps", () => {
				const weight = 315;
				const reps = 3;

				const result = calculateOneRepMax(weight, reps);

				// Low reps should be close to weight
				expect(result.average).toBeGreaterThan(330);
				expect(result.average).toBeLessThan(345);
			});

			it("should calculate 1RM for 275 lbs × 8 reps", () => {
				const weight = 275;
				const reps = 8;

				const result = calculateOneRepMax(weight, reps);

				// Average should be reasonable for 8 reps
				expect(result.average).toBeGreaterThan(330);
				expect(result.average).toBeLessThan(360);
			});
		});

		describe("Deadlift Examples", () => {
			it("should calculate 1RM for 405 lbs × 1 rep", () => {
				const weight = 405;
				const reps = 1;

				const result = calculateOneRepMax(weight, reps);

				// 1 rep should be close to weight (slight variation due to formulas)
				expect(result.average).toBeGreaterThan(400);
				expect(result.average).toBeLessThan(430);
			});

			it("should calculate 1RM for 365 lbs × 5 reps", () => {
				const weight = 365;
				const reps = 5;

				const result = calculateOneRepMax(weight, reps);

				expect(result.average).toBeGreaterThan(400);
				expect(result.average).toBeLessThan(430);
			});
		});

		describe("Edge Cases", () => {
			it("should handle 1 rep (should be close to weight)", () => {
				const weight = 300;
				const reps = 1;

				const result = calculateOneRepMax(weight, reps);

				// Most formulas should give result close to weight for 1 rep
				// Brzycki: 300 × (36/36) = 300
				expect(result.brzycki).toBe(300);

				// Average should be close to weight
				expect(result.average).toBeGreaterThan(295);
				expect(result.average).toBeLessThan(330);
			});

			it("should handle maximum reps (20)", () => {
				const weight = 100;
				const reps = MAX_REPS;

				const result = calculateOneRepMax(weight, reps);

				// High reps should give significantly higher 1RM
				expect(result.average).toBeGreaterThan(150);
				expect(result.average).toBeLessThan(180);
			});

			it("should handle minimum weight", () => {
				const weight = 45; // Empty barbell
				const reps = 10;

				const result = calculateOneRepMax(weight, reps);

				expect(result.average).toBeGreaterThan(55);
				expect(result.average).toBeLessThan(65);
			});

			it("should handle very heavy weight with low reps", () => {
				const weight = 600;
				const reps = 2;

				const result = calculateOneRepMax(weight, reps);

				expect(result.average).toBeGreaterThan(610);
				expect(result.average).toBeLessThan(650);
			});
		});

		describe("Result Formatting", () => {
			it("should round all results to specified decimal places", () => {
				const weight = 225.5;
				const reps = 5;

				const result = calculateOneRepMax(weight, reps);

				// Check all values are rounded to 1 decimal place
				for (const key of Object.keys(result)) {
					const value = result[key as keyof OneRepMaxResult];
					const decimalPlaces = value.toString().split(".")[1]?.length || 0;
					expect(decimalPlaces).toBeLessThanOrEqual(RESULT_DECIMAL_PLACES);
				}
			});

			it("should handle integer weights and reps", () => {
				const weight = 225;
				const reps = 5;

				const result = calculateOneRepMax(weight, reps);

				// All results should be numbers
				expect(typeof result.brzycki).toBe("number");
				expect(typeof result.epley).toBe("number");
				expect(typeof result.average).toBe("number");
			});
		});

		describe("Formula Comparison", () => {
			it("should have Brzycki and O'Connor produce similar results", () => {
				const weight = 200;
				const reps = 5;

				const result = calculateOneRepMax(weight, reps);

				// These formulas typically produce very similar results
				expect(Math.abs(result.brzycki - result.oConnor)).toBeLessThan(5);
			});

			it("should have Epley produce slightly higher estimates", () => {
				const weight = 200;
				const reps = 5;

				const result = calculateOneRepMax(weight, reps);

				// Epley typically gives slightly higher estimates
				expect(result.epley).toBeGreaterThan(result.brzycki);
			});

			it("should have Mayhew and Wathen produce similar results", () => {
				const weight = 200;
				const reps = 10;

				const result = calculateOneRepMax(weight, reps);

				// Both use exponential decay, should be similar
				expect(Math.abs(result.mayhew - result.wathen)).toBeLessThan(10);
			});

			it("should have average be reasonable across all formulas", () => {
				const weight = 225;
				const reps = 5;

				const result = calculateOneRepMax(weight, reps);

				// Average should be within range of individual formulas
				const values = [
					result.brzycki,
					result.epley,
					result.lander,
					result.lombardi,
					result.mayhew,
					result.oConnor,
					result.wathen,
				];

				const min = Math.min(...values);
				const max = Math.max(...values);

				expect(result.average).toBeGreaterThanOrEqual(min);
				expect(result.average).toBeLessThanOrEqual(max);

				// Verify average is actually the mean (with tolerance for rounding)
				const calculatedAverage =
					values.reduce((a, b) => a + b, 0) / values.length;
				expect(result.average).toBeCloseTo(calculatedAverage, 0);
			});
		});

		describe("Rep Range Accuracy", () => {
			it("should be most accurate in 2-10 rep range", () => {
				const weight = 200;

				// Calculate for various rep ranges
				const lowReps = calculateOneRepMax(weight, 3);
				const midReps = calculateOneRepMax(weight, 8);
				const highReps = calculateOneRepMax(weight, 15);

				// All should give reasonable estimates
				expect(lowReps.average).toBeGreaterThan(210);
				expect(lowReps.average).toBeLessThan(230);

				expect(midReps.average).toBeGreaterThan(240);
				expect(midReps.average).toBeLessThan(260);

				expect(highReps.average).toBeGreaterThan(270);
				expect(highReps.average).toBeLessThan(300);
			});

			it("should show progressive increase with more reps", () => {
				const weight = 200;

				const results = [];
				for (let reps = MIN_REPS; reps <= 15; reps++) {
					results.push(calculateOneRepMax(weight, reps));
				}

				// Each result should be higher than the previous
				for (let i = 1; i < results.length; i++) {
					expect(results[i].average).toBeGreaterThan(results[i - 1].average);
				}
			});
		});
	});

	describe("convertOneRepMaxResults", () => {
		let sampleResult: OneRepMaxResult;

		beforeEach(() => {
			sampleResult = calculateOneRepMax(225, 5);
		});

		it("should convert from lbs to kg", () => {
			const converted = convertOneRepMaxResults(sampleResult, "lbs", "kg");

			expect(converted.brzycki).toBeCloseTo(
				sampleResult.brzycki * LBS_TO_KG,
				1,
			);
			expect(converted.epley).toBeCloseTo(sampleResult.epley * LBS_TO_KG, 1);
			expect(converted.average).toBeCloseTo(
				sampleResult.average * LBS_TO_KG,
				1,
			);
		});

		it("should convert from kg to lbs", () => {
			const kgResult = calculateOneRepMax(100, 5); // 100 kg
			const converted = convertOneRepMaxResults(kgResult, "kg", "lbs");

			expect(converted.brzycki).toBeCloseTo(kgResult.brzycki * KG_TO_LBS, 1);
			expect(converted.epley).toBeCloseTo(kgResult.epley * KG_TO_LBS, 1);
			expect(converted.average).toBeCloseTo(kgResult.average * KG_TO_LBS, 1);
		});

		it("should not change values if units are the same", () => {
			const converted = convertOneRepMaxResults(sampleResult, "lbs", "lbs");

			expect(converted).toEqual(sampleResult);
		});

		it("should convert all formula results", () => {
			const converted = convertOneRepMaxResults(sampleResult, "lbs", "kg");

			// Check all formulas are converted
			expect(converted.brzycki).not.toBe(sampleResult.brzycki);
			expect(converted.epley).not.toBe(sampleResult.epley);
			expect(converted.lander).not.toBe(sampleResult.lander);
			expect(converted.lombardi).not.toBe(sampleResult.lombardi);
			expect(converted.mayhew).not.toBe(sampleResult.mayhew);
			expect(converted.oConnor).not.toBe(sampleResult.oConnor);
			expect(converted.wathen).not.toBe(sampleResult.wathen);
			expect(converted.average).not.toBe(sampleResult.average);
		});

		it("should round converted values to specified decimal places", () => {
			const converted = convertOneRepMaxResults(sampleResult, "lbs", "kg");

			// Check all values are rounded to 1 decimal place
			for (const key of Object.keys(converted)) {
				const value = converted[key as keyof OneRepMaxResult];
				const decimalPlaces = value.toString().split(".")[1]?.length || 0;
				expect(decimalPlaces).toBeLessThanOrEqual(RESULT_DECIMAL_PLACES);
			}
		});

		it("should be reversible (lbs -> kg -> lbs)", () => {
			const toKg = convertOneRepMaxResults(sampleResult, "lbs", "kg");
			const backToLbs = convertOneRepMaxResults(toKg, "kg", "lbs");

			// Should be close to original (within rounding)
			expect(backToLbs.average).toBeCloseTo(sampleResult.average, 0);
			expect(backToLbs.brzycki).toBeCloseTo(sampleResult.brzycki, 0);
		});

		it("should handle conversion with decimal weights", () => {
			const decimalResult = calculateOneRepMax(102.5, 5);
			const converted = convertOneRepMaxResults(decimalResult, "kg", "lbs");

			expect(converted.average).toBeGreaterThan(250);
			expect(converted.average).toBeLessThan(280);
		});
	});

	describe("Real-World Validation", () => {
		it("should match known powerlifting reference values", () => {
			// Known reference: 225 lbs × 10 reps ≈ 300 lbs 1RM
			const result = calculateOneRepMax(225, 10);

			expect(result.average).toBeGreaterThan(290);
			expect(result.average).toBeLessThan(310);
		});

		it("should match known bench press reference", () => {
			// Known reference: 185 lbs × 12 reps ≈ 260 lbs 1RM
			const result = calculateOneRepMax(185, 12);

			expect(result.average).toBeGreaterThan(250);
			expect(result.average).toBeLessThan(270);
		});

		it("should match known squat reference", () => {
			// Known reference: 315 lbs × 5 reps ≈ 355 lbs 1RM
			const result = calculateOneRepMax(315, 5);

			expect(result.average).toBeGreaterThan(345);
			expect(result.average).toBeLessThan(375);
		});

		it("should produce consistent results for metric weights", () => {
			// 100 kg × 5 reps ≈ 112.5 kg 1RM
			const result = calculateOneRepMax(100, 5);

			expect(result.average).toBeGreaterThan(110);
			expect(result.average).toBeLessThan(120);
		});
	});
});
