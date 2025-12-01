import { Button } from "@/components/ui/button";
import type { WeightUnit } from "@/types/exercise";

interface UnitToggleProps {
	unit: WeightUnit;
	onUnitChange: (unit: WeightUnit) => void;
}

export function UnitToggle({ unit, onUnitChange }: UnitToggleProps) {
	return (
		<div className="flex gap-4">
			<Button
				variant={unit === "lbs" ? "default" : "outline"}
				onClick={() => onUnitChange("lbs")}
			>
				Pounds (lbs)
			</Button>
			<Button
				variant={unit === "kg" ? "default" : "outline"}
				onClick={() => onUnitChange("kg")}
			>
				Kilograms (kg)
			</Button>
		</div>
	);
}
