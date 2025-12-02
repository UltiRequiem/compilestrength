import { z } from "zod";

// Validation schema for body fat calculator inputs
export const bodyFatInputSchema = z
	.object({
		height: z
			.string()
			.trim()
			.min(1, "Height is required")
			.transform((val) => Number.parseFloat(val))
			.pipe(z.number().positive("Height must be positive")),
		waist: z
			.string()
			.trim()
			.min(1, "Waist measurement is required")
			.transform((val) => Number.parseFloat(val))
			.pipe(z.number().positive("Waist measurement must be positive")),
		neck: z
			.string()
			.trim()
			.min(1, "Neck measurement is required")
			.transform((val) => Number.parseFloat(val))
			.pipe(z.number().positive("Neck measurement must be positive")),
		hip: z
			.string()
			.trim()
			.optional()
			.transform((val) => (val ? Number.parseFloat(val) : undefined))
			.pipe(z.number().positive("Hip measurement must be positive").optional()),
		gender: z.enum(["male", "female"]),
		unit: z.enum(["metric", "imperial"]),
	})
	.refine(
		(data) => {
			// If gender is female, hip measurement is required
			if (data.gender === "female") {
				return data.hip !== undefined && data.hip > 0;
			}
			return true;
		},
		{
			message: "Hip measurement is required for females",
			path: ["hip"],
		},
	);

export type BodyFatInput = z.infer<typeof bodyFatInputSchema>;
