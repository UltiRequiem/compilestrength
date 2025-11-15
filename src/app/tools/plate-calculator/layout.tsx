import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Plate Calculator | Barbell Loading Calculator - CompileStrength",
	description:
		"Calculate which plates to load on your barbell for any weight. Free tool supporting kg and lb plates with visual plate layout display.",
	keywords: [
		"plate calculator",
		"barbell calculator",
		"weight plate calculator",
		"gym plate calculator",
		"powerlifting plate calculator",
		"barbell loading",
	],
	openGraph: {
		title: "Plate Calculator | Barbell Loading Calculator",
		description:
			"Calculate which plates to load on your barbell for any weight. Free tool supporting kg and lb plates with visual display.",
		url: "https://compilestrength.com/tools/plate-calculator",
		images: ["/logo.png"],
	},
	twitter: {
		title: "Plate Calculator | Barbell Loading Calculator",
		description:
			"Calculate which plates to load on your barbell for any weight. Free tool supporting kg and lb plates.",
		images: ["/logo.png"],
	},
};

export default function PlateCalculatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
