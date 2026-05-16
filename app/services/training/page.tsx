"use client";
import Navbar from "@/components/Navbar";
import Starfield from "@/components/Starfield";
import { Zap, Target, Activity, CheckCircle2, ChevronRight, Rocket, Users } from "lucide-react";
import Link from "next/link";

export default function TrainingServicePage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#06040d]">
      <Starfield />
      <Navbar />

      <section className="relative z-10 pt-48 pb-32 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="order-2 md:order-1">
             <div className="relative aspect-square card-purple rounded-[4rem] overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-tr from-purple-900/50 via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <div className="w-64 h-64 border-2 border-purple-500/20 rounded-full animate-ping" />
                        <div className="absolute inset-0 flex items-center justify-center">
                             <Zap size={64} className="text-purple-400 animate-pulse" />
                        </div>
                    </div>
                </div>
                {/* Stats overlays */}
                <div className="absolute top-10 left-10 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="mono-text text-[8px] text-purple-400 uppercase tracking-widest mb-1">Heart Rate</p>
                    <p className="text-white font-bold text-xl">72 BPM</p>
                </div>
                <div className="absolute bottom-10 right-10 p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                    <p className="mono-text text-[8px] text-purple-400 uppercase tracking-widest mb-1">G-Force</p>
                    <p className="text-white font-bold text-xl">1.0 G</p>
                </div>
             </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
              <Activity size={12} className="text-purple-400" />
              <span className="mono-text text-[9px] uppercase tracking-widest text-purple-300">Preparación de Élite</span>
            </div>
            <h1 className="text-7xl font-bold text-white tracking-tighter mb-8 leading-[0.9]">
              Domina la <span className="italic text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">Gravedad</span>.
            </h1>
            <p className="text-slate-400 text-xl font-light leading-relaxed mb-10">
              El programa **Iris Training** prepara tu cuerpo y mente para el salto al espacio profundo. Tecnología de simulación de vanguardia y expertos en medicina aeroespacial.
            </p>
            
            <div className="space-y-4 mb-12">
              {[
                "Entrenamiento en Cámara de Vacío y Microgravedad",
                "Simulación de Despegue en Centrífuga de Alta G",
                "Protocolos de Alimentación y Descanso Espacial",
                "Gestión Psicológica de Estancias Prolongadas"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={16} className="text-purple-500" />
                  <span className="text-sm font-light">{item}</span>
                </div>
              ))}
            </div>

            <Link href="/auth/register" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-2xl">
              Agendar Evaluación <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="relative z-10 py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Nivel 1: Adaptación", desc: "Primeros pasos en entornos de baja gravedad y protocolos de emergencia básica.", icon: Target },
              { title: "Nivel 2: Inmersión", desc: "Simulacros de vida en la ISS y manejo de herramientas en traje EVA.", icon: Users },
              { title: "Nivel 3: Resiliencia", desc: "Pruebas extremas de aislamiento y gestión de crisis en vuelo real.", icon: Zap },
            ].map((step, i) => (
              <div key={i} className="card-purple p-8 rounded-[3rem] text-center space-y-4">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-purple-400">
                  <step.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="text-slate-500 text-sm font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
