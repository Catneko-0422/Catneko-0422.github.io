// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import RootShell from "./RootShell";

export const metadata: Metadata = {
  title: "Catneko-0422",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
