"use server";

import type { Repo } from "@web/lib/data/repos";

const API_DISABLED_ERROR = "API is temporarily disabled";

// TODO: Restore API-backed repository creation once the API is healthy again.
export async function createRepo(_repoName: string): Promise<{ repo: Repo }> {
  throw new Error(API_DISABLED_ERROR);
}

// TODO: Restore API-backed repository deletion once the API is healthy again.
export async function deleteRepo(_id: string): Promise<{ success: true }> {
  throw new Error(API_DISABLED_ERROR);
}

// TODO: Restore API-backed repository pause toggling once the API is healthy again.
export async function toggleRepoPause(
  _id: string,
  _paused: boolean,
): Promise<{ repo: Repo }> {
  throw new Error(API_DISABLED_ERROR);
}
