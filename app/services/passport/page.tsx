"use client";
import Navbar from "@/components/Navbar";
import Starfield from "@/components/Starfield";
import { ShieldCheck, FileText, Globe, CheckCircle2, ChevronRight, Rocket, Users } from "lucide-react";
import Link from "next/link";

export default function PassportServicePage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#06040d]">
      <Starfield />
      <Navbar />

      <section className="relative z-10 pt-48 pb-32 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
              <ShieldCheck size={12} className="text-purple-400" />
              <span className="mono-text text-[9px] uppercase tracking-widest text-purple-300">Servicios Burocráticos</span>
            </div>
            <h1 className="text-7xl font-bold text-white tracking-tighter mb-8 leading-[0.9]">
              Tu Llave al <span className="italic text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">Cosmos</span>.
            </h1>
            <p className="text-slate-400 text-xl font-light leading-relaxed mb-10">
              Gestionamos la complejidad legal de los viajes interplanetarios. Desde la verificación OFAC hasta la emisión de tu **Pasaporte Estelar** oficial.
            </p>
            
            <div className="space-y-4 mb-12">
              {[
                "Verificación de Antecedentes Internacionales",
                "Gestión de Visados Aduaneros Orbitales",
                "Certificación de Aptitud Legal para Vuelo",
                "Emisión de Pasaporte Estelar Físico y Digital"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 size={16} className="text-green-500" />
                  <span className="text-sm font-light">{item}</span>
                </div>
              ))}
            </div>

            <Link href="/auth/register" className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-2xl shadow-purple-600/20">
              Comenzar Trámites <ChevronRight size={14} />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-purple-600/20 blur-[120px] rounded-full" />
            <div className="relative card-purple p-8 rounded-[3rem] border-white/20 transform md:rotate-3">
              <div className="flex justify-between items-start mb-20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold italic">I</div>
                  <span className="text-white text-[10px] font-bold tracking-widest uppercase">Iris Aerospace</span>
                </div>
                <Globe size={32} className="text-white/20" />
              </div>
              <div className="space-y-4">
                <div className="h-4 w-48 bg-white/10 rounded-full" />
                <div className="h-4 w-32 bg-white/5 rounded-full" />
                <div className="pt-10 flex justify-between items-end">
                  <div className="space-y-2">
                    <p className="mono-text text-[7px] text-slate-500 uppercase">Stellar ID</p>
                    <p className="text-white text-lg font-bold tracking-widest">####-####-IRIS</p>
                  </div>
                  <div className="w-16 h-16 bg-white/5 rounded-xl border border-white/10" />
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 flex justify-between text-[8px] mono-text text-slate-500 uppercase tracking-widest">
                <span>Exp: 2045</span>
                <span>Class: Civilian Voyager</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="relative z-10 py-32 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Un proceso <span className="text-purple-400">sin fricciones</span></h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Auditoría de Datos", desc: "Escaneamos bases de datos internacionales para garantizar la seguridad de la misión.", icon: FileText },
              { title: "Verificación Médica", desc: "Coordinamos tus pruebas físicas para certificar tu resistencia a la microgravedad.", icon: Users },
              { title: "Emisión y Envío", desc: "Recibe tu credencial Iris y tu Pasaporte Estelar en tu domicilio en 48 horas.", icon: Rocket },
            ].map((step, i) => (
              <div key={i} className="text-center space-y-4">
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
