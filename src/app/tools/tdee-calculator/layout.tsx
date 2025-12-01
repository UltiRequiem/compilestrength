import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "TDEE Calculator | Total Daily Energy Expenditure - CompileStrength",
	description:
		"Calculate your Total Daily Energy Expenditure (TDEE) for accurate calorie and macro planning. Free tool with multiple activity levels and cutting/bulking recommendations.",
	keywords: [
		"TDEE calculator",
		"total daily energy expenditure",
		"calorie calculator",
		"BMR calculator",
		"cutting calories",
		"bulking calories",
		"maintenance calories",
	],
	authors: [{ name: "CompileStrength" }],
	creator: "CompileStrength",
	publisher: "CompileStrength",
	alternates: {
		canonical: "https://compilestrength.com/tools/tdee-calculator",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://compilestrength.com/tools/tdee-calculator",
		siteName: "CompileStrength",
		title: "TDEE Calculator | Total Daily Energy Expenditure - CompileStrength",
		description:
			"Calculate your Total Daily Energy Expenditure (TDEE) for accurate calorie and macro planning. Free tool with multiple activity levels and cutting/bulking recommendations.",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "CompileStrength TDEE Calculator - Total Daily Energy Expenditure",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "TDEE Calculator | Total Daily Energy Expenditure",
		description:
			"Calculate your Total Daily Energy Expenditure (TDEE) for accurate calorie and macro planning.",
		images: ["/logo.png"],
		creator: "@ultirequiem",
	},
};

export default function TDEECalculatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
