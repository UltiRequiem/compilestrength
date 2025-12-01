import { Button } from "@/components/ui/button";

interface UnitToggleProps {
	unit: "kg" | "lbs";
	onUnitChange: (unit: "kg" | "lbs") => void;
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
