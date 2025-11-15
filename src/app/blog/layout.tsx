import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Evidence-Based Training Blog | CompileStrength",
	description:
		"Science-backed fitness articles on progressive overload, periodization, and evidence-based training methods for serious lifters.",
	keywords: [
		"evidence based training",
		"progressive overload",
		"periodization",
		"strength training science",
		"fitness research",
		"training blog",
	],
	openGraph: {
		title: "Evidence-Based Training Blog | CompileStrength",
		description:
			"Science-backed fitness articles on progressive overload, periodization, and evidence-based training methods for serious lifters.",
		url: "https://compilestrength.com/blog",
		images: ["/logo.png"],
	},
	twitter: {
		title: "Evidence-Based Training Blog | CompileStrength",
		description:
			"Science-backed fitness articles on progressive overload, periodization, and evidence-based training methods.",
		images: ["/logo.png"],
	},
};

export default function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
