import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Thermometer, Gauge, Cloud, Flame, Sunset, UtensilsCrossed, PersonStanding, Star, Zap } from "lucide-react";

export const metadata = {
  title: "Venus — Iris Aerospace",
  description: "La belleza más peligrosa del Sistema Solar. Nuestras aeronaves flotantes navegan sobre las nubes de Venus donde el espectáculo es absolutamente sublime.",
};

const poi = [
  {
    name: "El Mar de Nubes Doradas",
    desc: "A 52 km de altitud, la atmósfera de Venus se convierte en un océano de nubes de un dorado sulfuroso imposible. Las naves de Iris navegan entre ellas y tú puedes salir a caminar sobre sus corrientes térmicas.",
    icon: Cloud,
  },
  {
    name: "El Terminador Perpetuo",
    desc: "La línea de sombra entre el día y la noche en Venus, donde el cielo pasa del naranja cálido al negro absoluto en cuestión de kilómetros. Nuestras naves hacen pausa exactamente en ese umbral.",
    icon: Flame,
  },
  {
    name: "Las Corrientes de Lava de Ishtar Terra",
    desc: "Sobrevolando a baja altitud, contempla ríos de lava activa en la llanura más alta de Venus. El calor que sube tiempla las nubes y las convierte en un espectáculo de luz naranja que cambia cada minuto.",
    icon: Sunset,
  },
];

const experiencias = [
  {
    title: "Paseo Exterior entre las Nubes de Ácido",
    desc: "Con el exotraje Iris Zephyr de protección total, sal al exterior de la aeronave a 52 km de altitud y camina sobre las corrientes de nubes de Venus. Naranja, denso, cegador y completamente irreal. La actividad más extrema del sistema solar interior.",
    icon: UtensilsCrossed,
  },
  {
    title: "Cena Suspendida en la Noche Venusiana",
    desc: "En el lado nocturno del planeta, donde las nubes se vuelven frías y plateadas, nuestra aeronave restaurante Altus sirve un menú de 9 tiempos con las ventanas panorámicas abiertas al espacio y los relámpagos venusianos como espectáculo de fondo.",
    icon: PersonStanding,
  },
];

export default function VenusPage() {
  return (
    <main className="min-h-screen bg-[#110e20] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1618681317438-a8dd7da06cd4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Venus — nubes doradas"
          fill
          className="object-cover opacity-45"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#110e20]/30 via-transparent to-[#110e20]/80" />
        <div className="absolute inset-0 bg-yellow-950/10" />

        <div className="relative z-10">
          <p className="mono-text text-[10px] text-yellow-400 uppercase tracking-[0.4em] mb-4">Destino — 0.72 AU</p>
          <h1 className="text-8xl md:text-[11rem] font-black uppercase tracking-tighter text-white leading-none mb-6">
            Venus
          </h1>
          <p className="text-xl md:text-2xl text-yellow-300/90 font-light italic mb-6 max-w-xl mx-auto">
            "Camina entre nubes de ácido. Nunca te has sentido tan vivo."
          </p>
          <p className="text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-12 text-lg">
            Las naves de Iris navegan a 52 km sobre la superficie de Venus, donde la temperatura es
            idéntica a la de un día de verano en la Tierra. Fuera de la ventana: un océano de nubes
            de ácido sulfúrico de un dorado imposible que arden lentamente bajo el sol más próximo.
            El destino más paradisiacamente peligroso del sistema solar, servido en primera clase absoluta.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-yellow-700 to-orange-700 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_40px_rgba(220,160,50,0.6)] hover:scale-105 transition-all duration-300"
          >
            Flotar sobre el Infierno en Primera Clase →
          </Link>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="mono-text text-[9px] text-yellow-400 uppercase tracking-[0.4em] text-center mb-12">Datos del destino</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <MapPin size={18} />, label: "Distancia", value: "0.72 AU", sub: "el más cercano" },
              { icon: <Thermometer size={18} />, label: "Crucero Iris", value: "20°C", sub: "altitud de crucero 52 km" },
              { icon: <Gauge size={18} />, label: "Gravedad", value: "90%", sub: "de la terrestre" },
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
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-800/20 blur-[100px] pointer-events-none" />
            <p className="mono-text text-[9px] text-yellow-400 uppercase tracking-[0.4em] mb-6">Iris Aerospace — Expedición Venus</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              La diosa del cielo nocturno<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                te llama desde hace siglos.
              </span>
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto font-light text-lg">
              Ha llegado el momento de responder. El vuelo más glamuroso del sistema solar está preparado para ti.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-yellow-700 to-orange-700 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_50px_rgba(220,160,50,0.4)] hover:scale-105 transition-all duration-300"
            >
              Reservar mi Vuelo a Venus →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
