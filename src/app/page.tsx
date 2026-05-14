import Link from "next/link";
import { sanityFetch } from "@/sanity/fetch";
import {
  allServicesQuery,
  allProjectsQuery,
  allPostsQuery,
  siteConfigQuery,
  allTestimonialsQuery,
} from "@/sanity/queries";
import type {
  ServiceDoc,
  ProjectDoc,
  PostListItem,
  SiteConfig,
  TestimonialDoc,
} from "@/sanity/types";
import {
  FALLBACK_SERVICES,
  FALLBACK_PROJECTS,
  FALLBACK_POSTS,
  FALLBACK_SITE_CONFIG,
  FALLBACK_TESTIMONIALS,
} from "@/data/fallbacks";
import { iconFor } from "@/components/IconRegistry";
import { IconArrow } from "@/components/icons";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import CursorSpotlight from "@/components/CursorSpotlight";
import ParticleNetwork from "@/components/ParticleNetwork";
import LiveAgentDashboard from "@/components/LiveAgentDashboard";
import MagneticButton from "@/components/MagneticButton";
import ServiceCardLarge from "@/components/ServiceCardLarge";
import LiveTicker from "@/components/LiveTicker";

import TiltCard from "@/components/TiltCard";
import TensorPipeline from "@/components/TensorPipeline";
import SprintTimeline from "@/components/SprintTimeline";
import Live30Days from "@/components/Live30Days";
import FaqSection from "@/components/FaqSection";
import FinalCTASection from "@/components/FinalCTASection";

const tools = [
  "n8n",
  "Zapier",
  "Make",
  "LangChain",
  "LangFlow",
  "GoHighLevel",
  "OpenAI",
  "Anthropic Claude",
  "Pinecone",
  "Supabase",
  "Python",
  "TypeScript",
  "Node.js",
  "Slack API",
  "Twilio",
  "Apollo",
  "Notion",
  "Airtable",
];

export default async function HomePage() {
  const [servicesRaw, projectsRaw, postsRaw, cfgRaw, testimonialsRaw] =
    await Promise.all([
      sanityFetch<ServiceDoc[]>({ query: allServicesQuery, tags: ["service"] }),
      sanityFetch<ProjectDoc[]>({ query: allProjectsQuery, tags: ["project"] }),
      sanityFetch<PostListItem[]>({ query: allPostsQuery, tags: ["post"] }),
      sanityFetch<SiteConfig>({ query: siteConfigQuery, tags: ["siteConfig"] }),
      sanityFetch<TestimonialDoc[]>({
        query: allTestimonialsQuery,
        tags: ["testimonial"],
      }),
    ]);

  const services = servicesRaw && servicesRaw.length > 0 ? servicesRaw : FALLBACK_SERVICES;
  const projects = projectsRaw && projectsRaw.length > 0 ? projectsRaw : FALLBACK_PROJECTS;
  const posts = postsRaw && postsRaw.length > 0 ? postsRaw : FALLBACK_POSTS;
  const cfg: SiteConfig = cfgRaw ?? FALLBACK_SITE_CONFIG;
  const testimonials =
    testimonialsRaw && testimonialsRaw.length > 0
      ? testimonialsRaw
      : FALLBACK_TESTIMONIALS;

  const availabilityNote =
    cfg.availabilityNote ??
    FALLBACK_SITE_CONFIG.availabilityNote ??
    "Free 30-min audit";

  const heroTiles = cfg.heroTiles ?? [];
  const showHeroTiles = (cfg.showHeroTiles ?? true) && heroTiles.length > 0;

  const live30Days = cfg.live30Days ?? [];
  const showLive30Days = (cfg.showLive30Days ?? true) && live30Days.length > 0;

  const showLiveTicker = cfg.showLiveTicker ?? false;

  return (
    <>
      {/* HERO — dark luxe with particles, aurora, agent dashboard */}
      <section className="hero-dark relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid-dark pointer-events-none" aria-hidden="true" />
        <div className="starfield" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden="true">
          <ParticleNetwork density={70} linkDistance={150} />
        </div>
        <div className="aurora hidden md:block" aria-hidden="true" />
        <div className="orb orb-violet hidden md:block" aria-hidden="true" />
        <div className="orb orb-pink hidden md:block" aria-hidden="true" />
        <div className="orb orb-cyan hidden md:block" aria-hidden="true" />
        <CursorSpotlight />

        {/* Top live ticker */}
        {showLiveTicker && (
          <div className="relative"><LiveTicker /></div>
        )}

        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-20 md:pt-36 md:pb-28 relative">
          {/* Top status bar — single high-signal trust pill, no dev-fluff */}
          <div className="flex flex-wrap items-center gap-3 mb-12 md:mb-16 text-xs">
            <span className="chip chip-live">
              <span className="live-dot" /> {availabilityNote}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow mb-8 inline-flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono tracking-[0.26em] uppercase text-foreground">Tensorix</span>
                  <span className="opacity-30">·</span>
                  <span>AI Automation & Agent Engineering</span>
                </p>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="display text-[10vw] sm:text-7xl md:text-8xl lg:text-[6.4rem] xl:text-[7.4rem]">
                  AI systems
                  <br />
                  <span className="serif">that turn repetitive</span>
                  <br />
                  work into <span className="iridescent draw-underline">reliable</span>
                  <br />
                  workflows.
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-8 text-lg md:text-xl text-muted max-w-xl leading-relaxed">
                  I help small teams automate lead handling, customer replies,
                  CRM updates, reporting, and internal operations with
                  practical AI agents, workflow automation, and integrated
                  web systems.
                </p>
              </Reveal>

              <Reveal delay={220}>
                <div className="mt-10 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
                  <MagneticButton href="/book" className="btn-primary shimmer w-full sm:w-auto justify-center">
                    Book a free systems audit
                    <IconArrow width={16} height={16} />
                  </MagneticButton>
                  <Link href="#services" className="btn-secondary w-full sm:w-auto justify-center">
                    See services
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={280}>
                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono uppercase tracking-[0.16em] text-muted">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Founder-led
                  </span>
                  <span className="opacity-30">·</span>
                  <span>Agents · Automation · Integrations · Web</span>
                  <span className="opacity-30">·</span>
                  <span>Dhaka → Global</span>
                </div>
              </Reveal>

              {/* System status strip — feels like a terminal heartbeat */}
              {showHeroTiles && (
                <Reveal delay={280}>
                  <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                    {heroTiles.map((tile) => (
                      <SystemTile key={tile.label} label={tile.label} value={tile.value} />
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            {/* Live agent dashboard — desktop only. On mobile we let the
                hero copy own the full viewport so the headline + CTA hit
                first-time visitors without competition. */}
            <div className="hidden lg:block lg:col-span-5 relative">
              <Reveal delay={300}>
                <LiveAgentDashboard />
              </Reveal>
            </div>

            {/* Mobile hero visual — stat cards. Replaces the desktop
                LiveAgentDashboard on phones where animations are expensive
                and the dashboard would compete with the headline. */}
            <div className="lg:hidden grid grid-cols-2 gap-3 mt-2">
              <MobileStat label="Reply time" value={"< 1 hour"} />
              <MobileStat label="Delivery" value="14 days" />
              <MobileStat label="You own" value="Everything" />
              <MobileStat label="Support" value="30 days free" />
            </div>
          </div>

          {/* Marquee of tools — dark variant */}
          <Reveal delay={120} className="mt-16 md:mt-24">
            <div className="border-y border-white/10 py-5">
              <Marquee duration={40}>
                {tools.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-3 px-6 text-white/80"
                  >
                    <span className="text-base">{t}</span>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                  </span>
                ))}
              </Marquee>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES — 3 large premium cards (Problem / Solution / Outcome) */}
      <section id="services" className="hero-dark border-b border-white/5 relative overflow-hidden scroll-mt-20">
        <div className="orb orb-violet hidden md:block opacity-40" aria-hidden="true" />
        <div className="orb orb-cyan hidden md:block opacity-30" aria-hidden="true" />
        <div className="absolute inset-0 bg-grid-dark pointer-events-none opacity-50" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 section relative">
          <Reveal>
            <div className="text-center mb-12 md:mb-16">
              <p className="eyebrow mb-5">[ 01 ] Services</p>
              <h2 className="display text-4xl md:text-6xl text-white max-w-4xl mx-auto leading-[1.05]">
                Four ways we{" "}
                <span className="serif iridescent">build with you.</span>
              </h2>
              <p className="mt-6 text-white/65 max-w-2xl mx-auto leading-relaxed">
                Distinct service pillars built around real workflows.
                Scoped after a 30-minute audit, with acceptance criteria
                agreed in writing before any build.
              </p>
              <p className="mt-7 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-white/70 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {availabilityNote}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 items-stretch">
            {services.slice(0, 4).map((s, i) => (
              <ServiceCardLarge
                key={s._id ?? s.title}
                index={i}
                title={s.title}
                iconName={s.iconName}
                hook={s.hook}
                problem={s.problem}
                solution={s.solution}
                outcome={s.outcome}
                bullets={s.bullets}
                description={s.description}
                ctaLabel={s.ctaLabel}
                ctaPrefill={s.ctaPrefill}
                badge={s.badge}
                isFeatured={s.isFeatured}
              />
            ))}
          </div>

          <Reveal delay={300}>
            <div className="mt-12 text-center">
              <Link
                href="/services"
                className="hover-arrow text-sm text-white/65 hover:text-white"
              >
                <span className="link-underline">See full pricing & engagement models</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SELECTED WORK — asymmetric editorial */}
      <section className="border-b border-line">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 section">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <p className="eyebrow mb-5">[ 03 ] Selected work</p>
                <h2 className="display text-4xl md:text-6xl max-w-3xl">
                  Systems that{" "}
                  <span className="serif">do the work,</span>
                  <br />
                  so the team doesn&apos;t.
                </h2>
              </div>
              <Link
                href="/projects"
                className="hover-arrow text-sm text-muted hover:text-foreground"
              >
                <span className="link-underline">View all 06</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {projects.slice(0, 4).map(({ iconName, title, summary, stack, category, slug }, i) => {
              const Icon = iconFor(iconName);
              const span =
                i === 0
                  ? "md:col-span-7 md:row-span-2"
                  : i === 1
                  ? "md:col-span-5"
                  : i === 2
                  ? "md:col-span-5"
                  : "md:col-span-7";
              const tall = i === 0;
              return (
                <Reveal
                  key={title}
                  delay={i * 80}
                  className={`group ${span}`}
                >
                  <TiltCard className="h-full rounded-3xl">
                  <Link
                    href={slug ? `/projects/${slug}` : "/projects"}
                    className="block h-full rounded-3xl border border-line bg-surface p-8 md:p-10 transition-all duration-300 hover:border-foreground/30 hover:shadow-[0_20px_60px_-30px_rgba(10,10,20,0.25)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <Icon
                        width={tall ? 36 : 28}
                        height={tall ? 36 : 28}
                        className="text-foreground"
                      />
                      <span className="chip">{category}</span>
                    </div>
                    <h3
                      className={`mt-${tall ? "10" : "8"} font-medium tracking-tight ${
                        tall
                          ? "display text-3xl md:text-5xl"
                          : "text-2xl md:text-3xl"
                      }`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`mt-4 text-muted leading-relaxed ${
                        tall ? "text-base md:text-lg max-w-xl" : "text-sm md:text-base"
                      }`}
                    >
                      {summary}
                    </p>
                    <div className="mt-8 pt-6 border-t border-line flex flex-wrap gap-x-4 gap-y-1.5 text-xs mono text-muted">
                      {stack.map((s) => (
                        <span key={s}>· {s}</span>
                      ))}
                    </div>
                  </Link>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SPRINT TIMELINE — autoplay editorial timeline of a 14-day engagement */}
      <section className="hero-dark border-y border-white/5 relative overflow-hidden">
        <div className="aurora opacity-40" aria-hidden="true" />
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <div className="absolute inset-0 bg-grid-dark pointer-events-none opacity-50" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 section relative">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
              <div>
                <p className="eyebrow text-white/55 mb-5">[ 04 ] How it works</p>
                <h2 className="display text-4xl md:text-6xl text-white max-w-3xl leading-[1.05]">
                  From first message
                  <br />
                  <span className="serif">to live system in 14 days.</span>
                </h2>
                <p className="mt-5 text-white/65 max-w-xl leading-relaxed">
                  Six steps. You always know what&apos;s happening, what&apos;s
                  next, and what you&apos;ll have at the end of each phase —
                  starting with a free 30-minute audit call.
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] mono uppercase tracking-[0.22em] text-white/45">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                autoplay · phases advance every 3.6s
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SprintTimeline />
          </Reveal>
        </div>
      </section>

      {/* LIVE STUDIO DASHBOARD — 30-day stats + world map. Hidden when no
          stats are configured in /studio so the site never shows fabricated
          numbers. */}
      {showLive30Days && (
        <section className="hero-dark border-y border-white/5 relative overflow-hidden">
          <div className="aurora opacity-40" aria-hidden="true" />
          <div className="orb orb-pink" aria-hidden="true" />
          <div className="orb orb-cyan" aria-hidden="true" />
          <div className="absolute inset-0 bg-grid-dark pointer-events-none opacity-50" aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-6 sm:px-8 section relative">
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
                <div>
                  <p className="eyebrow text-white/55 mb-5">[ 06 ] Studio dashboard</p>
                  <h2 className="display text-4xl md:text-6xl text-white max-w-3xl leading-[1.05]">
                    Last 30 days
                    <br />
                    at <span className="serif">Tensorix.</span>
                  </h2>
                  <p className="mt-5 text-white/65 max-w-xl leading-relaxed">
                    A live look at what&apos;s running across active
                    engagements — straight from the studio dashboard.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <Live30Days stats={live30Days} />
            </Reveal>

            <Reveal delay={140} className="mt-6 md:mt-8">
              <TensorPipeline />
            </Reveal>
          </div>
        </section>
      )}

      {/* TESTIMONIALS — social proof for SMB conversion. Auto-hides when
          neither Sanity nor the fallback array has entries. */}
      {testimonials.length > 0 && (
        <section className="border-b border-line">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 section">
            <Reveal>
              <div className="text-center mb-12 md:mb-16">
                <p className="eyebrow mb-5">[ 04 ] Example engagements</p>
                <h2 className="display text-4xl md:text-6xl max-w-3xl mx-auto">
                  Anonymized examples{" "}
                  <span className="serif">of the work we ship.</span>
                </h2>
                <p className="mt-6 text-muted max-w-xl mx-auto leading-relaxed">
                  Illustrative outcomes from real engagements, anonymized for
                  client privacy. Real named testimonials will be added as
                  written permission comes through.
                </p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t, i) => (
                <Reveal key={t._id ?? t.name} delay={i * 80}>
                  <figure className="h-full rounded-3xl border border-line bg-surface p-8 md:p-10 flex flex-col">
                    {typeof t.rating === "number" && t.rating > 0 && (
                      <div
                        className="flex items-center gap-0.5 text-amber-500"
                        aria-label={`${t.rating} out of 5`}
                      >
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span
                            key={idx}
                            aria-hidden="true"
                            className={idx < (t.rating ?? 0) ? "" : "opacity-20"}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                    <blockquote className="mt-5 text-foreground/85 leading-relaxed italic">
                      “{t.content}”
                    </blockquote>
                    <figcaption className="mt-auto pt-8 border-t border-line">
                      <p className="mono text-[10px] uppercase tracking-[0.2em] text-muted/80">
                        {t.name}
                      </p>
                      {t.role && (
                        <p className="mt-1 font-medium tracking-tight">{t.role}</p>
                      )}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* JOURNAL */}
      <section className="border-b border-line">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 section">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <div>
                <p className="eyebrow mb-5">[ 05 ] Journal</p>
                <h2 className="display text-4xl md:text-6xl max-w-3xl">
                  Notes on shipping{" "}
                  <span className="serif">AI in production.</span>
                </h2>
              </div>
              <Link
                href="/blog"
                className="hover-arrow text-sm text-muted hover:text-foreground"
              >
                <span className="link-underline">All entries</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line rounded-3xl overflow-hidden">
            {posts.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 80} className="bg-surface">
                <Link
                  href={`/blog/${p.slug}`}
                  className="block p-8 md:p-10 group h-full flex flex-col"
                >
                  <div className="flex items-center justify-between">
                    <span className="chip">{p.category}</span>
                    <span className="mono text-xs text-muted">
                      / {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl md:text-2xl tracking-tight font-medium leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed line-clamp-3">
                    {p.excerpt}
                  </p>
                  <div className="mt-auto pt-8 flex items-center justify-between text-xs mono text-muted">
                    <span>
                      {new Date(p.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="hover-arrow text-foreground">
                      <span>Read</span>
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — 6 honest answers to the questions every SMB asks */}
      <FaqSection />

      {/* FINAL CTA — free audit + WhatsApp, dual-channel close */}
      <FinalCTASection />
    </>
  );
}

function MobileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">
        {label}
      </p>
      <p className="font-mono text-xl text-white mt-1 tabular-nums">{value}</p>
    </div>
  );
}

function SystemTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md px-3 py-3 flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
        {label}
      </span>
      <span className="font-mono text-base text-white/95 tabular-nums">
        {value}
      </span>
    </div>
  );
}
