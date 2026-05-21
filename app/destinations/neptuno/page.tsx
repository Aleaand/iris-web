import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Thermometer, Gauge, CloudLightning, Orbit, Sparkles, Telescope, UtensilsCrossed, Star, Zap } from "lucide-react";

export const metadata = {
  title: "Neptuno — Iris Aerospace",
  description: "Hasta aquí llega la audacia humana. En el borde del Sistema Solar, un gigante de azul metano te desafía con los vientos más rápidos del cosmos.",
};

const poi = [
  {
    name: "Las Planicies de Metano Azul",
    desc: "Aterriza en la superficie congelada de Neptuno y camina sobre extensas llanuras de metano solidificado de un azul imposible. El color más saturado y extraño que jamás podrás ver en ningún otro lugar del universo.",
    icon: CloudLightning,
  },
  {
    name: "Los Acántilados de Tritón",
    desc: "Explora los cantiles de hielo de la luna de Neptuno desde los que los géiseres de nitrógeno lanzan columnas de vapor hacia un cielo negro absoluto. Una postal del fin del mundo que te cambiará para siempre.",
    icon: Orbit,
  },
  {
    name: "La Gran Tormenta Oscura a Pie",
    desc: "Con el traje Iris Windbreaker de blindaje sónico total, párate en el borde mismo de la Gran Mancha Oscura y siente los vientos más veloces del sistema solar rozarte a 2.100 km/h sin moverte un centímetro.",
    icon: Sparkles,
  },
];

const experiencias = [
  {
    title: "Surf Sónico sobre los Vientos Supersónicos",
    desc: "A bordo de una plataforma de vuelo personal Iris Zephyr, cabalga los vientos supersónicos de Neptuno a ras de superficie. La velocidad, el frío y el azul absoluto crean una experiencia de adrenalina pura que ninguna atracción terrestre puede replicar ni remotamente.",
    icon: Telescope,
  },
  {
    title: "Cena Privada bajo el Cielo de Tritón",
    desc: "En nuestro hábitat presurizado de diseño sobre la superficie de Tritón, un chef de autor sirve una cena íntima bajo un cielo negro donde Neptuno ocupa más de un tercio del horizonte, girando lentamente en un azul que hipnotiza.",
    icon: UtensilsCrossed,
  },
];

export default function NeptunoPage() {
  return (
    <main className="min-h-screen bg-[#110e20] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1561356599-4477fa545889?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Neptuno"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#110e20]/30 via-transparent to-[#110e20]/80" />
        <div className="absolute inset-0 bg-blue-950/10" />

        <div className="relative z-10">
          <p className="mono-text text-[10px] text-blue-400 uppercase tracking-[0.4em] mb-4">Destino — 30.07 AU</p>
          <h1 className="text-8xl md:text-[11rem] font-black uppercase tracking-tighter text-white leading-none mb-6">
            Neptuno
          </h1>
          <p className="text-xl md:text-2xl text-blue-300/90 font-light italic mb-6 max-w-xl mx-auto">
            "El azul más intenso del universo existe aquí. Tú puedes pisarlo."
          </p>
          <p className="text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-12 text-lg">
            Nuestras naves aterrizan en la superficie helada de Neptuno, el planeta más azul y más salvaje
            del sistema solar. Un mundo donde los vientos superan los 2.000 km/h y el horizonte es de un
            azul metano tan intenso que parece digital. Para quienes quieren tocar el borde del mapa y
            volver para contarlo — con un cóctel en la mano.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_40px_rgba(30,80,200,0.6)] hover:scale-105 transition-all duration-300"
          >
            Ir donde Casi Nadie ha Llegado →
          </Link>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="mono-text text-[9px] text-blue-400 uppercase tracking-[0.4em] text-center mb-12">Datos del destino</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <MapPin size={18} />, label: "Distancia", value: "30.07 AU", sub: "del sol" },
              { icon: <Thermometer size={18} />, label: "Clima", value: "-218°C", sub: "vientos 2100 km/h" },
              { icon: <Gauge size={18} />, label: "Gravedad", value: "114%", sub: "de la terrestre" },
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
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-800/20 blur-[100px] pointer-events-none" />
            <p className="mono-text text-[9px] text-blue-400 uppercase tracking-[0.4em] mb-6">Iris Aerospace — Expedición Neptuno</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Los que llegan hasta aquí<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                no vuelven siendo los mismos.
              </span>
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto font-light text-lg">
              ¿Tienes el coraje para tocar el borde del mapa solar? La expedición más audaz de la historia te espera.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_50px_rgba(30,80,200,0.4)] hover:scale-105 transition-all duration-300"
            >
              Reservar Expedición al Confín →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
