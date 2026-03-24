import Link from "next/link";

const footerLinks = {
  PRODUCT: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "How It Works", href: "/#workflow" },
    { label: "Success Stories", href: "/#stories" },
  ],
  COMPANY: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  LEGAL: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refunds" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black border-t-2 border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo + tagline */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-display text-4xl">
                <span className="text-white">TAP</span>
                <span className="text-[#B5FF4D]">POST</span>
              </span>
              <div className="w-3 h-3 bg-[#B5FF4D]" />
            </div>
            <p className="font-mono-custom text-white/30 text-xs leading-relaxed">
              AI poster & caption agent for bars and pubs. Generate. Post. Fill seats.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-mono-custom text-xs text-white/20 tracking-widest uppercase mb-4">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-mono-custom text-sm text-white/50 hover:text-[#B5FF4D] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono-custom text-xs text-white/20">
            © {new Date().getFullYear()} TapPost. All rights reserved.
          </p>
          <p className="font-mono-custom text-xs text-white/20">
            Built for bars. Powered by AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
