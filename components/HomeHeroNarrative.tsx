import Link from "next/link";
import { RefObject } from "react";

interface HomeHeroNarrativeProps {
  activePhase: number;
  typedText1: string;
  typedText2: string;
  typedText3: string;
  h1Ref: RefObject<HTMLHeadingElement | null>;
}

export default function HomeHeroNarrative({
  activePhase,
  typedText1,
  typedText2,
  typedText3,
  h1Ref,
}: HomeHeroNarrativeProps) {
  return (
    <div className="relative z-20 flex flex-col items-center justify-center h-full w-full max-w-5xl mx-auto px-6 select-none">
      <div className="relative w-full flex flex-col items-center justify-center min-h-[30rem] md:min-h-[36rem]">

        {activePhase === 1 && (
          <div className="flex flex-col items-center text-center space-y-6 w-full animate-fade-in">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-black uppercase tracking-tighter md:tracking-[-0.05em] text-white leading-none max-w-6xl drop-shadow-[0_0_35px_rgba(168,85,247,0.45)] text-center">
              {typedText1}
              {typedText1.length < "EL UNIVERSO TE LLAMA, RESPONDE!".length && (
                <span className="animate-pulse ml-1 text-purple-400">|</span>
              )}
            </h1>
          </div>
        )}

        {activePhase === 2 && (
          <div className="flex flex-col items-center text-center space-y-6 w-full animate-fade-in">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-black uppercase tracking-tighter md:tracking-[-0.05em] text-white leading-none max-w-6xl drop-shadow-[0_0_35px_rgba(99,102,241,0.45)] text-center">
              {typedText2}
              {typedText2.length < "MÁS ALLÁ DEL HORIZONTE, TU DESTINO TE ESPERA.".length && (
                <span className="animate-pulse ml-1 text-indigo-400 font-sans">|</span>
              )}
            </h1>
          </div>
        )}

        {activePhase === 3 && (
          <div id="aerospace" className="flex flex-col items-center text-center space-y-8 w-full animate-fade-in">
            <h1 ref={h1Ref} className="text-6xl md:text-[9rem] font-black text-white tracking-tighter leading-[0.8] text-center select-none transition-transform duration-75 ease-out drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              IRIS <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-slate-400 px-10">
                AEROSPACE
              </span>
            </h1>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-[0.16em] text-purple-200 leading-relaxed min-h-[3rem] font-mono max-w-5xl drop-shadow-[0_0_20px_rgba(168,85,247,0.25)] text-center">
              {typedText3}
              {typedText3.length < "TU BOLETO DE ENTRADA HACIA LA INFINIDAD DEL COSMOS.".length && (
                <span className="animate-pulse ml-1 text-purple-400">|</span>
              )}
            </h2>

            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-6 w-full pt-6 transition-all duration-1000 delay-500 transform ${activePhase === 3 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95 pointer-events-none"
                }`}
            >
              <Link
                href="/booking"
                className="px-10 py-4 md:px-12 md:py-5 bg-white text-black rounded-full font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] hover:bg-purple-600 hover:text-white transition-all shadow-2xl shadow-purple-600/20 hover:scale-105 active:scale-95"
              >
                Anímate y reserva
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 md:px-10 md:py-5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all backdrop-blur-md hover:scale-105 active:scale-95"
              >
                Conoce más
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
