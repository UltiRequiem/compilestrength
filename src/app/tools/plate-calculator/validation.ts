import z from "zod";

export const plateCalculatorInputSchema = z
	.object({
		targetWeight: z
			.string()
			.trim()
			.min(1, "Please enter target weight")
			.transform((val) => Number.parseFloat(val))
			.pipe(z.number().positive("Target weight must be greater than 0")),
		barWeight: z
			.string()
			.trim()
			.min(1, "Please enter bar weight")
			.transform((val) => Number.parseFloat(val))
			.pipe(z.number().positive("Bar weight must be greater than 0")),
	})
	.refine((data) => data.targetWeight > data.barWeight, {
		message: "Target weight must be greater than bar weight",
		path: ["targetWeight"],
	});
