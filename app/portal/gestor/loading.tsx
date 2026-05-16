import { Loader2 } from "lucide-react";

export default function LoadingGestor() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 size={48} className="text-purple-500 animate-spin mb-4" />
      <p className="mono-text text-[10px] uppercase tracking-[0.3em] text-slate-500">
        Conectando con terminal de asistencia...
      </p>
    </div>
  );
}
