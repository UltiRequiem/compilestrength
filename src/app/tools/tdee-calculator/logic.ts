import type { Gender } from "@/types/gender";
import type { TDEEInputs, TDEEResult } from "./config";
import {
	BMR_CONSTANTS_BY_GENDER,
	BULKING_SURPLUS_MULTIPLIER,
	CUTTING_DEFICIT_MULTIPLIER,
	INCHES_TO_CM,
	LBS_TO_KG,
} from "./config";

/**
 * Converts weight from pounds to kilograms.
 *
 * @param lbs - Weight in pounds
 * @returns Weight in kilograms
 */
export function convertLbsToKg(lbs: number): number {
	return lbs * LBS_TO_KG;
}

/**
 * Converts height from inches to centimeters.
 *
 * @param inches - Height in inches
 * @returns Height in centimeters
 */
export function convertInchesToCm(inches: number): number {
	return inches * INCHES_TO_CM;
}

/**
 * Calculates Basal Metabolic Rate (BMR) based on gender.
 *
 * @param weightKg - Body weight in kilograms
 * @param heightCm - Height in centimeters
 * @param age - Age in years
 * @param gender - Gender ('male' or 'female')
 * @returns BMR in calories per day
 */
export function calculateBMR(
	weightKg: number,
	heightCm: number,
	age: number,
	gender: Gender,
): number {
	const { WEIGHT_COEFFICIENT, HEIGHT_COEFFICIENT, AGE_COEFFICIENT, OFFSET } =
		BMR_CONSTANTS_BY_GENDER[gender];

	return (
		WEIGHT_COEFFICIENT * weightKg +
		HEIGHT_COEFFICIENT * heightCm -
		AGE_COEFFICIENT * age +
		OFFSET
	);
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE) from BMR and activity level.
 *
 * TDEE represents the total calories burned per day including all activity.
 *
 * @param bmr - Basal Metabolic Rate in calories per day
 * @param activityMultiplier - Activity level multiplier (1.2 to 1.9)
 * @returns TDEE in calories per day
 */
export function calculateTDEE(bmr: number, activityMultiplier: number): number {
	return bmr * activityMultiplier;
}

/**
 * Calculates daily calorie target for fat loss (cutting).
 *
 * Applies a 20% caloric deficit to TDEE for sustainable fat loss.
 *
 * @param tdee - Total Daily Energy Expenditure in calories per day
 * @returns Cutting calories per day
 */
export function calculateCuttingCalories(tdee: number): number {
	return tdee * CUTTING_DEFICIT_MULTIPLIER;
}

/**
 * Calculates daily calorie target for muscle gain (bulking).
 *
 * Applies a 10% caloric surplus to TDEE for lean muscle gain.
 *
 * @param tdee - Total Daily Energy Expenditure in calories per day
 * @returns Bulking calories per day
 */
export function calculateBulkingCalories(tdee: number): number {
	return tdee * BULKING_SURPLUS_MULTIPLIER;
}

/**
 * Main TDEE calculation function that orchestrates all calculations.
 *
 * This function:
 * 1. Converts measurements to metric if needed
 * 2. Calculates BMR using Mifflin-St Jeor equation
 * 3. Calculates TDEE by applying activity multiplier
 * 4. Calculates cutting and bulking calorie targets
 *
 * @param inputs - TDEE calculation inputs (age, weight, height, activity level, gender, unit)
 * @returns Complete TDEE results with BMR, TDEE, cutting, and bulking calories
 */
export function calculateTDEEResults(inputs: TDEEInputs): TDEEResult {
	// Convert to metric if needed
	const weightKg =
		inputs.unit === "imperial" ? convertLbsToKg(inputs.weight) : inputs.weight;
	const heightCm =
		inputs.unit === "imperial"
			? convertInchesToCm(inputs.height)
			: inputs.height;

	// Calculate BMR using Mifflin-St Jeor equation
	const bmr = calculateBMR(weightKg, heightCm, inputs.age, inputs.gender);

	// Calculate TDEE
	const tdee = calculateTDEE(bmr, inputs.activityLevel);

	// Calculate cutting and bulking calories
	const cutting = calculateCuttingCalories(tdee);
	const bulking = calculateBulkingCalories(tdee);

	return {
		bmr: Math.round(bmr),
		tdee: Math.round(tdee),
		cutting: Math.round(cutting),
		bulking: Math.round(bulking),
		formula: "Mifflin-St Jeor",
	};
}
