"use client";

import { Project } from "@/lib/projects";

type Props = {
  project: Project;
  isInactive: boolean;
  onMouseEnter: () => void;
};

export default function WorkRow({ project, isInactive, onMouseEnter }: Props) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      className="flex items-center h-11 px-10 w-full shrink-0 cursor-default select-none relative z-10"
      style={{
        opacity: isInactive ? 0.2 : 1,
        transition: "opacity 0.35s ease-out",
      }}
    >
      {/* Project title */}
      <div className="flex-1 flex items-center min-w-0">
        <span
          className="text-base text-black whitespace-nowrap"
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 400,
            letterSpacing: "-0.24px",
            lineHeight: 1.5,
          }}
        >
          {project.title}
        </span>
      </div>

      {/* Meta: categories · year */}
      <div className="flex items-center gap-3">
        <span
          className="text-base text-black whitespace-nowrap"
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 400,
            letterSpacing: "-0.24px",
            lineHeight: 1.5,
          }}
        >
          {project.categories}
        </span>
        <span className="block w-1 h-1 rounded-full bg-black shrink-0" />
        <span
          className="text-base text-black whitespace-nowrap"
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 400,
            letterSpacing: "-0.24px",
            lineHeight: 1.5,
          }}
        >
          {project.year}
        </span>
      </div>
    </div>
  );
}
