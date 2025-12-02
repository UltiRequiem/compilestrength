import { z } from "zod";
import { MAX_BODY_FAT_PERCENTAGE, MIN_BODY_FAT_PERCENTAGE } from "./config";

export const ffmiCalculatorInputSchema = z.object({
	weight: z
		.string()
		.trim()
		.min(1, "Please enter your weight")
		.transform((val) => Number.parseFloat(val))
		.pipe(z.number().positive("Weight must be greater than 0")),
	height: z
		.string()
		.trim()
		.min(1, "Please enter your height")
		.transform((val) => Number.parseFloat(val))
		.pipe(z.number().positive("Height must be greater than 0")),
	bodyFat: z
		.string()
		.trim()
		.min(1, "Please enter your body fat percentage")
		.transform((val) => Number.parseFloat(val))
		.pipe(
			z
				.number()
				.min(
					MIN_BODY_FAT_PERCENTAGE,
					`Body fat percentage must be at least ${MIN_BODY_FAT_PERCENTAGE}%`,
				)
				.max(
					MAX_BODY_FAT_PERCENTAGE,
					`Body fat percentage must be at most ${MAX_BODY_FAT_PERCENTAGE}%`,
				),
		),
	unit: z.enum(["metric", "imperial"]),
});

export type FFMICalculatorInput = z.infer<typeof ffmiCalculatorInputSchema>;
