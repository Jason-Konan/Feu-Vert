import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [adminClient()],
});

// signIn expose ici signIn.email(...) ET signIn.social({ provider: "google" }),
// exactement ce que les pages sign-in / sign-up utilisent déjà.
export const { signIn, signUp, signOut, useSession } = authClient;
