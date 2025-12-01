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
	authors: [{ name: "CompileStrength" }],
	creator: "CompileStrength",
	publisher: "CompileStrength",
	alternates: {
		canonical: "https://compilestrength.com/tools/body-fat-calculator",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://compilestrength.com/tools/body-fat-calculator",
		siteName: "CompileStrength",
		title:
			"Body Fat Percentage Calculator | Navy & Army Method - CompileStrength",
		description:
			"Calculate your body fat percentage using US Navy and Army formulas. Free tool with circumference measurements for accurate body composition assessment.",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "CompileStrength Body Fat Calculator - Navy & Army Method",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Body Fat Percentage Calculator | Navy & Army Method",
		description:
			"Calculate your body fat percentage using US Navy and Army formulas with circumference measurements.",
		images: ["/logo.png"],
		creator: "@ultirequiem",
	},
};

export default function BodyFatCalculatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
