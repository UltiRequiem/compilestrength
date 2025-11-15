"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";

export default function TDEECalculator() {
	const { data: session } = useSession();
	const [unit, setUnit] = useState<"metric" | "imperial">("imperial");
	const [gender, setGender] = useState<"male" | "female">("male");
	const [age, setAge] = useState("");
	const [weight, setWeight] = useState("");
	const [height, setHeight] = useState("");
	const [activityLevel, setActivityLevel] = useState("1.55");
	const [results, setResults] = useState<{
		bmr: number;
		tdee: number;
		cutting: number;
		bulking: number;
		formula: string;
	} | null>(null);

	const activityLevels = [
		{ value: "1.2", label: "Sedentary (desk job, no exercise)" },
		{ value: "1.375", label: "Lightly active (light exercise 1-3 days/week)" },
		{
			value: "1.55",
			label: "Moderately active (moderate exercise 3-5 days/week)",
		},
		{ value: "1.725", label: "Very active (hard exercise 6-7 days/week)" },
		{
			value: "1.9",
			label: "Extremely active (very hard exercise, physical job)",
		},
	];

	const calculate = () => {
		if (!weight.trim() || !height.trim() || !age.trim()) {
			alert("Please enter age, weight, and height");
			return;
		}

		const w = Number.parseFloat(weight);
		const h = Number.parseFloat(height);
		const a = Number.parseInt(age, 10);
		const activity = Number.parseFloat(activityLevel);

		if (
			Number.isNaN(w) ||
			Number.isNaN(h) ||
			Number.isNaN(a) ||
			w <= 0 ||
			h <= 0 ||
			a < 15 ||
			a > 80
		) {
			alert("Please enter valid age (15-80), weight, and height");
			return;
		}

		// Convert to metric if needed
		const weightKg = unit === "imperial" ? w * 0.453592 : w;
		const heightCm = unit === "imperial" ? h * 2.54 : h;

		// Mifflin-St Jeor Equation (more accurate than Harris-Benedict)
		let bmr: number;
		if (gender === "male") {
			bmr = 10 * weightKg + 6.25 * heightCm - 5 * a + 5;
		} else {
			bmr = 10 * weightKg + 6.25 * heightCm - 5 * a - 161;
		}

		const tdee = bmr * activity;
		const cutting = tdee * 0.8; // 20% deficit
		const bulking = tdee * 1.1; // 10% surplus

		setResults({
			bmr: Math.round(bmr),
			tdee: Math.round(tdee),
			cutting: Math.round(cutting),
			bulking: Math.round(bulking),
			formula: "Mifflin-St Jeor",
		});
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			{/* Navbar */}
			<nav className="border-b border-zinc-800 px-6 py-4 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<Link href="/" className="text-xl font-bold">
						<span className="text-blue-500">Compile</span>
						<span className="text-white">Strength</span>
					</Link>
					<div className="flex items-center gap-4">
						<Link
							href="/tools"
							className="text-zinc-300 hover:text-white transition-colors"
						>
							Tools
						</Link>
						<Link
							href="/blog"
							className="text-zinc-300 hover:text-white transition-colors"
						>
							Blog
						</Link>
						{session ? (
							<Link href="/app/dashboard">
								<Button size="sm">Dashboard</Button>
							</Link>
						) : (
							<>
								<Link href="/login">
									<Button variant="outline" size="sm">
										Login
									</Button>
								</Link>
								<Link href="/signup">
									<Button size="sm">Sign Up</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="max-w-3xl mx-auto px-6 py-12">
				<div className="mb-8">
					<Link
						href="/tools"
						className="text-sm text-zinc-400 hover:text-blue-500 mb-4 inline-block"
					>
						← Back to Tools
					</Link>
					<h1 className="text-4xl font-bold mb-4">TDEE Calculator</h1>
					<p className="text-zinc-400">
						Calculate your Total Daily Energy Expenditure for accurate calorie
						planning
					</p>
				</div>

				<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 space-y-6">
					{/* Unit Toggle */}
					<div className="flex gap-4">
						<Button
							variant={unit === "imperial" ? "default" : "outline"}
							onClick={() => setUnit("imperial")}
						>
							Imperial (lb/in)
						</Button>
						<Button
							variant={unit === "metric" ? "default" : "outline"}
							onClick={() => setUnit("metric")}
						>
							Metric (kg/cm)
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
					<div className="grid md:grid-cols-2 gap-4">
						<div>
							<Label htmlFor="age">Age (years)</Label>
							<Input
								id="age"
								type="number"
								value={age}
								onChange={(e) => setAge(e.target.value)}
								placeholder="e.g., 25"
								min="15"
								max="80"
								className="mt-1"
							/>
						</div>

						<div>
							<Label htmlFor="weight">
								Weight ({unit === "imperial" ? "lbs" : "kg"})
							</Label>
							<Input
								id="weight"
								type="number"
								value={weight}
								onChange={(e) => setWeight(e.target.value)}
								placeholder={unit === "imperial" ? "e.g., 180" : "e.g., 82"}
								className="mt-1"
							/>
						</div>

						<div className="md:col-span-2">
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
					</div>

					{/* Activity Level */}
					<div>
						<Label htmlFor="activity">Activity Level</Label>
						<select
							id="activity"
							value={activityLevel}
							onChange={(e) => setActivityLevel(e.target.value)}
							className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						>
							{activityLevels.map((level) => (
								<option key={level.value} value={level.value}>
									{level.label}
								</option>
							))}
						</select>
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
						Calculate TDEE
					</Button>

					{/* Results */}
					{results && (
						<div className="mt-8 pt-8 border-t border-zinc-800">
							<h2 className="text-2xl font-bold mb-4">Results</h2>
							<div className="grid md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div className="p-4 bg-zinc-800/50 rounded-lg">
										<div className="text-sm text-zinc-400 mb-1">
											Basal Metabolic Rate (BMR)
										</div>
										<div className="text-2xl font-bold text-blue-500">
											{results.bmr} cal/day
										</div>
										<div className="text-xs text-zinc-500">
											Calories burned at rest
										</div>
									</div>

									<div className="p-4 bg-zinc-800/50 rounded-lg">
										<div className="text-sm text-zinc-400 mb-1">
											Total Daily Energy Expenditure
										</div>
										<div className="text-2xl font-bold text-green-500">
											{results.tdee} cal/day
										</div>
										<div className="text-xs text-zinc-500">
											Maintenance calories
										</div>
									</div>
								</div>

								<div className="space-y-4">
									<div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
										<div className="text-sm text-red-400 mb-1">
											Fat Loss (20% deficit)
										</div>
										<div className="text-2xl font-bold text-red-400">
											{results.cutting} cal/day
										</div>
										<div className="text-xs text-red-300">
											-{results.tdee - results.cutting} calories
										</div>
									</div>

									<div className="p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
										<div className="text-sm text-green-400 mb-1">
											Muscle Gain (10% surplus)
										</div>
										<div className="text-2xl font-bold text-green-400">
											{results.bulking} cal/day
										</div>
										<div className="text-xs text-green-300">
											+{results.bulking - results.tdee} calories
										</div>
									</div>
								</div>
							</div>

							<div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg text-sm text-zinc-400">
								<p className="font-bold text-blue-500 mb-1">
									Formula Used: {results.formula}
								</p>
								<p>
									These are estimates. Monitor your weight and adjust calories
									as needed. Individual metabolisms vary.
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Info Section */}
				<div className="mt-8 space-y-4 text-sm text-zinc-400">
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							What is TDEE?
						</h3>
						<p>
							Total Daily Energy Expenditure (TDEE) is the total number of
							calories your body burns in a day, including exercise and daily
							activities. It's calculated by multiplying your BMR by an activity
							factor.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							How to Use These Results
						</h3>
						<p>
							Use your TDEE as a starting point for calorie planning. To lose
							fat, eat below your TDEE. To gain muscle, eat slightly above your
							TDEE. Track your weight and adjust as needed.
						</p>
					</div>
					<div>
						<h3 className="text-lg font-bold mb-2 text-blue-500">
							Activity Level Guidelines
						</h3>
						<p>
							Choose your activity level based on total weekly activity, not
							just gym sessions. Include work activity, walking, and other
							movement throughout the day.
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
