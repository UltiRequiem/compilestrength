import { z } from "zod";

export const userPreferencesSchema = z.object({
	userId: z.string(),
	units: z.enum(["lbs", "kg"]),
	restTimerDefault: z.number().int().min(0),
	trainingGoal: z.string().optional(),
	experienceLevel: z.string().optional(),
	availableDays: z.number().int().min(0).max(7).optional(),
});

export const userProfileSchema = z.object({
	experience: z.enum(["beginner", "intermediate", "advanced"]),
	goals: z.array(z.string()),
	availableEquipment: z.array(z.string()),
	timeConstraints: z.object({
		daysPerWeek: z.number().int().min(1).max(7),
		minutesPerSession: z.number().int().min(15).max(300),
	}),
	physicalLimitations: z.array(z.string()).optional(),
	preferences: z
		.object({
			favoriteExercises: z.array(z.string()).optional(),
			exercisesToAvoid: z.array(z.string()).optional(),
		})
		.optional(),
});

// Inferred types
export type UserPreferences = z.infer<typeof userPreferencesSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;
