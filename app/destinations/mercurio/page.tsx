import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Thermometer, Gauge, CircleDot, Snowflake, SunDim, Sunrise, Car, Star, Zap } from "lucide-react";

export const metadata = {
  title: "Mercurio — Iris Aerospace",
  description: "El amanecer más violento del universo. En Mercurio, el sol no sale: aparece de golpe, enorme y cegador, ocupando el triple del cielo que en la Tierra.",
};

const poi = [
  {
    name: "El Amanecer Triple de Mercurio",
    desc: "Planta tus botas en la llanura de Mercurio y contempla un sol que ocupa el triple del cielo que en la Tierra. Aparece de golpe, sin previo aviso, con un brillo tan brutal que el traje Iris lo procesa en tiempo real para que tus ojos sobrevivan al espectáculo.",
    icon: CircleDot,
  },
  {
    name: "El Crater Caloris a Pie",
    desc: "Camina por el interior de un cáter de 1.500 km de diámetro: el suelo que quedó tras el mayor impacto del sistema solar interior. El silencio es absoluto. El horizonte curvo, visible. La escala, inhumana.",
    icon: Snowflake,
  },
  {
    name: "Las Sombras del Polo — Hielo en el Infierno",
    desc: "En los cáteres polares que el sol nunca toca, a pocos kilómetros de llanuras a 430°C, existe hielo de agua. Camina del infierno al frío en 20 minutos. Nada lo explica mejor que experimentarlo.",
    icon: SunDim,
  },
];

const experiencias = [
  {
    title: "La Carrera del Amanecer en Llanuras de Mercurio",
    desc: "En rovers de alta velocidad diseñados por ingenieros de F1 y la Iris Engineering Division, compite o crucero por las llanuras abrasadoras de Mercurio mientras el sol sube vertical y brutal. Una experiencia de adrenalina que solo existe en este planeta.",
    icon: Sunrise,
  },
  {
    title: "Pic-Nic Térmico en el Borde del Caloris",
    desc: "En la pared interior del mayor cáter de Mercurio, con el sol ya bajo en el horizonte y el suelo aún cálido bajo los pies, nuestro servicio de catering espacial sirve una merienda de élite con el sistema solar interior como vista panorámica de 180 grados.",
    icon: Car,
  },
];

export default function MercurioPage() {
  return (
    <main className="min-h-screen bg-[#110e20] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1666883349867-ee1d23482b7b?q=80&w=1182&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Mercurio — paisaje rocoso"
          fill
          className="object-cover opacity-45"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#110e20]/30 via-transparent to-[#110e20]/80" />
        <div className="absolute inset-0 bg-orange-950/10" />

        <div className="relative z-10">
          <p className="mono-text text-[10px] text-orange-400 uppercase tracking-[0.4em] mb-4">Destino — 0.39 AU</p>
          <h1 className="text-8xl md:text-[11rem] font-black uppercase tracking-tighter text-white leading-none mb-6">
            Mercurio
          </h1>
          <p className="text-xl md:text-2xl text-orange-300/90 font-light italic mb-6 max-w-xl mx-auto">
            "Un sol tres veces más grande. Y es tuyo por un día."
          </p>
          <p className="text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-12 text-lg">
            Las naves de Iris aterrizan sobre las llanuras calcinadas de Mercurio, el planeta más cercano
            al sol del sistema solar. Sales al exterior con el traje Solar Shield y el sol — colosal, cegador
            y absolutamente sobrecogedor — ocupa un tercio del cielo. La roca bajo tus pies guarda el calor
            de millones de años. El paisaje de cráteres se extiende hasta el horizonte curvo. Esto es real.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-orange-700 to-red-700 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_40px_rgba(180,100,50,0.6)] hover:scale-105 transition-all duration-300"
          >
            Ver el Amanecer más Épico del Sistema Solar →
          </Link>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="mono-text text-[9px] text-orange-400 uppercase tracking-[0.4em] text-center mb-12">Datos del destino</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <MapPin size={18} />, label: "Distancia", value: "0.39 AU", sub: "más cercano al sol" },
              { icon: <Thermometer size={18} />, label: "Rango Térmico", value: "-180/430°C", sub: "día a noche" },
              { icon: <Gauge size={18} />, label: "Gravedad", value: "38%", sub: "de la terrestre" },
            ].map((stat, i) => (
              <div key={i} className="card-purple p-6 rounded-2xl text-center hover:border-orange-500/40 transition-all duration-300">
                <div className="text-orange-400 flex justify-center mb-3">{stat.icon}</div>
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
            <Star size={18} className="text-orange-400" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Puntos de Interés</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {poi.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="card-purple p-8 rounded-3xl hover:border-orange-500/40 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-orange-400" />
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
            <Zap size={18} className="text-orange-400" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Experiencias Exclusivas</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {experiencias.map((e, i) => {
              const Icon = e.icon;
              return (
                <div key={i} className="card-purple p-10 rounded-3xl hover:border-orange-500/40 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                    <Icon size={26} className="text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors">{e.title}</h3>
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
          <div className="relative card-purple rounded-[3rem] p-16 text-center overflow-hidden border-orange-500/20">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-800/20 blur-[100px] pointer-events-none" />
            <p className="mono-text text-[9px] text-orange-400 uppercase tracking-[0.4em] mb-6">Iris Aerospace — Expedición Mercurio</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              El amanecer que no olvidarás<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                ocurre cada 176 días terrestres.
              </span>
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto font-light text-lg">
              El próximo es tuyo si actúas ahora. Asegura tu plaza en el siguiente amanecer mercuriano.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-orange-700 to-red-700 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_50px_rgba(180,100,50,0.4)] hover:scale-105 transition-all duration-300"
            >
              Asegurar mi Plaza en el Siguiente Amanecer →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
