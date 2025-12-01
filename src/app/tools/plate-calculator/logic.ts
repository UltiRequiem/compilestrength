import { PLATE_WEIGHT_TOLERANCE, plateConfigs } from "./config";

export interface PlateConfig {
	weight: number;
	color: string;
	count: number;
}

export interface PlateCalculationResult {
	plates: PlateConfig[];
	totalWeight: number;
	impossible: boolean;
}

/**
 * Calculates the optimal plate distribution to achieve a target weight.
 * Uses a greedy algorithm to prioritize larger plates first.
 *
 * @param targetWeight - The desired total weight (including bar)
 * @param barWeight - The weight of the barbell
 * @param unit - The unit system to use (kg or lbs)
 * @returns Calculation result with plates per side, total weight, and whether exact match is impossible
 */
export function calculatePlateDistribution(
	targetWeight: number,
	barWeight: number,
	unit: "kg" | "lbs",
): PlateCalculationResult {
	// Calculate weight needed per side of the bar
	const weightPerSide = (targetWeight - barWeight) / 2;
	let remainingWeight = weightPerSide;

	// Get available plates for current unit system
	const availablePlates = plateConfigs[unit];
	const usedPlates = availablePlates.map((plate) => ({ ...plate, count: 0 }));

	// Greedy algorithm: use largest plates first to minimize plate count
	for (const plate of usedPlates) {
		const plateCount = Math.floor(remainingWeight / plate.weight);
		plate.count = Math.max(0, plateCount);
		remainingWeight -= plate.count * plate.weight;
	}

	// Calculate actual achieved weight
	const actualWeightPerSide = usedPlates.reduce(
		(sum, plate) => sum + plate.weight * plate.count,
		0,
	);
	const actualWeight = barWeight + actualWeightPerSide * 2;

	// Check if we got close enough (within floating-point tolerance)
	const isImpossible = Math.abs(remainingWeight) > PLATE_WEIGHT_TOLERANCE;

	return {
		plates: usedPlates.filter((p) => p.count > 0),
		totalWeight: actualWeight,
		impossible: isImpossible,
	};
}

/**
 * Gets the default bar weight for a given unit system.
 * Standard barbells are 45 lbs (20 kg).
 *
 * @param unit - The unit system
 * @returns Default bar weight as a string
 */
export function getDefaultBarWeight(unit: "kg" | "lbs"): string {
	return unit === "kg" ? "20" : "45";
}
