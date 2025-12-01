import type { WeightUnit } from "@/types/exercise";
import type { PlateConfig } from "../logic";

interface BarVisualizationProps {
	plates: PlateConfig[];
	barWeight: string;
	unit: WeightUnit;
}

export function BarVisualization({
	plates,
	barWeight,
	unit,
}: BarVisualizationProps) {
	if (!plates.length) {
		return null;
	}

	return (
		<div className="space-y-2">
			<h4 className="text-md font-semibold">Bar Loading:</h4>
			<div className="flex items-center justify-center space-x-1">
				{/* Left side plates */}
				<div className="flex">
					{plates.map((plate) =>
						Array.from({ length: plate.count }).map((_, countIndex) => (
							<div
								key={`left-${plate.weight}-${countIndex}`}
								className={`w-3 h-12 ${plate.color} border border-zinc-600 -ml-1 first:ml-0`}
								title={`${plate.weight}${unit === "kg" ? "kg" : "lb"} plate`}
							/>
						)),
					)}
				</div>

				{/* Bar */}
				<div className="w-32 h-4 bg-gray-400 mx-2 flex items-center justify-center text-xs text-black font-bold">
					{barWeight}
					{unit}
				</div>

				{/* Right side plates (mirror of left) */}
				<div className="flex flex-row-reverse">
					{plates.map((plate) =>
						Array.from({ length: plate.count }).map((_, countIndex) => (
							<div
								key={`right-${plate.weight}-${countIndex}`}
								className={`w-3 h-12 ${plate.color} border border-zinc-600 -mr-1 first:mr-0`}
								title={`${plate.weight}${unit === "kg" ? "kg" : "lb"} plate`}
							/>
						)),
					)}
				</div>
			</div>
		</div>
	);
}
