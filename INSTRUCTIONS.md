# Tensorix v1 + v2 — Combined Drop-In (GitHub Desktop friendly)

This single zip contains **all 29 files** that changed across both v1
(`eed4580` — Deep Neural Dark design system) and v2 (`76709ba` — Hero
dashboard widget, bento services, stats, projects, testimonials,
journal, FAQ, navbar, footer rebuilds).

Apply with GitHub Desktop:

1. Extract this zip into your local `arefin-portfolio` repo folder.
   Confirm "Replace" when prompted (you want existing files to be
   overwritten).
2. Open GitHub Desktop. The Changes tab should show ~29 modified /
   added files.
3. Current Branch dropdown → New Branch → name it
   `devin/tensorix-visual-overhaul` → Create.
4. Commit summary: `feat(visual): Tensorix v1+v2 visual overhaul`.
   Description: `Deep Neural Dark design system + Hero dashboard
   widget, bento services, stats CountUp, projects grid, testimonials,
   journal, FAQ, navbar, footer.`
5. Commit to branch → Publish branch (or Push origin).
6. On github.com, click "Compare & pull request" → open the PR.

## Files included (29)

```
src/app/about/page.tsx
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/app/projects/page.tsx
src/app/services/page.tsx
src/components/AIReadinessAudit.tsx
src/components/Footer.tsx
src/components/GlowCard.tsx
src/components/LiveIndicator.tsx
src/components/Navbar.tsx
src/components/NeuralMesh.tsx
src/components/SectionLabel.tsx
src/components/ServiceCardLarge.tsx
src/components/v2/AgentDashboard.tsx
src/components/v2/BentoServices.tsx
src/components/v2/CountUp.tsx
src/components/v2/FaqAccordionV2.tsx
src/components/v2/FinalCtaV2.tsx
src/components/v2/HeroSectionV2.tsx
src/components/v2/JournalGridV2.tsx
src/components/v2/ProjectsGridV2.tsx
src/components/v2/StatsBar.tsx
src/components/v2/TechTicker.tsx
src/components/v2/TerminalLog.tsx
src/components/v2/TestimonialsV2.tsx
src/components/v2/TypewriterText.tsx
src/hooks/useInView.ts
src/hooks/useReducedMotion.ts
```

`npm run lint` and `npm run build` both pass on this combined state.
