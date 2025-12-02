import z from "zod";
import { MAX_REPS, MIN_REPS } from "./config";

/**
 * Validation schema for One Rep Max calculator inputs.
 *
 * Validates:
 * - Weight: Must be a positive number
 * - Reps: Must be an integer between 1-20 for formula accuracy
 */
export const oneRepMaxInputSchema = z.object({
	weight: z
		.string()
		.trim()
		.min(1, "Please enter weight")
		.transform((val) => Number.parseFloat(val))
		.pipe(z.number().positive("Weight must be greater than 0")),
	reps: z
		.string()
		.trim()
		.min(1, "Please enter reps")
		.transform((val) => Number.parseInt(val, 10))
		.pipe(
			z
				.number()
				.int("Reps must be a whole number")
				.min(MIN_REPS, `Reps must be at least ${MIN_REPS}`)
				.max(MAX_REPS, `Reps must be ${MAX_REPS} or less for accuracy`),
		),
});

/**
 * Inferred TypeScript type from the validation schema.
 */
export type OneRepMaxInputData = z.infer<typeof oneRepMaxInputSchema>;
