import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Understanding Progressive Overload: The Science Behind Muscle Growth",
	description:
		"Progressive overload is the fundamental principle of strength training. Learn the science behind why gradually increasing training demands is essential for continued muscle growth and strength gains.",
	keywords: [
		"progressive overload",
		"muscle growth",
		"hypertrophy",
		"strength training science",
		"training progression",
		"muscle adaptation",
	],
	openGraph: {
		title:
			"Understanding Progressive Overload: The Science Behind Muscle Growth",
		description:
			"Progressive overload is the fundamental principle of strength training. Learn the science behind why gradually increasing training demands is essential for continued muscle growth.",
		url: "https://compilestrength.com/blog/progressive-overload-science",
		images: ["/logo.png"],
		type: "article",
		publishedTime: "2024-11-14",
		authors: ["CompileStrength"],
	},
	twitter: {
		title:
			"Understanding Progressive Overload: The Science Behind Muscle Growth",
		description:
			"Progressive overload is the fundamental principle of strength training. Learn the science behind muscle adaptation.",
		images: ["/logo.png"],
		card: "summary_large_image",
	},
};

export default function ProgressiveOverloadBlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
