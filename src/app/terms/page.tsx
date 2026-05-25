import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/Section";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern use of tensorix.me and any engagement with Tensorix for AI automation, Messenger bots, or website development.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "April 2026";
const CONTACT_EMAIL = "hello@tensorix.me";

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terms of Service"
        index="09"
        meta={`Last updated · ${LAST_UPDATED}`}
        title={
          <>
            The rules of the road,{" "}
            <span className="serif">in plain English.</span>
          </>
        }
        subtitle="What you can expect from Tensorix, what we expect from you, and how we handle the boring-but-important parts. Written to be read, not skimmed past."
      />

      <section className="max-w-3xl mx-auto px-6 sm:px-8 section">
        <div className="prose-tensor space-y-12 text-foreground/85 leading-relaxed">
          <Block num="01" title="Who we are">
            <p>
              &quot;Tensorix&quot;, &quot;we&quot;, and &quot;us&quot; refer to Arefin Muin, an
              independent contractor based in Dhaka, Bangladesh, operating
              under the name Tensorix and accessible at{" "}
              <strong>tensorix.me</strong>.
            </p>
            <p>
              &quot;You&quot; means the person browsing the Site, the person who
              books a call, or the business that engages us for a project.
            </p>
          </Block>

          <Block num="02" title="What these terms cover">
            <p>
              These Terms govern: (a) your use of this Site, and (b) any{" "}
              <strong>pre-engagement interactions</strong> — emails, calls,
              audits, proposals, scoping conversations.
            </p>
            <p>
              Once we sign a separate <strong>Project Agreement</strong> or
              <strong> Statement of Work</strong> for a paid engagement, that
              document governs the engagement and overrides these Terms where
              they conflict. Until then, these Terms apply.
            </p>
          </Block>

          <Block num="03" title="Use of the Site">
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Site for any unlawful purpose.</li>
              <li>
                Scrape, crawl, mirror, or train AI models on the content
                without written permission (compliant crawlers can read{" "}
                <code className="mono text-xs">robots.txt</code>).
              </li>
              <li>
                Attempt to bypass security controls, probe vulnerabilities, or
                disrupt the Site&apos;s availability — except via{" "}
                <Link
                  href="/.well-known/security.txt"
                  className="link-underline text-foreground"
                >
                  good-faith disclosure
                </Link>
                .
              </li>
              <li>
                Submit false contact details or impersonate someone else.
              </li>
              <li>
                Submit content that is unlawful, defamatory, infringing, or
                contains malware.
              </li>
            </ul>
          </Block>

          <Block num="04" title="Free audits & calls">
            <p>
              The 30-minute audit call is free, no-obligation, and not a
              binding engagement. After the call we may send a written
              recommendation with an indicative scope and pricing. You&apos;re
              free to take the recommendation, walk away, or implement it
              yourself with anyone.
            </p>
            <p>
              The audit is delivered &quot;as-is&quot; — recommendations only, no
              guarantees about outcomes from a 30-minute conversation.
            </p>
          </Block>

          <Block num="05" title="Engagements & payment">
            <p>
              Paid engagements (AI automation builds, Messenger bots, website
              development, retainer support) are governed by a separate
              Project Agreement that we sign together before work starts.
              That agreement specifies scope, deliverables, milestones, price,
              and payment schedule.
            </p>
            <p>Standard practice unless specified otherwise:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>50% deposit</strong> on signature, balance on
                delivery.
              </li>
              <li>
                <strong>Flat-price builds</strong>, no hidden hourly billing.
              </li>
              <li>
                <strong>Fast async communication</strong> during active project
                milestones.
              </li>
              <li>
                <strong>30-day post-launch support</strong> for bug fixes
                included.
              </li>
              <li>
                Payment in USD via Wise, bank transfer, or another agreed
                method.
              </li>
              <li>
                Late payments accrue 1.5% per month after 30 days, or the
                maximum permitted by law, whichever is lower.
              </li>
            </ul>
            <p>
              We reserve the right to pause work if an invoice is more than
              14 days overdue.
            </p>
          </Block>

          <Block num="06" title="Scope changes">
            <p>
              If the work you ask for grows beyond what we agreed (new
              features, new integrations, new pages), we&apos;ll send a written
              change order with the additional cost and timeline. Work on the
              new scope starts only after you approve it.
            </p>
            <p>
              Small clarifications and adjustments inside the original scope
              are included — we&apos;re not going to nickel-and-dime you for a
              copy tweak.
            </p>
          </Block>

          <Block num="07" title="Ownership & intellectual property">
            <p className="font-semibold text-foreground">
              You own everything we build for you.
            </p>
            <p>
              On <strong>final payment</strong>, we assign to you all rights,
              title, and interest in the deliverables we created
              specifically for your project — code, copy, designs, prompts,
              workflow configurations, n8n / Zapier / Make flows, chatbot
              scripts, and any other custom artifacts.
            </p>
            <p>
              <strong>What we keep:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Pre-existing code, libraries, components, prompts, or
                templates we wrote before your project (&quot;Background IP&quot;).
                You get a perpetual, royalty-free license to use the
                Background IP as embedded in your deliverables.
              </li>
              <li>
                Open-source components retain their original licenses (MIT,
                Apache, etc.).
              </li>
              <li>
                Third-party tools (n8n, Zapier, Make, Resend, Cal.com, Sanity,
                OpenAI, Anthropic, Meta Cloud API) remain governed by their
                own terms — your account, your billing relationship.
              </li>
              <li>
                The right to mention publicly that we worked together
                (company name, sector, type of work) in case studies and
                portfolio pieces, unless you ask in writing for an NDA-style
                arrangement.
              </li>
            </ul>
          </Block>

          <Block num="08" title="Confidentiality">
            <p>
              Anything you share that&apos;s not publicly available — strategy,
              numbers, customer data, internal processes — we treat as
              confidential. We won&apos;t share it with anyone outside the
              engagement, and we won&apos;t use it for any purpose other than
              delivering your project.
            </p>
            <p>
              This obligation survives the engagement. If you need a signed
              NDA before sharing sensitive material, ask.
            </p>
          </Block>

          <Block num="09" title="Your responsibilities">
            <p>To deliver well, we need you to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Provide accurate, timely access to accounts, content,
                screenshots, brand assets, and stakeholders.
              </li>
              <li>
                Reply to questions within 1–2 business days. Long silences
                push the timeline.
              </li>
              <li>
                Hold your own subscriptions (OpenAI, Anthropic, Meta API,
                hosting, domain, CMS, email service, etc.). We can advise but
                we don&apos;t resell.
              </li>
              <li>
                Make sure you have the legal right to share content,
                customer lists, brand assets, and any data you give us.
              </li>
            </ul>
          </Block>

          <Block num="10" title="Warranties & disclaimers">
            <p>
              We warrant that we&apos;ll perform the work professionally and
              competently, with reasonable skill and care.
            </p>
            <p>
              <strong>What we don&apos;t warrant:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Specific business outcomes (revenue, leads, conversion lifts)
                — too many variables outside our control.
              </li>
              <li>
                That third-party platforms (Meta, OpenAI, Zapier, n8n, etc.)
                won&apos;t change their APIs, pricing, or policies. They will. We
                build defensively but cannot guarantee a workflow will run
                untouched forever.
              </li>
              <li>
                That AI outputs will be accurate 100% of the time. AI
                models hallucinate. We design guardrails, but you remain
                responsible for review of AI-generated content used in
                customer-facing contexts.
              </li>
              <li>
                Compatibility with browsers, devices, or platforms older than
                what we agreed to support in the Project Agreement.
              </li>
            </ul>
            <p>
              The Site itself is provided &quot;as-is&quot; and &quot;as-available&quot;,
              without warranties of any kind, express or implied, to the
              maximum extent permitted by law.
            </p>
          </Block>

          <Block num="11" title="Limitation of liability">
            <p>
              To the maximum extent permitted by law, our total aggregate
              liability arising out of or related to the Site or any
              engagement — whether in contract, tort, negligence, or otherwise
              — is capped at the <strong>greater of</strong> (a) the fees you
              paid us in the 12 months preceding the claim, or (b) USD 1,000.
            </p>
            <p>
              We are not liable for indirect, incidental, special, punitive,
              or consequential damages, including lost profits, lost revenue,
              business interruption, or loss of data — even if we were
              advised of the possibility.
            </p>
            <p>
              Nothing in these Terms limits liability that cannot be limited
              by law (e.g. fraud, willful misconduct, death or personal
              injury caused by negligence, or statutory consumer rights).
            </p>
          </Block>

          <Block num="12" title="Termination">
            <p>
              Either party may terminate an engagement in writing with 7
              days&apos; notice. On termination:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You pay for all work completed up to the termination date.
              </li>
              <li>
                We hand over deliverables in their then-current state once
                outstanding fees are paid.
              </li>
              <li>
                The deposit is non-refundable for work already started but is
                credited against fees owed.
              </li>
              <li>
                Confidentiality, IP assignment (for paid-up deliverables),
                and limitation of liability survive termination.
              </li>
            </ul>
            <p>
              We may suspend or terminate Site access immediately if you
              breach these Terms or use the Site to harm others.
            </p>
          </Block>

          <Block num="13" title="Third-party services & links">
            <p>
              The Site links to and integrates with third-party services
              (Cal.com, WhatsApp, Resend, Sanity, Vercel, social platforms).
              We are not responsible for the content, policies, availability,
              or practices of those services. Use them under their own terms.
            </p>
          </Block>

          <Block num="14" title="Indemnification">
            <p>
              You agree to indemnify and hold us harmless from any claim
              arising out of: (a) your breach of these Terms, (b) content or
              data you provide that infringes a third party&apos;s rights or
              violates law, or (c) your use of the deliverables in a manner
              not contemplated in the Project Agreement.
            </p>
          </Block>

          <Block num="15" title="Governing law & disputes">
            <p>
              These Terms are governed by the laws of{" "}
              <strong>Bangladesh</strong>, without regard to conflict-of-laws
              rules. Disputes arising out of or related to these Terms or the
              Site are subject to the exclusive jurisdiction of the courts of
              Dhaka, Bangladesh.
            </p>
            <p>
              Before filing anything, talk to us first —{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Dispute`}
                className="link-underline text-foreground"
              >
                {CONTACT_EMAIL}
              </a>
              . Most disagreements can be resolved over a 20-minute call.
            </p>
            <p>
              If you&apos;re a consumer in a jurisdiction that grants you
              non-waivable rights (e.g. EU/UK consumer protection), nothing
              in this section overrides those rights.
            </p>
          </Block>

          <Block num="16" title="Changes to these Terms">
            <p>
              We may update these Terms as the Site or our services evolve.
              The &quot;Last updated&quot; date at the top reflects the most recent
              version. Material changes will be flagged on the homepage for
              at least 30 days. Continued use of the Site after changes take
              effect means you accept the updated Terms.
            </p>
            <p>
              Changes do not retroactively alter signed Project Agreements.
            </p>
          </Block>

          <Block num="17" title="Severability & entire agreement">
            <p>
              If any clause is unenforceable, the rest stays in effect.
              Together with our{" "}
              <Link href="/privacy" className="link-underline text-foreground">
                Privacy Policy
              </Link>{" "}
              and any signed Project Agreement, these Terms are the complete
              agreement between you and Tensorix regarding the Site and
              pre-engagement interactions, and supersede prior verbal or
              written communications on the same subject.
            </p>
          </Block>

          <Block num="18" title="Contact">
            <p>
              Questions about these Terms? Email{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Terms%20question`}
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
          <Link href="/privacy" className="link-underline">
            Privacy Policy
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
