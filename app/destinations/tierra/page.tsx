import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Gauge, Clock, Globe, Eye, Waves, PersonStanding, UtensilsCrossed, Star, Zap } from "lucide-react";

export const metadata = {
  title: "Tierra Órbita — Iris Aerospace",
  description: "No sabes lo que tienes hasta que lo ves desde arriba. El efecto overview: ver la Tierra completa desde el espacio y que todo cambie en ti para siempre.",
};

const poi = [
  {
    name: "El Sahara desde Órbita",
    desc: "Las dunas más grandes de África dibujadas como una obra de arte abstracta que cambia con cada órbita y cada ángulo de iluminación solar.",
    icon: Globe,
  },
  {
    name: "Las Auroras Boreales desde Arriba",
    desc: "No las verás desde el suelo. Las verás desde encima: coronas luminosas de verde y magenta que abrazan los polos como halos divinos e infinitos.",
    icon: Eye,
  },
  {
    name: "El Océano Pacífico en su Totalidad",
    desc: "El mayor espejo azul del planeta, tan inmenso que desde órbita casi no ves sus bordes: solo un azul profundo e infinito que llena toda la ventana.",
    icon: Waves,
  },
];

const experiencias = [
  {
    title: "Paseo Espacial Privado sobre el Mediterráneo",
    desc: "Con guía personal de ex-astronauta, sal al exterior de la estación con el traje Iris EVA Couture y flota libremente sobre el mar más famoso de la civilización humana. 45 minutos de eternidad entre la Tierra y el cosmos.",
    icon: PersonStanding,
  },
  {
    title: "Cena de 12 Tiempos durante un Amanecer Orbital",
    desc: "El chef Michelin Paolo Ferrini diseña un menú de un solo servicio que dura exactamente lo que tarda la Tierra en girar frente a la cúpula: 90 minutos, con un atardecer y un amanecer incluidos en el maridaje.",
    icon: UtensilsCrossed,
  },
];

export default function TierraPage() {
  return (
    <main className="min-h-screen bg-[#110e20] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1275&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Tierra desde el espacio"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#110e20]/30 via-transparent to-[#110e20]/80" />
        <div className="absolute inset-0 bg-blue-950/10" />

        <div className="relative z-10">
          <p className="mono-text text-[10px] text-blue-400 uppercase tracking-[0.4em] mb-4">Destino — 1.00 AU</p>
          <h1 className="text-6xl md:text-[9rem] font-black uppercase tracking-tighter text-white leading-none mb-6">
            Tierra
          </h1>
          <p className="text-xl md:text-2xl text-blue-300/90 font-light italic mb-6 max-w-xl mx-auto">
            "No sabes lo que tienes hasta que lo ves desde arriba."
          </p>
          <p className="text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-12 text-lg">
            Hay un momento que los astronautas llaman "el efecto overview": el instante en que ves la Tierra
            completa desde el espacio y todo cambia en ti para siempre. Iris Orbital Suite te da ese momento
            — con cama king-size, champagne francés y el planeta más hermoso del universo girando lentamente
            ante ti.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-700 to-emerald-700 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_40px_rgba(50,120,200,0.6)] hover:scale-105 transition-all duration-300"
          >
            Ver mi Hogar como Nunca Antes →
          </Link>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="mono-text text-[9px] text-blue-400 uppercase tracking-[0.4em] text-center mb-12">Datos del destino</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <MapPin size={18} />, label: "Distancia", value: "1.00 AU", sub: "el punto de referencia" },
              { icon: <Globe size={18} />, label: "Altitud", value: "400 km", sub: "órbita baja terrestre" },
              { icon: <Gauge size={18} />, label: "Gravedad", value: "0%", sub: "ingravidez total" },
              { icon: <Clock size={18} />, label: "Estancia", value: "10 días", sub: "16 amaneceres al día" },
            ].map((stat, i) => (
              <div key={i} className="card-purple p-6 rounded-2xl text-center hover:border-blue-500/40 transition-all duration-300">
                <div className="text-blue-400 flex justify-center mb-3">{stat.icon}</div>
                <p className="mono-text text-[8px] text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-[10px] text-slate-600 mt-1">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PUNTOS DE INTERÉS */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Star size={18} className="text-blue-400" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Puntos de Interés</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {poi.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="card-purple p-8 rounded-3xl hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{p.name}</h3>
                  <p className="text-slate-400 font-light leading-relaxed text-sm">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXPERIENCIAS EXCLUSIVAS */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <Zap size={18} className="text-blue-400" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Experiencias Exclusivas</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {experiencias.map((e, i) => {
              const Icon = e.icon;
              return (
                <div key={i} className="card-purple p-10 rounded-3xl hover:border-blue-500/40 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                    <Icon size={26} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">{e.title}</h3>
                  <p className="text-slate-400 font-light leading-relaxed">{e.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BANNER CTA */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative card-purple rounded-[3rem] p-16 text-center overflow-hidden border-blue-500/20">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-800/15 blur-[100px] pointer-events-none" />
            <p className="mono-text text-[9px] text-blue-400 uppercase tracking-[0.4em] mb-6">Iris Aerospace — Órbita Terrestre</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              No necesitas ir lejos para ver<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                la maravilla más grande del universo.
              </span>
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto font-light text-lg">
              Solo necesitas subir un poco más. Tu perspectiva nunca volverá a ser la misma.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-blue-700 to-emerald-700 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_50px_rgba(50,120,200,0.4)] hover:scale-105 transition-all duration-300"
            >
              Reservar mi Órbita →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
