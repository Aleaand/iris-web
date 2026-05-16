"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Rocket, Plus, Loader2, Filter, Search, ChevronDown } from "lucide-react";
import Link from "next/link";
import { irisApi } from "@/lib/api";
import { Reservation } from "@/types";
import ReservationCard from "@/components/ReservationCard";
import { motion, AnimatePresence } from "framer-motion";

type FilterStatus = 'Todas' | 'Confirmada' | 'Pendiente' | 'Cancelada';

export default function ReservasPage() {
  const { data: session } = useSession();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('Todas');
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadReservations() {
      if (!session?.user) return;
      const token = (session.user as any).accessToken;
      try {
        const data = await irisApi.getReservations(token);
        setReservations(data.datos || []);
      } catch (error) {
        console.error("Error cargando reservas:", error);
      } finally {
        setLoading(false);
      }
    }
    loadReservations();
  }, [session]);

  const filteredReservations = reservations.filter(res => {
    const status = res.status || '';
    const query = searchQuery.toLowerCase();

    const matchesFilter = activeFilter === 'Todas' || status.toLowerCase() === activeFilter.toLowerCase();

    const matchesSearch = !searchQuery || (
      (res.flights || (res.flight ? [res.flight] : [])).some((f: any) =>
        (f.code || f.flight_code)?.toLowerCase().includes(query) ||
        f.destination_name?.toLowerCase().includes(query) ||
        f.origin_name?.toLowerCase().includes(query)
      ) ||
      (res.id_locator || res.locator || '').toLowerCase().includes(query) ||
      (res.passenger_names || '').toLowerCase().includes(query) ||
      (res.id?.toString().includes(query))
    );

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="text-purple-500 animate-spin mb-4" />
        <p className="mono-text text-[10px] uppercase tracking-[0.3em] text-slate-500">Recuperando historial...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10 pb-20">

      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Rocket size={10} className="text-purple-400" />
            <span className="mono-text text-[8px] uppercase tracking-widest text-purple-300">Archivo</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Mis <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400 italic">Reservas</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-light">Gestiona tus vuelos, protocolos y servicios contratados.</p>
        </div>

        <Link
          href="/booking"
          className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black text-[10px] uppercase tracking-widest font-bold hover:bg-purple-600 hover:text-white transition-all shadow-2xl shadow-purple-600/10 group"
        >
          <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Nueva Reserva
        </Link>
      </header>

      {/* Filtros y Buscador */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-2 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
        <div className="flex gap-2 p-1 overflow-x-auto no-scrollbar">
          {(['Todas', 'Confirmada', 'Pendiente', 'Cancelada'] as FilterStatus[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${activeFilter === filter
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 pr-2">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            placeholder="Buscar por ID de vuelo, destino o pasajero..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-full pl-10 pr-6 py-3 text-[10px] text-white placeholder:text-slate-700 outline-none focus:border-purple-500/50 transition-all"
          />
        </div>
      </div>

      {/* Listado */}
      <AnimatePresence mode="popLayout">
        {filteredReservations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-32 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.01]"
          >
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-700">
              <Rocket size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No se encontraron expediciones</h2>
            <p className="text-slate-500 text-sm font-light max-w-md mx-auto leading-relaxed">
              {searchQuery || activeFilter !== 'Todas'
                ? "Prueba a cambiar los filtros o el término de búsqueda."
                : "Todavía no has reservado ninguna plaza para el espacio profundo."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6"
          >
            {filteredReservations.map((res) => (
              <motion.div
                key={res.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <ReservationCard reservation={res} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
