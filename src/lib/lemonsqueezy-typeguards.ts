/**
 * Type guards for LemonSqueezy webhook events
 */

export function webhookHasMeta(obj: unknown): obj is {
	meta: {
		event_name: string;
		custom_data?: {
			user_id: string;
		};
	};
} {
	return (
		typeof obj === "object" &&
		obj !== null &&
		"meta" in obj &&
		typeof obj.meta === "object" &&
		obj.meta !== null &&
		"event_name" in obj.meta
	);
}

export function webhookHasData(obj: unknown): obj is {
	data: {
		id: string;
		type: string;
		attributes: Record<string, unknown>;
	};
	meta: {
		event_name: string;
		custom_data?: {
			user_id: string;
		};
	};
} {
	return (
		webhookHasMeta(obj) &&
		"data" in obj &&
		typeof obj.data === "object" &&
		obj.data !== null &&
		"attributes" in obj.data
	);
}
