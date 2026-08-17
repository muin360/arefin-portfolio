import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import HeroSignature from "./HeroSignature";

interface HeroSectionProps {
  availabilityNote?: string;
  profileImage?: string | null;
  name?: string;
  role?: string;
}

export default function HeroSectionV2({
  availabilityNote = "Open to automation projects",
  profileImage,
  name = "Arefin Mueen",
  role = "AI Automation & AI Agent Developer",
}: HeroSectionProps) {
  const line1 = "I build AI systems".split(" ");
  const line2Pre = ["that", "automate"];
  const line2Accent = "real work.";
  const line2Post: string[] = [];

  let wordIdx = 0;
  const delay = () => `${wordIdx++ * 55}ms`;

  return (
    <section className="v2-hero" aria-label="Hero">
      <div className="v2-hero__grain" aria-hidden="true" />
      <div className="v2-hero__mesh" aria-hidden="true" />
      <div className="cosmic-grid" aria-hidden="true" />
      <div className="nebula-orb nebula-orb--hero" aria-hidden="true" />

      <div className="v2-hero__inner">
        <div className="v2-hero__grid items-center">
          {/* LEFT COL */}
          <div className="v2-hero__left">
            <span className="v2-hero__pill">
              <span className="v2-hero__pill-dot" aria-hidden="true" />
              <span className="v2-hero__pill-text">
                {role.toUpperCase()}
              </span>
              <span aria-hidden="true" className="v2-hero__pill-sep">·</span>
              <span className="v2-hero__pill-meta shimmer-label">Dhaka · GMT+6 · open to work</span>
            </span>

            <h1 className="v2-hero__headline">
              {/* Line 1 — geometric sans (Syne via --f-display) */}
              <span className="v2-hero__line">
                {line1.map((w, i) => (
                  <span
                    key={`l1-${i}`}
                    className="v2-hero__word"
                    style={{ ["--word-delay" as string]: delay() }}
                  >
                    {w}{" "}
                  </span>
                ))}
              </span>
              {/* Line 2 — italic serif (Instrument Serif) with accent word */}
              <span className="v2-hero__line v2-hero__line--serif">
                {line2Pre.map((w, i) => (
                  <span
                    key={`l2p-${i}`}
                    className="v2-hero__word"
                    style={{ ["--word-delay" as string]: delay() }}
                  >
                    {w}{" "}
                  </span>
                ))}
                <span
                  className="v2-hero__word v2-hero__accent"
                  style={{ ["--word-delay" as string]: delay() }}
                >
                  {line2Accent}{" "}
                </span>
                {line2Post.map((w, i) => (
                  <span
                    key={`l2s-${i}`}
                    className="v2-hero__word"
                    style={{ ["--word-delay" as string]: delay() }}
                  >
                    {w}{" "}
                  </span>
                ))}
              </span>
            </h1>

            <p className="v2-hero__sub">
              Practical AI agents, RAG knowledge pipelines, multi-agent systems, and business workflow automations.
              <span className="v2-hero__sub-em"> n8n · LangChain · Langflow · LLMs · APIs · Python</span>
            </p>

            <div className="v2-hero__cta">
              <MagneticButton href="/contact" className="v2-hero__btn v2-hero__btn--primary group">
                <span>Let&rsquo;s Build an Automation</span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="v2-hero__btn-arrow"
                />
              </MagneticButton>
              <MagneticButton href="/projects" className="v2-hero__btn v2-hero__btn--ghost">
                <span>View My Projects</span>
              </MagneticButton>
            </div>

            <ul className="v2-hero__proof" aria-label="Trust signals">
              <li>
                <span className="v2-hero__proof-dot" />
                <span>AI Agents · RAG · Multi-Agent Workflows</span>
              </li>
              <li>
                <span className="v2-hero__proof-dot" />
                <span>{availabilityNote}</span>
              </li>
              <li>
                <span className="v2-hero__proof-dot" />
                <span>Zero Hallucination Guarantee</span>
              </li>
            </ul>
          </div>

          {/* RIGHT COL — Human + Technical Signature Visual */}
          <div className="v2-hero__right flex justify-center items-center w-full">
            <HeroSignature
              profileImage={profileImage}
              name={name}
              role={role}
              availabilityNote={availabilityNote}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
