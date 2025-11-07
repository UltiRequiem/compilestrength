import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		OPENAI_API_KEY: z.string().min(1).optional(),
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.string().url(),
	},
	client: {},
	runtimeEnv: {
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		DATABASE_URL: process.env.DATABASE_URL,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
