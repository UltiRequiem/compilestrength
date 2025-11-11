import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";
import { env } from "@/env";

/**
 * Ensures that required environment variables are set and sets up the Lemon
 * Squeezy JS SDK. Throws an error if any environment variables are missing or
 * if there's an error setting up the SDK.
 */
export function configureLemonSqueezy() {
	const apiKey = env.LEMONSQUEEZY_API_KEY;

	if (!apiKey) {
		throw new Error(
			"Missing required LEMONSQUEEZY_API_KEY. Please set it in your .env file.",
		);
	}

	lemonSqueezySetup({
		apiKey,
		onError: (error) => {
			console.error("LemonSqueezy API Error:", error);
			throw new Error(`LemonSqueezy API error: ${error.message}`);
		},
	});
}
