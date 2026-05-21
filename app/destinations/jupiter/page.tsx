import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Thermometer, Gauge, Tornado, Snowflake, Zap, Plane, Wine, Star } from "lucide-react";

export const metadata = {
  title: "Júpiter — Iris Aerospace",
  description: "La sinfonía majestuosa del coloso gaseoso. Contempla la Gran Mancha Roja desde nuestra Estación Orbital Nebula en primera clase absoluta.",
};

const poi = [
  {
    name: "Los Valles de Niebla Violeta",
    desc: "Profundidades atmosféricas donde el metano y el hidrógeno crean densas nieblas de un violeta eléctrico que ninguna pantalla ha podido reproducir jamás. Caminas entre ellas.",
    icon: Tornado,
  },
  {
    name: "Las Bandas Cromáticas del Ecuador",
    desc: "Franjas atmosféricas vivas de naranja, marfil y marrón que se mueven como ríos de color bajo tus pies. Un paisaje que cambia cada hora, irrepetible e infinitamente hipnótico.",
    icon: Snowflake,
  },
  {
    name: "La Gran Mancha Roja a Pie",
    desc: "Camina en el corazón de la tormenta más antigua del sistema solar: un torbellino carmesí de 14.000 km de diámetro donde el viento te rodea como una catedral de energía pura.",
    icon: Zap,
  },
];

const experiencias = [
  {
    title: "Inmersión en la Tormenta Arcoíris",
    desc: "Con el traje de presión Iris Storm Edition, desciende a las capas medias de Júpiter donde las distintas bandas atmosféricas crean auroras internas de colores imposibles: turquesas, fucsia y dorado que nunca verás en otro planeta.",
    icon: Plane,
  },
  {
    title: "Noche de Camping en la Niebla Joviana",
    desc: "Pasa la noche en cápsulas de lujo flotantes suspendidas en la capa de nubes. La niebla naranja y violeta envuelve tu ventana mientras relámpagos colosales iluminan el horizonte infinito. El espectáculo más íntimo y salvaje del sistema solar.",
    icon: Wine,
  },
];

export default function JupiterPage() {
  return (
    <main className="min-h-screen bg-[#110e20] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1475727946784-2890c8fdb9c8?q=80&w=1184&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Júpiter"
          fill
          className="object-cover opacity-45"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#110e20]/30 via-transparent to-[#110e20]/80" />
        <div className="absolute inset-0 bg-amber-950/10" />

        <div className="relative z-10">
          <p className="mono-text text-[10px] text-amber-400 uppercase tracking-[0.4em] mb-4">Destino — 5.20 AU</p>
          <h1 className="text-8xl md:text-[11rem] font-black uppercase tracking-tighter text-white leading-none mb-6">
            Júpiter
          </h1>
          <p className="text-xl md:text-2xl text-amber-300/90 font-light italic mb-6 max-w-xl mx-auto">
            "Para los que sueñan con caminar entre nubes de otro color."
          </p>
          <p className="text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-12 text-lg">
            ¿Amas los días con niebla? ¿Te hipnotizan las nébulas de distintos colores en las fotografías del cosmos?
            Ahora puedes caminar dentro de ellas. Júpiter es un mundo de nieblas vivas, de cielos que cambian
            de violeta a naranja en minutos, de tormentas que rugen como sinfonías. Nuestras naves aterrizan
            directamente en las capas de nubes y tú pones los pies donde nadie imaginó que se podría.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_40px_rgba(200,120,30,0.6)] hover:scale-105 transition-all duration-300"
          >
            Reclamar mi Suite frente al Rey →
          </Link>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="mono-text text-[9px] text-amber-400 uppercase tracking-[0.4em] text-center mb-12">Datos del destino</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <MapPin size={18} />, label: "Distancia", value: "5.20 AU", sub: "del sol" },
              { icon: <Thermometer size={18} />, label: "Clima", value: "-110°C", sub: "en nubes altas" },
              { icon: <Gauge size={18} />, label: "Gravedad", value: "252%", sub: "hábitat a 1G" },
            ].map((stat, i) => (
              <div key={i} className="card-purple p-6 rounded-2xl text-center hover:border-amber-500/40 transition-all duration-300">
                <div className="text-amber-400 flex justify-center mb-3">{stat.icon}</div>
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
            <Star size={18} className="text-amber-400" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Puntos de Interés</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {poi.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="card-purple p-8 rounded-3xl hover:border-amber-500/40 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-amber-400" />
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
            <Zap size={18} className="text-amber-400" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Experiencias Exclusivas</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {experiencias.map((e, i) => {
              const Icon = e.icon;
              return (
                <div key={i} className="card-purple p-10 rounded-3xl hover:border-amber-500/40 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
                    <Icon size={26} className="text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-amber-300 transition-colors">{e.title}</h3>
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
          <div className="relative card-purple rounded-[3rem] p-16 text-center overflow-hidden border-amber-500/20">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-700/20 blur-[100px] pointer-events-none" />
            <p className="mono-text text-[9px] text-amber-400 uppercase tracking-[0.4em] mb-6">Iris Aerospace — Expedición Júpiter</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              El cielo más colorido del universo<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                te espera en Júpiter.
              </span>
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto font-light text-lg">
              Nieblas violetas, tormentas naranja y auroras que nunca se apagan. Prepárate para aterrizar en el planeta más espectacular del sistema solar.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_50px_rgba(200,120,30,0.4)] hover:scale-105 transition-all duration-300"
            >
              Embarcar hacia Júpiter →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
