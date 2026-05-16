import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Starfield from "@/components/Starfield";
import { Rocket, Globe, Shield, Zap, Users, Star, MoveRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre Iris Aerospace — Misión y Visión",
  description:
    "Conoce la primera agencia de viajes espaciales privada del mundo. Nuestra misión es hacer el espacio accesible a la élite y, algún día, a toda la humanidad.",
  openGraph: {
    title: "Sobre Iris Aerospace",
    description: "La primera agencia de transporte civil interplanetario.",
    images: ["/img/og-about.jpg"],
  },
};

const HITOS = [
  { anio: "2026", titulo: "Creacion de iris", descripcion: "Nace iris aerospace, la primera agencia de viajes espaciales privada del mundo." }
];

const VALORES = [
  { icono: Shield, titulo: "Seguridad Absoluta", descripcion: "Triple redundancia en todos los sistemas. Tu seguridad es nuestra obsesión, no una promesa." },
  { icono: Zap, titulo: "Innovación Constante", descripcion: "Colaboramos con los mejores ingenieros del planeta para empujar los límites de lo posible." },
  { icono: Users, titulo: "Atención Personalizada", descripcion: "Cada cliente tiene un gestor dedicado. No eres un número, eres un explorador." },
  { icono: Globe, titulo: "Visión Global", descripcion: "Nuestro objetivo final: que viajar a Marte sea tan normal como volar a Nueva York." },
];

export default function PaginaSobreIris() {
  return (
    <main className="min-h-screen relative bg-[#06040d]">
      <Starfield />
      <Navbar />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-8 text-center pt-20">
        <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-purple-600/8 aurora-blur rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-indigo-600/8 aurora-blur rounded-full" />

        <div className="max-w-4xl animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
            <Rocket size={10} className="text-purple-400" />
            <span className="mono-text text-[9px] uppercase tracking-[0.3em] text-purple-300">
              Nuestra Historia
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.9]">
            Construimos el<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400">
              futuro.
            </span>
          </h1>
          <p className="text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">
            Somos la primera red de transporte civil interplanetario. No vendemos billetes de avión.
            Vendemos la posibilidad de ser parte de la historia.
          </p>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="relative z-10 py-24 px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-purple p-12 rounded-[3rem]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                <Rocket size={18} className="text-purple-400" />
              </div>
              <span className="mono-text text-[9px] text-purple-400 uppercase tracking-widest font-bold">
                Nuestra Misión
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Hacer el espacio accesible hoy. Universal mañana.
            </h2>
            <p className="text-slate-400 font-light leading-relaxed">
              Comenzamos con los pioneros: empresarios, artistas y líderes visionarios dispuestos a escribir
              la primera página de esta historia. Cada billete financiará la tecnología que hará los vuelos
              espaciales asequibles para todos.
            </p>
          </div>

          <div className="card-purple p-12 rounded-[3rem]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
                <Star size={18} className="text-indigo-400" />
              </div>
              <span className="mono-text text-[9px] text-indigo-400 uppercase tracking-widest font-bold">
                Nuestra Visión
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              2050: la humanidad, una especie multiplanetaria.
            </h2>
            <p className="text-slate-400 font-light leading-relaxed">
              Imaginamos un mundo donde tus hijos puedan elegir entre vivir en la Tierra, la Luna o Marte.
              Iris es el primer paso. Pequeño para nosotros, gigantesco para la humanidad.
            </p>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="relative z-10 py-16 px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="mono-text text-[9px] text-purple-400 uppercase tracking-[0.4em] mb-4">
            En qué creemos
          </p>
          <h2 className="text-4xl font-bold text-white">Nuestros Valores</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALORES.map((valor) => (
            <div key={valor.titulo} className="card-purple p-8 rounded-[2rem] group hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <valor.icono size={20} className="text-purple-400" />
              </div>
              <h3 className="text-white font-bold mb-3">{valor.titulo}</h3>
              <p className="text-slate-500 text-sm font-light leading-relaxed">
                {valor.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Línea del tiempo */}
      <section className="relative z-10 py-24 px-8 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="mono-text text-[9px] text-purple-400 uppercase tracking-[0.4em] mb-4">
            Nuestra Trayectoria
          </p>
          <h2 className="text-4xl font-bold text-white">Hitos Históricos</h2>
        </div>
        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent" />

          <div className="space-y-10">
            {HITOS.map((hito, indice) => (
              <div key={hito.anio} className="flex items-start gap-8 pl-8 relative">
                {/* Punto en la línea */}
                <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-purple-500 bg-[#06040d] -translate-x-1.5 shrink-0" />

                <div className="flex-1 card-purple p-6 rounded-2xl">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="mono-text text-purple-400 font-bold text-sm">{hito.anio}</span>
                    {indice === HITOS.length - 1 && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[8px] text-purple-300 uppercase tracking-widest font-bold">
                        Próximo
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-bold mb-1">{hito.titulo}</h3>
                  <p className="text-slate-500 text-sm font-light">{hito.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative z-10 py-24 px-8 text-center border-t border-white/5">
        <h2 className="text-4xl font-bold text-white mb-4">
          ¿Listo para ser parte de la historia?
        </h2>
        <p className="text-slate-400 font-light mb-10 max-w-xl mx-auto">
          Las plazas para los primeros vuelos son limitadas. El universo te está esperando.
        </p>
        <Link
          href="/booking"
          className="inline-flex items-center gap-3 px-12 py-5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[11px] uppercase tracking-[0.3em] hover:shadow-[0_0_40px_rgba(147,51,234,0.3)] transition-all group"
        >
          Ver Expediciones
          <MoveRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </main>
  );
}
