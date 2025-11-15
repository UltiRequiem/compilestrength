import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "One Rep Max Calculator | 1RM Strength Calculator - CompileStrength",
	description:
		"Calculate your one rep max (1RM) using multiple proven formulas. Free tool for powerlifters and strength athletes with Brzycki, Epley, and more formulas.",
	keywords: [
		"one rep max calculator",
		"1RM calculator",
		"max strength calculator",
		"powerlifting calculator",
		"strength testing tool",
		"Brzycki formula",
		"Epley formula",
	],
	openGraph: {
		title: "One Rep Max Calculator | 1RM Strength Calculator",
		description:
			"Calculate your one rep max (1RM) using multiple proven formulas. Free tool for powerlifters and strength athletes.",
		url: "https://compilestrength.com/tools/one-rep-max-calculator",
		images: ["/logo.png"],
	},
	twitter: {
		title: "One Rep Max Calculator | 1RM Strength Calculator",
		description:
			"Calculate your one rep max (1RM) using multiple proven formulas. Free tool for powerlifters and strength athletes.",
		images: ["/logo.png"],
	},
};

export default function OneRepMaxCalculatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
