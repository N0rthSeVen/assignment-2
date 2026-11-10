import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: site.name, template: `%s | ${site.shortName}` },
  description: `Portfolio of ${site.name} — ${site.tagline}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <NavBar />
        <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">{children}</main>
        <footer className="border-t border-stone-200 py-6 text-center text-sm text-stone-500">
          © 2026 {site.name}
        </footer>
      </body>
    </html>
  );
}
