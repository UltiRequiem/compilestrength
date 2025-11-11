import { fileURLToPath } from "node:url";
import createJiti from "jiti";
import type { NextConfig } from "next";

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti("./src/env");

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();
