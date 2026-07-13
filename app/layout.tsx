import type { Metadata } from "next";
import { damase, instrumentSans, spaceMono } from "@/app/fonts";
import { CustomCursor } from "@/components/CustomCursor";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "(SW) — Product Designer",
  description:
    "Portfolio of a product designer. UX research, interface design, design systems, and shipped product work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${damase.variable} ${instrumentSans.variable} ${spaceMono.variable} bg-background antialiased`}
    >
      <body className="min-h-screen bg-background font-sans text-foreground">
        <CustomCursor />
        <Header />
        {children}
      </body>
    </html>
  );
}
