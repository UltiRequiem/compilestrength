"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BodyFatResult, Gender, UnitSystem } from "./config";
import { calculateBodyFat } from "./logic";
import { bodyFatInputSchema } from "./validation";

export default function BodyFatCalculator() {
	const [unit, setUnit] = useState<UnitSystem>("imperial");
	const [gender, setGender] = useState<Gender>("male");
	const [height, setHeight] = useState("");
	const [waist, setWaist] = useState("");
	const [neck, setNeck] = useState("");
	const [hip, setHip] = useState(""); // Only for females
	const [results, setResults] = useState<BodyFatResult | null>(null);

	const calculate = () => {
		// Validate inputs using Zod schema
		const result = bodyFatInputSchema.safeParse({
			height,
			waist,
			neck,
			hip: hip || undefined,
			gender,
			unit,
		});

		if (!result.success) {
			console.log(result.error);
			return toast.error(
				`${result.error.issues.map((issue) => issue.message).join(". ")}.`,
			);
		}

		// Calculate body fat using pure logic function
		const calculationResult = calculateBodyFat({
			height: result.data.height,
			waist: result.data.waist,
			neck: result.data.neck,
			hip: result.data.hip,
			gender: result.data.gender,
			unit: result.data.unit,
		});

		setResults(calculationResult);
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
					<h1 className="text-4xl font-bold mb-4">Body Fat Calculator</h1>
					<p className="text-zinc-400">
						Calculate your body fat percentage using circumference measurements
					</p>
				</div>

				<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 space-y-6">
					{/* Unit Toggle */}
					<div className="flex gap-4">
						<Button
							variant={unit === "imperial" ? "default" : "outline"}
							onClick={() => setUnit("imperial")}
						>
							Imperial (inches)
						</Button>
						<Button
							variant={unit === "metric" ? "default" : "outline"}
							onClick={() => setUnit("metric")}
						>
							Metric (cm)
						</Button>
					</div>

					{/* Gender Selection */}
					<div className="flex gap-4">
						<Button
							variant={gender === "male" ? "default" : "outline"}
							onClick={() => setGender("male")}
						>
							Male
						</Button>
						<Button
							variant={gender === "female" ? "default" : "outline"}
							onClick={() => setGender("female")}
						>
							Female
						</Button>
					</div>

					{/* Inputs */}
					<div className="space-y-4">
						<div>
							<Label htmlFor="height">
								Height ({unit === "imperial" ? "inches" : "cm"})
							</Label>
							<Input
								id="height"
								type="number"
								value={height}
								onChange={(e) => setHeight(e.target.value)}
								placeholder={unit === "imperial" ? "e.g., 70" : "e.g., 178"}
								className="mt-1"
							/>
						</div>

						<div>
							<Label htmlFor="waist">
								Waist Circumference ({unit === "imperial" ? "inches" : "cm"})
							</Label>
							<Input
								id="waist"
								type="number"
								value={waist}
								onChange={(e) => setWaist(e.target.value)}
								placeholder={unit === "imperial" ? "e.g., 32" : "e.g., 81"}
								className="mt-1"
							/>
							<p className="text-xs text-zinc-400 mt-1">
								Measure at the navel (belly button) level
							</p>
						</div>

						<div>
							<Label htmlFor="neck">
								Neck Circumference ({unit === "imperial" ? "inches" : "cm"})
							</Label>
							<Input
								id="neck"
								type="number"
								value={neck}
								onChange={(e) => setNeck(e.target.value)}
								placeholder={unit === "imperial" ? "e.g., 15" : "e.g., 38"}
								className="mt-1"
							/>
							<p className="text-xs text-zinc-400 mt-1">
								Measure just below the Adam's apple
							</p>
						</div>

						{gender === "female" && (
							<div>
								<Label htmlFor="hip">
									Hip Circumference ({unit === "imperial" ? "inches" : "cm"})
								</Label>
								<Input
									id="hip"
									type="number"
									value={hip}
									onChange={(e) => setHip(e.target.value)}
									placeholder={unit === "imperial" ? "e.g., 38" : "e.g., 97"}
									className="mt-1"
								/>
								<p className="text-xs text-zinc-400 mt-1">
									Measure at the widest point around the hips
								</p>
							</div>
						)}
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
						Calculate Body Fat
					</Button>

					{/* Results */}
					{results && (
						<div className="mt-8 pt-8 border-t border-zinc-800">
							<h2 className="text-2xl font-bold mb-4">Results</h2>
							<div className="space-y-4">
								<div className="p-6 bg-blue-900/20 border border-blue-800/50 rounded-lg text-center">
									<div className="text-sm text-blue-400 mb-2">
										Body Fat Percentage
									</div>
									<div className="text-4xl font-bold text-blue-500 mb-2">
										{results.bodyFat}%
									</div>
									<div className="text-lg text-zinc-300">
										{results.category}
									</div>
								</div>

								<div className="p-4 bg-zinc-800/50 rounded-lg">
									<div className="text-sm text-zinc-400 mb-2">
										Method: {results.method} Formula
									</div>
									<div className="text-xs text-zinc-500">
										Based on circumference measurements using validated military
										formulas
									</div>
								</div>
							</div>

							{/* Body Fat Categories */}
							<div className="mt-6 p-4 bg-zinc-800/30 rounded-lg">
								<h3 className="font-bold mb-3 text-blue-500">
									Body Fat Categories
								</h3>
								<div className="grid md:grid-cols-2 gap-4 text-sm">
									<div>
										<h4 className="font-semibold text-zinc-300 mb-2">Men:</h4>
										<ul className="space-y-1 text-zinc-400">
											<li>Essential fat (too low): &lt;6%</li>
											<li>Athletic: 6-13%</li>
											<li>Fitness: 14-17%</li>
											<li>Average: 18-24%</li>
											<li>Above average: 25%+</li>
										</ul>
									</div>
									<div>
										<h4 className="font-semibold text-zinc-300 mb-2">Women:</h4>
										<ul className="space-y-1 text-zinc-400">
											<li>Essential fat (too low): &lt;14%</li>
											<li>Athletic: 14-20%</li>
											<li>Fitness: 21-24%</li>
											<li>Average: 25-31%</li>
											<li>Above average: 32%+</li>
										</ul>
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
							About This Calculator
						</h3>
						<p>
							This calculator uses the US Navy method, which estimates body fat
							percentage using circumference measurements. It's more accessible
							than DEXA scans but less accurate than professional methods.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Measurement Tips
						</h3>
						<p>
							Take measurements at the same time of day, preferably in the
							morning. Ensure the tape measure is snug but not tight. Take
							measurements three times and use the average for best accuracy.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Limitations
						</h3>
						<p>
							This method may be less accurate for very muscular or very lean
							individuals. It's best used for tracking changes over time rather
							than absolute accuracy.
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
