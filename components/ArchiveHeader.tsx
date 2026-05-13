import Image from "next/image";

const navItems = ["Work", "Studio", "Services", "Contact"];

// Header height = pt-8 (32) + pb-4 (16) + logo h-7 (28) = 76px
export const HEADER_HEIGHT = 76;

export default function ArchiveHeader() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-[60] flex items-start gap-6 px-10 pt-8 pb-4 w-full"
      style={{ mixBlendMode: "difference" }}
    >
      {/* Logo — inverted to white so difference blend reads correctly */}
      <div className="flex flex-1 flex-col items-start justify-center min-w-0">
        <div className="relative h-7" style={{ width: "118.744px" }}>
          <Image
            src="/logo.svg"
            alt="studio.seven"
            fill
            className="object-contain object-left"
            style={{ filter: "invert(1)" }}
            priority
          />
        </div>
      </div>

      {/* Navigation — white text, inverts against whatever is behind */}
      <nav className="flex items-center gap-2 self-stretch">
        {navItems.map((item, i) => (
          <button key={item} className="flex items-center h-full cursor-pointer">
            <span
              className="text-base text-white font-medium capitalize text-right whitespace-nowrap leading-6"
              style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
            >
              {item}{i < navItems.length - 1 ? "," : ""}
            </span>
          </button>
        ))}
      </nav>
    </header>
  );
}
