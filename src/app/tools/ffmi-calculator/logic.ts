import type { UnitSystem } from "@/types/unit-system";
import type { FFMICalculationResult, FFMIInputs } from "./config";
import {
	CM_TO_METERS,
	FFMI_CATEGORIES,
	FFMI_THRESHOLDS,
	HEIGHT_ADJUSTMENT_FACTOR,
	INCHES_TO_METERS,
	KG_TO_LBS,
	LBS_TO_KG,
	NORMALIZED_HEIGHT_METERS,
} from "./config";

/**
 * Converts weight from user's selected units to kilograms.
 *
 * @param weight - Weight in user's units (lbs or kg)
 * @param unit - Unit system being used
 * @returns Weight in kilograms
 */
function convertWeightToKg(weight: number, unit: UnitSystem): number {
	return unit === "imperial" ? weight * LBS_TO_KG : weight;
}

/**
 * Converts height from user's selected units to meters.
 *
 * @param height - Height in user's units (inches or cm)
 * @param unit - Unit system being used
 * @returns Height in meters
 */
function convertHeightToMeters(height: number, unit: UnitSystem): number {
	return unit === "imperial"
		? height * INCHES_TO_METERS
		: height * CM_TO_METERS;
}

/**
 * Converts mass from kilograms to user's selected units.
 *
 * @param massKg - Mass in kilograms
 * @param unit - Unit system to convert to
 * @returns Mass in user's units (lbs or kg)
 */
function convertMassFromKg(massKg: number, unit: UnitSystem): number {
	return unit === "imperial" ? massKg * KG_TO_LBS : massKg;
}

/**
 * Calculates fat-free mass from total body weight and body fat percentage.
 * Formula: FFM = Weight × (1 - BodyFat/100)
 *
 * @param weightKg - Total body weight in kilograms
 * @param bodyFatPercentage - Body fat percentage (0-100)
 * @returns Fat-free mass in kilograms
 */
function calculateFatFreeMass(
	weightKg: number,
	bodyFatPercentage: number,
): number {
	return weightKg * (1 - bodyFatPercentage / 100);
}

/**
 * Calculates raw Fat-Free Mass Index.
 * Formula: FFMI = FFM (kg) / Height² (m²)
 *
 * @param fatFreeMassKg - Fat-free mass in kilograms
 * @param heightMeters - Height in meters
 * @returns Raw FFMI value
 */
function calculateRawFFMI(fatFreeMassKg: number, heightMeters: number): number {
	return fatFreeMassKg / (heightMeters * heightMeters);
}

/**
 * Calculates height-adjusted FFMI normalized to 1.8m (5'11") height.
 * This allows fair comparison between individuals of different heights.
 * Formula: Adjusted FFMI = FFMI + 6.1 × (1.8 - Height)
 *
 * @param rawFFMI - Raw FFMI value
 * @param heightMeters - Height in meters
 * @returns Adjusted FFMI normalized to 1.8m height
 */
function calculateAdjustedFFMI(rawFFMI: number, heightMeters: number): number {
	return (
		rawFFMI +
		HEIGHT_ADJUSTMENT_FACTOR * (NORMALIZED_HEIGHT_METERS - heightMeters)
	);
}

/**
 * Determines FFMI category based on adjusted FFMI value.
 * Categories represent typical ranges for natural muscle development.
 *
 * @param adjustedFFMI - Height-adjusted FFMI value
 * @returns Category label describing the FFMI level
 */
function determineFFMICategory(adjustedFFMI: number): string {
	if (adjustedFFMI < FFMI_THRESHOLDS.BELOW_AVERAGE) {
		return FFMI_CATEGORIES.BELOW_AVERAGE;
	}
	if (adjustedFFMI < FFMI_THRESHOLDS.AVERAGE) {
		return FFMI_CATEGORIES.AVERAGE;
	}
	if (adjustedFFMI < FFMI_THRESHOLDS.ABOVE_AVERAGE) {
		return FFMI_CATEGORIES.ABOVE_AVERAGE;
	}
	if (adjustedFFMI < FFMI_THRESHOLDS.EXCELLENT) {
		return FFMI_CATEGORIES.EXCELLENT;
	}
	if (adjustedFFMI < FFMI_THRESHOLDS.SUPERIOR) {
		return FFMI_CATEGORIES.SUPERIOR;
	}
	return FFMI_CATEGORIES.ENHANCED;
}

/**
 * Calculates Fat-Free Mass Index (FFMI) and related metrics.
 * FFMI is used to assess muscle development relative to height, providing
 * a more accurate measure than BMI for athletes and bodybuilders.
 *
 * @param inputs - User's weight, height, body fat percentage, and unit system
 * @returns Calculation results including FFMI, adjusted FFMI, fat-free mass, and category
 */
export function calculateFFMI(inputs: FFMIInputs): FFMICalculationResult {
	const { weight, height, bodyFat, unit } = inputs;

	// Convert inputs to metric system for calculations
	const weightKg = convertWeightToKg(weight, unit);
	const heightMeters = convertHeightToMeters(height, unit);

	// Calculate fat-free mass
	const fatFreeMassKg = calculateFatFreeMass(weightKg, bodyFat);

	// Calculate raw and adjusted FFMI
	const rawFFMI = calculateRawFFMI(fatFreeMassKg, heightMeters);
	const adjustedFFMI = calculateAdjustedFFMI(rawFFMI, heightMeters);

	// Convert fat-free mass to display units
	const fatFreeMassDisplay = convertMassFromKg(fatFreeMassKg, unit);

	// Determine category based on adjusted FFMI
	const category = determineFFMICategory(adjustedFFMI);

	return {
		ffmi: Number(rawFFMI.toFixed(1)),
		adjustedFFMI: Number(adjustedFFMI.toFixed(1)),
		fatFreeMass: Number(fatFreeMassDisplay.toFixed(1)),
		category,
	};
}

/**
 * Converts FFMI calculation results between unit systems.
 * FFMI and adjusted FFMI are unitless, so only fat-free mass needs conversion.
 *
 * @param result - Current FFMI calculation result
 * @param currentUnit - Current unit system of the result
 * @param newUnit - Target unit system
 * @returns Updated result with fat-free mass converted to new units
 */
export function convertFFMIResultUnits(
	result: FFMICalculationResult,
	currentUnit: UnitSystem,
	newUnit: UnitSystem,
): FFMICalculationResult {
	if (currentUnit === newUnit) {
		return result;
	}

	const conversionFactor = newUnit === "imperial" ? KG_TO_LBS : LBS_TO_KG;

	return {
		...result,
		fatFreeMass: Number((result.fatFreeMass * conversionFactor).toFixed(1)),
	};
}
