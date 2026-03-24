"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, ChevronDown } from "lucide-react";


/* ─── Pricing Tiers ─── */
const tiers = [
  {
    name: "FREE TRIAL",
    price: "$0",
    period: "7 days",
    desc: "Full product access. No credit card.",
    featured: false,
    badge: null,
    cta: "START FREE TRIAL",
    href: "/signup",
    color: "border-white/10",
  },
  {
    name: "STARTER",
    price: "$29",
    period: "/ month",
    desc: "For bars that post consistently.",
    featured: false,
    badge: null,
    cta: "GET STARTED",
    href: "/signup",
    color: "border-white/10",
  },
  {
    name: "PRO",
    price: "$79",
    period: "/ month",
    desc: "For bars that want to dominate the feed.",
    featured: true,
    badge: "MOST POPULAR",
    cta: "GO PRO",
    href: "/signup",
    color: "border-[#B5FF4D]",
  },
  {
    name: "MULTI-VENUE",
    price: "$199",
    period: "/ month",
    desc: "For groups running 2–5 locations.",
    featured: false,
    badge: null,
    cta: "CONTACT SALES",
    href: "/contact",
    color: "border-white/10",
  },
];

/* ─── Feature Matrix ─── */
const featureRows = [
  { feature: "Specials input", trial: true, starter: true, pro: true, multi: true },
  { feature: "AI poster generation", trial: true, starter: true, pro: true, multi: true },
  { feature: "All 6 platform captions", trial: true, starter: true, pro: true, multi: true },
  { feature: "ZIP download pack", trial: true, starter: true, pro: true, multi: true },
  { feature: "Unlimited generations", trial: false, starter: true, pro: true, multi: true },
  { feature: "Brand profile (saved)", trial: false, starter: true, pro: true, multi: true },
  { feature: "History & re-downloads", trial: false, starter: true, pro: true, multi: true },
  { feature: "Analytics dashboard", trial: false, starter: false, pro: true, multi: true },
  { feature: "Instagram auto-posting", trial: false, starter: false, pro: true, multi: true },
  { feature: "Custom brand controls", trial: false, starter: false, pro: true, multi: true },
  { feature: "Multi-tone A/B captions", trial: false, starter: false, pro: true, multi: true },
  { feature: "Multi-location (up to 5)", trial: false, starter: false, pro: false, multi: true },
  { feature: "Bulk post to all locations", trial: false, starter: false, pro: false, multi: true },
  { feature: "Unified analytics view", trial: false, starter: false, pro: false, multi: true },
  { feature: "Priority support", trial: false, starter: true, pro: true, multi: true },
  { feature: "Dedicated CSM", trial: false, starter: false, pro: false, multi: true },
];

/* ─── FAQ ─── */
const faqs = [
  {
    q: "Do I need a credit card to start?",
    a: "No. Your 7-day free trial is completely free with no card required. You only enter payment details when you choose to subscribe.",
  },
  {
    q: "What happens after my trial ends?",
    a: "Your account is paused and you'll be prompted to upgrade. Your specials and generated content are saved for 30 days so nothing is lost.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your settings dashboard at any time. No cancellation fees, no questions asked.",
  },
  {
    q: "How does the AI generate the poster?",
    a: "GPT-4o writes your captions and creates a detailed image prompt from your brand inputs. Nano-BaNana 2 then generates the actual poster and story card images.",
  },
  {
    q: "What does the ZIP download contain?",
    a: "You get a ZIP with platform-specific folders: Instagram Feed, Instagram Story, Facebook, TikTok, and Other. Each folder has the resized image and a caption text file.",
  },
  {
    q: "Can I use my own photos?",
    a: "Yes. You can upload a food or bar photo during the generation step and it will be incorporated into the poster design.",
  },
  {
    q: "Is Instagram auto-posting available on all plans?",
    a: "Auto-posting is a Pro and Multi-Venue feature. Starter users can download the ZIP and post manually — it takes about 30 seconds.",
  },
  {
    q: "How does Multi-Venue work?",
    a: "You can manage up to 5 bar locations from one dashboard. Each location has its own brand profile, specials, and generation history. Bulk-post to all locations at once.",
  },
];

/* ─── FAQ Accordion Item ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border-2 transition-colors cursor-pointer ${open ? "border-[#B5FF4D] border-l-4 border-l-[#B5FF4D]" : "border-white/10"}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between p-6 gap-4">
        <h3 className="font-display text-2xl text-white">{q}</h3>
        <ChevronDown
          size={20}
          className={`text-white/40 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </div>
      {open && (
        <div className="px-6 pb-6 border-t border-white/10">
          <p className="font-mono-custom text-sm text-white/50 leading-relaxed pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Icon helper ─── */
function TierIcon({ included }: { included: boolean }) {
  if (included) return <Check size={16} className="text-[#B5FF4D] mx-auto" strokeWidth={3} />;
  return <X size={16} className="text-white/20 mx-auto" />;
}

export default function PricingPage() {
  return (
    <div className="bg-black min-h-screen">

      {/* ── HEADER ─────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <span className="font-mono-custom text-[#B5FF4D] text-xs tracking-widest uppercase block mb-6">
          PRICING
        </span>
        <h1
          className="font-display text-white leading-[0.85] mb-6"
          style={{ fontSize: "clamp(3rem, 8vw, 10rem)" }}
        >
          NO HIDDEN FEES.<br />NO BULLSH*T.
        </h1>
        <p className="font-mono-custom text-white/60 text-sm">
          Start free for 7 days. No credit card. Cancel anytime.
        </p>
      </section>

      {/* ── PRICING GRID ───────────────────────────────────── */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-white/10">
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`relative flex flex-col gap-6 p-10 border-b-2 lg:border-b-0 border-white/10 ${i < 3 ? "lg:border-r-2" : ""} ${tier.featured ? "bg-[#B5FF4D]/5 border-[#B5FF4D] border-2" : ""}`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-[#B5FF4D] text-black font-mono-custom text-xs px-3 py-1">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div>
                <p className="font-mono-custom text-xs text-white/30 tracking-widest uppercase mb-2">
                  {tier.name}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-6xl text-white">{tier.price}</span>
                  <span className="font-mono-custom text-sm text-white/30">{tier.period}</span>
                </div>
                <p className="font-mono-custom text-xs text-white/40 mt-2">{tier.desc}</p>
              </div>

              {/* Feature list */}
              <ul className="flex flex-col gap-3 flex-1">
                {featureRows
                  .filter((_, idx) => idx < 8) // Show first 8 in cards
                  .map((row) => {
                    const vals = [row.trial, row.starter, row.pro, row.multi];
                    const included = vals[i];
                    return (
                      <li key={row.feature} className="flex items-center gap-3">
                        {included ? (
                          <div className="w-4 h-4 bg-[#B5FF4D] flex items-center justify-center flex-shrink-0">
                            <Check size={10} className="text-black" strokeWidth={3} />
                          </div>
                        ) : (
                          <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                            <X size={12} className="text-white/20" />
                          </div>
                        )}
                        <span className={`font-mono-custom text-xs ${included ? "text-white/60" : "text-white/20"}`}>
                          {row.feature}
                        </span>
                      </li>
                    );
                  })}
              </ul>

              <Link
                href={tier.href}
                className={`cta-btn w-full text-center font-display text-2xl py-4 border-2 block ${
                  tier.featured
                    ? "bg-[#B5FF4D] text-black border-[#B5FF4D]"
                    : "border-white/20 text-white"
                }`}
              >
                <span>{tier.cta} →</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURE COMPARISON TABLE ───────────────────────── */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto pb-24">
        <h2 className="font-display text-white text-5xl lg:text-6xl leading-[0.85] mb-12">
          FULL FEATURE COMPARISON.
        </h2>

        <div className="border-2 border-white/10 overflow-x-auto">
          {/* Header */}
          <div className="grid grid-cols-5 bg-[#111111] border-b-2 border-white/10">
            <div className="p-4 border-r border-white/10">
              <span className="font-mono-custom text-xs text-white/20 tracking-widest uppercase">
                FEATURE
              </span>
            </div>
            {["TRIAL", "STARTER", "PRO", "MULTI"].map((t) => (
              <div key={t} className="p-4 text-center border-r last:border-r-0 border-white/10">
                <span className="font-mono-custom text-xs text-white/40 tracking-widest uppercase">
                  {t}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {featureRows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-5 border-b border-white/10 last:border-b-0 ${i % 2 === 0 ? "bg-black" : "bg-[#111111]"}`}
            >
              <div className="p-4 border-r border-white/10">
                <span className="font-mono-custom text-sm text-white/60">{row.feature}</span>
              </div>
              {[row.trial, row.starter, row.pro, row.multi].map((val, j) => (
                <div key={j} className="p-4 flex items-center justify-center border-r last:border-r-0 border-white/10">
                  <TierIcon included={val} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="px-6 lg:px-12 max-w-7xl mx-auto pb-24">
        <h2 className="font-display text-white text-5xl lg:text-6xl leading-[0.85] mb-12">
          QUESTIONS?
        </h2>
        <div className="flex flex-col gap-0">
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ─────────────────────────────────────── */}
      <section className="bg-[#B5FF4D] py-24 text-center px-6">
        <h2
          className="font-display text-black leading-[0.85] mb-8"
          style={{ fontSize: "clamp(2.5rem, 6vw, 8rem)" }}
        >
          READY TO FILL<br />YOUR BAR?
        </h2>
        <Link
          href="/signup"
          className="cta-btn inline-block bg-black text-[#B5FF4D] font-display text-3xl px-12 py-5 border-2 border-black hover:bg-transparent hover:text-black"
        >
          <span>START FREE — 7 DAYS →</span>
        </Link>
      </section>

    </div>
  );
}
