import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/Section";
import Reveal from "@/components/Reveal";
import { IconArrow } from "@/components/icons";
import { whatsappHref, WA_MESSAGES, PHONE_DISPLAY } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Book a free 30-min scoping call",
  description:
    "Book a free 30-minute scoping call with Arefin. We'll review your manual workflow steps and identify practical automation opportunities.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book a free 30-min scoping call — Arefin Mueen",
    description:
      "30 minutes. Let's map your workflow and explore what we can automate.",
    url: "/book",
  },
};

const CAL_USERNAME = process.env.NEXT_PUBLIC_CAL_USERNAME ?? "";
const CAL_EVENT = process.env.NEXT_PUBLIC_CAL_EVENT ?? "30min";
const CAL_LINK =
  CAL_USERNAME &&
  `https://cal.com/${CAL_USERNAME}/${CAL_EVENT}?layout=month_view&theme=dark`;

export default function BookPage() {
  return (
    <>
      <PageHeader
        eyebrow="Scoping Call · Free"
        index="06"
        meta="30 minutes · Explore automation opportunities · No obligation"
        title={
          <>
            Pick a time.{" "}
            <span className="serif">Let&rsquo;s review</span> your workflow
            and explore what we can automate.
          </>
        }
        subtitle="Free 30-minute scoping call. We'll map your repetitive tasks and outline practical AI automation or agent solutions."
      />

      <section className="hero-dark relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-grid-dark pointer-events-none" aria-hidden="true" />
        <div className="orb orb-violet hidden md:block" aria-hidden="true" />
        <div className="orb orb-cyan hidden md:block" aria-hidden="true" />

        <div className="max-w-5xl mx-auto px-6 sm:px-8 section relative">
          <Reveal>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 sm:p-8 md:p-10 min-h-[520px] flex flex-col">
              {CAL_LINK ? (
                // Cal.com / Calendly drop-in. Set NEXT_PUBLIC_CAL_USERNAME (and
                // optionally NEXT_PUBLIC_CAL_EVENT) in your env to wire this up.
                <iframe
                  title="Book a free audit call"
                  src={CAL_LINK}
                  className="w-full flex-1 rounded-2xl border-0 min-h-[600px]"
                  loading="lazy"
                />
              ) : (
                <div className="flex-1 grid place-items-center text-center py-10">
                  <div className="max-w-lg">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55 mb-5">
                      Booking link · Coming soon
                    </p>
                    <h2 className="display text-3xl md:text-4xl text-white">
                      Cal.com embed{" "}
                      <span className="serif iridescent">drops in here.</span>
                    </h2>
                    <p className="mt-5 text-white/65 leading-relaxed">
                      The fastest way to talk right now is WhatsApp.
                      I&rsquo;ll book the audit on the same chat and send a
                      Google Meet link.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <a
                        href={whatsappHref(WA_MESSAGES.audit)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-white px-6 py-3.5 text-sm font-medium w-full sm:w-auto"
                      >
                        <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true" fill="currentColor">
                          <path d="M19.11 17.21c-.31-.16-1.83-.9-2.11-1-.28-.1-.49-.16-.7.16s-.81 1-.99 1.21c-.18.21-.36.23-.67.08-.31-.16-1.31-.48-2.5-1.54-.92-.83-1.55-1.84-1.73-2.15-.18-.31-.02-.48.13-.63.13-.13.31-.36.46-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.7-1.69-.95-2.32-.25-.6-.51-.52-.7-.53l-.59-.01c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.61 0 1.54 1.13 3.03 1.29 3.24.16.21 2.22 3.39 5.39 4.75.75.32 1.34.51 1.8.66.75.24 1.44.21 1.98.13.6-.09 1.83-.75 2.09-1.47.26-.72.26-1.34.18-1.47-.08-.13-.29-.21-.6-.36zM16 4C9.37 4 4 9.37 4 16c0 2.12.55 4.11 1.5 5.84L4 28l6.32-1.45A11.93 11.93 0 0 0 16 28c6.63 0 12-5.37 12-12S22.63 4 16 4z" />
                        </svg>
                        Book on WhatsApp ({PHONE_DISPLAY})
                      </a>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 hover:bg-white/10 text-white px-6 py-3.5 text-sm font-medium w-full sm:w-auto"
                      >
                        Use the contact form
                        <IconArrow width={14} height={14} />
                      </Link>
                    </div>

                    <p className="mt-10 text-xs font-mono uppercase tracking-[0.22em] text-white/45">
                      Fast async communication during active projects
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white/65">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-2">
                  / 01 What you get
                </p>
                <p>
                  A free 30-minute call where I map your current workflows
                  on screen with you and share where automation will give
                  the highest leverage — in writing afterwards.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-2">
                  / 02 What I&rsquo;ll ask
                </p>
                <p>
                  What does your team do manually? Which tools aren&rsquo;t
                  talking to each other? What outcome would make this
                  engagement worth your time?
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-2">
                  / 03 What happens after
                </p>
                <p>
                  A written recommendation with the highest-leverage
                  automations, an indicative scope, and clear next steps.
                  No obligation either way.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
