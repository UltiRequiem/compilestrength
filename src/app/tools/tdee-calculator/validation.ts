import { z } from "zod";

// Validation schema for TDEE calculator inputs
export const tdeeInputSchema = z.object({
	age: z
		.string()
		.trim()
		.min(1, "Age is required")
		.transform((val) => Number.parseInt(val, 10))
		.pipe(
			z
				.number()
				.int("Age must be a whole number")
				.min(15, "Age must be at least 15 years")
				.max(80, "Age must be 80 years or less"),
		),
	weight: z
		.string()
		.trim()
		.min(1, "Weight is required")
		.transform((val) => Number.parseFloat(val))
		.pipe(z.number().positive("Weight must be positive")),
	height: z
		.string()
		.trim()
		.min(1, "Height is required")
		.transform((val) => Number.parseFloat(val))
		.pipe(z.number().positive("Height must be positive")),
	activityLevel: z
		.string()
		.transform((val) => Number.parseFloat(val))
		.pipe(z.number().positive("Activity level must be positive")),
	gender: z.enum(["male", "female"]),
	unit: z.enum(["metric", "imperial"]),
});

export type TDEEInput = z.infer<typeof tdeeInputSchema>;
