import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Script from "next/script";
import { getSiteSettings } from "@/lib/site-settings";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.title,
    description: settings.description,
    keywords: settings.keywords ?? undefined,
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
    openGraph: {
      title: settings.title,
      description: settings.description,
      images: settings.ogImageUrl ? [settings.ogImageUrl] : undefined,
    },
  };
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // React `cache()` dédoublonne cet appel avec celui fait dans
  // generateMetadata ci-dessus : une seule requête base par page rendue,
  // pas deux.
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
        <main className="flex-1">{children}</main>
        <Footer siteName={settings.siteName} logoUrl={settings.logoUrl} />
        <Script
          src="https://cdn.kkiapay.me/k.js"
          strategy="afterInteractive"
        />{" "}
      </body>
    </html>
  );
}
