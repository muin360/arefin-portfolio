"use client";

import { motion } from "framer-motion";

// Word-by-word reveal for big editorial headlines. Splits on spaces, animates
// each word on a stagger. Honors prefers-reduced-motion via Framer's built-in
// detection (transform: none when reduced).
export default function AnimatedHeading({
  text,
  as: Tag = "h1",
  className,
  serifAt,
}: {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  // Optional: index of word(s) that should render in the editorial serif.
  serifAt?: number[];
}) {
  const words = text.split(" ");

  const Container = motion[Tag as "h1"] ?? motion.h1;
  return (
    <Container
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15% 0px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.045 } },
        hidden: {},
      }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-baseline mr-[0.25em]"
        >
          <motion.span
            className={`inline-block ${serifAt?.includes(i) ? "serif" : ""}`}
            variants={{
              hidden: { y: "110%", opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Container>
  );
}
