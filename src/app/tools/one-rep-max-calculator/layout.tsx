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
	authors: [{ name: "CompileStrength" }],
	creator: "CompileStrength",
	publisher: "CompileStrength",
	alternates: {
		canonical: "https://compilestrength.com/tools/one-rep-max-calculator",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://compilestrength.com/tools/one-rep-max-calculator",
		siteName: "CompileStrength",
		title: "One Rep Max Calculator | 1RM Strength Calculator - CompileStrength",
		description:
			"Calculate your one rep max (1RM) using multiple proven formulas. Free tool for powerlifters and strength athletes with Brzycki, Epley, and more formulas.",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "CompileStrength One Rep Max Calculator - 1RM Strength Tool",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "One Rep Max Calculator | 1RM Strength Calculator",
		description:
			"Calculate your one rep max (1RM) using multiple proven formulas. Free tool for powerlifters and strength athletes.",
		images: ["/logo.png"],
		creator: "@ultirequiem",
	},
};

export default function OneRepMaxCalculatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
