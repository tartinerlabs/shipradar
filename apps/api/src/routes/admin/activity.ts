import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import * as z from "zod";
import type { AuthEnv } from "../../middleware/auth";

const app = new Hono<AuthEnv>().basePath("/activity").get(
  "/",
  zValidator(
    "query",
    z.object({
      limit: z.coerce.number().int().min(1).max(100).default(50),
      offset: z.coerce.number().int().min(0).default(0),
    }),
  ),
  async (c) => {
    const { limit, offset } = c.req.valid("query");

    // Better Auth sessions live in Redis secondary storage, not Postgres.
    return c.json({ activity: [], limit, offset });
  },
);

export default app;
