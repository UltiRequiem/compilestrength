import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "FFMI Calculator - Fat Free Mass Index | Natural Limit Assessment",
	description:
		"Calculate your Fat-Free Mass Index (FFMI) to assess muscle development and natural genetic potential. Free tool with scientific explanations.",
	keywords: [
		"FFMI calculator",
		"fat free mass index",
		"natural muscle limit",
		"bodybuilding calculator",
		"muscle development assessment",
	],
	authors: [{ name: "CompileStrength" }],
	creator: "CompileStrength",
	publisher: "CompileStrength",
	alternates: {
		canonical: "https://compilestrength.com/tools/ffmi-calculator",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://compilestrength.com/tools/ffmi-calculator",
		siteName: "CompileStrength",
		title: "FFMI Calculator - Fat Free Mass Index | Natural Limit Assessment",
		description:
			"Calculate your Fat-Free Mass Index (FFMI) to assess muscle development and natural genetic potential. Free tool with scientific explanations.",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "CompileStrength FFMI Calculator - Fat Free Mass Index Tool",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "FFMI Calculator - Fat Free Mass Index | Natural Limit Assessment",
		description:
			"Calculate your Fat-Free Mass Index (FFMI) to assess muscle development and natural genetic potential.",
		images: ["/logo.png"],
		creator: "@ultirequiem",
	},
};

export default function FFMICalculatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
