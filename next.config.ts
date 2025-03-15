import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

/*
import type { NextConfig } from "next";

import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // ignore Node.js core modules in client-side code
      config.resolve.fallback = {
        fs: false,
        child_process: false,
        "fs/promises": false,
        async_hooks: false,
      };
    }
    return config;
  },
};

export default withSentryConfig(nextConfig);
*/
