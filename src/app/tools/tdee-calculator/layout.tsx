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
	openGraph: {
		title: "TDEE Calculator | Total Daily Energy Expenditure",
		description:
			"Calculate your Total Daily Energy Expenditure (TDEE) for accurate calorie and macro planning. Free tool with multiple activity levels.",
		url: "https://compilestrength.com/tools/tdee-calculator",
		images: ["/logo.png"],
	},
	twitter: {
		title: "TDEE Calculator | Total Daily Energy Expenditure",
		description:
			"Calculate your Total Daily Energy Expenditure (TDEE) for accurate calorie and macro planning.",
		images: ["/logo.png"],
	},
};

export default function TDEECalculatorLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
