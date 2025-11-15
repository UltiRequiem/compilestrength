"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export function Navbar() {
	const { data: session } = useSession();

	return (
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
	);
}
