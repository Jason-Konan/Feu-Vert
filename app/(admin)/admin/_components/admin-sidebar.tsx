// app/admin/_components/admin-sidebar.tsx
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminSidebarContent } from "./admin-sidebar-content";

interface AdminSidebarProps {
  email: string;
}

export function AdminSidebar({ email }: AdminSidebarProps) {
  const [ouvert, setOuvert] = useState(false);

  return (
    <>
      {/* ------------------- DESKTOP : sidebar fixe ------------------- */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-[#1B1D1F] p-6 md:block">
        <AdminSidebarContent email={email} />
      </aside>

      {/* ------------------- MOBILE : barre + offcanvas ------------------- */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-[#1B1D1F] p-4 md:hidden">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Administration
        </p>

        <Sheet open={ouvert} onOpenChange={setOuvert}>
          <SheetTrigger className="text-slate-300 hover:bg-white/5 hover:text-white">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Ouvrir le menu d'administration</span>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-64 border-slate-800 bg-[#1B1D1F] p-6"
          >
            <SheetTitle className="sr-only">Menu d'administration</SheetTitle>
            <AdminSidebarContent
              email={email}
              onNavigate={() => setOuvert(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
