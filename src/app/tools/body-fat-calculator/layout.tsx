import type { Metadata } from "next";

export const metadata: Metadata = {
	title:
		"Body Fat Percentage Calculator | Navy & Army Method - CompileStrength",
	description:
		"Calculate your body fat percentage using US Navy and Army formulas. Free tool with circumference measurements for accurate body composition assessment.",
	keywords: [
		"body fat calculator",
		"body fat percentage",
		"Navy method",
		"Army method",
		"body composition",
		"circumference measurements",
		"lean mass calculator",
	],
	openGraph: {
		title: "Body Fat Percentage Calculator | Navy & Army Method",
		description:
			"Calculate your body fat percentage using US Navy and Army formulas. Free tool with circumference measurements for accurate assessment.",
		url: "https://compilestrength.com/tools/body-fat-calculator",
		images: ["/logo.png"],
	},
	twitter: {
		title: "Body Fat Percentage Calculator | Navy & Army Method",
		description:
			"Calculate your body fat percentage using US Navy and Army formulas with circumference measurements.",
		images: ["/logo.png"],
	},
};

export default function BodyFatCalculatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
