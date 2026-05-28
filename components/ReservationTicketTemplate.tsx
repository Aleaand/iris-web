"use client";
import React from 'react';
import { ArrowLeft, Printer, Rocket, MapPin, Calendar, User, ShieldCheck, QrCode, AlertTriangle, Building, Plane, Shield } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ReservationTicketTemplateProps {
  reservation: any;
  activeFlight: any;
  departureDate: string | null;
  arrivalDate: string | null;
  starshipName: string;
  activeSeatType: string;
  activePrice: number;
  locator: string;
  passengers: any[];
}

export default function ReservationTicketTemplate({
  reservation,
  activeFlight,
  departureDate,
  arrivalDate,
  starshipName,
  activeSeatType,
  activePrice,
  locator,
  passengers
}: ReservationTicketTemplateProps) {
  const isExtraService = 
    (!reservation.flights || reservation.flights.length === 0) && 
    !reservation.outbound_flight && 
    !reservation.space_flight_id;

  const mainPassenger = passengers?.[0] || reservation.passenger || reservation.pasajero || {};
  const user = reservation.user || {};

  const resolvedDepartureDate =
    departureDate ||
    activeFlight?.departure_date ||
    activeFlight?.departureDate ||
    reservation.outbound_flight?.departure_date ||
    reservation.departure_date ||
    null;

  const resolvedArrivalDate =
    arrivalDate ||
    activeFlight?.arrival_date ||
    activeFlight?.landing_date ||
    activeFlight?.arrivalDate ||
    reservation.outbound_flight?.arrival_date ||
    reservation.outbound_flight?.landing_date ||
    reservation.arrival_date ||
    reservation.landing_date ||
    null;

  const resolvedStarshipName =
    starshipName && starshipName !== 'Desconocida' && starshipName !== 'TBD' ? starshipName : (
      reservation.outbound_flight?.starship?.name ||
      reservation.outbound_flight?.starship_name ||
      reservation.outbound_flight?.ship_name ||
      reservation.flight?.starship?.name ||
      reservation.flight?.starship_name ||
      reservation.flight?.ship_name ||
      activeFlight?.starship?.name ||
      activeFlight?.starship_name ||
      activeFlight?.ship_name ||
      reservation.starship_name ||
      reservation.ship_name ||
      'Iris Vanguard'
    );

  const originPlanet =
    reservation.outbound_flight?.origin_name ||
    reservation.origin_name ||
    activeFlight?.origin?.name ||
    activeFlight?.origin_name ||
    activeFlight?.origin ||
    'Tierra';

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Pendiente';
    try {
      const d = new Date(dateString);
      return d.toLocaleString('es-ES', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' UTC';
    } catch {
      return 'Fecha inválida';
    }
  };
  const snap = reservation.price_snapshot || reservation.snapshot || {};

  const formatDateTime = (dateStr: string | null, format: 'date' | 'time' = 'date') => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    if (format === 'date') {
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
    }
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  const getBoardingTime = (dateStr: string | null) => {
    if (!dateStr) return 'TBD';
    try {
      const d = new Date(dateStr);
      d.setHours(d.getHours() - 2);
      return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
    } catch {
      return 'TBD';
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] p-8 flex items-center justify-center font-['Outfit',sans-serif]">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="card-wrapper relative z-10 w-full max-w-[1000px] animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex flex-col md:flex-row overflow-hidden border border-white/10 text-slate-900">

          <div className="flex-1 p-8 md:p-12 relative">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <img src="/img/logo_iris.png" className="w-10 h-10 object-contain" alt="IRIS" />
                <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Iris Aerospace</span>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-4 py-2 rounded-full">
                Reserva #{String(reservation.id || 0).padStart(4, '0')}
              </div>
            </div>

            {isExtraService ? (
              <div className="flex flex-col items-center justify-center mb-12 p-8 bg-purple-500/5 rounded-[30px] border border-purple-500/10 text-center">
                <div className="w-16 h-16 bg-purple-600/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-4 text-purple-600">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Comprobante de Servicios Extras</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Servicios de Soporte y Logística Terrestre/Estelar</p>
              </div>
            ) : (
              <div className="flex items-center justify-between mb-16 px-4">
                <div className="text-center">
                  <div className="text-5xl font-black tracking-tighter text-slate-900 leading-none uppercase">
                    {(reservation.outbound_flight?.origin_name || reservation.origin_name || activeFlight?.origin?.name || 'Tierra').substring(0, 3)}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase mt-2 tracking-widest">
                    {reservation.outbound_flight?.origin_name || reservation.origin_name || activeFlight?.origin?.name || 'Cabo Cañaveral'}
                  </div>
                </div>

                <div className="flex-1 mx-8 relative flex items-center justify-center">
                  <div className="w-full h-px border-t-2 border-dashed border-slate-200"></div>
                  <div className="absolute bg-white p-2 rounded-full text-purple-600 shadow-sm border border-slate-100 rotate-90">
                    <Rocket size={20} />
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-5xl font-black tracking-tighter text-purple-600 leading-none uppercase">
                    {(reservation.outbound_flight?.destination_name || reservation.destination_name || activeFlight?.destination?.name || 'Destino').substring(0, 3)}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase mt-2 tracking-widest">
                    {reservation.outbound_flight?.destination_name || reservation.destination_name || activeFlight?.destination?.name || 'Destino'}
                  </div>
                </div>
              </div>
            )}

            {isExtraService ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8 mb-12">
                <div className="item">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fecha de Solicitud</label>
                  <div className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                    {formatDateTime(reservation.created_at || new Date().toISOString())}
                  </div>
                  <div className="text-[10px] font-bold text-purple-600 uppercase">
                    {formatDateTime(reservation.created_at || new Date().toISOString(), 'time')}
                  </div>
                </div>
                <div className="item">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tipo de Servicio</label>
                  <span className="text-lg font-bold text-slate-800 uppercase italic">Adicional Logístico</span>
                </div>
                <div className="item">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado de Activación</label>
                  <span className={`text-lg font-black uppercase ${reservation.status?.toLowerCase() === 'confirmada' || reservation.status?.toLowerCase() === 'confirmed'
                    ? 'text-emerald-500'
                    : 'text-amber-500'
                    }`}>
                    {reservation.status || 'Pendiente'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-8 mb-12">
                <div className="item">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Salida</label>
                  <div className="text-lg font-bold text-slate-800 uppercase tracking-tight">{originPlanet}</div>
                  <div className="text-[10px] font-bold text-purple-600 uppercase">
                    {resolvedDepartureDate ? `${formatDateTime(resolvedDepartureDate)} • ${formatDateTime(resolvedDepartureDate, 'time')}` : 'TBD'}
                  </div>
                </div>
                <div className="item">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Aterrizaje (Fecha y Hora)</label>
                  <div className="text-lg font-bold text-slate-800">
                    {resolvedArrivalDate ? formatDateTime(resolvedArrivalDate) : 'TBD'}
                  </div>
                  <div className="text-[10px] font-bold text-purple-600 uppercase">
                    {resolvedArrivalDate ? formatDateTime(resolvedArrivalDate, 'time') : 'TBD'}
                  </div>
                </div>
                <div className="item">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hora de Embarque</label>
                  <span className="text-lg font-bold text-slate-800">
                    {resolvedDepartureDate ? getBoardingTime(resolvedDepartureDate) : 'TBD'}
                  </span>
                </div>
                <div className="item">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Clase de Vuelo</label>
                  <span className="text-lg font-bold text-slate-800 uppercase italic">{activeSeatType}</span>
                </div>
                <div className="item">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Nave Asignada</label>
                  <span className="text-lg font-bold text-slate-800">{resolvedStarshipName}</span>
                </div>
                <div className="item">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Estado de Reserva</label>
                  <span className={`text-lg font-black uppercase ${reservation.status?.toLowerCase() === 'confirmada' || reservation.status?.toLowerCase() === 'confirmed'
                    ? 'text-emerald-500'
                    : 'text-amber-500'
                    }`}>
                    {reservation.status || 'Pendiente'}
                  </span>
                </div>
              </div>
            )}

            <div className="mb-12 bg-slate-50/50 rounded-[30px] p-8 border border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Servicios Extra Solicitados</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase">Hoteles</span>
                  <div className={`text-[10px] font-bold flex flex-col ${reservation.hotel_id || reservation.hotel_name ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <div className="flex items-center gap-1.5"><Building size={12} /> {reservation.hotel_id || reservation.hotel_name ? 'Incluido' : 'No solicitado'}</div>
                    {reservation.hotel_name && <span className="text-[7px] text-slate-500 font-medium ml-4 mt-0.5">{reservation.hotel_name}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase">Traslados</span>
                  <div className={`text-[10px] font-bold flex flex-col ${reservation.transfer_id || reservation.transfer_name || reservation.vip_transfer_included ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <div className="flex items-center gap-1.5"><Plane size={12} /> {reservation.transfer_id || reservation.transfer_name || reservation.vip_transfer_included ? 'Confirmado' : 'No solicitado'}</div>
                    {reservation.transfer_name && <span className="text-[7px] text-slate-500 font-medium ml-4 mt-0.5">{reservation.transfer_name}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase">Iris Training</span>
                  <div className={`text-[10px] font-bold flex items-center gap-1.5 ${reservation.training_included ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <ShieldCheck size={12} /> {reservation.training_included ? 'Activado' : 'No solicitado'}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase">Gestión Pasaporte</span>
                  <div className={`text-[10px] font-bold flex items-center gap-1.5 ${reservation.passport_management_included ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <User size={12} /> {reservation.passport_management_included ? 'Verificado' : 'No solicitado'}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase">Seguro Reembolso</span>
                  <div className={`text-[10px] font-bold flex items-center gap-1.5 ${reservation.refund_insurance_included ? 'text-emerald-600' : 'text-slate-400'}`}>
                    <Shield size={12} /> {reservation.refund_insurance_included ? 'Protegido' : 'No solicitado'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100">
              <div className="mb-8 flex items-center gap-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Información Administrativa</h4>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              {!isExtraService && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Vuelo de Salida
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase">Destino de Misión</label>
                        <div className="text-xl font-bold text-slate-800 tracking-tight">{reservation.outbound_flight?.destination_name || reservation.destination_name || 'Tierra'}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase">Puerto de Salida</label>
                          <div className="text-[11px] font-bold text-slate-700">{reservation.outbound_flight?.origin_name || reservation.origin_name || 'Cabo Cañaveral'}</div>
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase">Código de Vuelo</label>
                          <div className="text-[11px] font-black text-purple-600 font-mono">{reservation.outbound_flight?.flight_code || reservation.flight_code}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase">Fecha Lanzamiento</label>
                          <div className="text-[11px] font-bold text-slate-700">{formatDate(reservation.outbound_flight?.departure_date || reservation.departure_date)}</div>
                        </div>
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase">Aterrizaje Previsto</label>
                          <div className="text-[11px] font-bold text-slate-700">{formatDate(reservation.outbound_flight?.arrival_date || reservation.arrival_date)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {reservation.return_flight && (
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Vuelo de Regreso
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[8px] font-black text-slate-400 uppercase">Destino de Retorno</label>
                          <div className="text-xl font-bold text-slate-800 tracking-tight">{reservation.return_flight.destination_name}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-black text-slate-400 uppercase">Puerto de Origen</label>
                            <div className="text-[11px] font-bold text-slate-700">{reservation.return_flight.origin_name}</div>
                          </div>
                          <div>
                            <label className="block text-[8px] font-black text-slate-400 uppercase">Código de Vuelo</label>
                            <div className="text-[11px] font-black text-blue-600 font-mono">{reservation.return_flight.flight_code}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[8px] font-black text-slate-400 uppercase">Salida Orbital (UTC)</label>
                            <div className="text-[11px] font-bold text-slate-700">{formatDate(reservation.return_flight.departure_date)}</div>
                          </div>
                          <div>
                            <label className="block text-[8px] font-black text-slate-400 uppercase">Regreso a Tierra (UTC)</label>
                            <div className="text-[11px] font-bold text-slate-700">{formatDate(reservation.return_flight.arrival_date)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h5 className="text-[9px] font-black text-slate-400 uppercase mb-4 tracking-tighter">Titular de la Reserva</h5>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[8px] font-black text-slate-400 uppercase">Nombre Completo</label>
                      <div className="text-sm font-bold text-slate-800 uppercase">{reservation.user_name || user.name || 'Cargando...'} {reservation.user_lastname || user.primarylastname || ''}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase">Email</label>
                        <div className="text-[11px] font-semibold text-slate-600 truncate">{reservation.user_email || user.email || 'N/A'}</div>
                      </div>
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase">Teléfono</label>
                        <div className="text-[11px] font-bold text-slate-800">{reservation.user_phone || user.phone || 'No registrado'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-1">
                  <h5 className="text-[9px] font-black text-slate-400 uppercase mb-4 tracking-tighter">Información de la Tripulación ({reservation.all_passengers?.length || 1})</h5>
                  <div className="space-y-6">
                    {(reservation.all_passengers || [mainPassenger]).map((p: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                        <div>
                          <label className="block text-[7px] font-black text-slate-400 uppercase">Nombre Completo Viajero</label>
                          <div className="text-[11px] font-bold text-slate-800 uppercase">{p.name || p.nombre || 'Desconocido'} {p.primarylastname || p.apellido1 || ''}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[7px] font-black text-slate-400 uppercase">Pasaporte Espacial</label>
                            <div className="text-[9px] font-bold text-purple-600 uppercase italic">{p.iris_passport_number || 'GESTIÓN PENDIENTE'}</div>
                          </div>
                          <div>
                            <label className="block text-[7px] font-black text-slate-400 uppercase">Identificación (ID)</label>
                            <div className="text-[9px] font-semibold text-slate-600">{p.document_number || p.dni || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Lado Talón (Stub) ── */}
          <div className="w-full md:w-[280px] bg-slate-50 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-slate-200 p-8 flex flex-col items-center">
            <div className="bg-white p-5 rounded-[30px] border border-slate-100 shadow-sm w-full flex flex-col items-center mb-8">
              <div className="w-32 h-32 text-slate-200 flex items-center justify-center p-2 mb-6">
                <QrCode size={120} strokeWidth={1} className="text-slate-900" />
              </div>
              <div className="text-center">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Localizador</div>
                <div className="text-lg font-black text-purple-600 tracking-tighter uppercase">{locator}</div>
              </div>
            </div>

            <div className="w-full bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm mb-6 text-left">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Titular de Reserva</div>
              <div className="text-sm font-bold text-slate-800 uppercase truncate">{reservation.user_name || user.name || 'Cargando...'} {reservation.user_lastname || user.primarylastname || ''}</div>
              <div className="text-[8px] text-slate-400 uppercase mt-1 tracking-widest">REG: #{String(user.id || 0).padStart(6, '0')}</div>
            </div>

            <div className="w-full bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm mb-auto text-left">
              <div className="text-[9px] font-black text-slate-400 uppercase mb-4 tracking-widest">Facturación Detallada</div>
              <div className="space-y-3 mb-6">
                {(() => {
                  const items = [
                    { label: 'Vuelo Espacial', value: snap.space_flight_price || snap.vuelo_price || snap.space },
                    { label: 'Estancia Hotel', value: snap.hotel_price || snap.hotel },
                    { label: 'Vuelos Terrestres', value: snap.terrestrial_price || snap.terrestrial },
                    { label: 'Entrenamiento Iris', value: snap.training_price || snap.training },
                    { label: 'Gestión Pasaporte', value: snap.passport_price || snap.passport },
                    { label: 'Traslados Tierra', value: snap.vip_price || snap.vip },
                    { label: 'Pasajeros', value: snap.extra_passengers_price || snap.extra_passengers }
                  ];

                  const activeItems = items.filter(item => Number(item.value) > 0);

                  if (activeItems.length > 0) {
                    return activeItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-[10px] items-center">
                        <span className="text-slate-500 font-medium">{item.label}</span>
                        <span className="font-bold text-slate-700">{formatPrice(Number(item.value))} €</span>
                      </div>
                    ));
                  }

                  // Fallback si no hay snapshot detallado
                  return (
                    <div className="flex justify-between text-[10px] items-center">
                      <span className="text-slate-500 font-medium">Servicios Iris</span>
                      <span className="font-bold text-slate-700">{formatPrice(activePrice)} €</span>
                    </div>
                  );
                })()}
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-end">
                <div className="text-[9px] font-black text-slate-400 uppercase">Total</div>
                <div className="text-md font-black text-purple-600 font-mono">
                  {formatPrice(activePrice)} €
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-4 justify-center mt-12 no-print">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-purple-600 text-white font-black text-xs uppercase tracking-widest hover:translate-y-[-4px] transition-all shadow-xl shadow-purple-600/20"
          >
            <ArrowLeft size={16} /> Volver
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-white text-slate-900 font-black text-xs uppercase tracking-widest hover:translate-y-[-4px] transition-all shadow-xl shadow-black/20"
          >
            <Printer size={16} /> Imprimir
          </button>
        </div>
      </div>

      <style jsx>{`
        @media print {
          html, body {
            height: auto !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: #0f172a !important;
          }
          body * {
            visibility: hidden;
          }
          .card-wrapper, .card-wrapper * {
            visibility: visible;
          }
          .card-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            animation: none !important;
            page-break-inside: avoid;
          }
          .bg-white { border: 1px solid #e2e8f0 !important; box-shadow: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
