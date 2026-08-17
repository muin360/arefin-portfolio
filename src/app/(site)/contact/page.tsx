import type { Metadata } from "next";
import { PageHeader } from "@/components/Section";
import ContactForm from "./ContactForm";
import SectionPlate from "@/components/SectionPlate";
import {
  Mail,
  MessageSquare,
  CheckCircle2,
  Globe,
  ArrowRight,
} from "lucide-react";
import { getSiteSettings } from "@/lib/db";

export const metadata: Metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
  description:
    "Get in touch with Arefin Mueen to discuss AI automations, AI agents, RAG systems, and workflow integrations. Replies within 24 hours.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const { email, phone, phoneE164, socialLinks, availabilityNote } = settings;
  const whatsapp =
    socialLinks.whatsapp ||
    (phoneE164 ? `https://wa.me/${phoneE164}` : undefined);

  return (
    <>
      <PageHeader
        eyebrow="Direct Scoping Channel"
        index="05"
        meta="Replies within 24 hours · Mon–Sat"
        title={
          <>
            Tell me about the workflow you want to{" "}
            <span className="serif italic text-violet-300">automate.</span>
          </>
        }
        subtitle="Whether you need to connect business apps with n8n, build an autonomous agent, or set up a RAG knowledge assistant — share what you're trying to accomplish and the tools you use."
      />

      <section className="py-16 sm:py-20" aria-label="Contact Channels & Form">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionPlate
            index="01"
            title="SEND A PROJECT INQUIRY"
            sectionId="form"
            meta="direct intake · fast response"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ─── LEFT COL: DIRECT CHANNELS (5 cols) ────────────────────── */}
            <div className="lg:col-span-5 space-y-6">
              {/* Direct Email Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#0c0f18] border border-white/[0.08] hover:border-violet-500/30 transition-all space-y-4">
                <div className="flex items-center gap-2 text-violet-400 font-mono text-xs font-semibold uppercase tracking-wider">
                  <Mail className="w-4 h-4" />
                  <span>Email Channel</span>
                </div>
                <div>
                  <a
                    href={`mailto:${email}`}
                    className="text-lg sm:text-xl font-bold text-white hover:text-violet-200 transition-colors break-all tracking-tight"
                  >
                    {email}
                  </a>
                  <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
                    The fastest way to reach me directly for project inquiries, architecture reviews, and automation scoping.
                  </p>
                </div>
              </div>

              {/* WhatsApp Card */}
              {whatsapp && (
                <div className="p-6 sm:p-7 rounded-2xl bg-[#0c0f18] border border-white/[0.08] hover:border-violet-500/30 transition-all space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp / Direct Message</span>
                  </div>
                  <div>
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-white hover:text-emerald-300 transition-colors tracking-tight"
                    >
                      <span>{phone ? `WhatsApp: ${phone}` : "Chat on WhatsApp"}</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </a>
                    <p className="mt-2 text-xs sm:text-sm text-white/60 leading-relaxed font-sans">
                      Quick async voice notes and direct messaging for active project scoping and sprint updates.
                    </p>
                  </div>
                </div>
              )}

              {/* Scoping Checklist Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-[#0c0f18] border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-2 text-violet-400 font-mono text-xs font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>A helpful first inquiry includes</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-white/70 font-sans">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                    <span>What manual task or bottleneck you want to automate</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                    <span>Your current software stack (CRM, Gmail, Slack, Sheets, database)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                    <span>Desired timeline or key milestone targets</span>
                  </li>
                </ul>
              </div>

              {/* Status & Timezone Card */}
              <div className="p-5 rounded-2xl bg-[#0c0f18] border border-white/[0.08] flex items-center justify-between font-mono text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white/80 font-medium">{availabilityNote || "Open for projects"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/40">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Dhaka · GMT+6</span>
                </div>
              </div>
            </div>

            {/* ─── RIGHT COL: CONTACT FORM (7 cols) ────────────────────── */}
            <div className="lg:col-span-7 p-6 sm:p-10 rounded-2xl bg-[#0c0f18] border border-white/[0.08] shadow-2xl">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
