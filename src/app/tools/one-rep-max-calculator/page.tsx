"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WeightUnit } from "@/types/exercise";
import type { OneRepMaxResult } from "./config";
import { calculateOneRepMax, convertOneRepMaxResults } from "./logic";
import { oneRepMaxInputSchema } from "./validation";

export default function OneRepMaxCalculator() {
	const [unit, setUnit] = useState<WeightUnit>("lbs");
	const [weight, setWeight] = useState("");
	const [reps, setReps] = useState("");
	const [results, setResults] = useState<OneRepMaxResult | null>(null);

	const calculate = () => {
		// Validate inputs using Zod schema
		const validationResult = oneRepMaxInputSchema.safeParse({
			weight,
			reps,
		});

		if (!validationResult.success) {
			// Display first validation error
			toast.error(
				`${validationResult.error.issues.map((issue) => issue.message).join(". ")}.`,
			);
			return;
		}

		// Calculate 1RM using validated data
		const { weight: validWeight, reps: validReps } = validationResult.data;
		const calculationResults = calculateOneRepMax(validWeight, validReps);

		setResults(calculationResults);
	};

	// Handle unit conversion for existing results
	const handleUnitChange = (newUnit: WeightUnit) => {
		const oldUnit = unit;
		setUnit(newUnit);

		// Convert existing results if they exist
		if (results && oldUnit !== newUnit) {
			const convertedResults = convertOneRepMaxResults(
				results,
				oldUnit,
				newUnit,
			);
			setResults(convertedResults);
		}
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			<Navbar />

			{/* Main Content */}
			<main className="max-w-3xl mx-auto px-6 py-12">
				<div className="mb-8">
					<Link
						href="/tools"
						className="text-sm text-zinc-400 hover:text-blue-500 mb-4 inline-block"
					>
						← Back to Tools
					</Link>
					<h1 className="text-4xl font-bold mb-4">One Rep Max Calculator</h1>
					<p className="text-zinc-400">
						Calculate your one rep max (1RM) using multiple proven formulas
					</p>
				</div>

				<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 space-y-6">
					{/* Unit Toggle */}
					<div className="flex gap-4">
						<Button
							variant={unit === "lbs" ? "default" : "outline"}
							onClick={() => handleUnitChange("lbs")}
						>
							Pounds (lbs)
						</Button>
						<Button
							variant={unit === "kg" ? "default" : "outline"}
							onClick={() => handleUnitChange("kg")}
						>
							Kilograms (kg)
						</Button>
					</div>

					{/* Inputs */}
					<div className="space-y-4">
						<div>
							<Label htmlFor="weight">Weight ({unit})</Label>
							<Input
								id="weight"
								type="number"
								value={weight}
								onChange={(e) => setWeight(e.target.value)}
								placeholder={unit === "lbs" ? "e.g., 225" : "e.g., 102"}
								className="mt-1"
							/>
						</div>

						<div>
							<Label htmlFor="reps">Reps Performed</Label>
							<Input
								id="reps"
								type="number"
								value={reps}
								onChange={(e) => setReps(e.target.value)}
								placeholder="e.g., 5"
								min="1"
								max="20"
								className="mt-1"
							/>
							<p className="text-xs text-zinc-400 mt-1">
								Enter reps between 1-20 for best accuracy
							</p>
						</div>
					</div>

					<Button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							calculate();
						}}
						className="w-full"
						size="lg"
					>
						Calculate 1RM
					</Button>

					{/* Results */}
					{results && (
						<div className="mt-8 pt-8 border-t border-zinc-800">
							<h2 className="text-2xl font-bold mb-4">Results</h2>
							<div className="grid md:grid-cols-2 gap-4">
								<div className="space-y-3">
									<div className="flex justify-between">
										<span className="text-zinc-400">Brzycki Formula:</span>
										<span className="font-bold">
											{results.brzycki} {unit}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-400">Epley Formula:</span>
										<span className="font-bold">
											{results.epley} {unit}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-400">Lander Formula:</span>
										<span className="font-bold">
											{results.lander} {unit}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-400">Lombardi Formula:</span>
										<span className="font-bold">
											{results.lombardi} {unit}
										</span>
									</div>
								</div>
								<div className="space-y-3">
									<div className="flex justify-between">
										<span className="text-zinc-400">Mayhew Formula:</span>
										<span className="font-bold">
											{results.mayhew} {unit}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-400">O'Connor Formula:</span>
										<span className="font-bold">
											{results.oConnor} {unit}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-zinc-400">Wathen Formula:</span>
										<span className="font-bold">
											{results.wathen} {unit}
										</span>
									</div>
									<div className="flex justify-between pt-3 border-t border-zinc-800">
										<span className="text-zinc-400 font-semibold">
											Average:
										</span>
										<span className="font-bold text-blue-500 text-lg">
											{results.average} {unit}
										</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Info Section */}
				<div className="mt-8 space-y-4 text-sm text-zinc-400">
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							About 1RM Calculations
						</h3>
						<p>
							One Rep Max (1RM) is the maximum weight you can lift for one
							repetition of a given exercise. These formulas estimate your 1RM
							based on submaximal lifts.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Formula Accuracy
						</h3>
						<p>
							Most formulas are most accurate in the 2-10 rep range. The Brzycki
							and Epley formulas are most commonly used and generally reliable
							for compound movements like squat, bench press, and deadlift.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Safety Note
						</h3>
						<p>
							Always warm up properly before attempting heavy lifts. Consider
							having a spotter when testing true 1RM attempts. These
							calculations are estimates and individual results may vary.
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
