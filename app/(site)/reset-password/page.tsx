// app/reset-password/page.tsx
import { Suspense } from "react";
import AuthShell from "@/components/site/auth-shell";
import ResetPasswordForm from "@/components/site/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense
        fallback={<p className="text-sm text-[#6B6552]">Chargement…</p>}
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
