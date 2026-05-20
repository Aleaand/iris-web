"use client";
import React from "react";
import Link from "next/link";
import { Ship, Sparkles, Navigation, Shield, Compass, Heart, Wind, Tv, Bed, Droplets, Archive, Orbit, Moon, Bot, Wine, Crown, Rocket } from "lucide-react";

export default function HomeFleet() {
  return (
    <section className="relative w-full bg-[#06040d] pt-32 pb-40 px-6 border-t border-white/5 overflow-hidden z-30">
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-32 relative z-10">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-2">
              <Compass size={13} className="text-purple-400" />
              <span className="mono-text text-[9px] uppercase tracking-[0.3em] text-purple-300">
                Nuestras Naves Estelares
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white leading-none">
              Máximo Confort con
              <span className=" text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400 uppercase">
                Iris
              </span>
            </h2>

            <p className="text-slate-400/80 text-base md:text-lg font-light leading-relaxed">
              Nuestros cruceros estelares están diseñados bajo la premisa de la comodidad total. No son simples vehículos de transporte; son hoteles flotantes de cinco estrellas equipados con tecnologías de gravedad artificial y regeneración atmosférica.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="group relative flex flex-col rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:border-purple-500/30 overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_0_60px_rgba(168,85,247,0.08)]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src="/img/naves/celestia/homecelestia.png"
                  alt="Naves Estelares Celestia"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06040d] via-transparent to-transparent" />

                <div className="absolute bottom-6 left-8 flex gap-6 text-[9px] font-mono text-purple-300 tracking-widest uppercase">
                  <div>CAP: 500pax</div>
                  <div>VEL: 26,000 km/s</div>
                </div>
              </div>

              <div className="p-10 md:p-12 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-semibold tracking-tight text-white">
                      Celestia
                    </h3>
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase border border-white/10 rounded-full px-3 py-1">
                      Desde el cielo, hacia la infinidad de las estrellas
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    Diseñado para la travesía regular por el cinturón interior del Sistema Solar. Celestia ofrece una estabilidad magnética absoluta que anula cualquier turbulencia estelar o viento solar.
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <h4 className="mono-text text-[10px] text-purple-400 tracking-[0.25em] uppercase font-bold">
                    Comodidades a bordo
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-[11px] font-light text-slate-300">
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-500 rounded-full shrink-0" />Módulos de Gravedad Variable</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-500 rounded-full shrink-0" />Cine de Realidad Virtual Inmersiva</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-500 rounded-full shrink-0" />Cúpula Observatorio de Alta Claridad</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-500 rounded-full shrink-0" />Casino e Hipódromo Holográfico</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-500 rounded-full shrink-0" />Simuladores de Caminata Espacial (EVA)</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-500 rounded-full shrink-0" />Salones Gastronómicos de Vanguardia</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-500 rounded-full shrink-0" />Talleres de Arte Tridimensional</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-500 rounded-full shrink-0" />Galería y Museo Holográfico</li>
                  </ul>
                  <div className="pt-2">
                    <Link href="/about" className="text-[10px] uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors font-medium hover:underline underline-offset-4 decoration-purple-500/50">
                      Ver más...
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative flex flex-col rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:border-purple-500/30 overflow-hidden transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_0_60px_rgba(168,85,247,0.08)]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src="/img/naves/runner/homerunner.png"
                  alt="Runner Pro"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06040d] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-8 flex gap-6 text-[9px] font-mono text-indigo-300 tracking-widest uppercase">
                  <div>CAP: 1000 pax</div>
                  <div>VEL: 500,000 km/s</div>
                </div>
              </div>

              <div className="p-10 md:p-12 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-semibold tracking-tight text-white">
                      Runner Pro
                    </h3>
                    <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase border border-white/10 rounded-full px-3 py-1">
                      La nave más veloz del universo
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    Nuestra joya de largo alcance. Runner Pro dispone del exclusivo impulsor gravitatorio de curvatura y un escudo protector de plasma denso para travesías al espacio exterior e interestelar.
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <h4 className="mono-text text-[10px] text-indigo-400 tracking-[0.25em] uppercase font-bold">
                    Comodidades a bordo
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 text-[11px] font-light text-slate-300">
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full shrink-0" />Centro de Conectividad Cuántica</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full shrink-0" />Clínica de Bienestar & Bio-Spa</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full shrink-0" />Salón de Estilismo & Cuidado Personal</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full shrink-0" />Academia de Talleres Espaciales</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full shrink-0" />Módulos de Gravedad Variable</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full shrink-0" />Cine de Realidad Virtual Inmersiva</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full shrink-0" />Talleres de Arte Tridimensional</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 bg-indigo-500 rounded-full shrink-0" />Casino e Hipódromo Holográfico</li>
                  </ul>
                  <div className="pt-2">
                    <Link href="/about" className="text-[10px] uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors font-medium hover:underline underline-offset-4 decoration-indigo-500/50">
                      Ver más...
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/*Parte de cabinas */}
        <div className="space-y-16 pt-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-2">
              <Sparkles size={13} className="text-indigo-400" />
              <span className="mono-text text-[9px] uppercase tracking-[0.3em] text-indigo-300">
                Tus cabinas
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white leading-none">
              ¿Qué cabina prefieres? <br /><span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">Nova o Supernova</span>
            </h2>

            <p className="text-slate-400/80 text-base md:text-lg font-light leading-relaxed">
              Elige el espacio que mejor se adapte a tu estilo de exploración. Tanto si buscas un retiro ergonómico y tecnológico para descansar, como si deseas la máxima comodidad en tu viaje.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">

            {/* Nova */}
            <div className="group relative rounded-[3rem] bg-white/[0.01] border border-white/5 hover:border-purple-500/20 overflow-hidden transition-all duration-500 flex flex-col justify-between hover:scale-[1.01]">
              <div>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src="/img/naves/cabinanova.png"
                    alt="Cabina Nova"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06040d] via-transparent to-transparent" />
                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-purple-500/20 backdrop-blur-md rounded-full border border-purple-500/30 text-[9px] font-mono tracking-widest text-purple-300 uppercase">
                    La más solicitada por nuestros pasajeros
                  </div>
                </div>
                <div className="p-10 space-y-6">
                  <h3 className="text-3xl font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors">
                    Cabina Nova
                  </h3>

                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    Tu propio refugio perfecto y tecnológico para el viajero interplanetario. Un espacio sumamente inteligente donde la ergonomía y la biometría se unen para proporcionarte un descanso placentero durante todo el viaje.
                  </p>

                  <ul className="space-y-3 pt-4 border-t border-white/5 text-xs text-slate-300 font-light">
                    <li className="flex items-center gap-2"><Bed size={14} className="text-purple-400 shrink-0" />Cama Ergonómica de Máximo Confort (con anclajes de seguridad)</li>
                    <li className="flex items-center gap-2"><Droplets size={14} className="text-purple-400 shrink-0" />Baño Privado con Ducha de Microbruma Sónica</li>
                    <li className="flex items-center gap-2"><Archive size={14} className="text-purple-400 shrink-0" />Módulo de Armario Inteligente</li>
                    <li className="flex items-center gap-2"><Tv size={14} className="text-purple-400 shrink-0" />Consola de Entretenimiento y TV</li>
                    <li className="flex items-center gap-2"><Wind size={14} className="text-purple-400 shrink-0" />Climatización y Optimización de Oxígeno Automática</li>
                    <li className="flex items-center gap-2"><Orbit size={14} className="text-purple-400 shrink-0" />Sistemas de Gravedad Adaptativa Local</li>
                    <li className="flex items-center gap-2"><Moon size={14} className="text-purple-400 shrink-0" />Regulación del Ciclo del Sueño Lumínica</li>
                    <li className="flex items-center gap-2"><Bot size={14} className="text-purple-400 shrink-0" />Habitación inteligente con IA personal integrada</li>
                  </ul>
                </div>
              </div>

              <div className="p-10 pt-0">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  <span>Podria ser tuya...</span>
                  <Link href="/booking" className="text-purple-400 text-xl font-bold hover:text-purple-300 hover:underline underline-offset-4 decoration-purple-500/50">Reserva Ahora</Link>
                </div>
              </div>
            </div>

            {/* Supernova */}
            <div className="group relative rounded-[3rem] bg-white/[0.01] border border-white/5 hover:border-indigo-500/20 overflow-hidden transition-all duration-500 flex flex-col justify-between hover:scale-[1.01]">
              <div>
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src="/img/naves/cabinasupernova.png"
                    alt="Cabina Supernova Suite"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06040d] via-transparent to-transparent" />

                  <div className="absolute top-6 left-6 px-4 py-1.5 bg-indigo-500/20 backdrop-blur-md rounded-full border border-indigo-500/30 text-[9px] font-mono tracking-widest text-indigo-300 uppercase">
                    La más alagada por nuestros pasajeros
                  </div>
                </div>

                <div className="p-10 space-y-6">
                  <h3 className="text-3xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                    Cabina Supernova
                  </h3>

                  <p className="text-slate-400 text-sm font-light leading-relaxed">
                    La máxima exclusividad. Una suntuosa suite privada sobre el vacío espacial, dotada de amplios ventanales panorámicos y servicios dedicados para disfrutar del viaje.
                  </p>

                  <ul className="space-y-3 pt-4 border-t border-white/5 text-xs text-slate-300 font-light">
                    <li className="flex items-center gap-2"><Bed size={14} className="text-indigo-400 shrink-0" />Cama King-Size de Confort Adaptativo</li>
                    <li className="flex items-center gap-2"><Droplets size={14} className="text-indigo-400 shrink-0" />Spa Suite con Bañera de Hidromasaje Hidrodinámica</li>
                    <li className="flex items-center gap-2"><Tv size={14} className="text-indigo-400 shrink-0" />Consola de Entretenimiento y zonas de recreación(TV, escritorio)</li>
                    <li className="flex items-center gap-2"><Bot size={14} className="text-indigo-400 shrink-0" />Asistente de IA con opción holográfica</li>
                    <li className="flex items-center gap-2"><Wine size={14} className="text-indigo-400 shrink-0" />Bar de Nutrición y Coctelería</li>
                    <li className="flex items-center gap-2"><Crown size={14} className="text-indigo-400 shrink-0" />Acceso Exclusivo y Beneficios VIP</li>
                    <li className="flex items-center gap-2"><Compass size={14} className="text-indigo-400 shrink-0" />Pase de Acceso Total a la Cubierta VIP "Astro-Lounge"</li>
                    <li className="flex items-center gap-2"><Rocket size={14} className="text-indigo-400 shrink-0" />Embarque y Lanzamiento Prioritario (Fast-Track)</li>
                    <li className="flex items-center gap-2"><Sparkles size={14} className="text-indigo-400 shrink-0" />Prioridad en Experiencias (EVA)</li>
                  </ul>
                </div>
              </div>

              <div className="p-10 pt-0">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  <span>Podria ser tuya...</span>
                  <Link href="/booking" className="text-indigo-400 text-xl font-bold hover:text-indigo-300 hover:underline underline-offset-4 decoration-indigo-500/50">Reserva Ahora</Link>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
