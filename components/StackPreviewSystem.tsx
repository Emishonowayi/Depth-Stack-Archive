"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import Image from "next/image";
import { Project } from "@/lib/projects";

const STACK_SIZE = 4;
const EASING: [number, number, number, number] = [0.22, 1, 0.36, 1];
const TRANSITION = { duration: 0.55, ease: EASING };

const CARD_W = 334;
const CARD_H = 400;

/**
 * Every card has a fixed 334 × 400 DOM box. Depth is expressed entirely via
 * CSS transforms (scale + translateY), both of which are GPU-composited and
 * never trigger layout reflow or image re-rasterization.
 *
 * Scale derives from original Figma widths:
 *   292.25 / 334 = 0.875
 *   250.5  / 334 = 0.75
 *   208.75 / 334 = 0.625
 *
 * Y derives from the visual top offsets, accounting for center-origin scale:
 *   y = visual_top - CARD_H * (1 - scale) / 2
 *
 * Crucially, `scale` is ONLY used to represent depth — enter/exit effects use
 * opacity and y nudges, never modify scale. This prevents the double-duty
 * interpolation conflict that caused jank in earlier attempts.
 *
 * Depth blur lives on the static inner wrapper (imageBlur via CSS filter)
 * and the frosted overlay (backdropFilter). The inner wrapper has
 * overflow:hidden to contain any filter halo within the card bounds.
 */
const DEPTH_CONFIG = [
  { y: 0,    scale: 1,     imageBlur: 0,  overlayBlur: 0,  overlayColor: "rgba(230,230,230,0)"   },
  { y: -56,  scale: 0.875, imageBlur: 4,  overlayBlur: 20, overlayColor: "rgba(230,230,230,0.4)" },
  { y: -112, scale: 0.75,  imageBlur: 8,  overlayBlur: 20, overlayColor: "rgba(230,230,230,0.6)" },
  { y: -168, scale: 0.625, imageBlur: 10, overlayBlur: 20, overlayColor: "rgba(230,230,230,0.8)" },
] as const;

type Custom = { direction: 1 | -1; depthIndex: number };

const cardVariants: Variants = {
  /**
   * Enter at the correct depth (scale + y from config), with a small y nudge
   * for directional feel. Scale is NOT offset on enter — it stays at depth value.
   */
  initial: (c: Custom) => {
    const d = DEPTH_CONFIG[c.depthIndex];
    return {
      opacity: 0,
      scale: d.scale,
      y: d.y + (c.direction === 1 ? 6 : -10),
      ...(c.depthIndex === 0 && { filter: "blur(0px)" }),
    };
  },

  /**
   * Rest at the depth's exact scale + y. No layout properties animated.
   * filter:blur is intentionally NOT animated here — see DEPTH_CONFIG note.
   */
  animate: (c: Custom) => {
    const d = DEPTH_CONFIG[c.depthIndex];
    return {
      opacity: 1,
      scale: d.scale,
      y: d.y,
      ...(c.depthIndex === 0 && { filter: "blur(0px)" }),
      transition: TRANSITION,
    };
  },

  /**
   * Front card: expands forward (scale 1 → 1.14), drifts down, blurs and fades.
   * Back cards: stay at their depth scale, fade with a small y nudge.
   */
  exit: (c: Custom) => {
    if (c.depthIndex === 0) {
      return {
        opacity: 0,
        scale: 1.14,
        y: 62,
        filter: "blur(3px)",
        transition: {
          duration: 0.55,
          ease: EASING,
          opacity: { duration: 0.15, ease: "easeOut" },
        },
      };
    }
    const d = DEPTH_CONFIG[c.depthIndex];
    return c.direction === 1
      ? { opacity: 0, scale: d.scale, y: d.y - 14, transition: { duration: 0.4, ease: EASING } }
      : { opacity: 0, scale: d.scale, y: d.y + 6,  transition: { duration: 0.4, ease: EASING } };
  },
};

type Props = {
  activeIndex: number | null;
  direction: 1 | -1;
  projects: Project[];
};

export default function StackPreviewSystem({ activeIndex, direction, projects }: Props) {
  const stackCards =
    activeIndex !== null
      ? Array.from({ length: STACK_SIZE }, (_, i) => ({
          project: projects[(activeIndex + i) % projects.length],
          depthIndex: i,
        }))
      : [];

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      {/*
       * No overflow:hidden anywhere in this tree. The card content (image, overlay)
       * is all position:absolute inset:0 and never escapes its own card box.
       * Back cards use negative y transforms to stack upward — clipping would hide them.
       * Removing overflow:hidden from animated elements also eliminates the GPU
       * compositor clip-rect recalculation that caused the edge snap after animation.
       */}
      <div style={{ position: "relative", width: CARD_W, height: CARD_H, background: "#f0f0f0" }}>
        <AnimatePresence mode="sync">
          {stackCards.map(({ project, depthIndex }) => {
            const d = DEPTH_CONFIG[depthIndex];
            return (
              <motion.div
                key={project.id}
                custom={{ direction, depthIndex } satisfies Custom}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: CARD_W,
                  height: CARD_H,
                  zIndex: STACK_SIZE - depthIndex,
                }}
              >
                {/*
                 * Static clip wrapper — never animated, so its clip rect never
                 * changes and never participates in compositor layer promotion/
                 * demotion. overflow:hidden here is safe; it's the same value
                 * every render, so the CPU compositor reproduces it identically
                 * when the outer motion.div's GPU layer is released.
                 */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  overflow: "hidden",
                  filter: d.imageBlur ? `blur(${d.imageBlur}px)` : undefined,
                  transition: "filter 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
                }}>
                  <div style={{ position: "absolute", inset: 0, background: "#c9c5c0" }} />

                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="334px"
                    priority={depthIndex === 0}
                  />

                  <motion.div
                    style={{
                      position: "absolute",
                      inset: -2,
                      backdropFilter: `blur(${d.overlayBlur}px)`,
                      WebkitBackdropFilter: `blur(${d.overlayBlur}px)`,
                      transition: "backdrop-filter 0.55s cubic-bezier(0.22, 1, 0.36, 1), -webkit-backdrop-filter 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                    animate={{ backgroundColor: d.overlayColor }}
                    transition={TRANSITION}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
