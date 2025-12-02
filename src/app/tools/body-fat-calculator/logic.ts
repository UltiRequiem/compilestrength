import type { BodyFatResult, Gender, MeasurementInputs } from "./config";
import {
	FEMALE_CATEGORIES,
	FEMALE_FORMULA_CONSTANTS,
	INCHES_TO_CM,
	MALE_CATEGORIES,
	MALE_FORMULA_CONSTANTS,
} from "./config";

/**
 * Converts measurements from imperial (inches) to metric (centimeters).
 *
 * @param value - Measurement value in inches
 * @returns Measurement value in centimeters
 */
export function convertInchesToCm(value: number): number {
	return value * INCHES_TO_CM;
}

/**
 * Calculates body fat percentage using the US Navy formula for males.
 *
 * Formula: 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
 *
 * @param heightCm - Height in centimeters
 * @param waistCm - Waist circumference in centimeters (measured at navel)
 * @param neckCm - Neck circumference in centimeters (measured below Adam's apple)
 * @returns Body fat percentage
 */
export function calculateMaleBodyFat(
	heightCm: number,
	waistCm: number,
	neckCm: number,
): number {
	const {
		NUMERATOR,
		BASE,
		WAIST_NECK_COEFFICIENT,
		HEIGHT_COEFFICIENT,
		OFFSET,
	} = MALE_FORMULA_CONSTANTS;

	const bodyFatPercentage =
		NUMERATOR /
			(BASE -
				WAIST_NECK_COEFFICIENT * Math.log10(waistCm - neckCm) +
				HEIGHT_COEFFICIENT * Math.log10(heightCm)) -
		OFFSET;

	return bodyFatPercentage;
}

/**
 * Calculates body fat percentage using the US Navy formula for females.
 *
 * Formula: 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.221 * log10(height)) - 450
 *
 * @param heightCm - Height in centimeters
 * @param waistCm - Waist circumference in centimeters (measured at navel)
 * @param hipCm - Hip circumference in centimeters (measured at widest point)
 * @param neckCm - Neck circumference in centimeters (measured below Adam's apple)
 * @returns Body fat percentage
 */
export function calculateFemaleBodyFat(
	heightCm: number,
	waistCm: number,
	hipCm: number,
	neckCm: number,
): number {
	const {
		NUMERATOR,
		BASE,
		WAIST_HIP_NECK_COEFFICIENT,
		HEIGHT_COEFFICIENT,
		OFFSET,
	} = FEMALE_FORMULA_CONSTANTS;

	const bodyFatPercentage =
		NUMERATOR /
			(BASE -
				WAIST_HIP_NECK_COEFFICIENT * Math.log10(waistCm + hipCm - neckCm) +
				HEIGHT_COEFFICIENT * Math.log10(heightCm)) -
		OFFSET;

	return bodyFatPercentage;
}

/**
 * Determines the body fat category based on percentage and gender.
 *
 * Categories for males:
 * - Essential fat (too low): <6%
 * - Athletic: 6-13%
 * - Fitness: 14-17%
 * - Average: 18-24%
 * - Above average: 25%+
 *
 * Categories for females:
 * - Essential fat (too low): <14%
 * - Athletic: 14-20%
 * - Fitness: 21-24%
 * - Average: 25-31%
 * - Above average: 32%+
 *
 * @param bodyFatPercentage - Body fat percentage
 * @param gender - Gender ('male' or 'female')
 * @returns Category description string
 */
export function determineBodyFatCategory(
	bodyFatPercentage: number,
	gender: Gender,
): string {
	if (gender === "male") {
		if (bodyFatPercentage < MALE_CATEGORIES.ESSENTIAL_FAT_MAX) {
			return "Essential fat (too low)";
		}
		if (bodyFatPercentage < MALE_CATEGORIES.ATHLETIC_MAX) {
			return "Athletic";
		}
		if (bodyFatPercentage < MALE_CATEGORIES.FITNESS_MAX) {
			return "Fitness";
		}
		if (bodyFatPercentage < MALE_CATEGORIES.AVERAGE_MAX) {
			return "Average";
		}
		return "Above average";
	}

	// Female categories
	if (bodyFatPercentage < FEMALE_CATEGORIES.ESSENTIAL_FAT_MAX) {
		return "Essential fat (too low)";
	}
	if (bodyFatPercentage < FEMALE_CATEGORIES.ATHLETIC_MAX) {
		return "Athletic";
	}
	if (bodyFatPercentage < FEMALE_CATEGORIES.FITNESS_MAX) {
		return "Fitness";
	}
	if (bodyFatPercentage < FEMALE_CATEGORIES.AVERAGE_MAX) {
		return "Average";
	}
	return "Above average";
}

/**
 * Calculates body fat percentage and category using the US Navy method.
 *
 * This is the main calculation function that orchestrates the entire process:
 * 1. Converts measurements to metric if needed
 * 2. Calculates body fat percentage using gender-specific formulas
 * 3. Determines body fat category
 *
 * @param inputs - Measurement inputs including height, waist, neck, optional hip, gender, and unit
 * @returns Body fat result with percentage, category, and method
 */
export function calculateBodyFat(inputs: MeasurementInputs): BodyFatResult {
	// Convert to centimeters if imperial
	const heightCm =
		inputs.unit === "imperial"
			? convertInchesToCm(inputs.height)
			: inputs.height;
	const waistCm =
		inputs.unit === "imperial" ? convertInchesToCm(inputs.waist) : inputs.waist;
	const neckCm =
		inputs.unit === "imperial" ? convertInchesToCm(inputs.neck) : inputs.neck;
	const hipCm =
		inputs.hip && inputs.unit === "imperial"
			? convertInchesToCm(inputs.hip)
			: (inputs.hip ?? 0);

	// Calculate body fat percentage using gender-specific formula
	let bodyFatPercentage: number;
	if (inputs.gender === "male") {
		bodyFatPercentage = calculateMaleBodyFat(heightCm, waistCm, neckCm);
	} else {
		bodyFatPercentage = calculateFemaleBodyFat(
			heightCm,
			waistCm,
			hipCm,
			neckCm,
		);
	}

	// Determine category
	const category = determineBodyFatCategory(bodyFatPercentage, inputs.gender);

	return {
		bodyFat: Number(bodyFatPercentage.toFixed(1)),
		category,
		method: "US Navy",
	};
}
