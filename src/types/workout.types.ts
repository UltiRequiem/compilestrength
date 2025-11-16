import type {
	PersonalRecord as SchemaPersonalRecord,
	UserProfile as SchemaUserProfile,
	WorkoutDay as SchemaWorkoutDay,
	WorkoutProgram as SchemaWorkoutProgram,
	WorkoutRoutine as SchemaWorkoutRoutine,
	WorkoutSession as SchemaWorkoutSession,
} from "@/schemas";

export interface Exercise {
	id: string;
	name: string;
	description?: string;
	muscleGroup?: string; // Alternative naming
	equipmentType?: string; // Alternative naming
	difficulty?: string;
	videoUrl?: string;
	exerciseId?: string; // For DB references
	exerciseName?: string; // Alternative naming
	muscleGroups?: string[];
	equipment?: string;
	sets: number;
	reps: string; // e.g., "8-12", "10", "AMRAP"
	restPeriod?: number; // seconds
	restSeconds?: number; // Alternative naming
	weight?: number;
	notes?: string;
	order?: number;
	createdAt?: Date | string;
}

export interface WorkoutDay extends Omit<SchemaWorkoutDay, "programId"> {
	programId?: string;
	exercises: Exercise[];
	order?: number;
}

export interface WorkoutProgram extends SchemaWorkoutProgram {
	days: WorkoutDay[];
	duration?: number; // weeks
	difficulty?: "beginner" | "intermediate" | "advanced";
	goals?: string[]; // e.g., ["muscle_gain", "strength", "endurance"]
}

export interface WorkoutRoutine extends SchemaWorkoutRoutine {
	// Additional properties for compatibility
	days?: WorkoutDay[];
	frequency?: number;
	duration?: number;
	difficulty?: "beginner" | "intermediate" | "advanced";
	goals?: string[];
}

export interface Set {
	id: string;
	sessionId: string;
	exerciseId: string;
	setNumber: number;
	weight: number;
	reps: number | null;
	rpe?: number | null; // Rate of Perceived Exertion 1-10
	number?: number;
	completed?: boolean;
	completedAt?: Date | string;
}

export interface ExerciseWithSets extends Exercise {
	completedSets: Set[];
}

export type WorkoutSession = SchemaWorkoutSession & {
	sets?: Set[];
};

export type PersonalRecord = SchemaPersonalRecord;

export type UserProfile = SchemaUserProfile;
