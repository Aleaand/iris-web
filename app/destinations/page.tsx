"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Starfield from "@/components/Starfield";
import { Globe, Thermometer, Weight, Zap, ChevronRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { irisApi } from "@/lib/api";
import { Destination } from "@/types";
import { getNasaImages } from "@/lib/nasa";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [nasaImages, setNasaImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDestinations() {
      try {
        const destData = await irisApi.getDestinations();
        const dests: Destination[] = destData.datos || [];
        setDestinations(dests);

        // Fetch NASA images for each planet
        const imagePromises = dests.map(async (d) => {
          const images = await getNasaImages(d.name, 1);
          return { name: d.name, url: images[0]?.url || "/img/placeholder_space.jpg" };
        });

        const imageResults = await Promise.all(imagePromises);
        const imageMap = imageResults.reduce((acc, curr) => {
          acc[curr.name] = curr.url;
          return acc;
        }, {} as Record<string, string>);

        setNasaImages(imageMap);
      } catch (err) {
        console.error("Error loading destinations:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDestinations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06040d] flex flex-col items-center justify-center">
        <Starfield />
        <Loader2 size={48} className="text-purple-500 animate-spin mb-4" />
        <p className="mono-text text-[10px] uppercase tracking-[0.3em] text-slate-500">Mapeando el Sistema Solar...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#06040d]">
      <Starfield />
      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-20 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4 animate-fade-in">
            <Sparkles size={12} className="text-purple-400" />
            <span className="mono-text text-[9px] uppercase tracking-widest text-purple-300">Atlas Interplanetario</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9]">
            Elige tu <br /> <span className="italic text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">Próximo Mundo</span>
          </h1>
          <p className="text-slate-400 text-xl font-light max-w-2xl mx-auto leading-relaxed mt-6">
            Desde los valles de Marte hasta los anillos de Saturno. Explora destinos validados por Iris Aerospace para la vida humana.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {destinations.map((dest, i) => (
            <Link 
              key={dest.id} 
              href={`/destinations/${dest.slug}`}
              className="group relative flex flex-col rounded-[3.5rem] card-purple overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(147,51,234,0.15)]"
            >
              {/* Image Header */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image 
                  src={nasaImages[dest.name] || "/img/placeholder_space.jpg"} 
                  alt={dest.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0d0a1a] via-transparent to-transparent" />
                
                {/* Tech Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="mono-text text-[8px] text-white uppercase tracking-widest">Habitabilidad: Alta</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-10 space-y-6">
                <div>
                  <h3 className="text-4xl font-bold text-white tracking-tight mb-2 group-hover:text-purple-400 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-slate-500 text-sm font-light leading-relaxed line-clamp-2 italic">
                    "{dest.description}"
                  </p>
                </div>

                {/* Technical Specs */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Thermometer size={12} />
                      <span className="mono-text text-[8px] uppercase tracking-widest">Temp</span>
                    </div>
                    <p className="text-white text-xs font-bold">{dest.temperature}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Weight size={12} />
                      <span className="mono-text text-[8px] uppercase tracking-widest">Grav</span>
                    </div>
                    <p className="text-white text-xs font-bold">{dest.gravity}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Zap size={12} />
                      <span className="mono-text text-[8px] uppercase tracking-widest">Dist</span>
                    </div>
                    <p className="text-white text-xs font-bold">{dest.distance_au}</p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-purple-500" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Sector Orbital 0{i + 1}</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-purple-600 transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 py-32 px-6 text-center">
        <div className="max-w-2xl mx-auto card-purple p-16 rounded-[4rem] relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 blur-[100px]" />
          <h2 className="text-4xl font-bold text-white mb-6">¿Ves tu futuro aquí?</h2>
          <p className="text-slate-500 mb-10 font-light">Reserva tu plaza en la próxima ventana de lanzamiento.</p>
          <Link 
            href="/booking" 
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all shadow-2xl"
          >
            Ver Vuelos Disponibles <ChevronRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
