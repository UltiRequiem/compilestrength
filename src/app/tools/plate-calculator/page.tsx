"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Navbar } from "@/components/navbar";
import type { WeightUnit } from "@/lib/types";
import {
	BarVisualization,
	CalculatorInputs,
	InfoSection,
	PlateResults,
	UnitToggle,
} from "./components";
import {
	calculatePlateDistribution,
	getDefaultBarWeight,
	type PlateCalculationResult,
} from "./logic";
import { plateCalculatorInputSchema } from "./validation";

export default function PlateCalculator() {
	const [unit, setUnit] = useState<WeightUnit>("lbs");
	const [targetWeight, setTargetWeight] = useState("");
	const [barWeight, setBarWeight] = useState("45");
	const [results, setResults] = useState<PlateCalculationResult | null>(null);

	const calculate = () => {
		const result = plateCalculatorInputSchema.safeParse({
			targetWeight,
			barWeight,
		});

		if (!result.success) {
			const [firstError] = result.error.issues;
			return toast.error(firstError.message);
		}

		const { targetWeight: target, barWeight: bar } = result.data;
		const calculationResult = calculatePlateDistribution(target, bar, unit);
		setResults(calculationResult);
	};

	const handleUnitChange = (newUnit: "kg" | "lbs") => {
		setUnit(newUnit);
		setBarWeight(getDefaultBarWeight(newUnit));
		setResults(null);
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			<Navbar />

			<main className="max-w-3xl mx-auto px-6 py-12">
				<div className="mb-8">
					<Link
						href="/tools"
						className="text-sm text-zinc-400 hover:text-blue-500 mb-4 inline-block"
					>
						← Back to Tools
					</Link>
					<h1 className="text-4xl font-bold mb-4">Plate Calculator</h1>
					<p className="text-zinc-400">
						Calculate which plates to load on your barbell for any target weight
					</p>
				</div>

				<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 space-y-6">
					<UnitToggle unit={unit} onUnitChange={handleUnitChange} />

					<CalculatorInputs
						unit={unit}
						targetWeight={targetWeight}
						barWeight={barWeight}
						onTargetWeightChange={setTargetWeight}
						onBarWeightChange={setBarWeight}
						onCalculate={calculate}
					/>

					{results && (
						<div className="space-y-4">
							<PlateResults
								results={results}
								unit={unit}
								barWeight={barWeight}
							/>
							<BarVisualization
								plates={results.plates}
								barWeight={barWeight}
								unit={unit}
							/>
						</div>
					)}
				</div>

				<InfoSection />
			</main>
		</div>
	);
}
