"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-sm border-b-2 border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-3xl tracking-tight">
          <span className="text-white">TAP</span>
          <span className="text-[#B5FF4D]">POST</span>
          <span className="text-[#B5FF4D] ml-1">■</span>
        </Link>

        {/* Center nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {["FEATURES", "PRICING", "STORIES"].map((item) => (
            <Link
              key={item}
              href={item === "PRICING" ? "/pricing" : `/#${item.toLowerCase()}`}
              className="font-mono-custom text-sm text-white/50 nav-link hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/signup"
            className="cta-btn bg-[#B5FF4D] text-black font-mono-custom text-sm font-bold px-5 py-2 border-2 border-[#B5FF4D]"
          >
            <span>GET STARTED →</span>
          </Link>
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white/60 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-black border-t-2 border-white/10 px-6 py-4 flex flex-col gap-4">
          {["FEATURES", "PRICING", "STORIES"].map((item) => (
            <Link
              key={item}
              href={item === "PRICING" ? "/pricing" : `/#${item.toLowerCase()}`}
              className="font-mono-custom text-sm text-white/60 hover:text-[#B5FF4D] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
