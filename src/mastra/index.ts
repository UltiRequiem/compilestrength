import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";

import { weatherAgent } from "./agents/weather-agent";

const mastraConfig = {
	agents: { weatherAgent },
	storage: new LibSQLStore({
		url: ":memory:",
	}),
	logger: new PinoLogger({
		name: "Mastra",
		level: "info",
	}),
	telemetry: {
		enabled: false,
	},
	observability: {
		default: { enabled: true },
	},
};

// Singleton pattern to prevent multiple Mastra instances during HMR
const globalForMastra = globalThis as unknown as {
	mastra: ReturnType<typeof createMastra> | undefined;
};

function createMastra() {
	return new Mastra(mastraConfig);
}

export const mastra = globalForMastra.mastra ?? createMastra();

if (process.env.NODE_ENV !== "production") globalForMastra.mastra = mastra;
