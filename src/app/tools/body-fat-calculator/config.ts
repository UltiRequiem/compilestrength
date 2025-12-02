// Unit conversion constants
export const INCHES_TO_CM = 2.54;

// Body fat category thresholds for males (in percentage)
export const MALE_CATEGORIES = {
	ESSENTIAL_FAT_MAX: 6,
	ATHLETIC_MAX: 14,
	FITNESS_MAX: 18,
	AVERAGE_MAX: 25,
} as const;

// Body fat category thresholds for females (in percentage)
export const FEMALE_CATEGORIES = {
	ESSENTIAL_FAT_MAX: 14,
	ATHLETIC_MAX: 21,
	FITNESS_MAX: 25,
	AVERAGE_MAX: 32,
} as const;

// US Navy formula constants for males
export const MALE_FORMULA_CONSTANTS = {
	NUMERATOR: 495,
	BASE: 1.0324,
	WAIST_NECK_COEFFICIENT: 0.19077,
	HEIGHT_COEFFICIENT: 0.15456,
	OFFSET: 450,
} as const;

// US Navy formula constants for females
export const FEMALE_FORMULA_CONSTANTS = {
	NUMERATOR: 495,
	BASE: 1.29579,
	WAIST_HIP_NECK_COEFFICIENT: 0.35004,
	HEIGHT_COEFFICIENT: 0.221,
	OFFSET: 450,
} as const;

// Type definitions
export type UnitSystem = "metric" | "imperial";
export type Gender = "male" | "female";

export interface BodyFatResult {
	bodyFat: number;
	category: string;
	method: string;
}

export interface MeasurementInputs {
	height: number;
	waist: number;
	neck: number;
	hip?: number;
	gender: Gender;
	unit: UnitSystem;
}
