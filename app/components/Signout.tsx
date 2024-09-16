import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@mantine/core";

export function SignOutButton() {
  const { signOut } = useAuthActions();
  return <Button onClick={() => void signOut()}>Sign out</Button>;
}
