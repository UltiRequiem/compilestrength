import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ToolsPage() {
	return (
		<div className="min-h-screen bg-black text-green-400 font-mono">
			{/* Navbar */}
			<nav className="border-b border-green-400/20 px-6 py-4">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<Link href="/" className="text-xl font-bold">
						<span className="text-green-400">compile</span>
						<span className="text-white">strength</span>
					</Link>
					<div className="flex items-center gap-4">
						<Link
							href="/tools"
							className="text-green-400 hover:text-green-300 transition-colors"
						>
							Tools
						</Link>
						<Link href="/login">
							<Button variant="outline" size="sm">
								Login
							</Button>
						</Link>
						<Link href="/signup">
							<Button size="sm">Sign Up</Button>
						</Link>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-6 py-12">
				<div className="mb-12">
					<h1 className="text-4xl font-bold mb-4">
						<span className="text-green-400">// </span>Free Fitness Tools
					</h1>
					<p className="text-gray-400 text-lg">
						Calculators and utilities to optimize your training
					</p>
				</div>

				{/* Calculators Section */}
				<div className="space-y-8">
					<div>
						<h2 className="text-2xl font-bold mb-4 text-green-400">
							{">"} Calculators
						</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							<Link href="/tools/ffmi-calculator">
								<div className="border border-green-400/20 p-6 rounded-lg hover:border-green-400/40 transition-all cursor-pointer">
									<h3 className="text-xl font-bold mb-2">FFMI Calculator</h3>
									<p className="text-gray-400 text-sm">
										Calculate your Fat-Free Mass Index to assess muscle
										development
									</p>
								</div>
							</Link>

							{/* Placeholder for more tools */}
							<div className="border border-green-400/10 p-6 rounded-lg opacity-50">
								<h3 className="text-xl font-bold mb-2">One Rep Max</h3>
								<p className="text-gray-400 text-sm">Coming soon...</p>
							</div>

							<div className="border border-green-400/10 p-6 rounded-lg opacity-50">
								<h3 className="text-xl font-bold mb-2">TDEE Calculator</h3>
								<p className="text-gray-400 text-sm">Coming soon...</p>
							</div>

							<div className="border border-green-400/10 p-6 rounded-lg opacity-50">
								<h3 className="text-xl font-bold mb-2">Body Fat %</h3>
								<p className="text-gray-400 text-sm">Coming soon...</p>
							</div>

							<div className="border border-green-400/10 p-6 rounded-lg opacity-50">
								<h3 className="text-xl font-bold mb-2">Plate Calculator</h3>
								<p className="text-gray-400 text-sm">Coming soon...</p>
							</div>

							<div className="border border-green-400/10 p-6 rounded-lg opacity-50">
								<h3 className="text-xl font-bold mb-2">Macro Calculator</h3>
								<p className="text-gray-400 text-sm">Coming soon...</p>
							</div>
						</div>
					</div>
				</div>

				{/* CTA */}
				<div className="mt-16 border border-green-400/20 p-8 rounded-lg text-center">
					<h2 className="text-2xl font-bold mb-3">Want more advanced features?</h2>
					<p className="text-gray-400 mb-6">
						Get AI-powered workout programs, progress tracking, and more
					</p>
					<Link href="/signup">
						<Button size="lg">Start Free Trial</Button>
					</Link>
				</div>
			</main>
		</div>
	);
}
