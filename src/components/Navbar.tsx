"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "@/lib/simple-i18n";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslations();

  const navItems = [
    { href: "/", label: t("navigation.home") },
    { href: "/analyze", label: t("navigation.analyze") },
    { href: "/service", label: t("navigation.service") },
    { href: "/guide", label: t("navigation.guide") },
    { href: "/blog", label: t("navigation.blog") },
  ];

  return (
    <header className="bg-white/98 backdrop-blur-lg border-b border-blue-100/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-fredoka text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              Who&apos;s your papa AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      font-montserrat flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25" 
                        : "text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-100">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      font-montserrat flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full
                      ${isActive 
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg" 
                        : "text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {/* Mobile Language Switcher */}
            <div className="mt-4 pt-4 border-t border-blue-100">
              <div className="px-4">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}