import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import {
  Rocket,
  Globe,
  Shield,
  Zap,
  Users,
  Star,
  MoveRight,
  Compass,
  Bed,
  Droplets,
  Wind,
  Moon,
  Bot,
  Wine,
  Crown,
  Sparkles
} from "lucide-react";
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

const VALORES = [
  { icono: Shield, titulo: "Seguridad Absoluta", descripcion: "Triple redundancia en todos los sistemas. Tu seguridad es nuestra obsesión, no una promesa." },
  { icono: Zap, titulo: "Innovación Constante", descripcion: "Colaboramos con los mejores ingenieros del planeta para empujar los límites de lo posible." },
  { icono: Users, titulo: "Atención Personalizada", descripcion: "Cada cliente tiene un gestor dedicado. No eres un número, eres un explorador." },
  { icono: Globe, titulo: "Visión Global", descripcion: "Nuestro objetivo final: que viajar a Marte sea tan normal como volar a Nueva York." },
];

export default function PaginaSobreIris() {
  return (
    <main className="min-h-screen relative bg-[#110e20] overflow-x-hidden">
      <Navbar />

      <section className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-8 text-center pt-20">
        <div className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-purple-600/8 aurora-blur rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-indigo-600/8 aurora-blur rounded-full animate-pulse" style={{ animationDuration: '4s' }} />

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
            Ofrecemos la posibilidad de ser parte de la historia y una nueva forma de explorar el cosmos.
          </p>
        </div>
      </section>

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

      <section className="relative z-10 py-20 px-8 max-w-6xl mx-auto border-t border-white/5">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              <Sparkles size={12} className="text-purple-400" />
              <span className="mono-text text-[9px] uppercase tracking-widest text-purple-300">Una nueva manera de ver el universo</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              El Cosmos como <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">jamás</span> lo habías imaginado.
            </h2>
            <p className="text-slate-300 text-lg font-light leading-relaxed">
              En Iris Aerospace, los viajes espaciales dejan de ser una odisea de supervivencia para convertirse en una sinfonía de placer, arte y descubrimiento. Creemos que la inmensidad del espacio exterior debe experimentarse con la misma sofisticación, tranquilidad y delicadeza que un hotel boutique de cinco estrellas.
            </p>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Acompañamos a las mentes más brillantes de nuestra generación en su tránsito hacia las estrellas, convirtiendo el vacío cósmico en un santuario de confort, bienestar de gravedad neutra y desconexión absoluta.
            </p>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/15 to-indigo-600/15 blur-[120px] rounded-full" />
            <div className="relative card-purple p-10 rounded-[3rem] border border-white/10 space-y-6 bg-slate-950/40 backdrop-blur-md">
              <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400">
                <Globe size={28} className="animate-[spin_15s_linear_infinite]" />
              </div>
              <h3 className="text-2xl font-bold text-white">Exploración Sin Fricciones</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Un nuevo prisma para contemplar el universo, uniendo la ingeniería aeroespacial con el refinamiento de la alta hospitalidad espacial de cinco estrellas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-8 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <Compass size={12} className="text-indigo-400" />
            <span className="mono-text text-[9px] uppercase tracking-widest text-indigo-300">Naves diseñadas para un viaje diferente</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Naves diseñadas para un viaje diferente</h2>
          <p className="text-slate-400 text-sm font-light leading-relaxed">
            Naves diseñadas para un viaje diferente, equipadas con tecnologías de gravedad artificial avanzada, escudos térmicos y suites suntuosas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-purple p-10 rounded-[3rem] border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="mono-text text-[8px] text-purple-400 uppercase tracking-widest font-bold">Cinturón Interior</span>
                  <h3 className="text-3xl font-bold text-white mt-1">Celestia</h3>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-mono text-slate-300">
                  500 pax | 26k km/s
                </div>
              </div>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Diseñado para travesías estables y placenteras. Anula cualquier turbulencia gracias a su avanzado estabilizador magnético activo.
              </p>
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="mono-text text-[9px] text-purple-300 uppercase tracking-wider font-bold">Servicios Incluidos:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 font-light">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Gravedad Variable</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Observatorio de Cuarzo</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Cine VR Inmersivo</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Casino Holográfico</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Simuladores EVA</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> Salones Gastronómicos</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="card-purple p-10 rounded-[3rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="mono-text text-[8px] text-indigo-400 uppercase tracking-widest font-bold">Largo Alcance</span>
                  <h3 className="text-3xl font-bold text-white mt-1">Runner Pro</h3>
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-mono text-slate-300">
                  1000 pax | 500k km/s
                </div>
              </div>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Nuestra joya de velocidad ultra-rápida. Dispone de propulsores gravitatorios de curvatura espacial y escudos protectores de plasma denso.
              </p>
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="mono-text text-[9px] text-indigo-300 uppercase tracking-wider font-bold">Servicios Incluidos:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400 font-light">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Motor de Curvatura</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Conexión Cuántica</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Clínica Bio-Spa</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Escudo de Plasma</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Cuidado Personal</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Salones Astro-Lounge</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-8 max-w-6xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
            <Bed size={12} className="text-purple-400" />
            <span className="mono-text text-[9px] uppercase tracking-widest text-purple-300">Habitaciones del Mañana</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Tu Refugio entre las Estrellas</h2>
          <p className="text-slate-400 text-sm font-light leading-relaxed">
            Elige el nivel de exclusividad que mejor se adapte a tu estilo de exploración estelar. Diseños ergonómicos combinados con tecnología domótica integrada.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-purple p-10 rounded-[3rem] border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">Cabina Nova</h3>
                  <p className="text-xs text-purple-400 mt-1 uppercase tracking-wider font-mono">Tecnología & Ergonomía Inteligente</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Un santuario sumamente inteligente donde la ergonomía y la biometría se unen para proporcionarte un descanso placentero en gravedad adaptativa.
              </p>
              <ul className="space-y-3 pt-4 border-t border-white/5 text-xs text-slate-300 font-light">
                <li className="flex items-center gap-2.5"><Bed size={14} className="text-purple-400" /> Cama ergonómica con anclajes magnéticos</li>
                <li className="flex items-center gap-2.5"><Droplets size={14} className="text-purple-400" /> Ducha de microbruma sónica regenerativa</li>
                <li className="flex items-center gap-2.5"><Wind size={14} className="text-purple-400" /> Climatización de oxígeno automatizada</li>
                <li className="flex items-center gap-2.5"><Moon size={14} className="text-purple-400" /> Ciclos lumínicos circadianos del sueño</li>
                <li className="flex items-center gap-2.5"><Bot size={14} className="text-purple-400" /> Habitación inteligente con IA integrada</li>
              </ul>
            </div>
          </div>

          <div className="card-purple p-10 rounded-[3rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">Cabina Supernova</h3>
                  <p className="text-xs text-indigo-400 mt-1 uppercase tracking-wider font-mono">Suite Panorámica VIP</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                La suite real definitiva sobre el vacío cósmico. Equipada con amplios ventanales panorámicos y atenciones exclusivas de ultra-lujo.
              </p>
              <ul className="space-y-3 pt-4 border-t border-white/5 text-xs text-slate-300 font-light">
                <li className="flex items-center gap-2.5"><Bed size={14} className="text-indigo-400" /> Cama King-Size de confort adaptativo</li>
                <li className="flex items-center gap-2.5"><Droplets size={14} className="text-indigo-400" /> Spa privado con bañera hidrodinámica</li>
                <li className="flex items-center gap-2.5"><Wine size={14} className="text-indigo-400" /> Bar de nutrición y coctelería molecular</li>
                <li className="flex items-center gap-2.5"><Crown size={14} className="text-indigo-400" /> Acceso priorizado Fast-Track y pase VIP</li>
                <li className="flex items-center gap-2.5"><Sparkles size={14} className="text-indigo-400" /> Prioridad en experiencias de caminata EVA</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

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
