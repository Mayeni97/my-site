import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

// The project intentionally uses .env.example for local development.
// Next.js does not load that filename automatically, so populate process.env
// before the application starts. Production deployments keep using their
// platform-provided environment variables.
if (process.env.NODE_ENV !== "production") {
  const envExamplePath = path.join(process.cwd(), ".env.example");

  if (fs.existsSync(envExamplePath)) {
    const lines = fs.readFileSync(envExamplePath, "utf8").split(/\r?\n/);

    for (const line of lines) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!match) continue;

      const [, key, rawValue] = match;
      const value = rawValue.replace(/^(['"])(.*)\1$/, "$2");

      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

const nextConfig: NextConfig = {};

export default nextConfig;
