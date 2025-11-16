// Main bodybuilding agent exports

// Shared tool imports
export { explainChoice, setGenerationProgress } from "../shared/tools";
export { BODYBUILDING_SYSTEM_PROMPT } from "./prompts";
export { addExercise } from "./tools/add-exercise";
export { addWorkoutDay } from "./tools/add-workout-day";
export { createWorkoutRoutine } from "./tools/create-workout-routine";
// Bodybuilding-specific tool exports
export { updateUserProfile } from "./tools/update-user-profile";

// Combined tools object for easy import
export const bodybuildingTools = {
	updateUserProfile: (await import("./tools/update-user-profile"))
		.updateUserProfile,
	createWorkoutRoutine: (await import("./tools/create-workout-routine"))
		.createWorkoutRoutine,
	addWorkoutDay: (await import("./tools/add-workout-day")).addWorkoutDay,
	addExercise: (await import("./tools/add-exercise")).addExercise,
	explainChoice: (await import("../shared/tools/explain-choice")).explainChoice,
	setGenerationProgress: (
		await import("../shared/tools/set-generation-progress")
	).setGenerationProgress,
};
