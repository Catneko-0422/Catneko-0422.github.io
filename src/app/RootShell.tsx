'use client';

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

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
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const themeIcon = mounted && resolvedTheme === 'dark' ? faSun : faMoon;

  const navItems = [
    { label: "About", href: "/about" },
    { label: "Project", href: "/project" },
    { label: "Contact", href: "/contact" },
    { label: "Chat", href: "/chat" },
    { label: "Blog", href: "https://blog.nekocat.cc" },
  ];

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
    >
      <header className="w-full max-w-4xl mx-auto p-4 flex justify-between items-center text-purple-700 dark:text-purple-300 font-bold text-xl relative">
        <Link href="/" className="text-2xl font-bold hover:underline">
          nekocat.cc
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-[20px] items-center">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              className="mizuki-link hover:text-purple-500 dark:hover:text-purple-300 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="ml-4 text-xl active:rotate-90 transition-transform duration-200"
            aria-label="Toggle Theme"
          >
            <FontAwesomeIcon icon={themeIcon} />
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="text-xl active:rotate-90 transition-transform duration-200"
            aria-label="Toggle Theme"
          >
            <FontAwesomeIcon icon={themeIcon} />
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none text-2xl"
            aria-label="Menu"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          {menuOpen && (
            <div className="absolute top-16 right-4 bg-popover dark:bg-popover text-popover-foreground dark:text-popover-foreground rounded-md shadow-lg py-2 px-4 z-50">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  className="block py-1 px-2 hover:bg-accent dark:hover:bg-accent rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="w-full flex flex-col items-center mt-1 text-center flex-grow">
        {children}
      </main>

      <hr className="w-[80%] border-t border-purple-200 dark:border-purple-800 my-4 mx-auto" />

      <footer className="w-full text-center text-sm text-purple-400 dark:text-purple-500 pb-4">
        © {new Date().getFullYear()} nekocat. All Rights Reserved.
      </footer>
    </div>
  );
}
