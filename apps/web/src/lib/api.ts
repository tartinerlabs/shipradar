const API_DISABLED_ERROR = "API is temporarily disabled";

// TODO: Re-enable the Hono RPC client once the API package is healthy again.
export async function getApi() {
  throw new Error(API_DISABLED_ERROR);
}
