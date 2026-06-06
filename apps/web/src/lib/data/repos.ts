export interface Repo {
  id: string;
  repoName: string;
  lastNotifiedTag: string | null;
  paused: boolean;
  createdAt: string;
}

// TODO: Restore API-backed repository data once the API is healthy again.
export async function getRepos(): Promise<{ repos: Repo[] }> {
  return { repos: [] };
}
