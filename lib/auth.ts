import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { admin } from "better-auth/plugins";
import { resetPasswordEmail, verifyEmailEmail } from "@/lib/email/templates";
import { EMAIL_FROM, resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // Déclenché par authClient.forgetPassword() côté client.
    sendResetPassword: async ({ user, url }) => {
      const { subject, html } = resetPasswordEmail(url);
      await resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        subject,
        html,
      });
    },
  },
  emailVerification: {
    // Déclenché automatiquement à l'inscription (sendOnSignUp), ou
    // manuellement via authClient.sendVerificationEmail() (bouton "Renvoyer").
    sendVerificationEmail: async ({ user, url }) => {
      const { subject, html } = verifyEmailEmail(url);
      await resend.emails.send({
        from: EMAIL_FROM,
        to: user.email,
        subject,
        html,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    // La vérification n'est pas obligatoire pour se connecter : on la
    // rappelle simplement dans la section profil du dashboard.
  },
  plugins: [
    admin({
      // Un utilisateur qui s'inscrit via /sign-up reçoit toujours ce rôle —
      // aucun moyen de s'auto-attribuer "admin" par l'inscription publique.
      defaultRole: "user",

      // Filet de sécurité : ces IDs sont TOUJOURS traités comme admin,
      // quoi que dise la colonne `role` en base. Rempli à l'étape 4.
      adminUserIds:
        process.env.ADMIN_USER_IDS?.split(",").filter(Boolean) ?? [],
    }),
  ],
  trustedOrigins: [
    "http://localhost:3000",
    "https://feu-vert.vercel.app", // votre domaine de production
  ],
});
