import type { WeightUnit } from "@/types/exercise";
import type { PlateCalculationResult } from "../logic";

interface PlateResultsProps {
	results: PlateCalculationResult;
	unit: WeightUnit;
	barWeight: string;
}

export function PlateResults({ results, unit, barWeight }: PlateResultsProps) {
	if (!results.plates.length) {
		return (
			<div className="p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
				<p className="text-blue-400">
					No additional plates needed. Use just the bar weight of {barWeight}{" "}
					{unit}.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{results.impossible && (
				<div className="p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
					<p className="text-yellow-400">
						⚠️ Cannot achieve exact weight with available plates. Closest weight:{" "}
						{results.totalWeight} {unit}
					</p>
				</div>
			)}

			<div className="space-y-4">
				<h3 className="text-lg font-semibold">Plates Per Side:</h3>
				<div className="flex flex-wrap gap-2">
					{results.plates.map((plate) => (
						<div
							key={plate.weight}
							className={`px-4 py-2 rounded-lg ${plate.color} font-bold flex items-center gap-2`}
						>
							<span>
								{plate.count}x {plate.weight}
								{unit}
							</span>
						</div>
					))}
				</div>

				<div className="p-4 bg-zinc-800/30 rounded-lg">
					<p className="text-zinc-300">
						<strong>Total Weight:</strong> {results.totalWeight} {unit}
					</p>
					<p className="text-zinc-400 text-sm mt-1">
						Bar: {barWeight}
						{unit} + Plates:{" "}
						{(results.totalWeight - Number.parseFloat(barWeight)).toFixed(1)}
						{unit}
					</p>
				</div>
			</div>
		</div>
	);
}
