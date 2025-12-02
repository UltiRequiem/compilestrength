import type { WeightUnit } from "@/types/exercise";

/**
 * Represents the result of a One Rep Max calculation using multiple formulas.
 */
export interface OneRepMaxResult {
	/** Brzycki formula result */
	brzycki: number;
	/** Epley formula result */
	epley: number;
	/** Lander formula result */
	lander: number;
	/** Lombardi formula result */
	lombardi: number;
	/** Mayhew formula result */
	mayhew: number;
	/** O'Connor formula result */
	oConnor: number;
	/** Wathen formula result */
	wathen: number;
	/** Average of all formulas */
	average: number;
}

/**
 * Input parameters for One Rep Max calculation.
 */
export interface OneRepMaxInput {
	/** Weight lifted */
	weight: number;
	/** Number of reps performed */
	reps: number;
	/** Unit system (lbs or kg) */
	unit: WeightUnit;
}

// Validation constraints
export const MIN_REPS = 1;
export const MAX_REPS = 20;
export const MIN_WEIGHT = 0;

// Conversion factors between units
export const LBS_TO_KG = 0.453592;
export const KG_TO_LBS = 2.20462;

// Decimal precision for results
export const RESULT_DECIMAL_PLACES = 1;

/**
 * Formula constants and coefficients for various 1RM calculations.
 * Each formula has been validated by exercise science research.
 */
export const FORMULA_CONSTANTS = {
	/**
	 * Brzycki Formula: 1RM = w × (36 / (37 - r))
	 * Most commonly used formula, reliable for 2-10 rep range
	 */
	BRZYCKI: {
		NUMERATOR: 36,
		DENOMINATOR_BASE: 37,
	},

	/**
	 * Epley Formula: 1RM = w × (1 + r/30)
	 * Popular formula, similar accuracy to Brzycki
	 */
	EPLEY: {
		DIVISOR: 30,
	},

	/**
	 * Lander Formula: 1RM = (100 × w) / (101.3 - 2.67123 × r)
	 * Good for higher rep ranges
	 */
	LANDER: {
		NUMERATOR: 100,
		DENOMINATOR_BASE: 101.3,
		REP_COEFFICIENT: 2.67123,
	},

	/**
	 * Lombardi Formula: 1RM = w × r^0.1
	 * Uses exponential relationship between weight and reps
	 */
	LOMBARDI: {
		EXPONENT: 0.1,
	},

	/**
	 * Mayhew Formula: 1RM = (100 × w) / (52.2 + 41.9 × e^(-0.055 × r))
	 * Uses exponential decay function, accurate across rep ranges
	 */
	MAYHEW: {
		NUMERATOR: 100,
		DENOMINATOR_BASE: 52.2,
		DENOMINATOR_COEFFICIENT: 41.9,
		EXPONENT_COEFFICIENT: -0.055,
	},

	/**
	 * O'Connor Formula: 1RM = w × (1 + 0.025 × r)
	 * Simple linear formula
	 */
	O_CONNOR: {
		COEFFICIENT: 0.025,
	},

	/**
	 * Wathen Formula: 1RM = (100 × w) / (48.8 + 53.8 × e^(-0.075 × r))
	 * Similar to Mayhew with different coefficients
	 */
	WATHEN: {
		NUMERATOR: 100,
		DENOMINATOR_BASE: 48.8,
		DENOMINATOR_COEFFICIENT: 53.8,
		EXPONENT_COEFFICIENT: -0.075,
	},
} as const;
