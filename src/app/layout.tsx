import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "sonner";
import { UserPreferencesStoreProvider } from "@/providers/user-preferences-store-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title:
		"CompileStrength - AI Workout Program Generator | Evidence-Based Training",
	description:
		"Generate personalized workout programs with AI. Science-based training for lifters who understand progressive overload and periodization. Start free trial.",
	keywords: [
		"workout program generator",
		"AI workout planner",
		"evidence based training",
		"progressive overload",
		"periodization",
		"strength training program",
		"science based fitness",
	],
	authors: [{ name: "CompileStrength" }],
	creator: "CompileStrength",
	publisher: "CompileStrength",
	metadataBase: new URL("https://compilestrength.com"),
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://compilestrength.com",
		siteName: "CompileStrength",
		title:
			"CompileStrength - AI Workout Program Generator | Evidence-Based Training",
		description:
			"Generate personalized workout programs with AI. Science-based training for lifters who understand progressive overload and periodization. Start free trial.",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "CompileStrength - AI Workout Program Generator",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title:
			"CompileStrength - AI Workout Program Generator | Evidence-Based Training",
		description:
			"Generate personalized workout programs with AI. Science-based training for lifters who understand progressive overload and periodization.",
		images: ["/logo.png"],
		creator: "@compilestrength",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className={inter.className}>
				<UserPreferencesStoreProvider>{children}</UserPreferencesStoreProvider>
				<Toaster />
			</body>
		</html>
	);
}
