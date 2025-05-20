// src/app/RootShell.tsx
'use client';

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "About", href: "/About" },
    { label: "Project", href: "/Project" },
    { label: "Contact", href: "/Contact" },
    { label: "Chat", href: "/Chat" },
    { label: "Blog", href: "https://blog.nekocat.cc" },
  ];

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#222229] text-white flex flex-col min-h-screen`}
    >
      <header className="w-full max-w-4xl mx-auto p-4 flex justify-between items-center text-[#98BAD2] font-bold text-xl">
        <Link href="/" className="text-2xl font-bold absolute top-6 left-15">
          nekocat.cc
        </Link>

        {/* Desktop Nav */}
        <nav className="space-x-15 absolute top-6 right-15 text-[24px]">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              className="hover:underline"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none text-2xl"
            aria-label="Menu"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          {menuOpen && (
            <div className="absolute top-16 right-4 bg-[#333348] text-white rounded-md shadow-lg py-2 px-4 z-50">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  className="block py-1 px-2 hover:bg-[#44445a] rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="w-full flex flex-col items-center mt-12 text-center flex-grow">
        {children}
      </main>

      <hr className="w-[80%] border-t border-gray-500 my-4 mx-auto" />

      <footer className="w-full text-center text-sm text-gray-400 pb-4">
        © 2025 nekocat. All Rights Reserved.
      </footer>
    </div>
  );
}
