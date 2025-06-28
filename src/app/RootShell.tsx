'use client';

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const initial = stored === 'light' || stored === 'dark' ? stored : 'dark';
    setTheme(initial as 'light' | 'dark');
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const navItems = [
    { label: "About", href: "/About" },
    { label: "Project", href: "/Project" },
    { label: "Contact", href: "/Contact" },
    { label: "Chat", href: "/Chat" },
    { label: "Blog", href: "https://blog.nekocat.cc" },
  ];

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
    >
      <header className="w-full max-w-4xl mx-auto p-4 flex justify-between items-center text-blue-700 dark:text-[#98BAD2] font-bold text-xl relative">
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
              className="hover:underline"
            >
              {item.label}
            </Link>
          ))}
          <motion.button
            whileTap={{ rotate: 90 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-4 text-xl"
            aria-label="Toggle Theme"
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
          </motion.button>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-4">
          <motion.button
            whileTap={{ rotate: 90 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-xl"
            aria-label="Toggle Theme"
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
          </motion.button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none text-2xl"
            aria-label="Menu"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          {menuOpen && (
            <div className="absolute top-16 right-4 bg-white dark:bg-[#333348] text-black dark:text-white rounded-md shadow-lg py-2 px-4 z-50">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  className="block py-1 px-2 hover:bg-gray-200 dark:hover:bg-[#44445a] rounded-md"
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

      <hr className="w-[80%] border-t border-gray-500 my-4 mx-auto" />

      <footer className="w-full text-center text-sm text-gray-400 pb-4">
        © 2025 nekocat. All Rights Reserved.
      </footer>
    </div>
  );
}
