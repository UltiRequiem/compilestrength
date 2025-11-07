import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const weatherTool = createTool({
	id: "get-weather",
	description: "Get current weather for a location",
	inputSchema: z.object({
		location: z.string().describe("City name"),
	}),
	outputSchema: z.object({
		temperature: z.number(),
		feelsLike: z.number(),
		humidity: z.number(),
		windSpeed: z.number(),
		windGust: z.number(),
		conditions: z.string(),
		location: z.string(),
	}),
	execute: async ({ context }) => {
		return await getWeather(context.location);
	},
});

const getWeather = async (location: string) => {
	return {
		temperature: 22,
		feelsLike: 22,
		humidity: 22,
		windSpeed: 22,
		windGust: 22,
		conditions: "Clear sky",
		location: location,
	};
};
