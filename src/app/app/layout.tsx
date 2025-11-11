import { Suspense } from "react";
import { requireAuth } from "@/lib/auth-utils";
import { SubscriptionBanner } from "@/components/billing/subscription-banner";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Require authentication
	const session = await requireAuth();

	return (
		<>
			{/* Subscription Status Banner */}
			<Suspense fallback={null}>
				<SubscriptionBanner />
			</Suspense>

			{/* Main Content */}
			{children}
		</>
	);
}
