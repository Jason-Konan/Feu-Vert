// app/admin/messages/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MessageSquare, User as UserIcon } from "lucide-react";

function obtenirInitiales(nom?: string | null, email?: string | null): string {
  if (nom) {
    const parties = nom.trim().split(/\s+/);
    const initiales = parties
      .slice(0, 2)
      .map((mot) => mot[0]?.toUpperCase())
      .join("");
    if (initiales) return initiales;
  }
  return email?.[0]?.toUpperCase() ?? "?";
}

function formaterDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminMessagesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });

  return (
    <main className="min-h-screen bg-[#FBFAF7] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* ── En-tête ── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1C1C1E]/10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#235C43]" />
              Panel Admin
            </div>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold text-[#1C1C1E]">
              Messages de contact
            </h1>
            <p className="mt-1.5 text-sm text-[#6B7280]">
              {messages.length} message{messages.length > 1 ? "s" : ""} reçu
              {messages.length > 1 ? "s" : ""} au total.
            </p>
          </div>
        </div>

        {/* ── Liste ── */}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#1C1C1E]/15 bg-white px-6 py-16 text-center">
            <MessageSquare className="h-8 w-8 text-[#6B7280]/50" />
            <p className="mt-3 text-sm font-medium text-[#1C1C1E]">
              Aucun message pour l&apos;instant
            </p>
            <p className="mt-1 text-sm text-[#6B7280]">
              Les messages envoyés depuis la page de contact apparaîtront ici.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="rounded-2xl border border-[#1C1C1E]/8 bg-white p-5 shadow-[3px_3px_0_rgba(0,0,0,0.04)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Auteur */}
                  <div className="flex items-center gap-3">
                    {msg.user ? (
                      <Avatar className="h-10 w-10 border border-[#1C1C1E]/10">
                        <AvatarImage
                          src={msg.user.image ?? undefined}
                          alt={msg.user.name ?? ""}
                        />
                        <AvatarFallback className="bg-[#1C1C1E] text-xs font-bold text-white">
                          {obtenirInitiales(msg.user.name, msg.user.email)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1C1C1E]/10 bg-[#F6F4EF]">
                        <UserIcon className="h-4 w-4 text-[#6B7280]" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-[#1C1C1E]">
                          {msg.name}
                        </p>
                        {msg.user ? (
                          <span className="rounded-full bg-[#235C43]/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#235C43]">
                            Compte lié
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#6B7280]/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">
                            Visiteur
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${msg.email}`}
                        className="flex items-center gap-1.5 text-xs text-[#6B7280] transition-colors hover:text-[#235C43]"
                      >
                        <Mail className="h-3 w-3" />
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  <time
                    dateTime={msg.createdAt.toISOString()}
                    className="shrink-0 text-xs text-[#6B7280]"
                  >
                    {formaterDate(msg.createdAt)}
                  </time>
                </div>

                {msg.subject && (
                  <p className="mt-4 text-sm font-bold text-[#1C1C1E]">
                    {msg.subject}
                  </p>
                )}
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-[#6B7280]">
                  {msg.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
