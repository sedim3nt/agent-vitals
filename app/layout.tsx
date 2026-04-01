import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Agent Vitals — Fleet Health Dashboard",
  description: "Mission control for your AI agent fleet. Real-time health, performance, and cost monitoring.",
  openGraph: {
    title: "Agent Vitals",
    description: "Mission control for your AI agent fleet",
    siteName: "Agent Vitals",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Nav />
        <main className="min-h-screen pt-14 w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
