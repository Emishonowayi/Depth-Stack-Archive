"use client";

import { useRef, useState } from "react";
import { projects } from "@/lib/projects";
import ArchiveHeader, { HEADER_HEIGHT } from "./ArchiveHeader";
import WorkList from "./WorkList";
import StackPreviewSystem from "./StackPreviewSystem";

export default function StudioSevenArchive() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const prevIndexRef = useRef<number | null>(null);

  const handleRowEnter = (index: number) => {
    if (prevIndexRef.current !== null && prevIndexRef.current !== index) {
      setDirection(index > prevIndexRef.current ? 1 : -1);
    }
    setActiveIndex(index);
    prevIndexRef.current = index;
  };

  const handleListLeave = () => {
    setActiveIndex(null);
    prevIndexRef.current = null;
  };

  return (
    <div className="relative min-h-screen flex flex-col" style={{ backgroundColor: "#f0f0f0" }}>

      {/* Mobile fallback — hidden on md+ */}
      <div className="md:hidden fixed inset-0 z-[100] flex items-center justify-center px-8" style={{ backgroundColor: "#f0f0f0" }}>
        <p
          style={{
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 500,
            fontSize: "16px",
            letterSpacing: "-0.32px",
            color: "#000",
            textAlign: "center",
          }}
        >
          Mobile support is coming soon.<br />Please view on desktop.
        </p>
      </div>
      <ArchiveHeader />
      {/* Spacer reserves the space the fixed header no longer occupies in flow */}
      <div style={{ height: HEADER_HEIGHT }} className="shrink-0" />
      <WorkList
        projects={projects}
        activeIndex={activeIndex}
        onRowEnter={handleRowEnter}
        onListLeave={handleListLeave}
      />
      <div className="h-16 shrink-0" />

      {/* Stack lives outside the scrollable list so it's always viewport-centered */}
      <StackPreviewSystem
        activeIndex={activeIndex}
        direction={direction}
        projects={projects}
      />
    </div>
  );
}
