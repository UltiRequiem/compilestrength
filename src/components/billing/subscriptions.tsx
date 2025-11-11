import { eq, inArray } from "drizzle-orm";
import { getUserSubscriptions } from "@/app/actions/lemonsqueezy";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { SubscriptionCard } from "./subscription-card";

export async function Subscriptions() {
	const userSubscriptions = await getUserSubscriptions();

	if (userSubscriptions.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>No Active Subscription</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						You don't have any active subscriptions. Choose a plan below to get
						started.
					</p>
				</CardContent>
			</Card>
		);
	}

	// Get plan details for all subscriptions in a single query
	const planIds = userSubscriptions.map((sub) => sub.planId);
	const allPlans = await db
		.select()
		.from(plans)
		.where(inArray(plans.id, planIds));

	// Create a map of planId -> plan for fast lookup
	const planMap = new Map(allPlans.map((plan) => [plan.id, plan]));

	// Attach plan to each subscription
	const subscriptionsWithPlans = userSubscriptions.map((sub) => ({
		...sub,
		plan: planMap.get(sub.planId) || null,
	}));

	// Sort: active first, then on_trial, then others
	const sortedSubscriptions = subscriptionsWithPlans.sort((a, b) => {
		const statusOrder = {
			active: 1,
			on_trial: 2,
			paused: 3,
			past_due: 4,
			unpaid: 5,
			cancelled: 6,
			expired: 7,
		};
		return (
			(statusOrder[a.status as keyof typeof statusOrder] || 99) -
			(statusOrder[b.status as keyof typeof statusOrder] || 99)
		);
	});

	return (
		<div className="space-y-4">
			<h2 className="text-2xl font-bold">Your Subscriptions</h2>
			{sortedSubscriptions.map((subscription) => (
				<SubscriptionCard
					key={subscription.id}
					subscription={subscription}
					plan={subscription.plan}
				/>
			))}
		</div>
	);
}
