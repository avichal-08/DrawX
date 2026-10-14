import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle for the Docker image (see apps/web/Dockerfile)
  ...(process.env.DOCKER_BUILD === "1" && {
    output: "standalone",
    outputFileTracingRoot: path.join(__dirname, "../../"),
  }),
    webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("@prisma/client");
    }
    return config;
  },
};

export default nextConfig;
