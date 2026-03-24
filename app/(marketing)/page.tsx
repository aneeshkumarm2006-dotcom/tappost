"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Check,
  Instagram,
  Facebook,
  Music2,
  Triangle,
  Search,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const els = entry.target.querySelectorAll(
              ".reveal-up, .feat-item, .stat-card"
            );
            els.forEach((el, i) => {
              setTimeout(() => el.classList.add("show"), i * 100);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = ref.current?.querySelectorAll("[data-reveal]") ?? [];
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ─── Phone Mockup ─── */
function PhoneMockup() {
  return (
    <div className="relative flex justify-center items-center pr-6">
      {/* Glow */}
      <div className="absolute inset-0 bg-[#B5FF4D]/10 blur-[100px] scale-90 pointer-events-none" />
      {/* Phone frame */}
      <div
        className="relative w-64 xl:w-80 bg-[#111111] border-[6px] border-white/20 shadow-[12px_12px_0_#B5FF4D]"
        style={{ aspectRatio: "9/15" }}
      >
        {/* Status bar */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-white/10">
          <span className="font-mono-custom text-[9px] text-white/40">9:41</span>
          <div className="w-12 h-1.5 bg-white/10" />
        </div>

        {/* IG post header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10">
          <div className="w-8 h-8 bg-[#B5FF4D]/20 border border-[#B5FF4D] flex items-center justify-center flex-shrink-0">
            <span className="font-display text-[8px] text-[#B5FF4D]">TP</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-mono-custom text-[10px] text-white font-bold">the_rusty_nail</div>
            <div className="font-mono-custom text-[8px] text-white/30">Sponsored · Dublin, IE</div>
          </div>
          <span className="font-mono-custom text-[10px] text-white/30">···</span>
        </div>

        {/* 1:1 Square post image */}
        <div
          className="relative bg-black border-b border-white/10 overflow-hidden"
          style={{ aspectRatio: "1/1" }}
        >
          {/* Background texture */}
          <div className="absolute inset-0 grid-bg opacity-60" />
          {/* Badge */}
          <div className="absolute top-3 right-3 bg-[#B5FF4D] px-2 py-1 z-10">
            <span className="font-mono-custom text-[8px] text-black font-bold">NEW POST ↗</span>
          </div>
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center p-5 gap-2">
            <span className="font-mono-custom text-[8px] text-[#B5FF4D]/60 tracking-widest uppercase">TONIGHT ONLY</span>
            <p className="font-display text-[#B5FF4D] italic leading-tight" style={{ fontSize: "clamp(1rem, 4vw, 1.8rem)" }}>
              Happy Hour<br />$5 Mules
            </p>
            <div className="w-10 h-0.5 bg-[#B5FF4D]" />
            <p className="font-display text-white leading-tight" style={{ fontSize: "clamp(0.9rem, 3.5vw, 1.5rem)" }}>
              WED &amp; THU<br />5PM – 8PM
            </p>
            <div className="mt-1 border border-[#B5FF4D]/30 px-2 py-1 w-fit">
              <span className="font-mono-custom text-[7px] text-[#B5FF4D]/60 tracking-widest">THE RUSTY NAIL</span>
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="px-3 pt-2 pb-1">
          <p className="font-mono-custom text-[8px] text-white/40 leading-relaxed">
            Happy hour hits different 🍹 $5 Moscow Mules every Wed &amp; Thu. Don&apos;t miss it — tag a friend!
          </p>
        </div>

        {/* IG actions */}
        <div className="flex items-center gap-4 px-3 py-2 border-t border-white/5">
          {["♡", "💬", "⤴"].map((icon) => (
            <span key={icon} className="text-sm text-white/30">{icon}</span>
          ))}
          <div className="ml-auto w-4 h-4 bg-[#B5FF4D]/20 border border-[#B5FF4D]/40" />
        </div>
      </div>
    </div>
  );
}

/* ─── Platform Grid ─── */
const platforms = [
  { name: "INSTAGRAM", icon: Instagram },
  { name: "FACEBOOK", icon: Facebook },
  { name: "TIKTOK", icon: Music2 },
  { name: "GOOGLE", icon: Search },
  { name: "SMS", icon: MessageSquare },
  { name: "TWITTER/X", icon: Triangle },
];

/* ─── Steps ─── */
const steps = [
  {
    num: "01",
    title: "ADD YOUR SPECIALS",
    body: "Drop in tonight's deals — name, price, time window. Takes 30 seconds.",
  },
  {
    num: "02",
    title: "TUNE YOUR BRAND",
    body: "Select your tone, vibe, logo, brand color. TapPost learns your bar.",
  },
  {
    num: "03",
    title: "AI GENERATES EVERYTHING",
    body: "GPT-4o writes your captions. Nano-BaNana 2 designs your poster.",
  },
  {
    num: "04",
    title: "DOWNLOAD & POST",
    body: "Get a ZIP with tailored content for every platform. One click, all done.",
  },
];

/* ─── Success Stories ─── */
const stories = [
  { stat: "+340%", label: "INSTAGRAM REACH", bar: "The Rusty Nail, Dublin" },
  { stat: "12X", label: "FASTER THAN CANVA", bar: "Neon Tap Room, Austin" },
  { stat: "0", label: "DESIGN SKILLS NEEDED", bar: "The Copper Still, London" },
  { stat: "$0", label: "EXTRA HIRE COST", bar: "Red Dog Saloon, NYC" },
];

/* ─── Pricing Tiers (Landing — 3 tiers) ─── */
const landingTiers = [
  {
    name: "FREE TRIAL",
    price: "$0",
    period: "7 days",
    desc: "Full access. No credit card.",
    features: [
      "Unlimited specials",
      "AI poster generation",
      "All 6 platforms",
      "Download pack (ZIP)",
      "7 captions per post",
    ],
    cta: "START FREE TRIAL",
    href: "/signup",
    featured: false,
    badge: null,
  },
  {
    name: "STARTER",
    price: "$29",
    period: "/ month",
    desc: "For bars that post consistently.",
    features: [
      "Everything in Trial",
      "Unlimited generations",
      "Brand profile saved",
      "History & re-downloads",
      "Priority support",
    ],
    cta: "GET STARTED",
    href: "/signup",
    featured: false,
    badge: null,
  },
  {
    name: "PRO",
    price: "$79",
    period: "/ month",
    desc: "For bars that want to dominate.",
    features: [
      "Everything in Starter",
      "Instagram auto-posting",
      "Analytics dashboard",
      "Custom brand controls",
      "Multi-tone A/B captions",
    ],
    cta: "GO PRO",
    href: "/signup",
    featured: true,
    badge: "MOST POPULAR",
  },
];

/* ─── Main Page ─── */
export default function LandingPage() {
  const pageRef = useScrollReveal();

  return (
    <div ref={pageRef} className="bg-black overflow-x-hidden">

      {/* ── 1. HERO ──────────────────────────────────────────── */}
      <section
        className="relative h-[100svh] overflow-hidden grid-bg flex items-center pt-16"
        id="features"
      >
        {/* Glow orb — behind phone on the right */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[500px] h-[500px] bg-[#B5FF4D]/8 blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* ── Left: Text ── */}
            <div className="lg:col-span-6 flex flex-col gap-4 pt-4">

              {/* Pre-tag */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-[#B5FF4D]" />
                <span className="font-mono-custom text-[#B5FF4D] text-xs tracking-widest uppercase">
                  AI AGENT FOR BARS &amp; PUBS
                </span>
              </div>

              {/* Headline — 4 lines per design spec */}
              <h1
                className="font-display leading-[0.9]"
                style={{ fontSize: "clamp(2.5rem, 5.5vw, 9rem)" }}
              >
                <span className="text-white block">STOP POSTING</span>
                <span className="text-white block">MANUALLY.</span>
                <span className="text-[#B5FF4D] block">START FILLING</span>
                <span className="text-[#B5FF4D] block">SEATS.</span>
              </h1>

              {/* Divider */}
              <div className="w-16 h-px bg-white/10" />

              {/* Sub-copy */}
              <p className="font-mono-custom text-white/50 text-sm leading-relaxed border-l-4 border-[#B5FF4D] pl-4 max-w-sm">
                TapPost turns your nightly specials into AI-generated posters
                and platform-optimised captions in under 2 minutes.
                No designer. No agency. Just results.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href="/signup"
                  className="cta-btn inline-flex items-center bg-[#B5FF4D] text-black font-display text-xl px-7 py-3 border-2 border-[#B5FF4D] hover:text-black"
                >
                  <span>START FREE →</span>
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 font-mono-custom text-sm text-white/40 hover:text-white transition-colors"
                >
                  <span>View pricing</span>
                  <span className="text-[#B5FF4D]">↓</span>
                </Link>
              </div>


            </div>

            {/* ── Right: Phone ── */}
            <div className="hidden lg:flex lg:col-span-6 justify-center items-center pr-4">
              <PhoneMockup />
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-10 bg-white/10" />
          <span className="font-mono-custom text-[10px] text-white/20 tracking-widest">SCROLL</span>
          <ChevronDown size={14} className="text-white/20" />
        </div>
      </section>

      {/* ── 2. TICKER ─────────────────────────────────────────── */}
      <section className="bg-[#B5FF4D] overflow-hidden py-5">
        <div className="ticker-track">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 pr-8 whitespace-nowrap">
              <span className="font-display text-black text-4xl lg:text-5xl">10 SECOND SETUP</span>
              <Sparkles size={24} className="text-black opacity-40 flex-shrink-0" />
              <span className="font-display text-black text-4xl lg:text-5xl">AI-WRITTEN CAPTIONS</span>
              <Sparkles size={24} className="text-black opacity-40 flex-shrink-0" />
              <span className="font-display text-black text-4xl lg:text-5xl">AUTO-POSTS TO INSTAGRAM</span>
              <Sparkles size={24} className="text-black opacity-40 flex-shrink-0" />
              <span className="font-display text-black text-4xl lg:text-5xl">DESIGNED FOR BARS</span>
              <Sparkles size={24} className="text-black opacity-40 flex-shrink-0" />
              <span className="font-display text-black text-4xl lg:text-5xl">ZERO DESIGN SKILLS</span>
              <Sparkles size={24} className="text-black opacity-40 flex-shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. FEATURE BLOCK 1 — Instagram ───────────────────── */}
      <section className="border-b-2 border-white/10" data-reveal>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left — mockup */}
          <div className="bg-zinc-950 grid-bg flex items-center justify-center p-16 lg:p-24 border-r-2 border-white/10">
            <div className="relative w-64" style={{ aspectRatio: "9/16" }}>
              <div className="w-full h-full border-4 border-white bg-[#111111] p-6 flex flex-col gap-4 relative">
                {/* Badge */}
                <div className="absolute -top-3 -right-3 bg-[#B5FF4D] px-3 py-1 z-10">
                  <span className="font-mono-custom text-[10px] text-black font-bold">NEW POST ↗</span>
                </div>
                {/* Content */}
                <div className="flex-1 flex flex-col justify-center gap-3">
                  <p className="font-display text-2xl text-white italic leading-tight reveal-up">
                    &ldquo;Friday Night Ribeye — Don&apos;t Miss It&rdquo;
                  </p>
                  <div className="w-12 h-1 bg-[#B5FF4D]" />
                  <p className="font-display text-4xl text-[#B5FF4D] leading-tight reveal-up">
                    $42 FULL CUT
                  </p>
                  <p className="font-mono-custom text-xs text-white/40 leading-relaxed reveal-up">
                    Fridays only · 6PM till it&apos;s gone<br />
                    Book your table now ↗
                  </p>
                </div>
                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-3">
                  <span className="font-mono-custom text-[9px] text-[#B5FF4D] tracking-widest">THE RUSTY NAIL · DUBLIN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — text */}
          <div className="bg-black p-12 lg:p-16 flex flex-col justify-center gap-6">
            <span className="inline-block bg-[#B5FF4D] text-black font-mono-custom text-xs px-3 py-1 reveal-up w-fit">
              INSTAGRAM NATIVE
            </span>
            <h2
              className="font-display text-white leading-[0.85] reveal-up"
              style={{ fontSize: "clamp(3rem, 7vw, 8rem)" }}
            >
              DESIGNED<br />FOR THE<br />FEED.
            </h2>
            <ul className="flex flex-col gap-3">
              {[
                "Story cards at perfect 9:16 ratio",
                "Feed posts at native 1:1 square",
                "Captions optimised per platform",
                "Brand color & logo embedded",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 feat-item">
                  <div className="w-5 h-5 bg-[#B5FF4D] flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-black" strokeWidth={3} />
                  </div>
                  <span className="font-display text-2xl text-white/60">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="font-mono-custom text-[#B5FF4D] text-sm hover:underline w-fit feat-item"
            >
              See full integration →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURE BLOCK 2 — Platform Coverage (White) ───── */}
      <section className="bg-white text-black border-b-2 border-black" data-reveal>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left text — fixed padding, no max-w restriction */}
          <div className="lg:col-span-4 px-8 lg:px-16 py-16 flex flex-col justify-center gap-6 border-b-2 lg:border-b-0 lg:border-r-2 border-black">
            <span className="font-mono-custom text-xs text-black/40 tracking-widest uppercase reveal-up">
              PLATFORM COVERAGE
            </span>
            <h2
              className="font-display text-black leading-[0.85] reveal-up"
              style={{ fontSize: "clamp(2.5rem, 4vw, 6rem)" }}
            >
              ONE DATA<br />DROP.<br />EVERY<br />ASSET.
            </h2>
            <p className="font-mono-custom text-black/50 text-sm leading-relaxed reveal-up">
              Enter your specials once. TapPost generates platform-specific
              images and captions for every channel simultaneously.
            </p>
            <Link
              href="/signup"
              className="cta-btn inline-block border-2 border-black text-black font-display text-xl px-6 py-3 w-fit hover:text-white"
            >
              <span>TRY IT FREE →</span>
            </Link>
          </div>

          {/* Right — platform grid stretches to fill full height */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="grid grid-cols-3 flex-1 h-full">
              {platforms.map(({ name, icon: Icon }) => (
                <div
                  key={name}
                  className="lime-hover border-2 border-black flex flex-col items-center justify-center gap-3 cursor-pointer py-16"
                >
                  <Icon size={40} strokeWidth={1.5} />
                  <span className="font-mono-custom text-xs font-bold tracking-widest">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. STATS ROW ─────────────────────────────────────── */}
      <section className="bg-black border-b-2 border-white/10" id="stories" data-reveal>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {[
            { val: "10S", label: "SETUP" },
            { val: "3X", label: "REACH" },
            { val: "0", label: "EXTRA STAFF" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`stat-card p-16 flex flex-col justify-center ${i < 2 ? "md:border-r-2 border-white/10" : ""} border-b-2 md:border-b-0 border-white/10`}
            >
              <div
                className="font-display text-[#B5FF4D] leading-[0.85]"
                style={{ fontSize: "clamp(5rem, 10vw, 12rem)" }}
              >
                {stat.val}
              </div>
              <div className="font-mono-custom text-white/30 text-sm mt-2">
                / {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. HOW IT WORKS ──────────────────────────────────── */}
      <section className="bg-zinc-950 grid-bg border-b-2 border-white/10" id="workflow" data-reveal>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          {/* Header */}
          <div className="mb-16 reveal-up">
            <span className="font-mono-custom text-[#B5FF4D] text-xs tracking-widest uppercase block mb-4">
              WORKFLOW
            </span>
            <h2
              className="font-display text-white leading-[0.85]"
              style={{ fontSize: "clamp(3rem, 7vw, 8rem)" }}
            >
              FOUR STEPS.<br />ZERO HEADACHES.
            </h2>
          </div>
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-2 border-white/10">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`lime-hover relative p-8 border-b-2 lg:border-b-0 border-white/10 ${i < 3 ? "lg:border-r-2" : ""} reveal-up cursor-pointer`}
              >
                {/* Ghost number */}
                <span className="absolute top-4 right-4 font-display text-8xl text-white/5 leading-none select-none">
                  {step.num}
                </span>
                <div className="font-display text-[#B5FF4D] text-5xl mb-4">{step.num}</div>
                <h3 className="font-display text-3xl text-white mb-3">{step.title}</h3>
                <p className="font-mono-custom text-white/40 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. SUCCESS STORIES ───────────────────────────────── */}
      <section className="bg-black border-b-2 border-white/10" data-reveal>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="mb-12 reveal-up">
            <span className="font-mono-custom text-[#B5FF4D] text-xs tracking-widest uppercase block mb-4">
              RESULTS
            </span>
            <h2
              className="font-display text-white leading-[0.85]"
              style={{ fontSize: "clamp(3rem, 7vw, 8rem)" }}
            >
              REAL BARS.<br />REAL RESULTS.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-2 border-white/10">
            {stories.map((s, i) => (
              <div
                key={s.bar}
                className={`story-card border-2 border-white/10 p-8 min-h-[280px] flex flex-col justify-between ${i < 3 ? "lg:border-r-0" : ""} reveal-up`}
              >
                <div>
                  <p className="font-mono-custom text-[#B5FF4D] text-[10px] opacity-60 tracking-widest uppercase mb-2">
                    CLIENT RESULT
                  </p>
                  <div className="font-display text-7xl text-[#B5FF4D] leading-[0.85] mb-2">{s.stat}</div>
                  <div className="font-display text-2xl text-white/50">{s.label}</div>
                </div>
                <div className="border-t border-white/10 pt-4 mt-4">
                  <span className="font-mono-custom text-xs text-white/30">{s.bar}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. PRICING SECTION ───────────────────────────────── */}
      <section className="bg-zinc-950 border-b-2 border-white/10" id="pricing" data-reveal>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="mb-12 reveal-up">
            <span className="font-mono-custom text-[#B5FF4D] text-xs tracking-widest uppercase block mb-4">
              PRICING
            </span>
            <h2
              className="font-display text-white leading-[0.85]"
              style={{ fontSize: "clamp(3rem, 7vw, 8rem)" }}
            >
              LESS THAN A<br />ROUND OF DRINKS.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-white/10">
            {landingTiers.map((tier, i) => (
              <div
                key={tier.name}
                className={`relative p-10 flex flex-col gap-6 border-b-2 md:border-b-0 border-white/10 ${i < 2 ? "md:border-r-2" : ""} ${tier.featured ? "bg-[#B5FF4D]/5 border-2 border-[#B5FF4D]" : "border-2 border-white/10"} reveal-up`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-8">
                    <span className="bg-[#B5FF4D] text-black font-mono-custom text-xs px-3 py-1">
                      {tier.badge}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-mono-custom text-xs text-white/40 tracking-widest uppercase mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-6xl text-white">{tier.price}</span>
                    <span className="font-mono-custom text-sm text-white/30">{tier.period}</span>
                  </div>
                  <p className="font-mono-custom text-xs text-white/40 mt-2">{tier.desc}</p>
                </div>
                <ul className="flex flex-col gap-3 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-[#B5FF4D] flex items-center justify-center flex-shrink-0">
                        <Check size={10} className="text-black" strokeWidth={3} />
                      </div>
                      <span className="font-mono-custom text-xs text-white/60">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`cta-btn w-full text-center font-display text-2xl py-4 border-2 ${tier.featured ? "bg-[#B5FF4D] text-black border-[#B5FF4D]" : "border-white/20 text-white"}`}
                >
                  <span>{tier.cta} →</span>
                </Link>
              </div>
            ))}
          </div>

          <p className="font-mono-custom text-xs text-white/20 text-center mt-8 reveal-up">
            Need multiple locations?{" "}
            <Link href="/pricing" className="text-[#B5FF4D] hover:underline">
              See Multi-Venue at $199/mo →
            </Link>
          </p>
        </div>
      </section>

      {/* ── 9. FINAL CTA ─────────────────────────────────────── */}
      <section className="bg-[#B5FF4D] relative overflow-hidden">
        {/* Inverted grid */}
        <div
          className="absolute inset-0 grid-bg opacity-20 pointer-events-none"
          style={{ filter: "invert(1)" }}
        />
        {/* Zap decor */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <Zap size={600} className="text-black" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32 flex flex-col items-center text-center gap-8">
          <h2
            className="font-display text-black leading-[0.85] max-w-5xl"
            style={{ fontSize: "clamp(3rem, 8vw, 10rem)" }}
          >
            YOUR COMPETITOR IS POSTING RIGHT NOW.
          </h2>
          <p className="font-mono-custom text-black/60 text-sm">
            NO CREDIT CARD REQUIRED — 7 DAY FREE TRIAL
          </p>
          <Link
            href="/signup"
            className="cta-btn inline-block bg-black text-[#B5FF4D] font-display text-3xl px-12 py-5 border-2 border-black hover:bg-transparent hover:text-black"
          >
            <span>START FOR FREE →</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
