import type { Variants, Variant } from "framer-motion";
// letterPositions.ts
export const LETTER_POSITIONS = [
  { x: 0, y: -30, rotate: -12 },
  { x: -10, y: 40, rotate: 8 },
  { x: -50, y: 0, rotate: -4 },
  { x: -90, y: 35, rotate: 10 },
  { x: -90, y: -45, rotate: -8 },
];

export const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 90,
    y: 10,
    rotate: 0,
  },
  visible: ((i: number) => {
    const pos = LETTER_POSITIONS[i % LETTER_POSITIONS.length];

    return {
      opacity: 1,
      x: pos.x,
      y: pos.y,
      rotate: [0, 720 + pos.rotate],
      transition: {
        delay: i * 0.15,
        duration: 0.9,
        ease: "easeOut",
        rotate: {
          duration: 1.2,
          ease: "easeInOut",
        },
      },
    };
  }) as Variant,
};
