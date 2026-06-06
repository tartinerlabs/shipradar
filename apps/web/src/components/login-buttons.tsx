"use client";

import { Button } from "@heroui/react";
import { signIn } from "@web/lib/auth-client";

export function LoginButtons() {
  const handleGitHubSignIn = () => {
    signIn.social({ provider: "github", callbackURL: "/dashboard" });
  };

  const handleGoogleSignIn = () => {
    signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" fullWidth onPress={handleGitHubSignIn}>
        Continue with GitHub
      </Button>
      <Button variant="outline" fullWidth onPress={handleGoogleSignIn}>
        Continue with Google
      </Button>
    </div>
  );
}
