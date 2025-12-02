import type { WeightUnit } from "@/types/exercise";
import {
	FORMULA_CONSTANTS,
	KG_TO_LBS,
	LBS_TO_KG,
	type OneRepMaxResult,
	RESULT_DECIMAL_PLACES,
} from "./config";

/**
 * Calculates One Rep Max using the Brzycki formula.
 *
 * Formula: 1RM = weight × (36 / (37 - reps))
 *
 * The Brzycki formula is one of the most commonly used 1RM estimation formulas.
 * It's most accurate in the 2-10 rep range and is widely used for compound movements.
 *
 * @param weight - The weight lifted
 * @param reps - Number of reps performed
 * @returns Estimated 1RM using Brzycki formula
 */
export function calculateBrzycki(weight: number, reps: number): number {
	const { NUMERATOR, DENOMINATOR_BASE } = FORMULA_CONSTANTS.BRZYCKI;
	return weight * (NUMERATOR / (DENOMINATOR_BASE - reps));
}

/**
 * Calculates One Rep Max using the Epley formula.
 *
 * Formula: 1RM = weight × (1 + reps/30)
 *
 * The Epley formula is popular for its simplicity and accuracy.
 * It's comparable to Brzycki and widely used in strength training.
 *
 * @param weight - The weight lifted
 * @param reps - Number of reps performed
 * @returns Estimated 1RM using Epley formula
 */
export function calculateEpley(weight: number, reps: number): number {
	const { DIVISOR } = FORMULA_CONSTANTS.EPLEY;
	return weight * (1 + reps / DIVISOR);
}

/**
 * Calculates One Rep Max using the Lander formula.
 *
 * Formula: 1RM = (100 × weight) / (101.3 - 2.67123 × reps)
 *
 * The Lander formula tends to be more accurate for higher rep ranges
 * compared to other formulas.
 *
 * @param weight - The weight lifted
 * @param reps - Number of reps performed
 * @returns Estimated 1RM using Lander formula
 */
export function calculateLander(weight: number, reps: number): number {
	const { NUMERATOR, DENOMINATOR_BASE, REP_COEFFICIENT } =
		FORMULA_CONSTANTS.LANDER;
	return (NUMERATOR * weight) / (DENOMINATOR_BASE - REP_COEFFICIENT * reps);
}

/**
 * Calculates One Rep Max using the Lombardi formula.
 *
 * Formula: 1RM = weight × reps^0.1
 *
 * The Lombardi formula uses an exponential relationship between
 * weight and reps. It's based on power function regression analysis.
 *
 * @param weight - The weight lifted
 * @param reps - Number of reps performed
 * @returns Estimated 1RM using Lombardi formula
 */
export function calculateLombardi(weight: number, reps: number): number {
	const { EXPONENT } = FORMULA_CONSTANTS.LOMBARDI;
	return weight * reps ** EXPONENT;
}

/**
 * Calculates One Rep Max using the Mayhew formula.
 *
 * Formula: 1RM = (100 × weight) / (52.2 + 41.9 × e^(-0.055 × reps))
 *
 * The Mayhew formula uses an exponential decay function and is known
 * for good accuracy across a wide range of rep ranges.
 *
 * @param weight - The weight lifted
 * @param reps - Number of reps performed
 * @returns Estimated 1RM using Mayhew formula
 */
export function calculateMayhew(weight: number, reps: number): number {
	const {
		NUMERATOR,
		DENOMINATOR_BASE,
		DENOMINATOR_COEFFICIENT,
		EXPONENT_COEFFICIENT,
	} = FORMULA_CONSTANTS.MAYHEW;
	return (
		(NUMERATOR * weight) /
		(DENOMINATOR_BASE +
			DENOMINATOR_COEFFICIENT * Math.exp(EXPONENT_COEFFICIENT * reps))
	);
}

/**
 * Calculates One Rep Max using the O'Connor formula.
 *
 * Formula: 1RM = weight × (1 + 0.025 × reps)
 *
 * The O'Connor formula is a simple linear formula that provides
 * a straightforward estimation of 1RM.
 *
 * @param weight - The weight lifted
 * @param reps - Number of reps performed
 * @returns Estimated 1RM using O'Connor formula
 */
export function calculateOConner(weight: number, reps: number): number {
	const { COEFFICIENT } = FORMULA_CONSTANTS.O_CONNOR;
	return weight * (1 + COEFFICIENT * reps);
}

/**
 * Calculates One Rep Max using the Wathen formula.
 *
 * Formula: 1RM = (100 × weight) / (48.8 + 53.8 × e^(-0.075 × reps))
 *
 * The Wathen formula is similar to Mayhew but uses different coefficients.
 * It's known for good accuracy in predicting 1RM.
 *
 * @param weight - The weight lifted
 * @param reps - Number of reps performed
 * @returns Estimated 1RM using Wathen formula
 */
export function calculateWathen(weight: number, reps: number): number {
	const {
		NUMERATOR,
		DENOMINATOR_BASE,
		DENOMINATOR_COEFFICIENT,
		EXPONENT_COEFFICIENT,
	} = FORMULA_CONSTANTS.WATHEN;
	return (
		(NUMERATOR * weight) /
		(DENOMINATOR_BASE +
			DENOMINATOR_COEFFICIENT * Math.exp(EXPONENT_COEFFICIENT * reps))
	);
}

/**
 * Rounds a number to a specified number of decimal places.
 *
 * @param value - The value to round
 * @param decimals - Number of decimal places
 * @returns Rounded number
 */
function roundToDecimals(value: number, decimals: number): number {
	return Number(value.toFixed(decimals));
}

/**
 * Calculates One Rep Max using all seven formulas and returns the average.
 *
 * This function computes 1RM estimates using:
 * - Brzycki
 * - Epley
 * - Lander
 * - Lombardi
 * - Mayhew
 * - O'Connor
 * - Wathen
 *
 * The average provides a more reliable estimate than any single formula.
 *
 * @param weight - The weight lifted
 * @param reps - Number of reps performed (1-20 for best accuracy)
 * @returns Object containing all formula results and their average
 */
export function calculateOneRepMax(
	weight: number,
	reps: number,
): OneRepMaxResult {
	// Calculate using all formulas
	const brzycki = calculateBrzycki(weight, reps);
	const epley = calculateEpley(weight, reps);
	const lander = calculateLander(weight, reps);
	const lombardi = calculateLombardi(weight, reps);
	const mayhew = calculateMayhew(weight, reps);
	const oConner = calculateOConner(weight, reps);
	const wathen = calculateWathen(weight, reps);

	// Calculate average of all formulas
	const average =
		(brzycki + epley + lander + lombardi + mayhew + oConner + wathen) / 7;

	// Round all results to specified decimal places
	return {
		brzycki: roundToDecimals(brzycki, RESULT_DECIMAL_PLACES),
		epley: roundToDecimals(epley, RESULT_DECIMAL_PLACES),
		lander: roundToDecimals(lander, RESULT_DECIMAL_PLACES),
		lombardi: roundToDecimals(lombardi, RESULT_DECIMAL_PLACES),
		mayhew: roundToDecimals(mayhew, RESULT_DECIMAL_PLACES),
		oConner: roundToDecimals(oConner, RESULT_DECIMAL_PLACES),
		wathen: roundToDecimals(wathen, RESULT_DECIMAL_PLACES),
		average: roundToDecimals(average, RESULT_DECIMAL_PLACES),
	};
}

/**
 * Converts all 1RM results from one unit system to another.
 *
 * @param results - The 1RM calculation results
 * @param fromUnit - The current unit
 * @param toUnit - The target unit
 * @returns Converted results with all values in the new unit
 */
export function convertOneRepMaxResults(
	results: OneRepMaxResult,
	fromUnit: WeightUnit,
	toUnit: WeightUnit,
): OneRepMaxResult {
	if (fromUnit === toUnit) {
		return results;
	}

	const conversionFactor = toUnit === "kg" ? LBS_TO_KG : KG_TO_LBS;

	return {
		brzycki: roundToDecimals(
			results.brzycki * conversionFactor,
			RESULT_DECIMAL_PLACES,
		),
		epley: roundToDecimals(
			results.epley * conversionFactor,
			RESULT_DECIMAL_PLACES,
		),
		lander: roundToDecimals(
			results.lander * conversionFactor,
			RESULT_DECIMAL_PLACES,
		),
		lombardi: roundToDecimals(
			results.lombardi * conversionFactor,
			RESULT_DECIMAL_PLACES,
		),
		mayhew: roundToDecimals(
			results.mayhew * conversionFactor,
			RESULT_DECIMAL_PLACES,
		),
		oConner: roundToDecimals(
			results.oConner * conversionFactor,
			RESULT_DECIMAL_PLACES,
		),
		wathen: roundToDecimals(
			results.wathen * conversionFactor,
			RESULT_DECIMAL_PLACES,
		),
		average: roundToDecimals(
			results.average * conversionFactor,
			RESULT_DECIMAL_PLACES,
		),
	};
}
