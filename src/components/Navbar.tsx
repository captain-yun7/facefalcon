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
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-12 h-12" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#1d4ed8' }} />
                  <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
                </linearGradient>
              </defs>
              <g transform="translate(0,1024) scale(0.1,-0.1)" fill="url(#logoGradient)">
                <path d="M4950 8669 c-514 -31 -1060 -192 -1495 -441 -832 -477 -1429 -1263 -1654 -2178 -68 -280 -94 -498 -94 -805 -1 -406 50 -727 175 -1100 295 -884 986 -1644 1846 -2030 329 -147 665 -237 1072 -287 163 -20 623 -17 790 5 822 110 1506 451 2070 1033 550 567 876 1282 951 2087 17 184 7 604 -19 772 -58 371 -157 693 -312 1010 -331 681 -887 1239 -1570 1579 -427 212 -859 326 -1347 356 -187 11 -225 11 -413 -1z"/>
              </g>
              <g transform="translate(0,1024) scale(0.1,-0.1)" fill="#ffffff">
                <path d="M5296 7390 c668 -54 1185 -283 1403 -620 39 -60 81 -170 81 -211 0 -11 10 -24 23 -29 250 -102 347 -160 467 -280 77 -76 103 -110 133 -172 49 -101 67 -182 67 -300 0 -160 -42 -310 -138 -492 -58 -110 -142 -231 -152 -219 -4 4 -19 46 -33 93 -14 47 -48 131 -76 187 l-50 101 -57 8 c-31 3 -134 4 -228 1 -147 -4 -188 -9 -288 -35 -299 -77 -465 -213 -542 -442 -34 -102 -42 -206 -23 -296 18 -82 41 -132 134 -282 83 -133 440 -719 578 -947 57 -93 137 -226 179 -295 l76 -125 -181 -3 c-157 -2 -185 0 -208 14 -53 35 -532 397 -691 523 l-165 131 -3 -336 -2 -335 -43 3 -42 3 -142 210 c-241 357 -433 639 -451 663 l-18 24 -132 -219 c-412 -686 -407 -678 -446 -681 l-36 -3 -2 623 -3 623 -59 -125 c-66 -137 -125 -254 -391 -772 l-179 -348 -33 0 -33 0 -2 702 -3 702 -190 -230 c-235 -283 -474 -564 -482 -564 -13 0 42 417 88 662 65 347 156 683 273 1006 210 578 453 1002 750 1310 49 50 85 92 80 92 -22 0 -240 139 -364 233 -125 94 -416 365 -462 429 l-19 28 954 0 c572 0 1006 -4 1083 -10z"/>
                <path d="M3850 7156 c0 -8 211 -132 305 -179 214 -106 487 -196 735 -241 208 -37 294 -45 575 -52 223 -6 258 -9 325 -30 392 -121 589 -173 692 -181 l81 -6 -7 39 c-21 114 -132 260 -265 348 -193 128 -425 213 -751 278 -113 22 -132 22 -902 26 -434 1 -788 1 -788 -2z"/>
                <path d="M4190 6452 c-95 -104 -236 -276 -265 -324 l-16 -28 767 0 c731 0 766 1 751 18 -37 41 -90 173 -100 252 l-11 80 -302 0 c-337 0 -443 12 -624 69 -52 17 -98 31 -102 31 -3 0 -47 -44 -98 -98z"/>
                <path d="M5560 6397 c0 -75 23 -129 80 -191 60 -65 118 -90 205 -90 52 0 81 6 111 22 77 40 144 138 144 211 0 20 -5 22 -55 25 -8 1 -25 -19 -37 -43 -30 -58 -65 -83 -125 -88 -37 -3 -57 1 -87 19 -57 33 -80 70 -86 136 l-5 57 -72 2 -73 2 0 -62z"/>
                <path d="M6505 6304 c-44 -41 -105 -95 -136 -120 l-56 -45 -7 -91 c-4 -56 -11 -95 -19 -100 -6 -4 -37 -8 -68 -8 -98 0 -570 -40 -663 -55 -471 -80 -892 -458 -1006 -903 -19 -76 -20 -109 -20 -643 l0 -562 181 303 182 304 23 -30 c13 -16 77 -110 141 -209 64 -99 162 -250 217 -335 l101 -155 5 262 5 262 125 -101 c69 -55 215 -171 325 -256 110 -86 264 -207 342 -269 78 -62 145 -113 148 -113 4 0 -1 12 -11 28 -22 33 -311 500 -567 917 -203 331 -296 510 -346 669 -18 54 -30 100 -29 101 2 2 68 47 148 100 177 119 435 248 613 307 l131 43 -262 3 c-144 1 -262 5 -262 8 0 4 18 39 40 79 39 71 41 72 86 79 77 10 667 7 772 -5 125 -13 267 -43 364 -75 85 -28 105 -48 154 -148 16 -31 31 -56 35 -56 19 0 44 151 44 260 0 260 -83 362 -441 539 -101 50 -189 91 -196 91 -7 -1 -49 -35 -93 -76z m176 -136 c22 -12 39 -28 39 -35 0 -11 -44 -109 -55 -121 -1 -1 -19 5 -41 14 -21 9 -54 22 -73 30 l-33 14 53 59 c30 33 58 60 63 60 4 1 26 -9 47 -21z"/>
                <path d="M3752 5823 c-11 -27 -54 -122 -95 -213 -93 -207 -190 -465 -261 -696 -52 -169 -126 -447 -126 -473 0 -6 48 48 108 122 59 73 175 215 257 315 l150 182 271 0 270 0 23 73 c90 278 263 508 537 714 l29 22 -571 0 -571 1 -21 -47z"/>
                <path d="M3825 4818 c-3 -7 -4 -222 -3 -478 l3 -465 79 170 c43 94 146 307 228 474 81 167 148 306 148 308 0 1 -101 3 -225 3 -171 0 -227 -3 -230 -12z"/>
              </g>
            </svg>
            <span className="font-fredoka text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              FaceFalcon
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
                      font-montserrat flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative
                      ${isActive 
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25" 
                        : "text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                      }
                    `}
                  >
                    {item.label}
                    {item.href === "/analyze" && (
                      <span 
                        className="inline-block px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse"
                        style={{
                          transform: 'rotate(-5deg)',
                        }}
                      >
                        Click
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <LanguageSwitcher />
          </div>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Analyze Quick Link */}
            <Link
              href="/analyze"
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all
                ${pathname === '/analyze' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' 
                  : 'bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
                }
              `}
            >
              {t("navigation.analyze")}
              <span 
                className="inline-block px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse"
                style={{
                  transform: 'rotate(-5deg)',
                  fontSize: '10px'
                }}
              >
                Click
              </span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
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
                      font-montserrat flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full relative
                      ${isActive 
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg" 
                        : "text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                      }
                    `}
                  >
                    {item.label}
                    {item.href === "/analyze" && (
                      <span 
                        className="inline-block px-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse"
                        style={{
                          transform: 'rotate(-5deg)',
                        }}
                      >
                        Click
                      </span>
                    )}
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