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
	authors: [{ name: "CompileStrength" }],
	creator: "CompileStrength",
	publisher: "CompileStrength",
	alternates: {
		canonical: "https://compilestrength.com/tools/plate-calculator",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://compilestrength.com/tools/plate-calculator",
		siteName: "CompileStrength",
		title: "Plate Calculator | Barbell Loading Calculator - CompileStrength",
		description:
			"Calculate which plates to load on your barbell for any weight. Free tool supporting kg and lb plates with visual plate layout display.",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "CompileStrength Plate Calculator - Barbell Loading Tool",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Plate Calculator | Barbell Loading Calculator - CompileStrength",
		description:
			"Calculate which plates to load on your barbell for any weight. Free tool supporting kg and lb plates with visual display.",
		images: ["/logo.png"],
		creator: "@ultirequiem",
	},
};

export default function PlateCalculatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
