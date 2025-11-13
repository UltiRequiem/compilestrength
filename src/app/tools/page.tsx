import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function ToolsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

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
			<main className="max-w-7xl mx-auto px-6 py-12">
				<div className="mb-12">
					<h1 className="text-4xl font-bold mb-4">Free Training Tools</h1>
					<p className="text-zinc-400 text-lg">
						Evidence-based calculators and utilities for optimal training
					</p>
				</div>

				{/* Calculators Section */}
				<div className="space-y-8">
					<div>
						<h2 className="text-2xl font-bold mb-4 text-blue-500">
							Calculators
						</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							<Link href="/tools/ffmi-calculator">
								<div className="border border-zinc-800 p-6 rounded-xl hover:bg-zinc-900 hover:border-blue-700 transition-all cursor-pointer">
									<h3 className="text-xl font-bold mb-2">FFMI Calculator</h3>
									<p className="text-zinc-400 text-sm">
										Calculate your Fat-Free Mass Index to assess muscle
										development
									</p>
								</div>
							</Link>

							{/* Placeholder for more tools */}
							<div className="border border-zinc-800 p-6 rounded-xl opacity-50">
								<h3 className="text-xl font-bold mb-2">One Rep Max</h3>
								<p className="text-zinc-400 text-sm">Coming soon...</p>
							</div>

							<div className="border border-zinc-800 p-6 rounded-xl opacity-50">
								<h3 className="text-xl font-bold mb-2">TDEE Calculator</h3>
								<p className="text-zinc-400 text-sm">Coming soon...</p>
							</div>

							<div className="border border-zinc-800 p-6 rounded-xl opacity-50">
								<h3 className="text-xl font-bold mb-2">Body Fat %</h3>
								<p className="text-zinc-400 text-sm">Coming soon...</p>
							</div>

							<div className="border border-zinc-800 p-6 rounded-xl opacity-50">
								<h3 className="text-xl font-bold mb-2">Plate Calculator</h3>
								<p className="text-zinc-400 text-sm">Coming soon...</p>
							</div>

							<div className="border border-zinc-800 p-6 rounded-xl opacity-50">
								<h3 className="text-xl font-bold mb-2">Macro Calculator</h3>
								<p className="text-zinc-400 text-sm">Coming soon...</p>
							</div>
						</div>
					</div>
				</div>

				{/* CTA - Only show if not logged in */}
				{!session && (
					<div className="mt-16 border border-zinc-800 p-12 rounded-xl bg-zinc-900/50 text-center">
						<h2 className="text-3xl font-bold mb-3">
							Want More Advanced Features?
						</h2>
						<p className="text-zinc-400 mb-6 text-lg">
							Get AI-powered program generation, progress tracking, and
							performance analytics
						</p>
						<Link href="/signup">
							<Button size="lg" className="h-12 px-8 text-lg">
								Start Free Trial
							</Button>
						</Link>
					</div>
				)}
			</main>
		</div>
	);
}
