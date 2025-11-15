"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PlateConfig {
	weight: number;
	color: string;
	count: number;
}

// Tolerance for floating point precision when calculating plate combinations
const PLATE_WEIGHT_TOLERANCE = 0.01;

export default function PlateCalculator() {
	const [unit, setUnit] = useState<"kg" | "lbs">("lbs");
	const [targetWeight, setTargetWeight] = useState("");
	const [barWeight, setBarWeight] = useState("45");
	const [results, setResults] = useState<{
		plates: PlateConfig[];
		totalWeight: number;
		impossible: boolean;
	} | null>(null);

	// Standard plate sets
	const plateConfigs = {
		kg: [
			{ weight: 25, color: "bg-red-600", count: 0 },
			{ weight: 20, color: "bg-blue-600", count: 0 },
			{ weight: 15, color: "bg-yellow-600", count: 0 },
			{ weight: 10, color: "bg-green-600", count: 0 },
			{ weight: 5, color: "bg-white text-black", count: 0 },
			{ weight: 2.5, color: "bg-red-800", count: 0 },
			{ weight: 1.25, color: "bg-gray-600", count: 0 },
		],
		lbs: [
			{ weight: 45, color: "bg-red-600", count: 0 },
			{ weight: 35, color: "bg-blue-600", count: 0 },
			{ weight: 25, color: "bg-yellow-600", count: 0 },
			{ weight: 10, color: "bg-green-600", count: 0 },
			{ weight: 5, color: "bg-white text-black", count: 0 },
			{ weight: 2.5, color: "bg-red-800", count: 0 },
		],
	};

	const calculate = () => {
		if (!targetWeight.trim() || !barWeight.trim()) {
			toast.error("Please enter both target weight and bar weight");
			return;
		}

		const target = Number.parseFloat(targetWeight);
		const bar = Number.parseFloat(barWeight);

		if (Number.isNaN(target) || Number.isNaN(bar) || target <= 0 || bar <= 0) {
			toast.error("Please enter valid numbers for target weight and bar weight");
			return;
		}

		if (target <= bar) {
			toast.error("Target weight must be greater than bar weight");
			return;
		}

		const weightPerSide = (target - bar) / 2;
		let remainingWeight = weightPerSide;

		// Get available plates for current unit
		const availablePlates = plateConfigs[unit];
		const usedPlates = availablePlates.map((plate) => ({ ...plate, count: 0 }));

		// Greedy algorithm: use largest plates first
		for (const plate of usedPlates) {
			const plateCount = Math.floor(remainingWeight / plate.weight);
			plate.count = Math.max(0, plateCount);
			remainingWeight -= plate.count * plate.weight;
		}

		// Check if we got close enough (within tolerance)
		const actualWeightPerSide = usedPlates.reduce(
			(sum, plate) => sum + plate.weight * plate.count,
			0,
		);
		const actualWeight = bar + actualWeightPerSide * 2;
		const isImpossible = Math.abs(remainingWeight) > PLATE_WEIGHT_TOLERANCE;

		setResults({
			plates: usedPlates.filter((p) => p.count > 0),
			totalWeight: actualWeight,
			impossible: isImpossible,
		});
	};

	// Update bar weight when unit changes
	const handleUnitChange = (newUnit: "kg" | "lbs") => {
		setUnit(newUnit);
		setBarWeight(newUnit === "kg" ? "20" : "45");
		// Clear results since they're no longer valid for the new unit
		setResults(null);
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
					<h1 className="text-4xl font-bold mb-4">Plate Calculator</h1>
					<p className="text-zinc-400">
						Calculate which plates to load on your barbell for any target weight
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
					<div className="grid md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="target">Target Weight ({unit})</Label>
							<Input
								id="target"
								type="number"
								value={targetWeight}
								onChange={(e) => setTargetWeight(e.target.value)}
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
								onChange={(e) => setBarWeight(e.target.value)}
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
							calculate();
						}}
						className="w-full"
						size="lg"
					>
						Calculate Plates
					</Button>

					{/* Results */}
					{results && (
						<div className="space-y-4">
							{results.impossible && (
								<div className="p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
									<p className="text-yellow-400">
										⚠️ Cannot achieve exact weight with available plates.
										Closest weight: {results.totalWeight} {unit}
									</p>
								</div>
							)}

							{results.plates.length > 0 ? (
								<div className="space-y-4">
									<h3 className="text-lg font-semibold">Plates Per Side:</h3>
									<div className="flex flex-wrap gap-2">
										{results.plates.map((plate, index) => (
											<div
												key={index}
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
											{unit} + Plates: {(results.totalWeight - Number.parseFloat(barWeight)).toFixed(1)}
											{unit}
										</p>
									</div>

									{/* Visual Bar Representation */}
									<div className="space-y-2">
										<h4 className="text-md font-semibold">Bar Loading:</h4>
										<div className="flex items-center justify-center space-x-1">
											{/* Left side plates */}
											<div className="flex">
												{results.plates.map((plate, plateIndex) =>
													Array.from({ length: plate.count }).map(
														(_, countIndex) => (
															<div
																key={`left-${plateIndex}-${countIndex}`}
																className={`w-3 h-12 ${plate.color} border border-zinc-600 -ml-1 first:ml-0`}
																title={`${plate.weight}${
																	unit === "kg" ? "kg" : "lb"
																} plate`}
															/>
														),
													),
												)}
											</div>

											{/* Bar */}
											<div className="w-32 h-4 bg-gray-400 mx-2 flex items-center justify-center text-xs text-black font-bold">
												{barWeight}
												{unit}
											</div>

											{/* Right side plates (mirror of left) */}
											<div className="flex flex-row-reverse">
												{results.plates.map((plate, plateIndex) =>
													Array.from({ length: plate.count }).map(
														(_, countIndex) => (
															<div
																key={`right-${plateIndex}-${countIndex}`}
																className={`w-3 h-12 ${plate.color} border border-zinc-600 -mr-1 first:mr-0`}
																title={`${plate.weight}${
																	unit === "kg" ? "kg" : "lb"
																} plate`}
															/>
														),
													),
												)}
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className="p-4 bg-blue-900/20 border border-blue-600 rounded-lg">
									<p className="text-blue-400">
										No additional plates needed. Use just the bar weight of{" "}
										{barWeight} {unit}.
									</p>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Info Section */}
				<div className="mt-8 space-y-4 text-sm text-zinc-400">
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Standard Plate Colors
						</h3>
						<div className="grid md:grid-cols-2 gap-4">
							<div>
								<h4 className="font-semibold text-zinc-300 mb-2">Kilograms:</h4>
								<ul className="space-y-1">
									<li>
										<span className="inline-block w-4 h-4 bg-red-600 rounded mr-2" />
										25kg - Red
									</li>
									<li>
										<span className="inline-block w-4 h-4 bg-blue-600 rounded mr-2" />
										20kg - Blue
									</li>
									<li>
										<span className="inline-block w-4 h-4 bg-yellow-600 rounded mr-2" />
										15kg - Yellow
									</li>
									<li>
										<span className="inline-block w-4 h-4 bg-green-600 rounded mr-2" />
										10kg - Green
									</li>
								</ul>
							</div>
							<div>
								<h4 className="font-semibold text-zinc-300 mb-2">Pounds:</h4>
								<ul className="space-y-1">
									<li>
										<span className="inline-block w-4 h-4 bg-red-600 rounded mr-2" />
										45lb - Red
									</li>
									<li>
										<span className="inline-block w-4 h-4 bg-blue-600 rounded mr-2" />
										35lb - Blue
									</li>
									<li>
										<span className="inline-block w-4 h-4 bg-yellow-600 rounded mr-2" />
										25lb - Yellow
									</li>
									<li>
										<span className="inline-block w-4 h-4 bg-green-600 rounded mr-2" />
										10lb - Green
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Loading Tips
						</h3>
						<p>
							Always load plates symmetrically and use collars to secure them.
							Load heavier plates closer to the bar for better balance and
							safety. The calculator assumes standard gym plate availability.
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}