"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Globe, Thermometer, Weight, Zap, ChevronRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { irisApi } from "@/lib/api";
import { Destination } from "@/types";
import { getNasaImages } from "@/lib/nasa";

const destinationSlogans: Record<string, string> = {
  "marte": "Atrévete a navegar entre dunas de tierras rojas...",
  "júpiter": "Contempla la tormenta eterna de la Gran Mancha...",
  "saturno": "Navega sobre el cinturón de hielo y polvo más brillante...",
  "neptuno": "Sumérgete en vientos supersónicos y un azul metano infinito...",
  "tierra": "Contempla los océanos infinitos desde la órbita de tu hogar...",
  "venus": "Desafía la densa atmósfera ácida sobre llanuras volcánicas...",
  "mercurio": "Admira amaneceres colosales sobre un horizonte de fuego...",
  "urano": "Explora el misterioso gigante helado de inclinación extrema..."
};

export default function DestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [nasaImages, setNasaImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // 3D Carrusel
  const carouselRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);
  const isDragging = useRef(false);
  const currentMousePos = useRef(0);
  const lastMousePos = useRef(0);
  const moveTo = useRef(0);
  const lastMoveTo = useRef(0);
  const animationFrameId = useRef<number>(0);
  const [tz, setTz] = useState(400);

  const updateTz = useCallback(() => {
    if (destinations.length === 0) return;
    const itemWidth = 240;
    const length = destinations.length;
    const gap = 30;
    const calculatedTz = Math.round((itemWidth / 2) / Math.tan(Math.PI / length) + gap);
    setTz(calculatedTz);
  }, [destinations.length]);

  useEffect(() => {
    updateTz();
    window.addEventListener('resize', updateTz);
    return () => window.removeEventListener('resize', updateTz);
  }, [updateTz]);

  const lerp = (a: number, b: number, n: number) => n * (a - b) + b;

  useEffect(() => {
    if (loading || destinations.length === 0) return;
    const update = () => {
      lastMoveTo.current = lerp(moveTo.current, lastMoveTo.current, 0.05);
      if (carouselRef.current) {
        carouselRef.current.style.transform = `rotateY(${lastMoveTo.current}deg)`;

        const items = carouselRef.current.children;
        for (let i = 0; i < items.length; i++) {
          const item = items[i] as HTMLElement;
          const totalRotation = (lastMoveTo.current + i * (360 / destinations.length)) % 360;
          let normalized = totalRotation;
          while (normalized > 180) normalized -= 360;
          while (normalized < -180) normalized += 360;

          const absRot = Math.abs(normalized);
          const darkness = Math.min(1, absRot / 120);
          item.style.filter = `brightness(${1 - (darkness * 0.8)}) opacity(${1 - (darkness * 0.3)})`;

          // Dynamic opacity for the background image so it becomes fully bright at the front
          const img = item.querySelector('.dest-card-image') as HTMLElement;
          if (img) {
            const imgOpacity = Math.max(0.4, 1.0 - (absRot / 90) * 0.6);
            img.style.opacity = imgOpacity.toString();
          }
        }
      }
      animationFrameId.current = requestAnimationFrame(update);
    };
    update();
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [loading, destinations.length]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isMouseDown.current = true;
    isDragging.current = false;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    lastMousePos.current = clientX;
    if (carouselRef.current) carouselRef.current.style.cursor = "grabbing";
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    if (carouselRef.current) carouselRef.current.style.cursor = "grab";
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isMouseDown.current) return;
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const delta = clientX - lastMousePos.current;
    moveTo.current += delta * 0.4;
    lastMousePos.current = clientX;
  };

  useEffect(() => {
    async function loadDestinations() {
      try {
        const destData = await irisApi.getDestinations();
        const rawDests = destData.datos || [];
        const dests: Destination[] = rawDests.map((d: any) => ({
          ...d,
          slug: d.slug || d.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        }));
        setDestinations(dests);

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
      <div className="min-h-screen bg-[#110e20] flex flex-col items-center justify-center">
        <Loader2 size={48} className="text-purple-500 animate-spin mb-4" />
        <p className="mono-text text-[10px] uppercase tracking-[0.3em] text-slate-500">Cargando...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#110e20]">
      <Navbar />

      {/* Hero*/}
      <section className="relative z-10 pt-32 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-7xl md:text-8xl font-bold text-white tracking-tighter leading-[0.9]">
            Elige tu <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400">Próximo Destino</span>
          </h1>
        </div>
      </section>

      {/* 3D Destinations Carousel */}
      <section
        className="relative z-10 px-6 max-w-full overflow-hidden mx-auto h-[350px] md:h-[400px] flex items-center justify-center select-none mt-4 md:mt-8"
        style={{ perspective: "1200px" }}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[350px] md:h-[400px] rounded-full pointer-events-none z-0 blur-[50px] opacity-80"
          style={{
            background: "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, rgba(79, 70, 229, 0.08) 50%, rgba(6, 4, 13, 0) 75%)"
          }}
        />

        <div
          ref={carouselRef}
          className="relative w-[200px] h-[200px] md:w-[240px] md:h-[200px] cursor-grab z-10"
          style={{ transformStyle: "preserve-3d" }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {destinations.map((dest, i) => {
            const degressByItem = i * (360 / destinations.length);
            return (
              <div
                key={dest.id}
                onClick={(e) => {
                  if (isDragging.current) {
                    e.preventDefault();
                  } else {
                    router.push(`/destinations/${dest.slug}`);
                  }
                }}
                className="absolute top-0 left-0 w-full h-full rounded-[2rem] overflow-hidden bg-white/[0.02] backdrop-blur-[20px] border border-white/15 hover:border-purple-500/60 transition-all duration-500 group shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-end"
                style={{
                  transform: `rotateY(${degressByItem}deg) translateZ(${tz}px)`,
                  boxShadow: `
                    inset 0 1px 2px rgba(255, 255, 255, 0.25),
                    inset 0 -1px 2px rgba(0, 0, 0, 0.4),
                    0 20px 50px rgba(0,0,0,0.5)
                  `,
                }}
              >
                <Image
                  src={nasaImages[dest.name] || "/img/placeholder_space.jpg"}
                  alt={dest.name}
                  fill
                  className="dest-card-image object-cover transition-all duration-700 scale-100 group-hover:scale-105"
                  draggable={false}
                />

                <div className="absolute inset-0 bg-linear-to-tr from-white/[0.03] via-transparent to-white/[0.08] pointer-events-none z-10 transition-opacity duration-500 opacity-60 group-hover:opacity-100" />
                <div className="absolute -inset-full bg-linear-to-r from-transparent via-white/[0.1] to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out z-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110e20]/90 via-[#110e20]/40 to-transparent pointer-events-none z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-3 z-30 pointer-events-none">
                  <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-[15px] border border-white/10 group-hover:border-purple-500/40 transition-all duration-500 pointer-events-auto flex flex-col justify-end translate-y-3 group-hover:translate-y-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-extrabold text-white tracking-tight group-hover:text-purple-300 transition-colors duration-300">
                        {dest.name}
                      </h3>
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-purple-600 transition-all duration-300">
                        <ChevronRight size={8} className="group-hover:scale-110" />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-300/90 leading-relaxed font-light mt-1.5 h-0 opacity-0 group-hover:h-8 group-hover:opacity-100 transition-all duration-500 ease-out line-clamp-2">
                      {destinationSlogans[dest.name.toLowerCase()] || dest.description || "Explora las fronteras del universo..."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* Footer CTA */}
      <section className="relative z-10 pb-16 px-6 text-center">
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