"use client";
import { Reservation } from "@/types";
import Link from "next/link";
import { Rocket, MapPin, Calendar, CreditCard, ChevronRight, Info, ShieldCheck, Loader2, Users } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { PLANET_GALLERY } from "@/lib/nasa";
import { useState } from "react";
import { irisApi } from "@/lib/api";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Zap, Shield, Hotel, Ship, Download, Printer } from "lucide-react";
import ReservationTicketTemplate from "./ReservationTicketTemplate";
import { createPortal } from "react-dom";
import { formatPrice } from "@/lib/utils";

export default function ReservationCard({ reservation }: { reservation: any }) {
  const { data: session } = useSession();
  const [showDetails, setShowDetails] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [actionModal, setActionModal] = useState<'cancel' | 'upgrade' | 'modify' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(false);

  const [localStatus, setLocalStatus] = useState<string>(reservation.status);

  const activeFlight =
    details?.space_flight ||
    details?.outbound_flight ||
    details?.flight ||
    details ||
    reservation.space_flight ||
    reservation.outbound_flight ||
    reservation.flight ||
    reservation ||
    null;
  const activeSeatType = details?.seat_type || details?.clase_asiento || reservation.seat_type || reservation.clase_asiento || "Desconocido";
  const rawPrice = details?.total_group_price || reservation.total_group_price || reservation.total_price || details?.total_price || 0;
  const activePrice = Number(rawPrice) || 0;
  const activeProtocol = details?.protocol_id || details?.seat_type || reservation.protocol_id || activeSeatType;
  const activePassengers = details?.pasajeros || reservation.pasajeros || details?.crew || reservation.crew || [];

  const destination =
    activeFlight?.destination ||
    reservation.destination ||
    (reservation.destination_name ? { name: reservation.destination_name } : null) ||
    (activeFlight?.destination_name ? { name: activeFlight.destination_name } : null);

  const originName =
    activeFlight?.origin?.name ||
    activeFlight?.origin ||
    reservation.origin?.name ||
    reservation.origin ||
    activeFlight?.origin_name ||
    null;

  const departureDate =
    activeFlight?.departure_date ||
    activeFlight?.departureDate ||
    reservation.departure_date ||
    reservation.departureDate ||
    reservation.fecha_vuelo ||
    reservation.start_date ||
    null;

  const arrivalDate = (() => {
    const landingKey = ['landing_date', 'arrival_date', 'return_date', 'end_date'].find(k => activeFlight?.[k]);
    return landingKey ? activeFlight[landingKey] : (reservation.landing_date || reservation.arrival_date || null);
  })();

  const starshipName =
    activeFlight?.starship?.name ||
    activeFlight?.starship_name ||
    activeFlight?.ship_name ||
    reservation.starship_name ||
    reservation.ship_name ||
    activeFlight?.starship?.model ||
    (activeFlight?.starship_id ? `Nave #${activeFlight.starship_id}` : null) ||
    (reservation.starship_id ? `Nave #${reservation.starship_id}` : null) ||
    "Desconocida";

  const locator =
    activeFlight?.flight_code ||
    activeFlight?.code ||
    reservation.flight_code ||
    reservation.locator ||
    (reservation.id_locator ? reservation.id_locator.split('-')[0].toUpperCase() : "N/A");

  let imageUrl = "https://images-assets.nasa.gov/image/PIA12348/PIA12348~orig.jpg";
  const destName = destination?.name || "Desconocido";
  const isReturn = destName.toLowerCase().includes('tierra') || destName.toLowerCase().includes('earth');

  if (PLANET_GALLERY[destName]) {
    imageUrl = PLANET_GALLERY[destName];
  } else if (reservation.locator?.startsWith('TRN')) {
    imageUrl = PLANET_GALLERY["Training"];
  } else if (reservation.locator?.startsWith('PAS')) {
    imageUrl = PLANET_GALLERY["Pasaporte"];
  } else if (destName.toLowerCase().includes('luna')) {
    imageUrl = PLANET_GALLERY["Luna"];
  }

  const handleAction = (action: 'cancel' | 'upgrade' | 'modify') => {
    setActionModal(action);
    setActionSuccess(false);
  };

  const submitAction = async () => {
    if (!actionModal) return;
    try {
      setActionLoading(true);
      if (!session?.user) return;
      const token = (session.user as any).accessToken;
      let title = '';
      let description = '';

      if (actionModal === 'cancel') {
        title = `Solicitud de Cancelación - Reserva #${reservation.id}`;
        description = 'El cliente solicita cancelar su reserva. Verificar seguro de reembolso y procesar devolución si aplica.';
      } else if (actionModal === 'upgrade') {
        title = `Solicitud de Upgrade - Reserva #${reservation.id}`;
        description = 'El cliente solicita un upgrade de asiento o paquete. Contactar para coordinar la diferencia de pago.';
      } else {
        title = `Modificación de Reserva - Reserva #${reservation.id}`;
        description = 'El cliente desea modificar detalles de su itinerario o pasajeros.';
      }

      await irisApi.createTask({
        title: `[GESTIÓN RESERVA] ${title}`,
        type: 'general',
        description,
        priority: actionModal === 'cancel' ? 'high' : 'medium',
        reservation_id: reservation.id
      }, token);

      let chatMessage = '';
      let newStatus = '';
      if (actionModal === 'cancel') {
        chatMessage = `He solicitado la cancelación de la reserva #${reservation.id}.`;
        newStatus = 'Solicitando Cancelación...';
      } else if (actionModal === 'upgrade') {
        chatMessage = `He solicitado un upgrade para la reserva #${reservation.id}.`;
        newStatus = 'Solicitando Upgrade...';
      } else {
        chatMessage = `He solicitado modificar la reserva #${reservation.id}.`;
        newStatus = 'Solicitando Modificación...';
      }

      try {
        await irisApi.sendMessage(token, chatMessage);
      } catch (chatErr) {
        console.error("Error al enviar el mensaje de chat de aviso:", chatErr);
      }

      if (newStatus) {
        setLocalStatus(newStatus);
      }

      setActionSuccess(true);
      setTimeout(() => {
        setActionModal(null);
        setActionSuccess(false);
      }, 3000);
    } catch (e) {
      console.error(e);
      alert('Error al enviar la solicitud al gestor.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDetails = async () => {
    setShowDetails(true);
    if (!details && session?.user) {
      setLoadingDetails(true);
      try {
        const token = (session.user as any).accessToken;
        const res = await irisApi.getReservationDetails(token, reservation.id);
        const data = res.datos || res;
        console.log("DEBUG - Detalles Reserva:", data);
        console.log("DEBUG - Vuelo Activo:", data.space_flight || data.flight || data.vuelo);
        setDetails(data);
      } catch (err) {
        console.error("Error fetching reservation details:", err);
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0f] transition-all hover:border-purple-500/30">
      <div className="absolute inset-0 z-0">
        <img
          src={imageUrl}
          alt={destName || "Space"}
          className="h-full w-full object-cover opacity-20 transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-0">
        <div className="flex-1 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <StatusBadge status={localStatus} />
            <div className="h-1 w-1 rounded-full bg-slate-700" />
            <span className="mono-text text-[10px] text-slate-500 uppercase tracking-[0.2em]">{reservation.locator}</span>
          </div>

          <div className="flex items-start gap-6">
            <div className="hidden sm:flex w-14 h-14 bg-purple-600/10 border border-purple-500/20 rounded-2xl items-center justify-center shrink-0">
              <Rocket size={24} className="text-purple-400" />
            </div>

            <div>
              <h3 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                {(!reservation.flights || reservation.flights.length === 0) ? 'Servicio Extra' : (reservation.locator?.startsWith('TRN') ? 'Programa de Entrenamiento' : reservation.locator?.startsWith('PAS') ? 'Gestión de Pasaporte' : (reservation.flights?.[0]?.flight_code || activeFlight?.code || activeFlight?.flight_code || reservation.flight_code || locator || 'Misión Orbital'))}
              </h3>

              <div className="flex flex-col gap-6 mt-6">
                <div>
                  <h4 className="text-[10px] text-purple-400 uppercase font-black tracking-widest mb-3">
                    {(!reservation.flights || reservation.flights.length === 0) ? 'DETALLE DEL SERVICIO:' : 'IDA:'}
                  </h4>
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-8 gap-y-3">
                    <div className="flex items-center gap-2.5">
                      <Calendar size={14} className="text-purple-400" />
                      <div className="flex flex-col">
                        <span className="mono-text text-[8px] text-slate-500 uppercase tracking-widest">
                          {(!reservation.flights || reservation.flights.length === 0) ? 'Solicitado' : 'Lanzamiento'}
                        </span>
                        <span className="text-xs text-slate-200 font-medium">
                          {(reservation.flights?.[0]?.departure_date || departureDate || reservation.created_at) ? new Date(reservation.flights?.[0]?.departure_date || departureDate || reservation.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : "Pendiente"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Rocket size={14} className="text-purple-400" />
                      <div className="flex flex-col">
                        <span className="mono-text text-[8px] text-slate-500 uppercase tracking-widest">
                          {(!reservation.flights || reservation.flights.length === 0) ? 'Servicio' : 'Aterrizaje'}
                        </span>
                        <span className="text-xs text-slate-200 font-medium">
                          {(!reservation.flights || reservation.flights.length === 0)
                            ? (reservation.has_training ? 'Iris Training' : reservation.has_passport ? 'Pasaporte Estelar' : 'Gestión Iris')
                            : ((reservation.flights?.[0]?.arrival_date || arrivalDate) ? new Date(reservation.flights?.[0]?.arrival_date || arrivalDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : "Pendiente")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin size={14} className="text-purple-400" />
                      <div className="flex flex-col">
                        <span className="mono-text text-[8px] text-slate-500 uppercase tracking-widest">
                          {(!reservation.flights || reservation.flights.length === 0) ? 'Incluye' : 'Destino'}
                        </span>
                        <span className="text-xs text-slate-200 font-medium">
                          {(!reservation.flights || reservation.flights.length === 0)
                            ? [reservation.has_training && "Training", reservation.has_passport && "Pasaporte", reservation.has_hotel && "Hotel", reservation.has_vip && "VIP"].filter(Boolean).join(' + ') || "Servicios Iris"
                            : (reservation.flights?.[0]?.destination_name || destination?.name || "Desconocido")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Users size={14} className="text-purple-400" />
                      <div className="flex flex-col max-w-[200px]">
                        <span className="mono-text text-[8px] text-slate-500 uppercase tracking-widest">Tripulación</span>
                        <span className="text-xs text-slate-200 font-medium truncate" title={reservation.passenger_names}>
                          {reservation.passenger_names || "Pendiente asignar"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {reservation.flights && reservation.flights.length > 1 && (
                  <div className="pt-4 border-t border-white/5">
                    <h4 className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-3">VUELTA:</h4>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-8 gap-y-3">
                      <div className="flex items-center gap-2.5">
                        <Calendar size={14} className="text-blue-400" />
                        <div className="flex flex-col">
                          <span className="mono-text text-[8px] text-slate-500 uppercase tracking-widest">Lanzamiento</span>
                          <span className="text-xs text-slate-200 font-medium">
                            {reservation.flights[1].departure_date ? new Date(reservation.flights[1].departure_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : "Pendiente"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Calendar size={14} className="text-blue-400" />
                        <div className="flex flex-col">
                          <span className="mono-text text-[8px] text-slate-500 uppercase tracking-widest">Aterrizaje</span>
                          <span className="text-xs text-slate-200 font-medium">
                            {reservation.flights[1].arrival_date ? new Date(reservation.flights[1].arrival_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : "Pendiente"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin size={14} className="text-blue-400" />
                        <div className="flex flex-col">
                          <span className="mono-text text-[8px] text-slate-500 uppercase tracking-widest">Destino</span>
                          <span className="text-xs text-slate-200 font-medium">{reservation.flights[1].destination_name || "Tierra"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Users size={14} className="text-blue-400" />
                        <div className="flex flex-col max-w-[200px]">
                          <span className="mono-text text-[8px] text-slate-500 uppercase tracking-widest">Tripulación</span>
                          <span className="text-xs text-slate-200 font-medium truncate" title={reservation.passenger_names}>
                            {reservation.passenger_names || "Pendiente asignar"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80 bg-white/[0.02] backdrop-blur-md border-t md:border-t-0 md:border-l border-white/5 p-8 md:p-10 flex flex-col justify-center">
          <div className="mb-6 text-center md:text-left">
            <p className="mono-text text-[8px] text-slate-500 uppercase tracking-widest mb-1">Inversión Total</p>
            <div className="flex items-baseline justify-center md:justify-start gap-1">
              <span className="text-3xl font-bold text-white tracking-tighter">{formatPrice(activePrice)}</span>
              <span className="text-sm text-purple-400 font-bold">€</span>
            </div>
          </div>

          <div className="space-y-3">
            {(reservation.payment_status === 'Pendiente' || reservation.payment_status === 'pending') ? (
              <Link
                href={`/portal/pagos?reserva_id=${reservation.id}`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/20"
              >
                <CreditCard size={14} /> Pagar Ahora
              </Link>
            ) : (
              <div className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-default">
                <ShieldCheck size={14} /> Pago Verificado
              </div>
            )}

            <button
              onClick={handleOpenDetails}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 text-white/60 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
            >
              <Info size={14} /> Detalles
            </button>

            {reservation.flights && reservation.flights.length > 0 && (
              <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
                <button onClick={() => handleAction('cancel')} className="w-full text-[9px] text-slate-500 hover:text-red-400 uppercase font-black tracking-widest text-left transition-colors">Solicitar Cancelación</button>
                <button onClick={() => handleAction('upgrade')} className="w-full text-[9px] text-slate-500 hover:text-amber-400 uppercase font-black tracking-widest text-left transition-colors">Solicitar Upgrade</button>
                <button onClick={() => handleAction('modify')} className="w-full text-[9px] text-slate-500 hover:text-blue-400 uppercase font-black tracking-widest text-left transition-colors">Modificar Reserva</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {typeof window !== 'undefined' && createPortal(
        <>
          <AnimatePresence>
            {showDetails && (
              <div className="fixed inset-0 z-[500] overflow-y-auto bg-black/90 backdrop-blur-2xl no-print">
                <button
                  onClick={() => setShowDetails(false)}
                  className="fixed top-8 right-8 z-[600] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all no-print"
                >
                  <X size={24} />
                </button>

                <div className="min-h-screen py-12 px-4 flex items-center justify-center">
                  {loadingDetails ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader2 size={40} className="text-purple-500 animate-spin mb-4" />
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Sincronizando Misión...</p>
                    </div>
                  ) : details ? (
                    <div className="w-full max-w-5xl">
                      <ReservationTicketTemplate
                        reservation={{ ...details, status: localStatus }}
                        activeFlight={activeFlight}
                        departureDate={departureDate}
                        arrivalDate={arrivalDate}
                        starshipName={starshipName}
                        activeSeatType={activeSeatType}
                        activePrice={activePrice}
                        locator={locator}
                        passengers={activePassengers}
                      />
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 py-20">No se pudieron recuperar los detalles de la misión.</p>
                  )}
                </div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {actionModal && (
              <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-md"
                  onClick={() => !actionLoading && !actionSuccess && setActionModal(null)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-md bg-[#0f0a1a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
                >
                  <div className="p-8">
                    {actionSuccess ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                          <ShieldCheck className="text-green-400" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Solicitud Enviada</h3>
                        <p className="text-slate-400 text-sm">Tu gestor ha recibido la notificación y se pondrá en contacto contigo a la mayor brevedad.</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${actionModal === 'cancel' ? 'bg-red-500/20 text-red-400' : actionModal === 'upgrade' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            <Info size={24} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {actionModal === 'cancel' ? 'Cancelar Reserva' : actionModal === 'upgrade' ? 'Solicitar Upgrade' : 'Modificar Reserva'}
                            </h3>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Reserva #{reservation.id}</p>
                          </div>
                        </div>

                        <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                          {actionModal === 'cancel'
                            ? '¿Estás seguro de que deseas solicitar la cancelación? Un gestor evaluará el caso y procesará el reembolso correspondiente si contrataste el seguro de cancelación.'
                            : actionModal === 'upgrade'
                              ? 'Al solicitar un upgrade, tu gestor verificará la disponibilidad de asientos superiores o paquetes premium y te contactará para abonar la diferencia.'
                              : 'Si necesitas cambiar las fechas, pasajeros o servicios logísticos, envía la solicitud y tu gestor contactará contigo para confirmar los cambios.'}
                        </p>

                        <div className="flex gap-4">
                          <button
                            onClick={() => setActionModal(null)}
                            disabled={actionLoading}
                            className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all"
                          >
                            Atrás
                          </button>
                          <button
                            onClick={submitAction}
                            disabled={actionLoading}
                            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white transition-all shadow-lg flex items-center justify-center gap-2 ${actionModal === 'cancel' ? 'bg-red-600 hover:bg-red-500 shadow-red-600/20' :
                              actionModal === 'upgrade' ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/20' :
                                'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                              }`}
                          >
                            {actionLoading ? <Loader2 size={16} className="animate-spin" /> : 'Confirmar'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>,
        document.body
      )}
    </div>
  );
}
