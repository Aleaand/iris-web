"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Zap, Activity, CheckCircle2, ChevronRight, Award, Clock, RefreshCw, MapPin, Sparkles, ShieldCheck, Globe, FileText, Shield, Fingerprint, Lock } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#110e20] animate-pulse min-h-[400px] flex items-center justify-center text-slate-500">Cargando holograma 3D...</div>
});

const modulos = [
  {
    title: "Cámara de Vacío y Microgravedad",
    desc: "Adaptación pulmonar y física a la descompresión controlada y flotabilidad neutra en simuladores líquidos.",
  },
  {
    title: "Centrífuga de Alta G",
    desc: "Simulación hiperrealista del despegue y reentrada orbital para acondicionar tu sistema cardiovascular hasta 4G.",
  },
  {
    title: "Biomecánica y Caminata Espacial (EVA)",
    desc: "Uso y manejo del traje Iris EVA Couture. Mecánica de movimiento y anclajes en el exterior de la nave.",
  },
  {
    title: "Protocolos de Emergencia",
    desc: "Instrucciones de despresurización rápida, salida de escape y soporte de vida auxiliar en situaciones de contingencia.",
  },
  {
    title: "Alimentación Molecular y Descanso",
    desc: "Nutrición estelar optimizada y técnicas avanzadas de sueño bifásico en condiciones de gravedad cero.",
  },
];

const requisitos = [
  {
    title: "Documento de Identidad Oficial",
    desc: "Pasaporte nacional vigente o identificación gubernamental equivalente para la validación de aduanas interestelares."
  },
  {
    title: "Datos Primarios de Perfil",
    desc: "Registro de perfil básico y expediente médico aeroespacial esencial para la certificación de salud."
  },
  {
    title: "Fotografía Biométrica",
    desc: "Captura de ultra-alta definición adaptada para el reconocimiento en los escáneres ópticos orbitales."
  },
  {
    title: "Autorización Legal Firmada",
    desc: "Consentimiento de tratamiento de datos certificado legalmente para aduanas e inmigración de la misión."
  }
];

export default function ServicesPage() {
  const [activeSection, setActiveSection] = useState("iristraining");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ["iristraining", "pasaporte"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#110e20] text-white scroll-smooth">
      <Navbar />

      <section className="relative pt-44 pb-12 px-6 max-w-6xl mx-auto text-center z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
          <Sparkles size={12} className="text-purple-400" />
          <span className="mono-text text-[9px] uppercase tracking-[0.2em] text-purple-300">Facilitación y Servicios Extras Premium</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none">
          Siempre<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400"> a tu lado</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-4xl mx-auto">
          Tu viaje comienza mucho antes del despegue. Como agencia de súper lujo, no solo te llevamos a las estrellas, sino que facilitamos cada paso del proceso. Descubre nuestros servicios extras diseñados para garantizar tu seguridad, comodidad y tranquilidad absoluta.
        </p>
      </section>

      <div className="sticky top-24 z-40 flex justify-center w-full px-4 mb-16 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 p-1.5 rounded-full bg-slate-950/60 border border-white/10 backdrop-blur-xl shadow-[0_10px_50px_rgba(0,0,0,0.5)]">
          <button
            onClick={() => handleScroll("iristraining")}
            className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeSection === "iristraining"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Activity size={12} className={activeSection === "iristraining" ? "animate-pulse" : ""} />
            Iris Training
          </button>
          <button
            onClick={() => handleScroll("pasaporte")}
            className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              activeSection === "pasaporte"
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ShieldCheck size={12} className={activeSection === "pasaporte" ? "animate-pulse" : ""} />
            Pasaporte Estelar
          </button>
        </div>
      </div>

      <section id="iristraining" className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <Activity size={12} className="text-indigo-400" />
              <span className="mono-text text-[9px] uppercase tracking-widest text-indigo-300">01. Servicio Extra de Preparación</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Domina la <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Gravedad</span>.
            </h2>

            <p className="text-slate-300 text-lg font-light leading-relaxed">
              El programa Iris Training es un servicio extra fundamental que prepara tu cuerpo y mente para el salto al espacio profundo. Mediante simulación de vanguardia y expertos en medicina aeroespacial, garantizamos tu adaptación al entorno estelar.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
                <Clock size={16} className="text-purple-400" />
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider mono-text">Duración</p>
                  <p className="text-sm font-bold text-white">3 Horas Intensivas</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
                <Award size={16} className="text-indigo-400" />
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider mono-text">Vigencia</p>
                  <p className="text-sm font-bold text-white">10 Años de Validez</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
                <RefreshCw size={16} className="text-pink-400" />
                <div>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider mono-text">Actualización</p>
                  <p className="text-sm font-bold text-white">Renovación de 1 Hora</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 to-indigo-600/10 blur-[100px] rounded-full" />
            <div className="relative card-purple p-8 md:p-10 rounded-[3rem] border border-white/10 space-y-6">
              <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                <Zap size={28} className="animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-white">Acreditación Oficial</h3>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Un servicio de élite diseñado para que alcances los estándares regulatorios espaciales internacionales COSPAR con comodidad absoluta y eficiencia médica total.
              </p>
              <Link href="/booking" className="inline-flex items-center gap-3 px-6 py-3 bg-white text-black font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-purple-600 hover:text-white transition-all shadow-xl">
                Añadir a mi Reserva →
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white mb-8 flex items-center gap-3">
            <span className="w-1.5 h-5 bg-indigo-500 rounded-full" /> Módulos Especializados
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modulos.map((modulo, i) => (
              <div key={i} className="card-purple p-8 rounded-[2.5rem] border border-white/5 hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <CheckCircle2 size={16} />
                  </div>
                  <h4 className="text-md font-bold text-white">{modulo.title}</h4>
                </div>
                <p className="text-slate-400 text-xs font-light leading-relaxed">{modulo.desc}</p>
              </div>
            ))}
            <div className="card-purple p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border border-indigo-500/20 flex flex-col justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Comienza Hoy</h4>
                <p className="text-slate-400 text-xs font-light leading-relaxed mb-6">
                  Integra el Iris Training en tu plan de viaje estelar personalizado.
                </p>
              </div>
              <Link href="/booking" className="inline-flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-white hover:translate-x-1 transition-all">
                Reservar Servicios Extras <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center p-8 md:p-12 rounded-[3.5rem] bg-white/5 border border-white/10">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20">
              <MapPin size={12} className="text-pink-400" />
              <span className="mono-text text-[9px] uppercase tracking-widest text-pink-300">Centros de Alto Rendimiento</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              Cobertura Global
            </h3>
            <p className="text-slate-300 font-light leading-relaxed text-sm">
              Este servicio extra se ofrece en instalaciones de alto rendimiento en más de 30 capitales alrededor del mundo.
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Todas las ciudades piloto cuentan con suites ejecutivas dedicadas, simuladores avanzados y atención multilingüe personalizada.
              </p>
              <p className="text-xs font-semibold text-purple-400">
                Consulta la disponibilidad de agendas con tu gestor personal.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 relative w-full h-[400px] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black/50 shadow-2xl">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
              <span className="mono-text text-[7px] text-white uppercase tracking-widest font-bold">Estamos en más de 30 ciudades</span>
            </div>
            <div className="h-full w-full">
              <Spline scene="https://prod.spline.design/IFnz3XlG8CH9Wx4k/scene.splinecode" />
            </div>
          </div>
        </div>
      </section>

      <section id="pasaporte" className="relative z-10 py-16 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              <ShieldCheck size={12} className="text-purple-400" />
              <span className="mono-text text-[9px] uppercase tracking-widest text-purple-300">02. Servicio Extra de Burocracia</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Tu llave al universo, <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">sin fricciones</span>.
            </h2>

            <p className="text-slate-300 text-lg font-light leading-relaxed">
              Olvídate de las complicaciones legales. Ofrecemos el servicio de gestión integral de tu Pasaporte Estelar. Nos encargamos de toda la burocracia pesada y visados interplanetarios, acompañándote en cada paso del proceso.
            </p>

            <div className="space-y-4 pt-2">
              <h3 className="text-xs uppercase tracking-widest text-slate-400 mono-text mb-4">Requisitos del Pasajero</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {requisitos.map((req, i) => (
                  <div key={i} className="flex gap-3 items-start p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/20 transition-all duration-300">
                    <CheckCircle2 size={16} className="text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white mb-1">{req.title}</h4>
                      <p className="text-[11px] text-slate-400 font-light leading-normal">{req.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-pink-600/10 blur-[120px] rounded-full" />
            <div className="relative w-full max-w-sm card-purple p-8 rounded-[3rem] border border-white/20 transform hover:rotate-0 transition-transform duration-500 md:rotate-3 shadow-2xl">
              <div className="flex justify-between items-start mb-16">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold italic shadow-lg shadow-purple-500/30">I</div>
                  <div className="flex flex-col">
                    <span className="text-white text-[9px] font-bold tracking-widest uppercase">Iris Aerospace</span>
                    <span className="text-purple-400 text-[6px] uppercase tracking-[0.2em] font-light">Stellar Access Division</span>
                  </div>
                </div>
                <Globe size={28} className="text-white/20 animate-spin" style={{ animationDuration: '30s' }} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Fingerprint size={32} className="text-purple-400/80" />
                  <div>
                    <p className="mono-text text-[6px] text-slate-500 uppercase">Passenger Identity Verified</p>
                    <div className="h-4 w-40 bg-white/10 rounded-full mt-1 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 animate-[pulse_1.5s_infinite]" />
                    </div>
                  </div>
                </div>
                <div className="h-3 w-28 bg-white/5 rounded-full" />

                <div className="pt-8 flex justify-between items-end">
                  <div className="space-y-2">
                    <p className="mono-text text-[7px] text-slate-500 uppercase">Stellar ID Number</p>
                    <p className="text-white text-md font-mono tracking-widest font-bold">4082-9912-IRIS</p>
                  </div>
                  <div className="w-14 h-14 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden group">
                    <Lock size={18} className="text-purple-400/40 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between text-[8px] mono-text text-slate-500 uppercase tracking-widest">
                <span>Exp: 2045</span>
                <span>Class: VIP voyager</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 rounded-[3.5rem] bg-white/5 border border-white/10">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-10 text-center tracking-tight">Proceso Legal Simplificado</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Auditoría de Datos",
                desc: "Analizamos y validamos tus perfiles de identidad en bases de datos aeroespaciales globales de manera ultra-discreta.",
                icon: FileText,
                color: "text-purple-400"
              },
              {
                title: "Acreditación y Firmas",
                desc: "Coordinamos la firma digital y el resguardo seguro bajo encriptación de datos de grado militar y soberanía de datos orbital.",
                icon: Shield,
                color: "text-indigo-400"
              },
              {
                title: "Emisión de Llave Estelar",
                desc: "Recibe tu credencial Iris física y digital en tu dirección preferida en un lapso garantizado de 48 horas.",
                icon: Globe,
                color: "text-pink-400"
              },
            ].map((step, i) => (
              <div key={i} className="card-purple p-8 rounded-[2.5rem] text-center space-y-4 border border-white/5 hover:border-purple-500/20 transition-all duration-300 bg-black/40">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-purple-400">
                  <step.icon size={24} className={step.color} />
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-slate-400 text-xs font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-b from-purple-950/20 to-transparent p-12 md:p-20 rounded-[3rem] border border-purple-500/10">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
            Viaja sin fricciones
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto font-light leading-relaxed">
            Asegura hoy mismo tus servicios extras. Tu entrenamiento y gestión de visados interplanetarios en manos de los líderes absolutos de la industria.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:scale-105 shadow-xl shadow-purple-600/20 transition-all duration-300"
            >
              Reservar Servicios Extras →
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-bold text-[10px] uppercase tracking-widest transition-all"
            >
              Añadir a mi Reserva
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
