// app/admin/seo/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSiteSettings } from "@/lib/site-settings";
import SeoSettingsForm from "@/components/admin/seo-settings-form";

export default async function AdminSeoPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen bg-[#FBFAF7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1C1C1E]/10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#235C43]" />
            Panel Admin
          </div>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold text-[#1C1C1E]">
            Réglages SEO
          </h1>
          <p className="mt-1.5 text-sm text-[#6B7280]">
            Titre, description, mots-clés, logo et favicon affichés sur
            l&apos;ensemble du site.
          </p>
        </div>

        <SeoSettingsForm settings={settings} />
      </div>
    </main>
  );
}
