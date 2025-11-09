"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { requireAuth } from "@/lib/auth-utils";

type UserPreferencesUpdate = {
	units?: string;
	restTimerDefault?: number;
	trainingGoal?: string | null;
	experienceLevel?: string | null;
	availableDays?: number | null;
};

export async function getUserPreferences() {
	const session = await requireAuth();

	const preferences = await db.query.userPreferences.findFirst({
		where: eq(userPreferences.userId, session.user.id),
	});

	return preferences;
}

export async function updateUserPreferences(formData: UserPreferencesUpdate) {
	const session = await requireAuth();

	const existing = await db.query.userPreferences.findFirst({
		where: eq(userPreferences.userId, session.user.id),
	});

	const updateData = buildUpdateData(formData);

	if (existing && Object.keys(updateData).length > 0) {
		const [updated] = await db
			.update(userPreferences)
			.set(updateData)
			.where(eq(userPreferences.userId, session.user.id))
			.returning();

		revalidatePath("/settings");
		return { success: true, preferences: updated };
	}

	if (!existing) {
		const [created] = await db
			.insert(userPreferences)
			.values({
				userId: session.user.id,
				units: formData.units ?? "lbs",
				restTimerDefault: formData.restTimerDefault ?? 90,
				trainingGoal: formData.trainingGoal ?? null,
				experienceLevel: formData.experienceLevel ?? null,
				availableDays: formData.availableDays ?? null,
			})
			.returning();

		revalidatePath("/settings");

		return { success: true, preferences: created };
	}

	return { success: true, preferences: existing };
}

function buildUpdateData(
	formData: UserPreferencesUpdate,
): Partial<typeof userPreferences.$inferInsert> {
	const updateData: Partial<typeof userPreferences.$inferInsert> = {};

	if (formData.units !== undefined) {
		updateData.units = formData.units;
	}
	if (formData.restTimerDefault !== undefined) {
		updateData.restTimerDefault = formData.restTimerDefault;
	}
	if (formData.trainingGoal !== undefined) {
		updateData.trainingGoal = formData.trainingGoal;
	}
	if (formData.experienceLevel !== undefined) {
		updateData.experienceLevel = formData.experienceLevel;
	}
	if (formData.availableDays !== undefined) {
		updateData.availableDays = formData.availableDays;
	}

	return updateData;
}
