import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Thermometer, Gauge, Gem, Hexagon, CloudFog, Ship, Droplets, Star, Zap } from "lucide-react";

export const metadata = {
  title: "Saturno — Iris Aerospace",
  description: "El joyero del Sistema Solar. Miles de millones de fragmentos de hielo puro orbitando en perfecta armonía: los anillos más deslumbrantes jamás contemplados.",
};

const poi = [
  {
    name: "Los Campos de Hielo de Cassini",
    desc: "Aterriza en el interior de los anillos y camina sobre campos infinitos de cristales de hielo puro que datan de 4.000 millones de años. Cada uno capta la luz del sol como un prisma diferente.",
    icon: Gem,
  },
  {
    name: "La Tormenta Hexagonal del Polo",
    desc: "Desciende al polo norte de Saturno y rodea a pie la mayor estructura geométrica natural del universo: una tormenta perfectamente hexagonal del tamaño de dos Tierras.",
    icon: Hexagon,
  },
  {
    name: "Lagos de Metano de Titán",
    desc: "Aterriza en Titán y camina junto a lagos de metano líquido bajo una niebla dorada perpetua. El único lugar del sistema solar con lluvia — aunque de metano — en un mundo completamente ajeno.",
    icon: CloudFog,
  },
];

const experiencias = [
  {
    title: "Paseo entre los Anillos al Amanecer",
    desc: "Con el exotraje Iris Ring Walker de aislamiento térmico total, camina literalmente entre los fragmentos de hielo del anillo A mientras el sol de Saturno proyecta un espectáculo de prismas y arcoíris que dura horas. La experiencia más fotográfica del cosmos.",
    icon: Ship,
  },
  {
    title: "Baño Termal bajo los Anillos de Saturno",
    desc: "En la superficie de Encélado, los géiseres de agua caliente brotan del suelo helado. Nuestro spa al aire libre te permite bañarte en agua genuinamente extraterrestre mientras los anillos de Saturno cubren el cielo de borde a borde.",
    icon: Droplets,
  },
];

export default function SaturnoPage() {
  return (
    <main className="min-h-screen bg-[#110e20] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1701486485765-8a373d83d95e?q=80&w=1228&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Saturno"
          fill
          className="object-cover opacity-45"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#110e20]/30 via-transparent to-[#110e20]/80" />
        <div className="absolute inset-0 bg-yellow-950/10" />

        <div className="relative z-10">
          <p className="mono-text text-[10px] text-yellow-400 uppercase tracking-[0.4em] mb-4">Destino — 9.58 AU</p>
          <h1 className="text-8xl md:text-[11rem] font-black uppercase tracking-tighter text-white leading-none mb-6">
            Saturno
          </h1>
          <p className="text-xl md:text-2xl text-yellow-300/90 font-light italic mb-6 max-w-xl mx-auto">
            "El único lugar donde puedes caminar sobre los anillos del cosmos."
          </p>
          <p className="text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-12 text-lg">
            Las naves de Iris aterrizan directamente sobre los campos de hielo de los anillos de Saturno.
            Caminas sobre cristales de 4.000 millones de años que crujen suavemente bajo tus botas.
            A tu izquierda: el planeta más bello del sistema solar. A tu derecha: el vacío del cosmos.
            No hay experiencia más surrealista ni más suntuosa en la historia de los viajes.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_40px_rgba(200,160,60,0.6)] hover:scale-105 transition-all duration-300"
          >
            Navegar entre los Anillos →
          </Link>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="mono-text text-[9px] text-yellow-400 uppercase tracking-[0.4em] text-center mb-12">Datos del destino</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <MapPin size={18} />, label: "Distancia", value: "9.58 AU", sub: "del sol" },
              { icon: <Thermometer size={18} />, label: "Clima", value: "-140°C", sub: "nubes de amoníaco" },
              { icon: <Gauge size={18} />, label: "Gravedad", value: "107%", sub: "de la terrestre" },
            ].map((stat, i) => (
              <div key={i} className="card-purple p-6 rounded-2xl text-center hover:border-yellow-500/40 transition-all duration-300">
                <div className="text-yellow-400 flex justify-center mb-3">{stat.icon}</div>
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
            <Star size={18} className="text-yellow-400" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Puntos de Interés</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {poi.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="card-purple p-8 rounded-3xl hover:border-yellow-500/40 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-yellow-400" />
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
            <Zap size={18} className="text-yellow-400" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Experiencias Exclusivas</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {experiencias.map((e, i) => {
              const Icon = e.icon;
              return (
                <div key={i} className="card-purple p-10 rounded-3xl hover:border-yellow-500/40 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6">
                    <Icon size={26} className="text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors">{e.title}</h3>
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
          <div className="relative card-purple rounded-[3rem] p-16 text-center overflow-hidden border-yellow-500/20">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-700/15 blur-[100px] pointer-events-none" />
            <p className="mono-text text-[9px] text-yellow-400 uppercase tracking-[0.4em] mb-6">Iris Aerospace — Expedición Saturno</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              ¿Qué tal despertar rodeado<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-400">
                de las joyas del universo?
              </span>
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto font-light text-lg">
              Saturno lleva esperándote desde el inicio de los tiempos. La aventura más elegante del cosmos te aguarda.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_50px_rgba(200,160,60,0.4)] hover:scale-105 transition-all duration-300"
            >
              Reservar mi Suite en los Anillos →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
