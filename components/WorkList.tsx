"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Project } from "@/lib/projects";
import WorkRow from "./WorkRow";

const ROW_HEIGHT = 44;

type Props = {
  projects: Project[];
  activeIndex: number | null;
  onRowEnter: (index: number) => void;
  onListLeave: () => void;
};

export default function WorkList({ projects, activeIndex, onRowEnter, onListLeave }: Props) {
  return (
    <div className="flex flex-col flex-1 min-h-0 w-full overflow-y-auto">
      {/* Section heading */}
      <div className="flex items-start gap-2 px-10 pt-14 pb-0 shrink-0">
        <h1
          className="text-black leading-none"
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 500,
            fontSize: "36px",
            letterSpacing: "-0.72px",
            lineHeight: 0.88,
          }}
        >
          Work
        </h1>
        <span
          className="text-black mt-[7px]"
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            letterSpacing: "-0.8px",
            lineHeight: 0.88,
          }}
        >
          ({projects.length})
        </span>
      </div>

      {/* Archive rows */}
      <div
        className="relative flex flex-col w-full mt-6"
        onMouseLeave={onListLeave}
      >
        {/* Sliding highlight — single shared element that follows the hovered row */}
        <AnimatePresence>
          {activeIndex !== null && (
            <motion.div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                height: ROW_HEIGHT,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
              }}
              initial={{ opacity: 0, y: activeIndex * ROW_HEIGHT }}
              animate={{ opacity: 1, y: activeIndex * ROW_HEIGHT }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.25, ease: "easeOut" },
                y: { type: "spring", stiffness: 500, damping: 45, mass: 0.8 },
              }}
            />
          )}
        </AnimatePresence>

        {projects.map((project, i) => (
          <WorkRow
            key={project.id}
            project={project}
            isInactive={activeIndex !== null && activeIndex !== i}
            onMouseEnter={() => onRowEnter(i)}
          />
        ))}
      </div>
    </div>
  );
}
