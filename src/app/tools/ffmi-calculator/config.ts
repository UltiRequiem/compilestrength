import type { UnitSystem } from "@/types/unit-system";

// Unit conversion factors for FFMI calculations
export const LBS_TO_KG = 0.453592;
export const INCHES_TO_METERS = 0.0254;
export const CM_TO_METERS = 0.01;
export const KG_TO_LBS = 2.20462;

// FFMI normalization constant (standard height for adjusted FFMI)
export const NORMALIZED_HEIGHT_METERS = 1.8;
export const HEIGHT_ADJUSTMENT_FACTOR = 6.1;

// Body fat percentage validation constants
export const MIN_BODY_FAT_PERCENTAGE = 0;
export const MAX_BODY_FAT_PERCENTAGE = 100;

// FFMI category thresholds (based on adjusted FFMI)
export const FFMI_THRESHOLDS = {
	BELOW_AVERAGE: 18,
	AVERAGE: 20,
	ABOVE_AVERAGE: 22,
	EXCELLENT: 24,
	SUPERIOR: 26,
} as const;

// FFMI category labels
export const FFMI_CATEGORIES = {
	BELOW_AVERAGE: "Below average",
	AVERAGE: "Average",
	ABOVE_AVERAGE: "Above average",
	EXCELLENT: "Excellent",
	SUPERIOR: "Superior - Natural limit",
	ENHANCED: "Very likely enhanced (steroid use)",
} as const;

export interface FFMICalculationResult {
	/** Raw Fat-Free Mass Index */
	ffmi: number;
	/** Height-adjusted FFMI normalized to 1.8m */
	adjustedFFMI: number;
	/** Fat-free mass in the user's selected units */
	fatFreeMass: number;
	/** Category based on adjusted FFMI thresholds */
	category: string;
}

export interface FFMIInputs {
	/** Body weight in user's selected units */
	weight: number;
	/** Height in user's selected units */
	height: number;
	/** Body fat percentage (0-100) */
	bodyFat: number;
	/** Unit system (metric: kg/cm, imperial: lbs/inches) */
	unit: UnitSystem;
}
