"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Rocket, Users, CreditCard, MessageSquare, Activity, ChevronLeft, ChevronRight, Loader2, MessageCircle, Sparkles, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { irisApi } from "@/lib/api";
import { Reservation, Destination } from "@/types";
import Countdown from "@/components/Countdown";
import { getNasaImages } from "@/lib/nasa";
import { motion, AnimatePresence } from "framer-motion";

export default function PortalDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    reservations: 0,
    passengers: 0,
    messages: 0
  });
  const [nextReservation, setNextReservation] = useState<Reservation | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [nasaImages, setNasaImages] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadDashboardData() {
      if (!session?.user) return;
      const token = (session.user as any).accessToken;

      try {
        const [resData, passData, msgData, destData] = await Promise.all([
          irisApi.getReservations(token),
          irisApi.getPassengers(token),
          irisApi.getMessages(token),
          irisApi.getDestinations()
        ]);

        const reservations = resData.datos || [];
        const passengers = passData.datos || [];
        const messages = msgData.datos || [];
        const dests = destData.datos || [];

        setStats({
          reservations: reservations.length,
          passengers: passengers.length,
          messages: messages.filter((m: any) => !m.is_read).length
        });

        setDestinations(dests);

        const imagePromises = dests.slice(0, 5).map(async (d: Destination) => {
          const images = await getNasaImages(d.name, 1);
          return { name: d.name, url: images[0]?.url || "/img/placeholder_space.jpg" };
        });

        const imageResults = await Promise.all(imagePromises);
        const imageMap = imageResults.reduce((acc, curr) => {
          acc[curr.name] = curr.url;
          return acc;
        }, {} as Record<string, string>);

        setNasaImages(imageMap);

        const now = new Date();
        const future = reservations
          .filter((r: Reservation) => r.flight && new Date(r.flight.departure_date) > now)
          .sort((a: Reservation, b: Reservation) =>
            new Date(a.flight!.departure_date).getTime() - new Date(b.flight!.departure_date).getTime()
          );

        if (future.length > 0) {
          setNextReservation(future[0]);
        }
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [session]);

  useEffect(() => {
    if (destinations.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % destinations.slice(0, 5).length);
    }, 8000);
    return () => clearInterval(timer);
  }, [destinations]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="text-purple-500 animate-spin mb-4" />
        <p className="mono-text text-[10px] uppercase tracking-[0.3em] text-slate-500">Sincronizando...</p>
      </div>
    );
  }

  const activeDests = destinations.slice(0, 5);

  return (
    <div className="animate-fade-in space-y-12 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Activity size={10} className="text-purple-400" />
            <span className="mono-text text-[8px] uppercase tracking-widest text-purple-300">Terminal Activa • Centro de Mando</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Bienvenido, <span className="text-purple-400 italic">{session?.user?.name?.split(' ')[0]}</span>.
          </h1>
          <p className="text-slate-500 mt-3 text-lg font-light">Estado actual de tus expediciones y protocolos activos.</p>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <p className="mono-text text-[8px] text-slate-500 uppercase tracking-widest mb-1">Próxima Salida</p>
            <p className="text-white font-bold">{nextReservation ? new Date(nextReservation.flight?.departure_date!).toLocaleDateString() : 'Ninguna'}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex flex-col items-end">
            <p className="mono-text text-[8px] text-slate-500 uppercase tracking-widest mb-1">Estado</p>
            <p className="text-green-400 font-bold uppercase text-[10px] tracking-widest">Nominal</p>
          </div>
        </div>
      </header>

      <section className="relative group">
        <div className="relative h-[500px] w-full overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={nasaImages[activeDests[currentSlide]?.name] || "/img/placeholder_space.jpg"}
                alt={activeDests[currentSlide]?.name || "Space"}
                fill
                className="object-cover opacity-60"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#06040d] via-transparent to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-16 md:p-24">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="max-w-2xl"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Globe size={16} className="text-purple-400" />
                    <span className="mono-text text-[10px] uppercase tracking-[0.3em] text-purple-300">Exploración Planetaria</span>
                  </div>
                  <h2 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-4">
                    {activeDests[currentSlide]?.name === 'Marte' ? 'El Gigante Rojo' : activeDests[currentSlide]?.name}
                  </h2>
                  <p className="text-slate-300 text-xl md:text-2xl font-light mb-10 leading-relaxed">
                    {activeDests[currentSlide]?.name === 'Marte'
                      ? 'Te espera con sus valles infinitos y el Monte Olimpo. La frontera final de la humanidad.'
                      : activeDests[currentSlide]?.description || 'Descubre los secretos que aguardan en los confines del sistema solar.'}
                  </p>

                  <Link
                    href={`/booking?destino=${activeDests[currentSlide]?.name}`}
                    className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-purple-600 hover:text-white transition-all shadow-2xl group/btn"
                  >
                    Reservar Destino <Rocket size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-10 right-10 flex gap-3 z-20">
            {activeDests.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-10 bg-white' : 'w-2 bg-white/20'}`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + activeDests.length) % activeDests.length)}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % activeDests.length)}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 card-purple p-12 rounded-[3rem] relative overflow-hidden flex flex-col justify-between min-h-[350px]">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 blur-[80px]" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Rocket size={14} className="text-purple-400" />
              <p className="mono-text text-[9px] text-purple-400 uppercase tracking-[0.3em]">Estado de Misión Activa</p>
            </div>

            {nextReservation ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-4xl font-bold text-white mb-2 uppercase tracking-tighter">
                    Viaje a {nextReservation.flight?.destination?.name}
                  </h3>
                  <p className="text-slate-500 text-sm font-light">
                    Localizador: <span className="text-slate-300 mono-text">{nextReservation.locator}</span> • Nave: {nextReservation.flight?.ship_name}
                  </p>
                </div>
                <Countdown targetDate={nextReservation.flight!.departure_date} />
              </div>
            ) : (
              <div className="py-10">
                <h3 className="text-3xl font-bold text-white mb-4">Sin misiones activas</h3>
                <p className="text-slate-500 text-lg font-light mb-8">El cosmos te espera. Planifica tu próxima incursión orbital hoy mismo.</p>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-purple-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-purple-700 transition-all shadow-2xl"
                >
                  Explorar Vuelos <ChevronRight size={12} />
                </Link>
              </div>
            )}
          </div>

          {nextReservation && (
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
              {[
                { label: "Pago", status: nextReservation.payment_status === 'Pagado' ? 'OK' : 'Pendiente' },
                { label: "Check-in", status: 'Pendiente' },
                { label: "Visa Orbital", status: 'Verificada' },
              ].map((item, i) => (
                <div key={i}>
                  <p className="mono-text text-[8px] text-slate-600 uppercase mb-1">{item.label}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${item.status === 'OK' || item.status === 'Verificada' ? 'text-green-500' : 'text-amber-500'}`}>{item.status}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="card-purple p-8 rounded-[2.5rem] bg-indigo-600/5 group hover:bg-indigo-600/10 transition-all border-indigo-500/20">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Iris Training</h4>
            <p className="text-slate-500 text-xs font-light leading-relaxed mb-6">Optimiza tu respuesta. Los pasajeros certificados tienen un <span className="text-indigo-300">10% de descuento</span>.</p>
            <Link href="/services/training" className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 flex items-center gap-2 hover:text-white transition-colors">
              Saber más <ChevronRight size={12} />
            </Link>
          </div>

          <div className="card-purple p-8 rounded-[2.5rem] bg-amber-600/5 group hover:bg-amber-600/10 transition-all border-amber-500/20">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Pasaporte Estelar</h4>
            <p className="text-slate-500 text-xs font-light leading-relaxed mb-6">Evita el papeleo. Deja que tu gestor personal se encargue de toda la documentación.</p>
            <Link href="/services/passport" className="text-[10px] uppercase font-bold tracking-widest text-amber-400 flex items-center gap-2 hover:text-white transition-colors">
              Gestionar <ChevronRight size={12} />
            </Link>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Expediciones", value: stats.reservations, sub: "totales", icon: Rocket, href: "/portal/reservas" },
          { label: "Tripulación", value: stats.passengers, sub: "miembros", icon: Users, href: "/portal/pasajeros" },
          { label: "Mensajes", value: stats.messages, sub: "sin leer", icon: MessageCircle, href: "/portal/gestor" },
          { label: "Pagos", value: stats.reservations > 0 ? "Pendiente" : "Al día", sub: "estado", icon: CreditCard, href: "/portal/historial-pagos", isText: true },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="card-purple p-8 rounded-[2rem] group relative overflow-hidden transition-all hover:border-purple-500/40">
            <stat.icon size={48} className="absolute -right-2 -bottom-2 text-white/[0.03] group-hover:text-white/[0.08] transition-all group-hover:scale-110" />
            <p className="mono-text text-[8px] text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className={`font-bold text-white tracking-tighter ${stat.isText ? 'text-xl' : 'text-5xl'}`}>{stat.isText ? stat.value : String(stat.value).padStart(2, '0')}</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{stat.sub}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}