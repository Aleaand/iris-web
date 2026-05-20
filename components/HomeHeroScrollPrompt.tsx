import { ArrowDown } from "lucide-react";
import { RefObject } from "react";

interface HomeHeroScrollPromptProps {
  activePhase: number;
  arrowRef: RefObject<HTMLButtonElement | null>;
  onClick: () => void;
}

export default function HomeHeroScrollPrompt({ activePhase, arrowRef, onClick }: HomeHeroScrollPromptProps) {
  if (activePhase !== 1) return null;

  return (
    <button
      ref={arrowRef as any}
      onClick={onClick}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 z-20 pointer-events-auto cursor-pointer focus:outline-none hover:opacity-80 active:scale-95 transition-all animate-pulse"
    >
      <span className="text-[10px] tracking-[0.3em] text-purple-400 font-mono font-medium drop-shadow-md">
        DESLIZA..Y DESCUBRE
      </span>
      <ArrowDown size={18} className="text-purple-400 animate-bounce" />
    </button>
  );
}
