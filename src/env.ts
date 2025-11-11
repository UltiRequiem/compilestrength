import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		OPENAI_API_KEY: z.string().min(1).optional(),
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		LEMONSQUEEZY_API_KEY: z.string().min(1),
		LEMONSQUEEZY_STORE_ID: z.string().min(1),
		LEMONSQUEEZY_WEBHOOK_SECRET: z.string().min(1),
		LEMONSQUEEZY_WEBHOOK_URL: z.url().optional(),
	},
	client: {
		NEXT_PUBLIC_BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
	},
	runtimeEnv: {
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		DATABASE_URL: process.env.DATABASE_URL,
		LEMONSQUEEZY_API_KEY: process.env.LEMONSQUEEZY_API_KEY,
		LEMONSQUEEZY_STORE_ID: process.env.LEMONSQUEEZY_STORE_ID,
		LEMONSQUEEZY_WEBHOOK_SECRET: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
		LEMONSQUEEZY_WEBHOOK_URL: process.env.LEMONSQUEEZY_WEBHOOK_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
		NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
