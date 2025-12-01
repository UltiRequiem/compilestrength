import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WeightUnit } from "@/types/exercise";

interface CalculatorInputsProps {
	unit: WeightUnit;
	targetWeight: string;
	barWeight: string;
	onTargetWeightChange: (value: string) => void;
	onBarWeightChange: (value: string) => void;
	onCalculate: () => void;
}

export function CalculatorInputs({
	unit,
	targetWeight,
	barWeight,
	onTargetWeightChange,
	onBarWeightChange,
	onCalculate,
}: CalculatorInputsProps) {
	return (
		<div className="space-y-4">
			<div className="grid md:grid-cols-2 gap-4">
				<div>
					<Label htmlFor="target">Target Weight ({unit})</Label>
					<Input
						id="target"
						type="number"
						value={targetWeight}
						onChange={(e) => onTargetWeightChange(e.target.value)}
						placeholder={unit === "kg" ? "e.g., 100" : "e.g., 225"}
						className="mt-1"
					/>
				</div>

				<div>
					<Label htmlFor="bar">Bar Weight ({unit})</Label>
					<Input
						id="bar"
						type="number"
						value={barWeight}
						onChange={(e) => onBarWeightChange(e.target.value)}
						placeholder={unit === "kg" ? "20" : "45"}
						className="mt-1"
					/>
				</div>
			</div>

			<Button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					onCalculate();
				}}
				className="w-full"
				size="lg"
			>
				Calculate Plates
			</Button>
		</div>
	);
}
