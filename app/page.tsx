"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Starfield from "@/components/Starfield";
import { ChevronRight, Rocket, Shield, Zap, Sparkles, Globe, Activity, ArrowDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { irisApi } from "@/lib/api";
import { Destination } from "@/types";
import { getNasaImages } from "@/lib/nasa";

export default function Home() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [nasaImages, setNasaImages] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const destData = await irisApi.getDestinations();
        const dests = destData.datos || [];
        setDestinations(dests);
        const imagePromises = dests.slice(0, 3).map(async (d: Destination) => {
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
        console.error("Error cargando datos:", err);
      }
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#06040d]">
      <Starfield />
      <Navbar />
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] bg-linear-to-tr from-purple-900/20 via-transparent to-transparent opacity-40 blur-[120px] animate-slow-spin" />
        </div>

        <div className="relative z-10 space-y-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 animate-fade-in-up">
            <Sparkles size={12} className="text-purple-400" />
            <span className="mono-text text-[9px] uppercase tracking-widest text-purple-300">Reserva tu vuelo</span>
          </div>
          <h1 className="text-8xl md:text-[10rem] font-bold text-white tracking-tighter leading-[0.8] animate-title">
            IRÍS <br /> <span className="italic text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-indigo-400 to-slate-400">AEROSPACE</span>
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:400ms]">
            Es un <span className="text-white font-medium">protocolo de excelencia</span> hacia las estrellas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 animate-fade-in-up [animation-delay:600ms]">
            <Link
              href="/booking"
              className="px-12 py-5 bg-white text-black rounded-full font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-purple-600 hover:text-white transition-all shadow-2xl shadow-purple-600/20"
            >
              Planificar Vuelo
            </Link>
            <Link
              href="/experience"
              className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all backdrop-blur-md"
            >
              Experiencia Iris
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <ArrowDown size={24} className="text-white" />
        </div>
      </section>
    </main>
  );
}
