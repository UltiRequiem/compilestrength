import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export default async function LandingPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			{/* Navbar */}
			<nav className="border-b border-zinc-800 px-6 py-4 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<Link href="/" className="flex items-center gap-2">
						<Image
							src="/logo.png"
							alt="CompileStrength Logo"
							width={32}
							height={32}
							className="object-contain"
						/>
						<span className="text-xl font-bold">
							<span className="text-blue-500">Compile</span>
							<span className="text-white">Strength</span>
						</span>
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

			{/* Hero Section */}
			<main className="max-w-7xl mx-auto px-6 py-20">
				<div className="text-center space-y-6">
					<h1 className="text-5xl md:text-7xl font-bold tracking-tight">
						Training Programs Built on
						<span className="text-blue-500 block mt-2">Exercise Science</span>
					</h1>
					<p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
						AI-powered programming designed for lifters who understand
						progressive overload, periodization, and evidence-based training
						principles.
					</p>
					<div className="flex gap-4 justify-center pt-8">
						<Link href="/signup">
							<Button size="lg" className="text-lg h-12 px-8">
								Start Free Trial
							</Button>
						</Link>
						<Link href="/tools">
							<Button size="lg" variant="outline" className="text-lg h-12 px-8">
								Free Training Tools
							</Button>
						</Link>
					</div>
				</div>

				{/* Features */}
				<div className="grid md:grid-cols-3 gap-8 mt-24">
					<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
						<h3 className="text-2xl font-bold mb-4 text-blue-500">
							AI Program Generator
						</h3>
						<p className="text-zinc-400 leading-relaxed">
							Create personalized training programs based on your experience
							level, training frequency, and goals. Built with periodization
							principles.
						</p>
					</div>
					<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
						<h3 className="text-2xl font-bold mb-4 text-blue-500">
							Progress Analytics
						</h3>
						<p className="text-zinc-400 leading-relaxed">
							Track your lifts, monitor progressive overload, and analyze
							performance trends with detailed metrics that matter.
						</p>
					</div>
					<div className="border border-zinc-800 p-8 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
						<h3 className="text-2xl font-bold mb-4 text-blue-500">
							Evidence-Based Tools
						</h3>
						<p className="text-zinc-400 leading-relaxed">
							Access calculators for FFMI, estimated 1RMs, and other metrics to
							make informed training decisions.
						</p>
					</div>
				</div>

				<div className="mt-24 border border-zinc-800 p-12 rounded-xl bg-zinc-900/50 text-center">
					<h2 className="text-4xl font-bold mb-4">Ready to Train Smarter?</h2>
					<p className="text-zinc-400 mb-8 text-lg">
						Join lifters who prioritize science-based programming. Start your
						7-day free trial.
					</p>
					<Link href="/signup">
						<Button size="lg" className="h-12 px-8 text-lg">
							Get Started
						</Button>
					</Link>
				</div>
			</main>
		</div>
	);
}
