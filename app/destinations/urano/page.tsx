import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Thermometer, Gauge, Sun, Orbit, Disc, ScanLine, Flower2, Star, Zap } from "lucide-react";

export const metadata = {
  title: "Urano — Iris Aerospace",
  description: "El misterio inclinado. Un gigante de hielo de un verde-azul hipnótico que orbita tumbado sobre su eje: el excéntrico irresistible del Sistema Solar.",
};

const poi = [
  {
    name: "Las Llanuras Cristalinas del Eje Inclinado",
    desc: "Camina sobre extensiones de metano y amínos congelados que forman estructuras de cristal hexagonal a -224°C. Bajo la luz oblicua del sol — que en Urano llega casi de lado — el suelo brilla como un campo de diamantes.",
    icon: Sun,
  },
  {
    name: "Los Acántilados de Miranda",
    desc: "Miranda tiene el acantilado más alto del sistema solar: 20 km de caída vertical de roca y hielo. Aterriza junto a su borde y asoma la vista. El vértigo será real; el traje Iris lo gestiona. La sensación, no.",
    icon: Orbit,
  },
  {
    name: "El Gran Amanecer de 42 Años",
    desc: "Debido a su inclinación, el sol sale una vez cada 42 años en los polos de Urano. Si aciertas la ventana, presencias un amanecer que durará meses. Irrepetible e irrenunciable.",
    icon: Disc,
  },
];

const experiencias = [
  {
    title: "Trekking sobre las Formaciones de Cristal de Urano",
    desc: "Con raquetas térmicas Iris Frost Edition y guía geológico privado, explora las formaciones de cristal de metano congelado bajo la luz lateral del sol. Cada paso resuena distinto; cada km revela una textura nueva del planeta más misterioso del sistema solar.",
    icon: ScanLine,
  },
  {
    title: "Retiro de Silencio Total en el Polo Norte",
    desc: "El polo norte de Urano pasa décadas sin luz solar. Nuestro retiro de wellness en oscuridad total es el programa de desconexción más radical que existe: biorritmos reiniciados, mente limpia, y el silencio más profundo del sistema solar como banda sonora.",
    icon: Flower2,
  },
];

export default function UranoPage() {
  return (
    <main className="min-h-screen bg-[#110e20] text-white overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490143921278-d853145e4977?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Urano — nebulosa"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#110e20]/30 via-transparent to-[#110e20]/80" />
        <div className="absolute inset-0 bg-teal-950/10" />

        <div className="relative z-10">
          <p className="mono-text text-[10px] text-teal-400 uppercase tracking-[0.4em] mb-4">Destino — 19.18 AU</p>
          <h1 className="text-8xl md:text-[11rem] font-black uppercase tracking-tighter text-white leading-none mb-6">
            Urano
          </h1>
          <p className="text-xl md:text-2xl text-teal-300/90 font-light italic mb-6 max-w-xl mx-auto">
            "Un mundo que te verá de lado. Igual que él nos ve a nosotros."
          </p>
          <p className="text-slate-300 font-light leading-relaxed max-w-2xl mx-auto mb-12 text-lg">
            Nuestras naves aterrizan en la superficie del gigante helado más peculiar del sistema solar:
            un planeta que orbita tumbado sobre su eje, donde el sol sale casi de lado y proyecta sombras
            de otro mundo sobre llanuras de metano cristalizado. Un destino para los que quieren algo
            radicalmente diferente, radicalmente hermoso y completamente inexplicable.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_40px_rgba(100,210,210,0.6)] hover:scale-105 transition-all duration-300"
          >
            Descubrir el Gigante Secreto →
          </Link>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="mono-text text-[9px] text-teal-400 uppercase tracking-[0.4em] text-center mb-12">Datos del destino</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <MapPin size={18} />, label: "Distancia", value: "19.18 AU", sub: "del sol" },
              { icon: <Thermometer size={18} />, label: "Clima", value: "-224°C", sub: "el más frío del sistema" },
              { icon: <Gauge size={18} />, label: "Gravedad", value: "89%", sub: "de la terrestre" },
            ].map((stat, i) => (
              <div key={i} className="card-purple p-6 rounded-2xl text-center hover:border-teal-500/40 transition-all duration-300">
                <div className="text-teal-400 flex justify-center mb-3">{stat.icon}</div>
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
            <Star size={18} className="text-teal-400" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Puntos de Interés</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {poi.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="card-purple p-8 rounded-3xl hover:border-teal-500/40 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-5">
                    <Icon size={22} className="text-teal-400" />
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
            <Zap size={18} className="text-teal-400" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">Experiencias Exclusivas</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {experiencias.map((e, i) => {
              const Icon = e.icon;
              return (
                <div key={i} className="card-purple p-10 rounded-3xl hover:border-teal-500/40 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6">
                    <Icon size={26} className="text-teal-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors">{e.title}</h3>
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
          <div className="relative card-purple rounded-[3rem] p-16 text-center overflow-hidden border-teal-500/20">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-800/20 blur-[100px] pointer-events-none" />
            <p className="mono-text text-[9px] text-teal-400 uppercase tracking-[0.4em] mb-6">Iris Aerospace — Expedición Urano</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              El universo tiene secretos que<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                no todos se atreven a descubrir.
              </span>
            </h2>
            <p className="text-slate-400 mb-10 max-w-lg mx-auto font-light text-lg">
              Urano te espera con su misterio intacto y su elegante inclinación hacia lo desconocido.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full text-white font-bold text-[11px] uppercase tracking-widest hover:shadow-[0_0_50px_rgba(100,210,210,0.4)] hover:scale-105 transition-all duration-300"
            >
              Explorar lo Inexplorado →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
