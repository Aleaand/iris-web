import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Thermometer, Gauge, Mountain, Waves, Wind, UtensilsCrossed, Camera, Star, Zap } from "lucide-react";

export const metadata = {
  title: "Marte — Iris Aerospace",
  description: "El desierto rojo de los dioses. Dunas infinitas, volcanes colosales y un horizonte carmesí que ningún ser humano ha pisado antes que tú.",
};

const poi = [
  {
    name: "Olympus Mons — La Cumbre del Sistema Solar",
    desc: "Planta tus botas en la cima del volcán más alto conocido: 21 km sobre la llanura marciana, donde el horizonte se curva y el silencio es absoluto. El techo del mundo rojo.",
    icon: Mountain,
  },
  {
    name: "Valles Marineris — El Gran Cañón Rojo",
    desc: "Desciende a las profundidades de un cañón de 4.000 km de longitud y 7 km de profundidad. Las paredes de roca terracota te rodean mientras el viento marciano susurra entre las grietas.",
    icon: Waves,
  },
  {
    name: "Mar de Dunas de Noctis",
    desc: "Un océano de dunas carmesí que se extiende hasta donde alcanza la vista. Al amanecer, las sombras las convierten en un mapa tridimensional de una belleza brutal y primitiva.",
    icon: Wind,
  },
];

const experiencias = [
  {
    title: "Cena de 7 Tiempos bajo las Dos Lunas",
    desc: "Una cúpula presurizada transparente en el borde del Valles Marineris. Un chef con estrellas Michelin sirve gastronomía molecular mientras Phobos y Deimos surcan el cielo rojizo en paralelo. El restaurante más remoto del sistema solar interior.",
    icon: UtensilsCrossed,
  },
  {
    title: "Senderismo Privado por las Dunas al Alba",
    desc: "Equipado con el exotraje ligero Iris Dune Walker, camina por las dunas de Noctis al amanecer marciano. La temperatura sube de -60°C a 0°C en minutos y el cielo pasa del negro profundo al naranja más puro que hayas visto jamás.",
    icon: Camera,
  },
];

export default function MartePage() {
  return (
    <main className="min-h-screen bg-[#110e20] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1612892483236-52d32a0e0ac1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Marte — desierto rojo"
          fill
          className="object-cover opacity-55"
          priority
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#110e20]/30 via-transparent to-[#110e20]/80" />
        <div className="absolute inset-0 bg-red-950/10" />

        {/* Content */}
        <div className="relative z-10">
          <p className="mono-text text-[10px] text-red-400 uppercase tracking-[0.4em] mb-4">Destino — 1.52 AU</p>
          <h1 className="text-8xl md:text-[11rem] font-black uppercase tracking-tighter text-white leading-none mb-6">
            Marte
          </h1>
          <p className="text-xl md:text-2xl text-red-300/90 font-light italic mb-6 max-w-xl mx-auto">
            "Camina donde el universo pintó el suelo de rojo."
          </p>
          <p className="text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-12 text-lg">
            Las naves de Iris aterrizan directamente sobre las llanuras de óxido de hierro de Marte.
            Pones los pies en el suelo rojo. Respiras el aire marciano filtrado. Ves el sol — más pequeño,
            más frío — salir sobre un horizonte que ninguna fotografía ha hecho justicia. El desierto más
            grande, más silencioso y más brutal del sistema solar es ahora tu destino de lujo.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_40px_rgba(220,60,30,0.6)] hover:scale-105 transition-all duration-300"
          >
            Quiero despertar en el Planeta Rojo →
          </Link>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="mono-text text-[9px] text-red-400 uppercase tracking-[0.4em] text-center mb-12">Datos del destino</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <MapPin size={18} />, label: "Distancia", value: "1.52 AU", sub: "del sol" },
              { icon: <Thermometer size={18} />, label: "Clima", value: "-73°C / 20°C", sub: "rango diario" },
              { icon: <Gauge size={18} />, label: "Gravedad", value: "38%", sub: "de la terrestre" },
            ].map((stat, i) => (
              <div key={i} className="card-purple p-6 rounded-2xl text-center hover:border-red-500/40 transition-all duration-300">
                <div className="text-red-400 flex justify-center mb-3">{stat.icon}</div>
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
            <Star size={18} className="text-red-400" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Puntos de Interés</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {poi.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="card-purple p-8 rounded-3xl hover:border-red-500/40 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-red-400" />
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
            <Zap size={18} className="text-red-400" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Experiencias Exclusivas</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {experiencias.map((e, i) => {
              const Icon = e.icon;
              return (
                <div key={i} className="card-purple p-10 rounded-3xl hover:border-red-500/40 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
                    <Icon size={26} className="text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-red-300 transition-colors">{e.title}</h3>
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
          <div className="relative card-purple rounded-[3rem] p-16 text-center overflow-hidden border-red-500/20">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-700/20 blur-[100px] pointer-events-none" />
            <p className="mono-text text-[9px] text-red-400 uppercase tracking-[0.4em] mb-6">Iris Aerospace — Expedición Marte</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              ¿Estás preparado para <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                la aventura definitiva?
              </span>
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto font-light text-lg">
              La última frontera de la humanidad te espera. El siguiente vuelo zarpa pronto.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-red-600 to-orange-600 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_50px_rgba(220,60,30,0.4)] hover:scale-105 transition-all duration-300"
            >
              Reserva tu Expedición a Marte →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
