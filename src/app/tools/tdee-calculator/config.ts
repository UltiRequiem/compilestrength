import type { Gender } from "@/types/gender";
import type { UnitSystem } from "@/types/unit-system";

// Unit conversion constants
export const LBS_TO_KG = 0.453592;
export const INCHES_TO_CM = 2.54;

// TDEE calculation multipliers
export const CUTTING_DEFICIT_MULTIPLIER = 0.8; // 20% deficit
export const BULKING_SURPLUS_MULTIPLIER = 1.1; // 10% surplus

// Mifflin-St Jeor formula constants for males
const MALE_BMR_CONSTANTS = {
	WEIGHT_COEFFICIENT: 10,
	HEIGHT_COEFFICIENT: 6.25,
	AGE_COEFFICIENT: 5,
	OFFSET: 5,
} as const;

// Mifflin-St Jeor formula constants for females
const FEMALE_BMR_CONSTANTS = {
	WEIGHT_COEFFICIENT: 10,
	HEIGHT_COEFFICIENT: 6.25,
	AGE_COEFFICIENT: 5,
	OFFSET: -161,
} as const;

export const BMR_CONSTANTS_BY_GENDER = {
	"male": MALE_BMR_CONSTANTS,
	"female": FEMALE_BMR_CONSTANTS,
}

// Activity level multipliers and descriptions
export const ACTIVITY_LEVELS = [
	{
		value: "1.2",
		label: "Sedentary (desk job, no exercise)",
		description: "Little to no exercise",
	},
	{
		value: "1.375",
		label: "Lightly active (light exercise 1-3 days/week)",
		description: "Light exercise or sports 1-3 days per week",
	},
	{
		value: "1.55",
		label: "Moderately active (moderate exercise 3-5 days/week)",
		description: "Moderate exercise or sports 3-5 days per week",
	},
	{
		value: "1.725",
		label: "Very active (hard exercise 6-7 days/week)",
		description: "Hard exercise or sports 6-7 days per week",
	},
	{
		value: "1.9",
		label: "Extremely active (very hard exercise, physical job)",
		description: "Very hard exercise, physical job, or training twice per day",
	},
] as const;

export interface ActivityLevel {
	value: string;
	label: string;
	description: string;
}

export interface TDEEResult {
	bmr: number;
	tdee: number;
	cutting: number;
	bulking: number;
	formula: string;
}

export interface TDEEInputs {
	age: number;
	weight: number;
	height: number;
	activityLevel: number;
	gender: Gender;
	unit: UnitSystem;
}
