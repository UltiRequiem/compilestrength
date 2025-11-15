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
	openGraph: {
		title: "FFMI Calculator - Fat Free Mass Index | Natural Limit Assessment",
		description:
			"Calculate your Fat-Free Mass Index (FFMI) to assess muscle development and natural genetic potential. Free tool with scientific explanations.",
		url: "https://compilestrength.com/tools/ffmi-calculator",
		images: ["/logo.png"],
	},
	twitter: {
		title: "FFMI Calculator - Fat Free Mass Index | Natural Limit Assessment",
		description:
			"Calculate your Fat-Free Mass Index (FFMI) to assess muscle development and natural genetic potential.",
		images: ["/logo.png"],
	},
};

export default function FFMICalculatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
