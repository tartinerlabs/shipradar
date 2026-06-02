// Extend the generated Env with secrets (not in wrangler.jsonc)
export type Env = Cloudflare.Env & {
  AI_GATEWAY_ID?: string;
  SENTRY_DSN?: string;
  POSTHOG_API_KEY?: string;
};
