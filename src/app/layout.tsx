import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserPreferencesStoreProvider } from "@/providers/user-preferences-store-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "CompileStrength - Science-Based Training Programs",
	description:
		"AI-powered workout programming for evidence-based lifters. Train smarter with personalized programs built on exercise science.",
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
			</body>
		</html>
	);
}
