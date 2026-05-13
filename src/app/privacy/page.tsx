import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/Section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Tensorix handles your data, what we collect, what we don't, and the rights you have. Plain English. No dark patterns.",
  openGraph: {
    title: "Privacy Policy — Tensorix",
    description: "How Tensorix handles your data.",
    url: "/privacy",
  },
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "April 2026";
const CONTACT_EMAIL = "hello@tensorix.ai";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy Policy"
        index="08"
        meta={`Last updated · ${LAST_UPDATED}`}
        title={
          <>
            Your data, treated{" "}
            <span className="serif">the way you&apos;d treat your own.</span>
          </>
        }
        subtitle="Plain-English account of what Tensorix collects, what it doesn't, and the controls you have. No legalese, no dark patterns."
      />

      <section className="max-w-3xl mx-auto px-6 sm:px-8 section">
        <div className="prose-tensor space-y-12 text-foreground/85 leading-relaxed">
          <Block num="01" title="Who this applies to">
            <p>
              This policy covers <strong>tensorix.ai</strong> and any
              subdomains (the &quot;Site&quot;), operated by Arefin Muin trading as
              <strong> Tensorix</strong> (&quot;we&quot;, &quot;us&quot;). It explains what
              happens when you browse the Site, fill out the contact form,
              book a call, or message us on WhatsApp.
            </p>
            <p>
              By using the Site you agree to this policy. If you don&apos;t agree,
              please don&apos;t use the Site.
            </p>
          </Block>

          <Block num="02" title="What we collect (the short version)">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Aggregate, anonymous traffic data</strong> via Vercel
                Analytics (page views, country, browser family, referrer).
                Cookieless. No personal identifiers.
              </li>
              <li>
                <strong>Anything you voluntarily submit</strong> via the
                contact form: name, email, optional company, and your message.
              </li>
              <li>
                <strong>Network logs</strong> from our hosting provider
                (Vercel) — IP address, request path, status code. Standard
                infrastructure logs, retained ~30 days.
              </li>
            </ul>
            <p className="mt-4">
              We do <strong>not</strong> set tracking cookies, do not use
              Google Analytics, Meta Pixel, LinkedIn Insight, HubSpot, or any
              other third-party tracker.
            </p>
          </Block>

          <Block num="03" title="Vercel Analytics (cookieless, GDPR-compatible)">
            <p>
              The Site uses Vercel Analytics and Vercel Speed Insights. Both
              are cookieless and do not store personal data. They aggregate
              page views and core web vitals to help us understand which
              pages are useful and where the site is slow.
            </p>
            <p>
              No fingerprinting. No cross-site tracking. No advertising
              profiles. See{" "}
              <a
                href="https://vercel.com/docs/analytics/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-foreground"
              >
                Vercel&apos;s analytics privacy policy
              </a>{" "}
              for the technical details.
            </p>
          </Block>

          <Block num="04" title="Contact form (Resend)">
            <p>
              When you submit the contact form, the message is delivered to
              our inbox via{" "}
              <a
                href="https://resend.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-foreground"
              >
                Resend
              </a>
              , a transactional email service. The data you typed (name, email,
              optional company, message) is emailed to{" "}
              <code className="mono text-xs">{CONTACT_EMAIL}</code> and
              transiently passes through Resend&apos;s servers.
            </p>
            <p>
              We use it solely to reply to your inquiry. We do not add you to
              a marketing list, do not enrich your record with third-party
              data, and do not sell or share it with anyone.
            </p>
            <p>
              Submissions are retained as long as the email thread is active
              (typically 12–24 months) and then archived or deleted. You can
              ask us to delete yours at any time — see &quot;Your rights&quot; below.
            </p>
          </Block>

          <Block num="05" title="Booking calls (Cal.com)">
            <p>
              The <Link href="/book" className="link-underline text-foreground">/book</Link>{" "}
              page embeds a scheduling widget from{" "}
              <a
                href="https://cal.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-foreground"
              >
                Cal.com
              </a>
              . When you pick a slot, your name, email, and any answers you
              provide go directly to Cal.com under their privacy policy. We
              receive the booking confirmation by email.
            </p>
            <p>
              Cal.com may set its own cookies inside the embedded widget. We
              do not control these. If you prefer not to use the widget,
              email or WhatsApp instead — both are listed on the{" "}
              <Link href="/contact" className="link-underline text-foreground">
                contact page
              </Link>
              .
            </p>
          </Block>

          <Block num="06" title="WhatsApp links">
            <p>
              WhatsApp click-to-chat links open a conversation with a
              pre-filled first message. No tracking parameters, no UTM tags.
              Once you send the message, the conversation is governed by{" "}
              <a
                href="https://www.whatsapp.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-foreground"
              >
                WhatsApp&apos;s privacy policy
              </a>
              . We retain WhatsApp conversations on the Tensorix business phone
              for as long as the relationship is active.
            </p>
          </Block>

          <Block num="07" title="Sanity CMS (content only — not your data)">
            <p>
              Site copy, services, FAQs, and case studies are stored in{" "}
              <a
                href="https://www.sanity.io/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-foreground"
              >
                Sanity
              </a>
              , a headless CMS. Sanity stores our content — not your personal
              data. Your visit to the Site does not result in any data being
              written to Sanity.
            </p>
          </Block>

          <Block num="08" title="Cookies">
            <p>The Site sets no first-party cookies of its own.</p>
            <p>
              Embedded third-party widgets (currently only Cal.com on the
              /book page) may set cookies inside their iframes. These are
              required for the widget to function. If you don&apos;t use the
              widget, no cookies are set.
            </p>
          </Block>

          <Block num="09" title="Your rights (GDPR / CCPA)">
            <p>
              Wherever you are, you can ask us to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Confirm what personal data we hold about you.</li>
              <li>Send you a copy of it.</li>
              <li>Correct anything that&apos;s wrong.</li>
              <li>Delete it (subject to legal retention obligations).</li>
              <li>
                Object to or restrict how we process it — though for a
                portfolio inquiry inbox, the only processing is &quot;reading the
                email and replying&quot;, which is hard to object to without
                deleting the message.
              </li>
            </ul>
            <p>
              Email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Privacy%20request`}
                className="link-underline text-foreground"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              with subject &quot;Privacy request&quot; and we&apos;ll respond within 30
              days. We don&apos;t charge a fee.
            </p>
          </Block>

          <Block num="10" title="Children">
            <p>
              The Site is for business inquiries. It is not directed at
              children under 16 and we don&apos;t knowingly collect data from
              them. If you believe a minor has submitted personal data,
              email us and we&apos;ll delete it.
            </p>
          </Block>

          <Block num="11" title="Security">
            <p>
              The Site is served over HTTPS-only with HSTS preload, ships a
              strict Content Security Policy, frames are denied
              (clickjacking-protected), and no secrets are exposed to the
              browser. We use industry-standard transport encryption with
              every third-party service we connect to (Resend, Sanity,
              Cal.com, Vercel).
            </p>
            <p>
              No system is perfect. If you find a vulnerability, see{" "}
              <a
                href="/.well-known/security.txt"
                className="link-underline text-foreground"
              >
                /.well-known/security.txt
              </a>{" "}
              or email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Security%20report`}
                className="link-underline text-foreground"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              with subject &quot;Security report&quot;.
            </p>
          </Block>

          <Block num="12" title="AI scrapers">
            <p>
              Our robots.txt asks GPTBot, ClaudeBot, anthropic-ai,
              Google-Extended, CCBot, PerplexityBot, Bytespider, Amazonbot
              and FacebookBot not to use this Site for training. Compliant
              crawlers will respect this; non-compliant ones we cannot stop
              technically.
            </p>
          </Block>

          <Block num="13" title="Changes">
            <p>
              We&apos;ll update this policy when the Site or our tooling
              changes. The &quot;Last updated&quot; date at the top reflects the most
              recent version. Material changes will be flagged on the
              homepage for at least 30 days.
            </p>
          </Block>

          <Block num="14" title="Contact">
            <p>
              Questions about privacy? Email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="link-underline text-foreground"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Block>
        </div>

        <p className="mt-16 text-xs mono text-muted">
          Last updated · {LAST_UPDATED} · See also{" "}
          <Link href="/terms" className="link-underline">
            Terms of Service
          </Link>
        </p>
      </section>
    </>
  );
}

function Block({
  num,
  title,
  children,
}: {
  num: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-4 border-t border-line pt-8">
      <div className="md:col-span-2">
        <span className="num text-sm text-muted">/{num}</span>
      </div>
      <div className="md:col-span-10 space-y-4">
        <h2 className="display text-xl md:text-2xl tracking-tight text-foreground">
          {title}
        </h2>
        <div className="space-y-3">{children}</div>
      </div>
    </section>
  );
}
