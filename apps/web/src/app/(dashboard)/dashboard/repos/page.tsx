import { Card, Typography } from "@heroui/react";
import { AddRepoForm } from "@web/components/repos/add-repo-form";
import { ReposTable } from "@web/components/repos/table";
import { getRepos } from "@web/lib/data/repos";

export default async function ReposPage() {
  const { repos } = await getRepos();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Typography type="h1">Repositories</Typography>
        <Typography color="muted">
          Repositories you're watching for new releases.
        </Typography>
      </div>

      <AddRepoForm />

      <Card>
        <Card.Header>
          <Card.Title>Watched Repositories</Card.Title>
          <Card.Description>
            You'll receive notifications when these repositories publish new
            releases.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <ReposTable initialRepos={repos} />
        </Card.Content>
      </Card>
    </div>
  );
}
