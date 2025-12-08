/**
 * Debug utility for conditional logging in development mode
 * Logs are only shown when NODE_ENV is 'development' or 'test'
 */

const isDevelopment =
	process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

export const debug = {
	log: (...args: unknown[]) => {
		if (isDevelopment) {
			console.log(...args);
		}
	},
	error: (...args: unknown[]) => {
		if (isDevelopment) {
			console.error(...args);
		}
	},
	warn: (...args: unknown[]) => {
		if (isDevelopment) {
			console.warn(...args);
		}
	},
	info: (...args: unknown[]) => {
		if (isDevelopment) {
			console.info(...args);
		}
	},
};
