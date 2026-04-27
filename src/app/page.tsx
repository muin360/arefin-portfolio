import Link from "next/link";
import { services, projects } from "@/data/site";
import { posts } from "@/data/posts";
import { IconArrow } from "@/components/icons";
import AgentNetwork from "@/components/AgentNetwork";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import NowWidget from "@/components/NowWidget";
import CursorSpotlight from "@/components/CursorSpotlight";
import Counter from "@/components/Counter";

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
    body: "Every workflow has to earn its place by saving real hours or making real money. If the output isn't measurable, I won't ship it.",
  },
  {
    n: "02",
    title: "No-code where it fits, code where it shouldn't.",
    body: "n8n, Zapier and Make get you 80% of the way fast. The remaining 20% is where Python and TypeScript earn their keep.",
  },
  {
    n: "03",
    title: "LLMs in the loop, not at the wheel.",
    body: "Models are great judges, terrible drivers. I keep humans and rules in the critical path until the AI proves itself.",
  },
  {
    n: "04",
    title: "Long-term ownership, not handoffs.",
    body: "I document, train and stay reachable. The systems I leave behind are ones the team can run and grow on their own.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-paper border-b border-line overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" aria-hidden="true" />
        <div className="noise" aria-hidden="true" />
        <CursorSpotlight />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-20 pb-16 md:pt-32 md:pb-20 relative">
          {/* Top meta strip */}
          <div className="flex flex-wrap items-center gap-3 mb-12 md:mb-16 text-xs">
            <span className="chip chip-live">
              <span className="live-dot" /> Available · April 2025
            </span>
            <span className="mono uppercase tracking-[0.16em] text-muted">
              [ Portfolio · v 2.0 ]
            </span>
            <span className="ml-auto mono uppercase tracking-[0.16em] text-muted hidden md:inline">
              Remote · GMT+6
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="eyebrow mb-8">
                  Arefin Muin · AI Automation &amp; Agent Engineer
                </p>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="display text-[10vw] sm:text-7xl md:text-8xl lg:text-[6.4rem] xl:text-[7.4rem]">
                  Engineering
                  <br />
                  <span className="serif">quiet, intelligent</span>
                  <br />
                  systems that{" "}
                  <span className="text-accent draw-underline">work</span>
                  <br />
                  while you sleep.
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="mt-8 text-lg md:text-xl text-muted max-w-xl leading-relaxed">
                  I&apos;m Arefin — I design and ship the workflows, integrations
                  and LLM-powered agents that operate behind the scenes of modern
                  companies.
                </p>
              </Reveal>

              <Reveal delay={220}>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link href="/contact" className="btn-primary">
                    Start a project
                    <IconArrow width={16} height={16} />
                  </Link>
                  <Link href="/projects" className="btn-secondary">
                    View selected work
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Animated agent network */}
            <div className="lg:col-span-5 relative">
              <Reveal delay={300}>
                <div className="relative rounded-3xl border border-line bg-surface/70 backdrop-blur-sm p-5 md:p-7">
                  <div className="flex items-center justify-between mb-3">
                    <span className="mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      Live · agent.flow
                    </span>
                    <span className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-foreground/15" />
                      <span className="w-2 h-2 rounded-full bg-foreground/15" />
                      <span className="w-2 h-2 rounded-full bg-foreground/15" />
                    </span>
                  </div>
                  <AgentNetwork />
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[10px] mono text-muted">
                    <span>← inputs</span>
                    <span className="text-center">orchestration</span>
                    <span className="text-right">action →</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Marquee of tools */}
          <Reveal delay={120} className="mt-16 md:mt-24">
            <div className="border-y border-line py-5">
              <Marquee duration={40}>
                {tools.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-3 px-6 text-foreground/85"
                  >
                    <span className="text-base">{t}</span>
                    <span className="w-1 h-1 rounded-full bg-foreground/30" />
                  </span>
                ))}
              </Marquee>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CAPABILITIES — asymmetric grid */}
      <section className="border-b border-line">
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

          <div className="grid grid-cols-1 md:grid-cols-6 gap-px bg-line border border-line rounded-3xl overflow-hidden">
            {services.map(({ Icon, title, description }, i) => {
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
                <Reveal
                  key={title}
                  delay={i * 60}
                  className={`bg-surface ${span}`}
                >
                  <div className="p-7 md:p-9 h-full flex flex-col group">
                    <div className="flex items-start justify-between">
                      <Icon
                        width={28}
                        height={28}
                        className="text-foreground transition-transform duration-500 group-hover:scale-110"
                      />
                      <span className="mono text-xs text-muted">
                        / {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-8 text-xl md:text-2xl font-medium tracking-tight">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm md:text-[0.95rem] text-muted leading-relaxed flex-1">
                      {description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs text-muted">
                      <span className="w-6 h-px bg-foreground/40 transition-all duration-300 group-hover:w-10 group-hover:bg-foreground" />
                      <span className="mono uppercase tracking-[0.14em]">
                        Read more
                      </span>
                    </span>
                  </div>
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
              <p className="eyebrow text-white/55 mb-5">[ 02 ] How I work</p>
              <h2 className="display text-4xl md:text-6xl">
                Four principles
                <br />
                I refuse to{" "}
                <span className="serif">break.</span>
              </h2>
              <p className="mt-6 text-white/65 max-w-md leading-relaxed">
                Most automation breaks because someone optimized for the demo,
                not the second year. I work the other way.
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
            {projects.slice(0, 4).map(({ Icon, title, summary, stack, category }, i) => {
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
                  <Link
                    href="/projects"
                    className="block h-full rounded-3xl border border-line bg-surface p-8 md:p-10 transition-all duration-300 hover:border-foreground/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_-30px_rgba(10,10,20,0.25)]"
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
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* NOW + STATS band */}
      <section className="border-b border-line">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 section grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-5">[ 04 ] Currently</p>
              <h2 className="display text-4xl md:text-5xl">
                What I&apos;m{" "}
                <span className="serif">up to</span>
                <br />
                this season.
              </h2>
              <p className="mt-6 text-muted max-w-md leading-relaxed">
                A snapshot updated every few weeks — what I&apos;m building, what
                I&apos;m reading, what I&apos;m saying yes to.
              </p>
              <div className="mt-10 grid grid-cols-3 gap-6">
                <div>
                  <p className="display text-4xl">
                    <Counter to={4} suffix="" />
                  </p>
                  <p className="mt-2 mono text-[10px] uppercase tracking-[0.16em] text-muted leading-relaxed">
                    Years shipping
                    <br />
                    automations
                  </p>
                </div>
                <div>
                  <p className="display text-4xl">
                    <Counter to={10} suffix="+" />
                  </p>
                  <p className="mt-2 mono text-[10px] uppercase tracking-[0.16em] text-muted leading-relaxed">
                    Tools &amp; APIs
                    <br />
                    orchestrated
                  </p>
                </div>
                <div>
                  <p className="display text-4xl">
                    <Counter to={24} suffix="h" />
                  </p>
                  <p className="mt-2 mono text-[10px] uppercase tracking-[0.16em] text-muted leading-relaxed">
                    Reply
                    <br />
                    window
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={120}>
              <NowWidget />
            </Reveal>
          </div>
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
