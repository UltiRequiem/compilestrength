"use server";

import { mastra } from "../../mastra";

export async function getWeatherInfo(formData: FormData) {
	const city = formData.get("city")?.toString();
	const agent = mastra.getAgent("weatherAgent");

	mastra.getLogger().info(`Fetching weather info for city: ${city}`);

	const result = await agent.generate(`What's the weather like in ${city}?`);

	return result.text ?? "bruh";
}
