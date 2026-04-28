import Link from "next/link";
import { sanityFetch } from "@/sanity/fetch";
import {
  allServicesQuery,
  allProjectsQuery,
  allPostsQuery,
} from "@/sanity/queries";
import type {
  ServiceDoc,
  ProjectDoc,
  PostListItem,
} from "@/sanity/types";
import { iconFor } from "@/components/IconRegistry";
import { IconArrow } from "@/components/icons";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import CursorSpotlight from "@/components/CursorSpotlight";
import ParticleNetwork from "@/components/ParticleNetwork";
import ScrambleText from "@/components/ScrambleText";
import LiveAgentDashboard from "@/components/LiveAgentDashboard";
import MagneticButton from "@/components/MagneticButton";
import BentoCard from "@/components/BentoCard";
import LiveTicker from "@/components/LiveTicker";
import LiveClock from "@/components/LiveClock";
import TiltCard from "@/components/TiltCard";
import TensorPipeline from "@/components/TensorPipeline";
import SprintTimeline from "@/components/SprintTimeline";
import PullQuote from "@/components/PullQuote";
import Manifesto from "@/components/Manifesto";
import Live30Days from "@/components/Live30Days";

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

const principles = [
  {
    n: "01",
    title: "Outcomes over outputs.",
    body: "Every workflow has to earn its place by saving real hours or making real money. If the output isn't measurable, we won't ship it.",
  },
  {
    n: "02",
    title: "No-code where it fits, code where it shouldn't.",
    body: "n8n, Zapier and Make get you 80% of the way fast. The remaining 20% is where Python and TypeScript earn their keep.",
  },
  {
    n: "03",
    title: "LLMs in the loop, not at the wheel.",
    body: "Models are great judges, terrible drivers. We keep humans and rules in the critical path until the AI proves itself.",
  },
  {
    n: "04",
    title: "Long-term ownership, not handoffs.",
    body: "We document, train and stay reachable. The systems we leave behind are ones your team can run and grow on its own.",
  },
];

export default async function HomePage() {
  const [services, projects, posts] = await Promise.all([
    sanityFetch<ServiceDoc[]>({ query: allServicesQuery, tags: ["service"] }),
    sanityFetch<ProjectDoc[]>({ query: allProjectsQuery, tags: ["project"] }),
    sanityFetch<PostListItem[]>({ query: allPostsQuery, tags: ["post"] }),
  ]);

  return (
    <>
      {/* HERO — dark luxe with particles, aurora, agent dashboard */}
      <section className="hero-dark relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-grid-dark pointer-events-none" aria-hidden="true" />
        <div className="starfield" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <ParticleNetwork density={70} linkDistance={150} />
        </div>
        <div className="aurora" aria-hidden="true" />
        <div className="orb orb-violet" aria-hidden="true" />
        <div className="orb orb-pink" aria-hidden="true" />
        <div className="orb orb-cyan" aria-hidden="true" />
        <CursorSpotlight />

        {/* Top live ticker */}
        <div className="relative"><LiveTicker /></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-20 md:pt-36 md:pb-28 relative">
          {/* Top status bar — terminal-style */}
          <div className="flex flex-wrap items-center gap-3 mb-12 md:mb-16 text-xs">
            <span className="chip chip-live">
              <span className="live-dot" /> Available · April 2025
            </span>
            <span className="tag-pill">
              <ScrambleText text="PORTFOLIO · V 2.0" speed={28} />
            </span>
            <span className="tag-pill hidden md:inline-flex">
              <ScrambleText text="STATUS · SHIPPING" speed={28} delay={150} />
            </span>
            <span className="ml-auto tag-pill hidden md:inline-flex items-center gap-2">
              <LiveClock />
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow mb-8 inline-flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono tracking-[0.26em] uppercase text-foreground">Tensor Studio</span>
                  <span className="opacity-30">—</span>
                  <span>An independent AI engineering studio</span>
                </p>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="display text-[10vw] sm:text-7xl md:text-8xl lg:text-[6.4rem] xl:text-[7.4rem]">
                  Engineering
                  <br />
                  <span className="serif">quiet, intelligent</span>
                  <br />
                  systems that{" "}
                  <span className="iridescent draw-underline">work</span>
                  <br />
                  while you sleep.
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-8 text-lg md:text-xl text-muted max-w-xl leading-relaxed">
                  We design and ship the workflows, integrations and LLM-powered
                  agents that operate behind the scenes of modern companies.
                  Quietly, reliably, while you sleep.
                </p>
              </Reveal>

              <Reveal delay={220}>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <MagneticButton href="/contact" className="btn-primary shimmer">
                    Start a project
                    <IconArrow width={16} height={16} />
                  </MagneticButton>
                  <Link href="/projects" className="btn-secondary">
                    View selected work
                  </Link>
                </div>
              </Reveal>

              {/* System status strip — feels like a terminal heartbeat */}
              <Reveal delay={280}>
                <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
                  <SystemTile label="agents online" value="04" />
                  <SystemTile label="workflows live" value="27" />
                  <SystemTile label="events / 24h" value="14.2k" />
                  <SystemTile label="uptime / 30d" value="99.97%" />
                </div>
              </Reveal>
            </div>

            {/* Live agent dashboard — the centerpiece */}
            <div className="lg:col-span-5 relative">
              <Reveal delay={300}>
                <LiveAgentDashboard />
              </Reveal>
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

      {/* CAPABILITIES — bento grid (dark luxe) */}
      <section className="hero-dark border-b border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 section">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
              <div>
                <p className="eyebrow mb-5">[ 01 ] What I build</p>
                <h2 className="display text-4xl md:text-6xl max-w-3xl">
                  Not a freelancer.
                  <br />
                  <span className="serif">An engineering partner</span> for
                  the workflows your team has outgrown.
                </h2>
              </div>
              <Link
                href="/services"
                className="hover-arrow text-sm text-muted hover:text-foreground self-start md:self-end"
              >
                <span className="link-underline">All capabilities</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {services.map(({ iconName, title, description }, i) => {
              const Icon = iconFor(iconName);
              // 6 cards in 3 asymmetric rows: 4+2 / 2+4 / 3+3
              const spans = [
                "md:col-span-4",
                "md:col-span-2",
                "md:col-span-2",
                "md:col-span-4",
                "md:col-span-3",
                "md:col-span-3",
              ];
              const span = spans[i] || "md:col-span-2";
              return (
                <Reveal key={title} delay={i * 60} className={span}>
                  <BentoCard className="h-full">
                    <div className="h-full flex flex-col group">
                      <div className="flex items-start justify-between">
                        <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 transition-all duration-500 group-hover:scale-110 group-hover:border-white/30">
                          <Icon width={22} height={22} className="text-white" />
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                          / {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="mt-7 text-xl md:text-2xl font-medium tracking-tight text-white">
                        {title}
                      </h3>
                      <p className="mt-3 text-sm md:text-[0.95rem] text-white/60 leading-relaxed flex-1">
                        {description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-xs text-white/55">
                        <span className="w-6 h-px bg-white/30 transition-all duration-300 group-hover:w-10 group-hover:bg-white/80" />
                        <span className="font-mono uppercase tracking-[0.14em]">
                          Read more
                        </span>
                      </span>
                    </div>
                  </BentoCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRINCIPLES — sticky scroll */}
      <section className="bg-foreground text-white relative overflow-hidden border-b border-foreground">
        <div className="noise" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 section grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-white/55 mb-5">[ 02 ] How we work</p>
              <h2 className="display text-4xl md:text-6xl">
                Four principles
                <br />
                we refuse to{" "}
                <span className="serif">break.</span>
              </h2>
              <p className="mt-6 text-white/65 max-w-md leading-relaxed">
                Most automation breaks because someone optimized for the demo,
                not the second year. Tensor Studio works the other way.
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-8">
            {principles.map((p, i) => (
              <Reveal key={p.n} delay={i * 80}>
                <div className="border-t border-white/10 pt-8 md:pt-10 grid grid-cols-12 gap-4">
                  <span className="col-span-2 mono text-xs text-white/45 tracking-[0.14em]">
                    {p.n}
                  </span>
                  <div className="col-span-10">
                    <h3 className="display text-2xl md:text-3xl">{p.title}</h3>
                    <p className="mt-3 text-white/65 leading-relaxed max-w-xl">
                      {p.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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
            {projects.slice(0, 4).map(({ iconName, title, summary, stack, category }, i) => {
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
                    href="/projects"
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
                <p className="eyebrow text-white/55 mb-5">[ 04 ] Anatomy of a sprint</p>
                <h2 className="display text-4xl md:text-6xl text-white max-w-3xl leading-[1.05]">
                  Fourteen days,
                  <br />
                  <span className="serif">narrated hour by hour.</span>
                </h2>
                <p className="mt-5 text-white/65 max-w-xl leading-relaxed">
                  Most studios sell you the deliverable. Tensor sells you the
                  visible process. Six phases, every beat scripted — playing
                  on a loop so you know what you&apos;re buying before the
                  first call.
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

      {/* PULL QUOTE — full-bleed editorial */}
      <PullQuote
        quote={
          <>
            We don&apos;t ship <span className="iridescent">prompts</span>.
            We ship <em className="serif">systems that survive</em> a Monday
            morning two years from now — when the team that hired us has
            grown, the model has changed, and the original requirement
            has been forgotten.
          </>
        }
        attribution="Tensor Studio · house line"
      />

      {/* MANIFESTO — scroll-revealed creed */}
      <Manifesto />

      {/* LIVE STUDIO DASHBOARD — 30-day stats + world map */}
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
                  at <span className="serif">the studio.</span>
                </h2>
                <p className="mt-5 text-white/65 max-w-xl leading-relaxed">
                  A live look at what&apos;s running. Workflows shipped,
                  agents deployed, hours saved, regions served — straight
                  from the production telemetry, refreshed every visit.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                streaming · last sync &lt; 1 min ago
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <Live30Days />
          </Reveal>

          <Reveal delay={140} className="mt-6 md:mt-8">
            <TensorPipeline />
          </Reveal>
        </div>
      </section>

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
    </>
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
