import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Adresse d'expédition. En attendant un domaine vérifié sur Resend,
// "onboarding@resend.dev" fonctionne pour les tests.
export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "FeuVert <onboarding@resend.dev>";
