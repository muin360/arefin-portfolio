import type { Metadata } from "next";
import { PageHeader } from "@/components/Section";
import SectionPlate from "@/components/SectionPlate";
import Button from "@/components/Button";
import { whatsappHref, WA_MESSAGES, PHONE_DISPLAY } from "@/lib/cta";
import { MessageSquare, ArrowRight, Calendar, CheckCircle2, Clock, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a 30-Min Scoping Call",
  description:
    "Schedule a 30-minute scoping session with Arefin Mueen to review manual bottlenecks and map out practical automation opportunities.",
  alternates: { canonical: "/book" },
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
        eyebrow="Workflow Scoping Call"
        index="06"
        meta="30 minutes · Free technical consultation"
        title={
          <>
            Pick a time.{" "}
            <span className="serif italic text-violet-300">Let&rsquo;s review</span> your workflow
            and explore what to automate.
          </>
        }
        subtitle="A direct 30-minute scoping call. We'll map your repetitive tasks on screen and outline practical AI automation or agent solutions under your 100% ownership."
      />

      <section className="py-16 sm:py-20" aria-label="Booking Options">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionPlate
            index="01"
            title="CALENDAR & DIRECT BOOKING"
            sectionId="calendar"
            meta="live calendar · fast scheduling"
          />

          <div className="rounded-2xl bg-[#0c0f18] border border-white/[0.08] p-6 sm:p-10 shadow-2xl">
            {CAL_LINK ? (
              <iframe
                title="Book a free audit call"
                src={CAL_LINK}
                className="w-full rounded-xl border border-white/10 min-h-[620px] bg-[#07090e]"
                loading="lazy"
              />
            ) : (
              <div className="py-10 text-center max-w-xl mx-auto space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 mx-auto flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Instant Scheduling via <span className="serif italic text-violet-300">WhatsApp &amp; Email</span>
                  </h2>
                  <p className="text-sm sm:text-base text-white/70 leading-relaxed font-sans">
                    Drop a message directly on WhatsApp. I will share a direct calendar slot or Google Meet link matching your timezone.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    href={whatsappHref(WA_MESSAGES.audit)}
                    variant="primary"
                    size="lg"
                    icon={<MessageSquare className="w-4 h-4 text-emerald-600" />}
                    iconPosition="left"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat on WhatsApp ({PHONE_DISPLAY})
                  </Button>

                  <Button
                    href="/contact"
                    variant="secondary"
                    size="lg"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Use Contact Form
                  </Button>
                </div>

                <p className="text-xs font-mono text-white/40 tracking-wider">
                  Fast async communication · Replies within 24 hours
                </p>
              </div>
            )}
          </div>

          {/* 3 Step Consultation Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0c0f18] border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-violet-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span className="uppercase tracking-wider">01 · What You Get</span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                A focused 30-minute session where we analyze your workflow bottlenecks and identify high-ROI automation targets.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0f18] border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-violet-400 font-semibold">
                <Clock className="w-4 h-4" />
                <span className="uppercase tracking-wider">02 · What We Discuss</span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                Which repetitive tasks your team spends time on, which APIs aren&apos;t connected, and your desired target outcome.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0c0f18] border border-white/[0.08] space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-violet-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span className="uppercase tracking-wider">03 · Clear Next Steps</span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                A written architectural summary with recommended tools (n8n, LangChain, APIs), timeline, and transparent estimate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
