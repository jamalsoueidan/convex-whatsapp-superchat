import { useAuthActions } from "@convex-dev/auth/react";

export function SignIn() {
  const { signIn } = useAuthActions();
  return (
    <button onClick={() => void signIn("facebook")}>Sign in with GitHub</button>
  );
}
