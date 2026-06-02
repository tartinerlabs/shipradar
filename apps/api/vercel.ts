import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  buildCommand: "pnpm build",
  outputDirectory: ".output",
  // Temporary disabled due to Vercel Hobby account
  // crons: [
  //   {
  //     path: "/internal/release-check",
  //     schedule: "*/15 * * * *",
  //   },
  // ],
};
