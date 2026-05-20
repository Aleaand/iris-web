import { Sparkles } from "lucide-react";

interface HomeHeroLoaderProps {
  show: boolean;
  progress: number;
  loaded: boolean;
}

export default function HomeHeroLoader({ show, progress, loaded }: HomeHeroLoaderProps) {
  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#06040d] flex flex-col items-center justify-center space-y-6 transition-opacity duration-700 ease-in-out ${loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-purple-500/10 border-t-purple-400 border-r-purple-400/20 animate-spin" />
        <div className="absolute inset-2 rounded-full border border-indigo-500/10 border-b-indigo-400 border-l-indigo-400/20 animate-[spin_2s_linear_infinite_reverse]" />
        <div className="w-10 h-10 rounded-full bg-purple-500/20 blur-md animate-pulse" />
        <Sparkles className="text-purple-400 animate-pulse absolute" size={24} />
      </div>

      <div className="flex flex-col items-center space-y-2 text-center">
        <h3 className="text-xs uppercase tracking-[0.4em] text-purple-300 font-mono">
          Iris Aeroespace
        </h3>
        <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-light">
          Cargando... {progress}%
        </p>
      </div>

      <div className="w-48 h-[1px] bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-slate-400 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
