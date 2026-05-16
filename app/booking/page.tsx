"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Starfield from "@/components/Starfield";
import Link from "next/link";
import {
  Search, Rocket, Calendar, Users, ChevronRight, Loader2, Sparkles, Shield, Crown,
  Zap, Globe, MessageCircle, ArrowLeft, ArrowRight, CheckCircle2,
  Plane, Hotel, Briefcase, Plus, Minus, Info, ShieldCheck, CreditCard, AlertTriangle, X, Activity, Clock, MapPin, UserPlus, User, Heart, ShieldAlert, FileText, Timer, Edit3, Check, Image as ImageIcon,
  Car, Lock
} from "lucide-react";
import { irisApi } from "@/lib/api";
import { Destination, Flight, Hotel as HotelType, Passenger } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const getDuration = (start: string, end: string) => {
  const d1 = new Date(start);
  const d2 = new Date(end);
  const diff = d2.getTime() - d1.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  return days > 0 ? `${days}d ${hours % 24}h` : `${hours}h`;
};

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [showNearby, setShowNearby] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [errorPrompt, setErrorPrompt] = useState<string | null>(null);
  const [highlightReturn, setHighlightReturn] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const returnDateRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [isSelectingReturn, setIsSelectingReturn] = useState(false);
  const [subStep, setSubStep] = useState(1);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [userPassengers, setUserPassengers] = useState<Passenger[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [savingPassenger, setSavingPassenger] = useState<number | null>(null);
  const [showAntaresModal, setShowAntaresModal] = useState(false);
  const [showAntaresSuccess, setShowAntaresSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [antaresData, setAntaresData] = useState({ phone: "", email: "", method: "chat" as "chat" | "video" });
  const [hotels, setHotels] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [tariffs, setTariffs] = useState<any>({
    training: 50000,
    vip_transfer: 1000,
    passport_management: 2500,
    refund_insurance_pct: 10
  });

  const [bookingMode, setBookingMode] = useState<'mission' | 'services'>('mission');

  const [form, setForm] = useState({
    origin_id: "1",
    destination_id: "",
    departure_date: "",
    return_date: "",
    passengers_count: 1,
    seat_type: "Nova" as "Nova" | "Supernova"
  });

  const [selection, setSelection] = useState({
    outboundFlight: null as Flight | null,
    returnFlight: null as Flight | null,
    package: 'altair' as 'sirius' | 'polaris' | 'rigel' | 'altair' | 'antares',
    passengerData: [] as any[],
    logisticsStays: [] as any[],
    logisticsCity: "Cabo Cañaveral",
    addAirTransfer: false,
    addReturnAirTransfer: false,
    addVipTransfer: false,
    addRefundInsurance: false,
    activeLogistics: 'none' as 'none' | 'hotel' | 'flight' | 'transfer',
    hotelSearch: { city: 'New York', from: '', to: '' },
    terrestrialSearch: { origin: '', destination: '', date: '' },
    transferSearch: { city: '' },
    hotel: null as any | null,
    transfer: null as any | null,
    assignedHotelPassengers: [0] as number[],
    assignedTransferPassengers: [0] as number[]
  });

  useEffect(() => {
    setSelection(prev => {
      const data = [...prev.passengerData];
      if (data.length < form.passengers_count) {
        for (let i = data.length; i < form.passengers_count; i++) {
          data.push({
            name: "",
            primarylastname: "",
            secondarylastname: "",
            document_number: "",
            document_country: "",
            birth_date: "",
            blood_type: "Desconocido",
            allergies: "Ninguna",
            physical_fitness: "No apto",
            passport_status: "none",
            training_mode: 'none',
            passport_mode: 'none',
            compliance: false,
            showPassportForm: false,
            showTrainingForm: false,
            training_dates: [""],
            training_city: "",
            fromManifesto: false,
            seat_type: 'Nova'
          });
        }
      } else if (data.length > form.passengers_count) {
        data.length = form.passengers_count;
      }
      return { ...prev, passengerData: data };
    });
  }, [form.passengers_count]);

  useEffect(() => {
    if (showAuthModal || showAntaresModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showAuthModal, showAntaresModal]);

  useEffect(() => {
    async function load() {
      try {
        const destRes = await irisApi.getDestinations();
        const destData = destRes.datos || destRes;
        setDestinations(Array.isArray(destData) ? destData : []);
        try {
          const locRes = await irisApi.getLocations();
          setLocations(locRes.datos || locRes || []);
        } catch (e) {
          console.error("Error loading locations from API:", e);
        }

        if (status === "authenticated" && (session?.user as any)?.accessToken) {
          try {
            const pRes = await irisApi.getPassengers((session?.user as any).accessToken);
            const pData = pRes.datos || pRes || [];
            setUserPassengers(Array.isArray(pData) ? pData : []);
          } catch (pe: any) {
            console.error("Error fetching manifesto passengers:", pe);
            if (pe.message?.includes("Token inválido") || pe.message?.includes("expirado")) {
              signOut({ callbackUrl: "/login?error=SessionExpired" });
            }
          }
        }

        try {
          const hRes = await irisApi.getHotels();
          setHotels(hRes.datos || hRes || []);
        } catch (e) {
          console.error("Error loading hotels:", e);
        }

        try {
          const tRes = await irisApi.getTransfers();
          setTransfers(tRes.datos || tRes || []);
        } catch (e) {
          console.error("Error loading transfers:", e);
        }

        try {
          const tData = await irisApi.getTariffs();
          if (tData) setTariffs(tData);
        } catch (e) {
          console.error("Error loading tariffs:", e);
        }
      } catch (e) {
        console.error("Critical error loading booking data:", e);
        setErrorPrompt("Error al conectar con el centro de control orbital.");
      }
      setLoading(false);
    }
    load();
  }, [status, session]);

  const handleSearch = async (isNearby = false, forceReturn = false) => {
    const isReturning = forceReturn || isSelectingReturn;
    const sOrigin = isReturning ? form.destination_id : form.origin_id;
    const sDest = isReturning ? form.origin_id : form.destination_id;
    const sDate = isReturning ? form.return_date : form.departure_date;

    if (!sDest || sOrigin === sDest) {
      setErrorPrompt("Selecciona una ruta válida.");
      return;
    }
    if (!sDate) {
      if (isReturning) {
        setHighlightReturn(true);
        returnDateRef.current?.focus();
        setTimeout(() => setHighlightReturn(false), 2000);
        setErrorPrompt("Selecciona una fecha de regreso para continuar.");
      } else {
        setErrorPrompt("Selecciona una fecha de lanzamiento.");
      }
      return;
    }

    setSearching(true);
    setHasSearched(true);
    setErrorPrompt(null);
    try {
      const query = new URLSearchParams({
        origin_id: sOrigin,
        destination_id: sDest,
        departure_date: sDate,
        passengers: form.passengers_count.toString(),
        seat_type: form.seat_type
      }).toString();

      const data = isNearby ? await irisApi.searchFlightsNearby(query) : await irisApi.searchFlights(query);
      setFlights(data.datos || []);
      if ((data.datos || []).length === 0 && !isNearby) setShowNearby(true);
    } catch (err) { console.error(err); }
    setSearching(false);
  };

  const getNights = () => {
    if (!selection.hotelSearch.from || !selection.hotelSearch.to) return 1;
    const start = new Date(selection.hotelSearch.from);
    const end = new Date(selection.hotelSearch.to);
    const diff = end.getTime() - start.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const getPassengerDiscount = (p: any) => {
    if (!p.training_certificate_date) return 0;
    const trainingDate = new Date(p.training_certificate_date);
    const now = new Date();
    const diffYears = (now.getTime() - trainingDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    return diffYears >= 0 && diffYears <= 3 ? 0.10 : 0;
  };

  const getTotal = () => {
    let total = 0;
    selection.passengerData.forEach((p: any) => {
      const multiplier = p.seat_type === 'Supernova' ? 2.5 : 1;
      const discount = getPassengerDiscount(p);

      let flightCost = 0;
      if (bookingMode === 'mission') {
        if (selection.outboundFlight) flightCost += (selection.outboundFlight.base_price || 0) * multiplier;
        if (selection.returnFlight) flightCost += (selection.returnFlight.base_price || 0) * multiplier;
      }
      total += flightCost * (1 - discount);

      if (p.training_mode === 'request') total += (tariffs.training || 50000);
      if (p.passport_mode === 'request') total += (tariffs.passport_management || 2500);
    });

    if (selection.hotel) total += (selection.hotel.price_per_night || 0) * getNights() * selection.assignedHotelPassengers.length;
    if (selection.transfer) total += (selection.transfer.price || 0) * selection.assignedTransferPassengers.length;
    if (selection.addVipTransfer) total += (tariffs.vip_transfer || 1000);
    if (selection.addAirTransfer) total += (tariffs.air_transfer || 1500) * selection.passengerData.length;
    if (selection.addRefundInsurance) total += (total * ((tariffs.refund_insurance_pct || 10) / 100));

    return total;
  };

  const handleAntaresContact = async () => {
    if (status !== "authenticated") { router.push("/login?callbackUrl=/booking"); return; }
    setIsCreating(true);
    try {
      try {
        await irisApi.sendMessage((session?.user as any).accessToken, "SOLICITUD DE CONTACTO (Acceso Directo)");
      } catch (e) { console.warn("Mensaje fallido, continuando redirección..."); }

      router.push(`/portal/gestor?new_task=contact_gestor`);
    } catch (e) {
      console.error(e);
      router.push(`/portal/gestor`);
    }
    setIsCreating(false);
  };

  const applyPackageSettings = () => {
    setSelection(prev => {
      const pkg = prev.package;
      if (pkg === 'altair') return prev;

      const data = [...prev.passengerData];
      data.forEach(pax => {
        if (pkg === 'sirius' || pkg === 'polaris' || pkg === 'rigel') {
          pax.training_mode = 'request';
        }
        if (pkg === 'polaris' || pkg === 'rigel') {
          pax.passport_mode = 'request';
        }
        if (pkg === 'rigel') {
          pax.seat_type = 'Supernova';
        }
        if (pkg === 'sirius' || pkg === 'polaris') {
          pax.seat_type = 'Nova';
        }
      });

      let newHotel = prev.hotel;
      let newTransfer = prev.transfer;
      let newAddAirTransfer = prev.addAirTransfer;

      if (pkg === 'rigel') {
        newHotel = { id: 9999, name: "Rigel Premium Stay (TBD)", price_per_night: 1000 };
        newTransfer = { id: 9999, name: "Rigel VIP Transfer", price: 1000, location_id: 1 };
        newAddAirTransfer = true;
      }

      return {
        ...prev,
        passengerData: data,
        hotel: newHotel,
        transfer: newTransfer,
        addAirTransfer: newAddAirTransfer,
        assignedHotelPassengers: data.map((_, i) => i),
        assignedTransferPassengers: data.map((_, i) => i)
      };
    });
  };

  const nextStep = () => {
    if (bookingMode === 'services' && step === 1) {
      if (status !== "authenticated") {
        setShowAuthModal(true);
        return;
      }
      setStep(3);
      window.scrollTo(0, 0);
      return;
    }

    if (bookingMode === 'mission' && step === 1 && !selection.outboundFlight) { setErrorPrompt("Selecciona un vuelo."); return; }

    if (step === 2) {
      if (status !== "authenticated") {
        setShowAuthModal(true);
        return;
      }
      if (selection.package === 'antares') {
        handleAntaresContact();
        return;
      }
      applyPackageSettings();
    }

    if (step === 3) {
      if (selection.passengerData.some(p => !p.name || !p.primarylastname)) {
        setErrorPrompt("Completa los datos de la tripulación.");
        return;
      }

      const trainingIncomplete = selection.passengerData.some(p =>
        p.training_mode === 'request' && (!p.training_city || p.training_dates.some((d: string) => !d))
      );

      if (trainingIncomplete) {
        setErrorPrompt("Las fechas y ciudad de Iris Training son obligatorias para todos los pasajeros que lo soliciten.");
        return;
      }

      if (bookingMode === 'services') {
        setStep(5);
        return;
      }
    }

    if (step === 3 && selection.package !== 'altair') {
      setStep(6);
      window.scrollTo(0, 0);
      return;
    }

    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    if (step === 3 && bookingMode === 'services') {
      setStep(1);
    } else if (step === 5 && bookingMode === 'services') {
      setStep(3);
    } else if (step === 6) {
      if (bookingMode === 'services') {
        setStep(5);
      } else if (selection.package !== 'altair') {
        setStep(3);
      } else {
        setStep(5);
      }
    } else if (step > 1) {
      setStep(step - 1);
    }
    window.scrollTo(0, 0);
  };

  const handleBooking = async () => {
    if (status !== "authenticated") { router.push("/login?callbackUrl=/booking"); return; }
    setIsCreating(true);
    try {
      const mappedPassengers = selection.passengerData.map(p => ({
        nombre: p.name,
        apellido1: p.primarylastname,
        apellido2: p.secondarylastname || "",
        dni: p.document_number,
        pais: p.document_country || "ESP",
        fecha_nacimiento: p.birth_date,
        tipo_sangre: p.blood_type,
        alergias: p.allergies,
        aptitud_fisica: "No apto",
        numero_pasaporte_iris: p.iris_passport_number || "",
        expiracion_pasaporte_iris: p.iris_passport_expiration || null,
        fecha_certificado_training: p.training_certificate_date || null,
        estado_certificado_training: p.training_mode === 'request' ? 'pending' : (p.training_certificate_status || "none"),
        foto_pasaporte: p.passport_photo || "",
        estado_pasaporte: p.passport_mode === 'request' ? 'pending' : (p.passport_status || "none"),
        pdf_pasaporte: p.passport_pdf || "",
        training_mode: p.training_mode,
        passport_mode: p.passport_mode,
        training_dates: p.training_dates,
        training_city: p.training_city
      }));

      const token = (session?.user as any)?.accessToken;
      if (!token) {
        setErrorPrompt("Sesión expirada o inválida. Por favor, inicia sesión de nuevo.");
        setIsCreating(false);
        return;
      }

      const res = await irisApi.createFullBooking(token, {
        vuelo_id: bookingMode === 'mission' ? selection.outboundFlight?.id : null,
        vuelo_regreso_id: bookingMode === 'mission' ? selection.returnFlight?.id : null,
        cantidad_pasajeros: form.passengers_count,
        clase_asiento: form.seat_type.toLowerCase(),
        precio_total: parseFloat(getTotal().toFixed(2)),
        pasajeros: mappedPassengers,
        logistics: {
          hotel_id: selection.hotel?.id || null,
          hotel_nights: selection.hotel ? getNights() : 0,
          hotel_from: selection.hotelSearch.from || null,
          hotel_to: selection.hotelSearch.to || null,
          transfer_id: selection.transfer?.id || null,
          air_transfer: selection.addAirTransfer || false,
          vip_transfer: selection.addVipTransfer || false,
          refund_insurance: selection.addRefundInsurance || false,
          hotel_passengers: selection.assignedHotelPassengers,
          transfer_passengers: selection.assignedTransferPassengers
        },
        price_snapshot: {
          space: bookingMode === 'mission' ? ((selection.outboundFlight?.base_price || 0) + (selection.returnFlight?.base_price || 0)) : 0,
          hotel: selection.hotel ? (selection.hotel.price_per_night * getNights() * selection.assignedHotelPassengers.length) : 0,
          terrestrial: selection.addAirTransfer ? ((tariffs.air_transfer || 1500) * selection.passengerData.length) : 0,
          training: selection.passengerData.filter(p => p.training_mode === 'request').length * (tariffs.training || 45000),
          passport: selection.passengerData.filter(p => p.passport_mode === 'request').length * (tariffs.passport_management || 12000),
          vip: (selection.transfer ? (selection.transfer.price * selection.assignedTransferPassengers.length) : 0) + (selection.addVipTransfer ? (tariffs.vip_transfer || 1000) : 0),
          insurance: selection.addRefundInsurance ? (getTotal() / (1 + (tariffs.refund_insurance_pct || 10) / 100)) * ((tariffs.refund_insurance_pct || 10) / 100) : 0,
          discount: 0,
          total: getTotal()
        }
      });
      const finalId = res.id || res.datos?.id;
      if (finalId) router.push(`/portal/pagos?reserva_id=${finalId}`);
    } catch (e) { setErrorPrompt("Error al procesar reserva."); }
    setIsCreating(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#06040d]"><Loader2 className="text-purple-500 animate-spin" size={48} /></div>;

  const visibleFlights = (() => {
    if (isSelectingReturn && selection.outboundFlight) {
      return flights.filter(v => new Date(v.departure_date) > new Date(selection.outboundFlight!.arrival_date));
    }
    return flights;
  })();

  return (
    <div className="pt-32 min-h-screen">
      {/* Modal Antares */}
      <AnimatePresence>
        {showAntaresModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#0d0a1a] border border-white/10 p-10 rounded-[3rem] max-w-lg w-full shadow-3xl space-y-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!showAntaresSuccess ? (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-6">
                        <MessageCircle size={40} />
                      </div>
                      <h3 className="text-3xl font-bold text-white tracking-tight">Asistente Personal</h3>
                      <p className="text-slate-400 text-sm">Tu gestor de Iris Aerospace necesita estos datos para coordinar tu misión de manera privada.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-emerald-400 font-black uppercase tracking-widest ml-1">Teléfono de Contacto</label>
                        <input
                          type="tel"
                          placeholder="+34 000 000 000"
                          value={antaresData.phone}
                          onChange={e => setAntaresData({ ...antaresData, phone: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-emerald-400 font-black uppercase tracking-widest ml-1">Correo Electrónico</label>
                        <input
                          type="email"
                          placeholder="ejemplo@email.com"
                          value={antaresData.email}
                          onChange={e => setAntaresData({ ...antaresData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-emerald-400 font-black uppercase tracking-widest ml-1">Tipo de Atención</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => setAntaresData({ ...antaresData, method: 'chat' })}
                            className={`p-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${antaresData.method === 'chat' ? 'border-emerald-500 bg-emerald-600/10 text-white' : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10'}`}
                          >
                            Chat Directo
                          </button>
                          <button
                            onClick={() => setAntaresData({ ...antaresData, method: 'video' })}
                            className={`p-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${antaresData.method === 'video' ? 'border-emerald-500 bg-emerald-600/10 text-white' : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10'}`}
                          >
                            Video Llamada
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button onClick={() => setShowAntaresModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Cancelar</button>
                      <button
                        onClick={handleAntaresContact}
                        disabled={!antaresData.phone || !antaresData.email || isCreating}
                        className="flex-1 py-4 bg-emerald-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isCreating ? <Loader2 size={14} className="animate-spin" /> : "Confirmar Solicitud"}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-8">
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                      <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold text-white tracking-tight">¡Solicitud Enviada!</h3>
                      <p className="text-slate-400 text-sm">Tu gestor personal ha recibido una <b>alerta de prioridad alta</b> y se pondrá en contacto contigo lo antes posible.</p>
                    </div>
                    <div className="pt-4 flex items-center justify-center gap-3 text-[10px] text-emerald-400 font-black uppercase tracking-widest">
                      <Loader2 size={14} className="animate-spin" />
                      Redirigiendo al Centro de Mensajes...
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showAuthModal && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAuthModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-[#0d0a1a] border border-white/10 p-10 rounded-[3.5rem] max-w-md w-full shadow-[0_0_100px_rgba(147,51,234,0.2)] text-center space-y-8 overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-purple-600/5 to-transparent pointer-events-none" />

                <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto text-purple-400 mb-6">
                  <Lock size={40} />
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white tracking-tight">A un solo paso de la Aventura...</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Inicia Sesión para continuar con la reserva.</p>
                </div>

                <div className="flex flex-col gap-4 pt-4">
                  <Link
                    href="/auth/login?callbackUrl=/booking"
                    className="w-full py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all shadow-2xl text-center"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/auth/register?callbackUrl=/booking"
                    className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors text-center"
                  >
                    Registrate ahora
                  </Link>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="text-[8px] font-bold uppercase tracking-widest text-slate-700 hover:text-slate-500 transition-colors"
                  >
                    Volver
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      <AnimatePresence>
        {errorPrompt && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] w-full max-w-lg px-6">
            <div className="bg-red-500/10 border border-red-500/30 backdrop-blur-xl p-4 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-red-400" />
                <p className="text-red-200 text-sm font-medium">{errorPrompt}</p>
              </div>
              <button onClick={() => setErrorPrompt(null)} className="text-red-400 hover:text-white"><X size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`max-w-[1400px] mx-auto px-6 grid grid-cols-1 ${bookingMode === 'mission' && selection.outboundFlight && step < 6 ? 'lg:grid-cols-4' : 'max-w-4xl'} gap-12 transition-all duration-700 relative z-10`}>
        <AnimatePresence>
          {bookingMode === 'mission' && selection.outboundFlight && step < 6 && (
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="hidden lg:block sticky top-32 h-fit space-y-6">
              <div className="card-purple p-8 rounded-[3rem] border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-linear-to-br from-purple-600/5 to-transparent pointer-events-none" />

                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-400"><Rocket size={14} /></div>
                  Resumen de Misión
                </h3>

                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                  {/* Warning si la fecha es menor a 5 días */}
                  {selection.outboundFlight && form.departure_date && (new Date(form.departure_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24) < 5 && (
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[9px] text-amber-200/90 leading-relaxed font-medium">
                      <span className="text-amber-400 font-bold uppercase tracking-widest block mb-1">Margen Ajustado</span>
                      Aviso: Faltan menos de 5 días para la salida. Recuerda que la gestión del Iris Training y Pasaporte requiere un margen mínimo de 5 días de antelación para asegurar su viabilidad antes del lanzamiento.
                    </div>
                  )}

                  {bookingMode === 'mission' && selection.outboundFlight && (
                    <>
                      {/* Outbound */}
                      <div className="space-y-4">
                        <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-purple-500" /> Vuelo de Salida
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-white font-bold">{selection.outboundFlight.code}</span>
                            <span className="text-[10px] text-purple-400 font-bold">{(selection.outboundFlight.base_price * (form.seat_type === 'Supernova' ? 2.5 : 1)).toLocaleString()}€</span>
                          </div>
                          <p className="text-[9px] text-slate-500 uppercase font-black">{selection.outboundFlight.destination_name || selection.outboundFlight.destination?.name}</p>
                        </div>
                      </div>

                      {/* Return */}
                      {selection.returnFlight && (
                        <div className="space-y-4">
                          <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-500" /> Vuelo de Regreso
                          </div>
                          <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-white font-bold">{selection.returnFlight.code}</span>
                              <span className="text-[10px] text-blue-400 font-bold">{(selection.returnFlight.base_price * (form.seat_type === 'Supernova' ? 2.5 : 1)).toLocaleString()}€</span>
                            </div>
                            <p className="text-[9px] text-slate-500 uppercase font-black">{selection.returnFlight.destination_name || selection.returnFlight.destination?.name}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Passengers */}
                  <div className="space-y-4">
                    <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-green-500" /> Pasajero(s) ({form.passengers_count})
                    </div>
                    <div className="space-y-2">
                      {selection.passengerData.map((p, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-white font-bold truncate max-w-[120px]">{p.name || `Explorador ${idx + 1}`}</span>
                            <span className="text-[7px] text-slate-500 uppercase font-black tracking-tighter">{p.seat_type}</span>
                          </div>
                          {(p.training_mode === 'request' || p.passport_mode === 'request') && (
                            <div className="flex gap-1">
                              {p.training_mode === 'request' && <Zap size={10} className="text-purple-400" />}
                              {p.passport_mode === 'request' && <ShieldCheck size={10} className="text-indigo-400" />}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Logistics */}
                  {(selection.hotel || selection.transfer) && (
                    <div className="space-y-4">
                      <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-amber-500" /> Logística Terrestre
                      </div>
                      <div className="space-y-2">
                        {selection.hotel && (
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Hotel size={12} className="text-amber-400" />
                              <span className="text-[9px] text-white font-bold truncate max-w-[100px]">{selection.hotel.name}</span>
                              <span className="text-[10px] text-amber-400 font-bold">{(selection.hotel.price_per_night * getNights() * selection.assignedHotelPassengers.length).toLocaleString()}€</span>
                            </div>
                          </div>
                        )}
                        {selection.transfer && (
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Rocket size={12} className="text-green-400 rotate-90" />
                              <span className="text-[9px] text-white font-bold truncate max-w-[100px]">{selection.transfer.name}</span>
                              <span className="text-[10px] text-green-400 font-bold">{(selection.transfer.price * selection.assignedTransferPassengers.length).toLocaleString()}€</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-10 pt-8 border-t border-white/10 relative z-10">
                  <div className="flex justify-between items-end mb-4">
                    <p className="text-[8px] text-slate-500 uppercase font-black tracking-[0.2em]">Coste Total</p>
                    <div className="px-2 py-1 rounded bg-purple-600/20 text-[7px] font-black text-purple-400 uppercase tracking-widest border border-purple-500/20">Final</div>
                  </div>
                  <p className="text-4xl font-black text-white tracking-tighter">{getTotal().toLocaleString()}€</p>
                  <p className="text-[8px] text-slate-500 mt-2 font-medium italic">Tasas de lanzamiento e IVA incluidos</p>
                </div>

                {/* Decorative glow */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-600/10 blur-[80px] rounded-full" />
              </div>

              {/* Tips / Help Card */}
              <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
                <p className="text-[9px] text-slate-400 leading-relaxed flex gap-3 italic">
                  <Info size={14} className="text-purple-400 shrink-0" />
                  Nuestro equipo de revisará los detalles de tu reserva en las próximas 24 horas.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`lg:col-span-3 pb-40 ${bookingMode === 'mission' && !selection.outboundFlight ? 'lg:col-start-1 lg:col-end-5 mx-auto' : ''}`}>
          <div className="flex justify-center mb-16">
            <AnimatePresence>
              {((step > 1 && (selection.package === 'altair' || bookingMode === 'services')) || step === 6) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-4 bg-black/40 backdrop-blur-xl p-2 rounded-full border border-white/10"
                >
                  {[1, 2, 3, 4, 5, 6].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-500 ${step >= s ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]' : 'bg-white/5 text-slate-500'}`}>
                        {step > s ? <Check size={16} /> : s}
                      </div>
                      {s < 6 && <div className={`w-8 h-[2px] rounded-full transition-colors duration-500 ${step > s ? 'bg-purple-600' : 'bg-white/5'}`} />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                <div className="flex flex-col items-center gap-12">
                  <div className="text-center max-w-2xl">
                    <h2 className="text-6xl font-bold text-white mb-6 tracking-tight">
                      {isSelectingReturn ? "Todo listo para tu " : "Estás a un paso de "}
                      <span className="text-purple-400 italic">
                        {isSelectingReturn ? "Regreso a Casa" : "Descubrir el Universo"}
                      </span>
                    </h2>
                    <p className="text-slate-400 text-lg">Elige el tipo de experiencia que deseas coordinar con el Centro de Control Orbital.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                    <button
                      onClick={() => setBookingMode('mission')}
                      className={`group relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 text-left overflow-hidden ${bookingMode === 'mission' ? 'border-purple-500 bg-purple-600/10 shadow-[0_0_40px_rgba(147,51,234,0.2)]' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-3xl -z-10" />
                      <div className="flex justify-between items-center mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${bookingMode === 'mission' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                          <Rocket size={24} />
                        </div>
                        {bookingMode === 'mission' && <CheckCircle2 size={24} className="text-purple-400" />}
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2">Misión Completa</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Reserva tus vuelos orbitales e incluye servicios personalizados de entrenamiento y logística.</p>
                    </button>

                    <button
                      onClick={() => setBookingMode('services')}
                      className={`group relative p-8 rounded-[2.5rem] border-2 transition-all duration-500 text-left overflow-hidden ${bookingMode === 'services' ? 'border-indigo-500 bg-indigo-600/10 shadow-[0_0_40px_rgba(79,70,229,0.2)]' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 blur-3xl -z-10" />
                      <div className="flex justify-between items-center mb-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${bookingMode === 'services' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                          <Zap size={24} />
                        </div>
                        {bookingMode === 'services' && <CheckCircle2 size={24} className="text-indigo-400" />}
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2">Solo Servicios Extras</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Gestión de Pasaporte Estelar o Iris Training para exploradores que ya disponen de vuelo o desean prepararse.</p>
                    </button>
                  </div>

                  {bookingMode === 'services' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 flex items-center justify-center text-indigo-400"><Users size={32} /></div>
                        <div>
                          <h4 className="text-2xl font-bold text-white">Configuración de Pasajeros</h4>
                          <p className="text-xs text-slate-400 uppercase font-black tracking-widest mt-1">¿Cuántos pasajeros solicitan servicios?</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button
                            key={n}
                            onClick={() => setForm({ ...form, passengers_count: n })}
                            className={`flex-1 py-4 rounded-xl text-xs font-black transition-all ${form.passengers_count === n ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                          >
                            {n} {n === 1 ? 'Explorador' : 'Exploradores'}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck size={14} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Pasaporte Iris</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{(tariffs.passport_management || 2500).toLocaleString()}€</p>
                          <p className="text-[8px] text-slate-500 uppercase font-bold mt-1">Por explorador</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap size={14} className="text-purple-400" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Iris Training</span>
                          </div>
                          <p className="text-2xl font-bold text-white">{(tariffs.training || 50000).toLocaleString()}€</p>
                          <p className="text-[8px] text-slate-500 uppercase font-bold mt-1">Protocolo Completo</p>
                        </div>
                      </div>

                      <button
                        onClick={nextStep}
                        className="w-full py-6 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3"
                      >
                        Continuar con la Solicitud <ArrowRight size={18} />
                      </button>
                    </motion.div>
                  )}
                </div>

                {bookingMode === 'mission' && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">

                    <div className="card-purple p-8 rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 items-end gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] text-purple-400 uppercase font-black tracking-[0.2em] ml-1">Origen</label>
                          <select
                            value={form.origin_id}
                            onChange={e => setForm({ ...form, origin_id: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 text-xs outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
                          >
                            <option value="" disabled className="bg-[#0d0a1a]">Selecciona</option>
                            {destinations.map(d => (
                              <option key={d.id} value={d.id.toString()} className="bg-[#0d0a1a]">{d.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] text-purple-400 uppercase font-black tracking-[0.2em] ml-1">Destino</label>
                          <select
                            value={form.destination_id}
                            onChange={e => setForm({ ...form, destination_id: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 text-xs outline-none focus:border-purple-500/50 transition-colors cursor-pointer"
                          >
                            <option value="" disabled className="bg-[#0d0a1a]">Selecciona</option>
                            {destinations.filter(d => d.id.toString() !== form.origin_id).map(d => (
                              <option key={d.id} value={d.id.toString()} className="bg-[#0d0a1a]">{d.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] text-purple-400 uppercase font-black tracking-[0.2em] ml-1">Salida</label>
                          <div className="relative">
                            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            <input
                              type="date"
                              value={form.departure_date}
                              min={new Date().toISOString().split('T')[0]}
                              onClick={(e) => e.currentTarget.showPicker?.()}
                              onChange={e => setForm({ ...form, departure_date: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 pl-12 text-xs color-scheme-dark outline-none focus:border-purple-500/50 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="text-[10px] text-purple-400 uppercase font-black tracking-[0.2em] ml-1">Regreso</label>
                            <span className="text-[8px] text-slate-500 uppercase font-bold italic">Opcional</span>
                          </div>
                          <div className={`relative transition-all duration-300 ${highlightReturn ? 'scale-105 ring-2 ring-purple-500 rounded-2xl' : ''}`}>
                            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            <input
                              ref={returnDateRef}
                              type="date"
                              value={form.return_date}
                              min={form.departure_date || new Date().toISOString().split('T')[0]}
                              onClick={(e) => e.currentTarget.showPicker?.()}
                              onChange={e => setForm({ ...form, return_date: e.target.value })}
                              className={`w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 pl-12 text-xs color-scheme-dark outline-none focus:border-purple-500/50 transition-colors ${highlightReturn ? 'border-purple-500' : ''}`}
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] text-purple-400 uppercase font-black tracking-[0.2em] ml-1">Pasajeros</label>
                          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-1 h-14">
                            <button
                              onClick={() => setForm(f => ({ ...f, passengers_count: Math.max(1, f.passengers_count - 1) }))}
                              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-white transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <div className="flex flex-col items-center">
                              <span className="text-white font-black text-sm">{form.passengers_count}</span>
                            </div>
                            <button
                              onClick={() => setForm(f => ({ ...f, passengers_count: Math.min(12, f.passengers_count + 1) }))}
                              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 text-white transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSearch()}
                          disabled={searching}
                          className="bg-white text-black h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 group"
                        >
                          {searching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} className="group-hover:scale-110 transition-transform" />}
                          <span>Buscar</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {visibleFlights.map(v => (
                        <motion.div
                          key={v.id}
                          whileHover={{ y: -5, scale: 1.02 }}
                          onClick={() => !isSelectingReturn ? setSelection({ ...selection, outboundFlight: v }) : setSelection({ ...selection, returnFlight: v })}
                          className={`relative p-8 rounded-[2.5rem] cursor-pointer transition-all duration-500 border-2 overflow-hidden group ${(selection.outboundFlight?.id === v.id || selection.returnFlight?.id === v.id)
                            ? 'border-purple-500 bg-purple-600/20 shadow-[0_0_40px_rgba(147,51,234,0.3)]'
                            : 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/[0.15] backdrop-blur-sm shadow-xl'
                            }`}
                        >
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                              <div className="space-y-1">
                                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">{v.code}</span>
                                <h3 className="text-4xl font-bold text-white tracking-tighter">{v.destination_name || v.destination?.name || 'Destino Desconocido'}</h3>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Precio Base</p>
                                <p className="text-3xl font-black text-white">{v.base_price.toLocaleString()}€</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                              <div className="space-y-1">
                                <p className="text-[8px] text-slate-500 uppercase font-bold">Lanzamiento</p>
                                <div className="flex items-center gap-2 text-white font-bold text-xs">
                                  <Calendar size={12} className="text-purple-500" />
                                  {new Date(v.departure_date).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[8px] text-slate-500 uppercase font-bold">Duración</p>
                                <div className="flex items-center gap-2 text-white font-bold text-xs">
                                  <Timer size={12} className="text-purple-500" />
                                  {getDuration(v.departure_date, v.arrival_date)}
                                </div>
                              </div>
                              <div className="space-y-1 text-right">
                                <p className="text-[8px] text-slate-500 uppercase font-bold">Nave</p>
                                <div className="flex items-center justify-end gap-2 text-white font-bold text-xs italic">
                                  <Rocket size={12} className="text-purple-500" />
                                  {v.starship_name || v.ship_name || 'Iris Vanguard'}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-600/10 blur-[60px] rounded-full group-hover:bg-purple-600/20 transition-all duration-700" />
                        </motion.div>
                      ))}
                    </div>

                    {visibleFlights.length === 0 && !searching && hasSearched && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-32 card-purple rounded-[4rem] border border-dashed border-white/10 bg-white/[0.02]"
                      >
                        <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                          <AlertTriangle className="text-purple-400" size={32} />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Sin ventanas de lanzamiento</h3>
                        <p className="text-slate-400 text-lg max-w-md mx-auto mb-10">
                          No hay vuelos disponibles para estas fechas seleccionadas. Prueba con otras fechas o destinos cercanos.
                        </p>
                        <button
                          onClick={() => setForm(f => ({ ...f, departure_date: "" }))}
                          className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-[10px] uppercase hover:bg-white/10 transition-all"
                        >
                          Limpiar Filtros
                        </button>
                      </motion.div>
                    )}

                    {showNearby && flights.length === 0 && (
                      <div className="mt-8 p-8 rounded-3xl bg-purple-600/5 border border-purple-500/20 text-center">
                        <p className="text-purple-300 font-bold mb-4">¿No encuentras lo que buscas? Mostramos opciones cercanas:</p>
                        <button onClick={() => { handleSearch(true); setShowNearby(false); }} className="px-8 py-3 bg-purple-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Ver fechas cercanas</button>
                      </div>
                    )}

                    {selection.outboundFlight && (
                      <div className="flex justify-center gap-4 mt-12">
                        {!isSelectingReturn && (
                          <div className="flex flex-col items-center gap-6">
                            <div className="flex gap-4">
                              <button
                                onClick={() => {
                                  if (!form.return_date) {
                                    setErrorPrompt("Introduce una fecha de regreso en el buscador primero.");
                                    return;
                                  }
                                  setIsSelectingReturn(true);
                                  handleSearch(false, true);
                                }}
                                className="px-10 py-5 bg-white text-black rounded-full font-bold text-[10px] uppercase hover:bg-purple-600 hover:text-white transition-all shadow-xl"
                              >
                                Añadir Regreso
                              </button>
                              <button onClick={nextStep} className="px-10 py-5 border border-white/10 text-white rounded-full font-bold text-[10px] uppercase hover:bg-white/10 transition-all">
                                Continuar sin regreso
                              </button>
                            </div>
                          </div>
                        )}
                        {isSelectingReturn && (
                          <div className="flex gap-4">
                            <button onClick={() => { setIsSelectingReturn(false); handleSearch(); }} className="px-10 py-5 border border-white/10 text-white rounded-full font-bold text-[10px] uppercase hover:bg-white/10 transition-all">
                              Cambiar Salida
                            </button>
                            {selection.returnFlight && (
                              <button onClick={nextStep} className="px-12 py-5 bg-white text-black rounded-full font-bold text-[10px] uppercase hover:bg-purple-600 hover:text-white transition-all shadow-xl">
                                Confirmar Selección
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 relative z-20">
                <div className="text-center max-w-3xl mx-auto space-y-4 relative z-30">
                  <h2 className="text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                    Escoge tu <span className="text-purple-400 italic">Camino</span>
                  </h2>
                  <p className="text-slate-300 text-lg drop-shadow-md">
                    Selecciona cómo quieres que Iris te acompañe en esta experiencia hacia las estrellas.
                  </p>
                </div>

                <div className="space-y-6 max-w-5xl mx-auto">
                  <div className="text-center"><h3 className="text-purple-400 font-black tracking-widest uppercase text-xs">Los Packs de Reserva</h3></div>
                  <div className="grid md:grid-cols-3 gap-6 relative z-20">
                    <button
                      onClick={() => setSelection({ ...selection, package: 'sirius' })}
                      className={`p-6 rounded-[2.5rem] border-2 transition-all text-left flex flex-col justify-between ${selection.package === 'sirius' ? 'border-purple-500 bg-purple-600/20' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">Sirius</h4>
                        <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">Lo esencial para brillar en el espacio. El punto de partida para cualquier viajero.</p>
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-center gap-2 text-[11px] text-slate-300"><CheckCircle2 size={14} className="text-purple-400" /> Vuelo (Nova)</li>
                          <li className="flex items-center gap-2 text-[11px] text-slate-300"><CheckCircle2 size={14} className="text-purple-400" /> Iris Training</li>
                        </ul>
                      </div>
                      <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mt-4">Seleccionar</div>
                    </button>

                    <button
                      onClick={() => setSelection({ ...selection, package: 'polaris' })}
                      className={`p-6 rounded-[2.5rem] border-2 transition-all text-left flex flex-col justify-between ${selection.package === 'polaris' ? 'border-blue-500 bg-blue-600/20' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">Polaris</h4>
                        <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">Es la estrella del norte, la que guía a los navegantes. Tu camino sin pérdida.</p>
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-center gap-2 text-[11px] text-slate-300"><CheckCircle2 size={14} className="text-blue-400" /> Vuelo (Nova)</li>
                          <li className="flex items-center gap-2 text-[11px] text-slate-300"><CheckCircle2 size={14} className="text-blue-400" /> Iris Training</li>
                          <li className="flex items-center gap-2 text-[11px] text-slate-300"><CheckCircle2 size={14} className="text-blue-400" /> Gestión Pasaporte</li>
                        </ul>
                      </div>
                      <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-4">Seleccionar</div>
                    </button>

                    <button
                      onClick={() => setSelection({ ...selection, package: 'rigel' })}
                      className={`p-6 rounded-[2.5rem] border-2 transition-all text-left flex flex-col justify-between relative overflow-hidden ${selection.package === 'rigel' ? 'border-amber-500 bg-amber-600/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <div className="relative z-10">
                        <h4 className="text-xl font-bold text-white mb-2">Rigel</h4>
                        <p className="text-[11px] text-slate-400 mb-6 leading-relaxed">El poder absoluto. No te preocupas por nada; nosotros movemos el mundo para ti.</p>
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-center gap-2 text-[11px] text-slate-300"><Sparkles size={14} className="text-amber-400" /> Vuelo Supernova</li>
                          <li className="flex items-center gap-2 text-[11px] text-slate-300"><Sparkles size={14} className="text-amber-400" /> Training & Pasaporte</li>
                          <li className="flex items-center gap-2 text-[11px] text-slate-300"><Sparkles size={14} className="text-amber-400" /> Hotel Premium</li>
                          <li className="flex items-center gap-2 text-[11px] text-slate-300"><Sparkles size={14} className="text-amber-400" /> Traslados</li>
                        </ul>
                      </div>
                      <div className="relative z-10 text-[10px] font-black text-amber-400 uppercase tracking-widest mt-4">Seleccionar</div>
                    </button>
                  </div>

                  <div className="text-center pt-8"><h3 className="text-slate-500 font-black tracking-widest uppercase text-xs">Opciones Personalizadas</h3></div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <button
                      onClick={() => setSelection({ ...selection, package: 'altair' })}
                      className={`p-8 rounded-[3rem] border-2 transition-all text-left flex items-center gap-6 ${selection.package === 'altair' ? 'border-indigo-500 bg-indigo-600/20' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400"><Edit3 size={24} /></div>
                      <div>
                        <h4 className="text-xl font-bold text-white">Altair</h4>
                        <p className="text-xs text-slate-400 mt-2">Reserva de manera manual para no perderte ningún detalle</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelection({ ...selection, package: 'antares' })}
                      className={`p-8 rounded-[3rem] border-2 transition-all text-left flex items-center gap-6 ${selection.package === 'antares' ? 'border-emerald-500 bg-emerald-600/20' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><MessageCircle size={24} /></div>
                      <div>
                        <h4 className="text-xl font-bold text-white">Antares</h4>
                        <p className="text-xs text-slate-400 mt-2">Agendar asistencia a tu gestor personal para que gestione tu reserva.</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex justify-center gap-6 mt-12">
                  <button onClick={prevStep} className="px-10 py-5 text-slate-500 uppercase font-black text-[10px] tracking-widest hover:text-white transition-colors">Volver</button>
                  <button onClick={nextStep} className="px-16 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all shadow-2xl">
                    {selection.package === 'antares' ? 'Configurar Contacto' : 'Continuar'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-6xl font-bold text-white mb-6">Identidad de los <span className="text-purple-400 italic">Pasajeros</span></h2>
                  <p className="text-slate-400 text-lg">Asegura los datos oficiales y requisitos estelares para cada pasajero.</p>
                </div>
                <div className="space-y-8">
                  {selection.passengerData.map((p: any, i: number) => (
                    <motion.div
                      key={i}
                      className={`card-purple p-10 rounded-[4rem] border transition-all duration-500 relative overflow-hidden ${editingIndex === i ? 'border-purple-500/50 bg-black/60' : 'border-white/10 bg-black/40'
                        }`}
                    >
                      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none"><Users size={180} /></div>

                      <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${editingIndex === i ? 'bg-purple-600 text-white border-purple-400' : 'bg-white/5 text-purple-400 border-white/10'}`}>
                            <User size={24} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white">Pasajero {i + 1}</h3>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                              {p.name ? `${p.name} ${p.primarylastname}` : 'Pendiente de datos'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setEditingIndex(editingIndex === i ? null : i)}
                          className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${editingIndex === i ? 'bg-white text-black' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                            }`}
                        >
                          {editingIndex === i ? 'Cerrar' : 'Añadir'}
                        </button>
                      </div>

                      {editingIndex === i ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                          <div className="p-10 rounded-[3rem] bg-purple-600/5 border border-purple-500/20 relative overflow-hidden">
                            <div className="relative z-10">
                              <p className="text-[10px] text-purple-400 uppercase font-black tracking-[0.3em] mb-8 flex items-center gap-2">
                                <Users size={14} /> ¿Quién nos acompaña?
                              </p>

                              {userPassengers.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                  {userPassengers.map(up => (
                                    <button
                                      key={up.id}
                                      onClick={() => {
                                        const d = [...selection.passengerData];
                                        d[i] = {
                                          ...d[i],
                                          name: up.nombre || up.name,
                                          primarylastname: up.apellido1 || up.primarylastname,
                                          secondarylastname: up.apellido2 || up.secondarylastname,
                                          document_number: up.dni || up.document_number,
                                          document_country: up.pais || up.document_country,
                                          birth_date: (up.fecha_nacimiento || up.birth_date)?.split('T')[0],
                                          compliance: false,
                                          fromManifesto: true
                                        };
                                        setSelection({ ...selection, passengerData: d });
                                      }}
                                      className="group p-4 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500 hover:bg-purple-600/10 transition-all text-left"
                                    >
                                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-purple-600 group-hover:text-white mb-3 transition-colors">
                                        <User size={18} />
                                      </div>
                                      <p className="text-[10px] text-white font-bold truncate">{up.nombre || up.name}</p>
                                      <p className="text-[8px] text-slate-500 uppercase font-black truncate">{up.apellido1 || up.primarylastname}</p>
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-slate-500 text-[10px] italic">No hay pasajeros guardados. Introduce los datos manualmente a continuación.</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <p className="text-[8px] text-slate-500 uppercase font-black tracking-[0.4em]">O rellena manualmente</p>
                            <div className="h-px flex-1 bg-white/10" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-2">
                              <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Nombre *</label>
                              <input value={p.name || ""} disabled={p.fromManifesto} onChange={e => { const d = [...selection.passengerData]; d[i].name = e.target.value; setSelection({ ...selection, passengerData: d }); }} placeholder="Nombre" className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-purple-500/50 ${p.fromManifesto ? 'opacity-50 cursor-not-allowed' : ''}`} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Primer Apellido *</label>
                              <input value={p.primarylastname || ""} disabled={p.fromManifesto} onChange={e => { const d = [...selection.passengerData]; d[i].primarylastname = e.target.value; setSelection({ ...selection, passengerData: d }); }} placeholder="Primer Apellido" className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-purple-500/50 ${p.fromManifesto ? 'opacity-50 cursor-not-allowed' : ''}`} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Segundo Apellido</label>
                              <input value={p.secondarylastname || ""} disabled={p.fromManifesto} onChange={e => { const d = [...selection.passengerData]; d[i].secondarylastname = e.target.value; setSelection({ ...selection, passengerData: d }); }} placeholder="Segundo Apellido" className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-purple-500/50 ${p.fromManifesto ? 'opacity-50 cursor-not-allowed' : ''}`} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Documento (ID) *</label>
                              <input value={p.document_number || ""} disabled={p.fromManifesto} onChange={e => { const d = [...selection.passengerData]; d[i].document_number = e.target.value; setSelection({ ...selection, passengerData: d }); }} placeholder="DNI / Pasaporte" className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-purple-500/50 ${p.fromManifesto ? 'opacity-50 cursor-not-allowed' : ''}`} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">País *</label>
                              <select value={p.document_country || ""} disabled={p.fromManifesto} onChange={e => { const d = [...selection.passengerData]; d[i].document_country = e.target.value; setSelection({ ...selection, passengerData: d }); }} className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-purple-500/50 appearance-none ${p.fromManifesto ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <option value="" disabled>Selecciona País</option>
                                {locations.map(loc => (
                                  <option key={loc.id} value={loc.country_code || loc.name} className="bg-[#0d0a1a]">
                                    {loc.country_code || loc.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Fecha Nacimiento *</label>
                              <input type="date" value={p.birth_date || ""} disabled={p.fromManifesto} onClick={(e) => e.currentTarget.showPicker?.()} onChange={e => { const d = [...selection.passengerData]; d[i].birth_date = e.target.value; setSelection({ ...selection, passengerData: d }); }} className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-purple-500/50 color-scheme-dark ${p.fromManifesto ? 'opacity-50 cursor-not-allowed' : ''}`} />
                            </div>
                          </div>

                          <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                            <label className="flex items-start gap-4 cursor-pointer group">
                              <div className={`mt-1 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${!!p.compliance ? 'bg-purple-600 border-purple-600' : 'border-white/20 group-hover:border-purple-500'}`}>
                                <input type="checkbox" checked={!!p.compliance} onChange={e => { const d = [...selection.passengerData]; d[i].compliance = e.target.checked; setSelection({ ...selection, passengerData: d }); }} className="sr-only" />
                                {!!p.compliance && <Check size={12} className="text-white" />}
                              </div>
                              <p className="text-[10px] text-slate-500 leading-relaxed">
                                Autorizo el <span className="text-white font-bold">tratamiento de datos </span> para la validación de seguridad orbital y cumplimiento del protocolo de vuelo de Iris Aerospace.
                              </p>
                            </label>
                          </div>

                          <div className="flex justify-end pt-8">
                            <button
                              onClick={async () => {
                                if (status !== "authenticated") return;
                                setSavingPassenger(i);
                                try {
                                  const mapped = {
                                    nombre: p.name,
                                    apellido1: p.primarylastname,
                                    apellido2: p.secondarylastname || "",
                                    dni: p.document_number,
                                    pais: p.document_country || "ESP",
                                    fecha_nacimiento: p.birth_date,
                                    tipo_sangre: p.blood_type,
                                    alergias: p.allergies || "Ninguna",
                                    aptitud_fisica: "No apto",
                                    numero_pasaporte_iris: p.iris_passport_number || "",
                                    expiracion_pasaporte_iris: p.iris_passport_expiration || null,
                                    fecha_certificado_training: p.training_certificate_date || null,
                                    estado_certificado_training: p.training_certificate_status || "none",
                                    foto_pasaporte: p.passport_photo || "",
                                    estado_pasaporte: p.passport_status || "none",
                                    pdf_pasaporte: p.passport_pdf || ""
                                  };
                                  await irisApi.createPassenger((session?.user as any).accessToken, mapped);
                                  const pRes = await irisApi.getPassengers((session?.user as any).accessToken);
                                  setUserPassengers(pRes.datos || pRes || []);
                                  setEditingIndex(null);
                                } catch (e) {
                                  setErrorPrompt("Error al guardar pasajero.");
                                } finally {
                                  setSavingPassenger(null);
                                }
                              }}
                              disabled={savingPassenger === i || !p.compliance}
                              className="px-12 py-5 bg-purple-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl disabled:opacity-50"
                            >
                              {savingPassenger === i ? <Loader2 size={16} className="animate-spin" /> : "Añadir Pasajero"}
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <p className="text-[10px] text-purple-400 uppercase font-black tracking-[0.2em] ml-1">Servicios Solicitados</p>
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                onClick={() => {
                                  const d = [...selection.passengerData];
                                  d[i].training_mode = d[i].training_mode === 'request' ? 'none' : 'request';
                                  setSelection({ ...selection, passengerData: d });
                                }}
                                className={`p-6 rounded-[2.5rem] border-2 text-left transition-all duration-500 flex flex-col justify-between h-44 relative ${p.training_mode === 'request' ? 'border-purple-500 bg-purple-600/10 shadow-[0_0_30px_rgba(147,51,234,0.2)]' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${p.training_mode === 'request' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-500'}`}><Zap size={20} /></div>
                                <div><h4 className="text-white font-bold text-sm mb-1">Iris Training</h4><p className="text-[9px] text-slate-500 uppercase font-black">{(tariffs.training || 50000).toLocaleString()}€</p></div>
                                {p.training_mode === 'request' && <div className="absolute top-4 right-4 text-purple-400"><CheckCircle2 size={16} /></div>}
                              </button>

                              <button
                                onClick={() => { const d = [...selection.passengerData]; d[i].passport_mode = d[i].passport_mode === 'request' ? 'none' : 'request'; setSelection({ ...selection, passengerData: d }); }}
                                className={`p-6 rounded-[2.5rem] border-2 text-left transition-all duration-500 flex flex-col justify-between h-44 relative ${p.passport_mode === 'request' ? 'border-indigo-500 bg-indigo-600/10 shadow-[0_0_30px_rgba(79,70,229,0.2)]' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${p.passport_mode === 'request' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500'}`}><ShieldCheck size={20} /></div>
                                <div><h4 className="text-white font-bold text-sm mb-1">Pasaporte Estelar</h4><p className="text-[9px] text-slate-500 uppercase font-black">{(tariffs.passport_management || 2500).toLocaleString()}€</p></div>
                                {p.passport_mode === 'request' && <div className="absolute top-4 right-4 text-indigo-400"><CheckCircle2 size={16} /></div>}
                              </button>
                            </div>

                            {p.training_mode === 'request' && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-4">
                                <div className="p-8 rounded-[2.5rem] bg-purple-600/5 border border-purple-500/20">
                                  <div className="flex justify-between items-center mb-6">
                                    <p className="text-[10px] text-purple-300 uppercase font-black tracking-widest flex items-center gap-2"><Calendar size={12} /> Planificación de Sesiones</p>
                                    <p className="text-[9px] text-purple-400 font-bold uppercase tracking-widest">Programación Obligatoria *</p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {p.training_dates.map((date: string, idx: number) => (
                                      <div key={idx} className="space-y-2 relative group">
                                        <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Sesión {idx + 1}</label>
                                        <div className="relative">
                                          <input
                                            type="datetime-local"
                                            value={date || ""}
                                            min={new Date().toISOString().slice(0, 16)}
                                            onClick={(e) => e.currentTarget.showPicker?.()}
                                            onChange={e => {
                                              const d = [...selection.passengerData];
                                              d[i].training_dates[idx] = e.target.value;
                                              setSelection({ ...selection, passengerData: d });
                                            }}
                                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-[11px] text-white outline-none focus:border-purple-500 color-scheme-dark"
                                          />
                                          {idx > 0 && (
                                            <button
                                              onClick={() => { const d = [...selection.passengerData]; d[i].training_dates.splice(idx, 1); setSelection({ ...selection, passengerData: d }); }}
                                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              ×
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                    {p.training_dates.length < 3 && (
                                      <div className="flex items-end">
                                        <button
                                          onClick={() => { const d = [...selection.passengerData]; d[i].training_dates.push(""); setSelection({ ...selection, passengerData: d }); }}
                                          className="w-full h-[52px] border border-dashed border-purple-500/30 rounded-2xl flex items-center justify-center gap-2 text-purple-400 hover:bg-purple-500/10 transition-all text-[9px] uppercase font-black tracking-widest"
                                        >
                                          <Plus size={12} /> Añadir Sesión
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                      <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Ciudad de Entrenamiento *</label>
                                      <select
                                        value={p.training_city || ""}
                                        onChange={e => {
                                          const d = [...selection.passengerData];
                                          d[i].training_city = e.target.value;
                                          setSelection({ ...selection, passengerData: d });
                                        }}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-[11px] text-white outline-none focus:border-purple-500 appearance-none"
                                      >
                                        <option value="">Seleccionar ciudad...</option>
                                        {locations.map(loc => (
                                          <option key={loc.id} value={loc.name} className="bg-[#0d0a1a]">{loc.name}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="flex items-center">
                                      <p className="text-[10px] text-slate-500 italic leading-relaxed border-l border-white/10 pl-6">
                                        <span className="text-purple-400 font-bold uppercase text-[8px] block mb-1">Sugerencia</span>
                                        Realizar el entrenamiento unos días antes del lanzamiento en la ciudad de origen ({selection.outboundFlight?.origin_name || 'TBD'}).
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                            {(p.training_mode === 'request' || p.passport_mode === 'request') && (
                              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                                <Activity size={14} className="text-purple-400 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                                  <span className="text-white font-bold">Aviso:</span> Es obligatorio contar con entrenamiento y pasaporte estelar validado para realizar el lanzamiento.
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="bg-white/5 rounded-[3rem] p-8 border border-white/5 flex flex-col justify-between">
                            <div className="space-y-4">
                              <h4 className="text-xs font-black text-white uppercase tracking-widest">Información</h4>
                              <div className="space-y-2">
                                {bookingMode === 'mission' && <div className="flex justify-between text-[10px] text-slate-400"><span>Vuelo Base ({form.seat_type})</span><span className="text-white">{((selection.outboundFlight?.base_price || 0) * (form.seat_type === 'Supernova' ? 2.5 : 1)).toLocaleString()}€</span></div>}
                                {p.training_mode === 'request' && <div className="flex justify-between text-[10px] text-purple-400 font-bold"><span>Iris Training</span><span>{(tariffs.training || 50000).toLocaleString()}€</span></div>}
                                {p.passport_mode === 'request' && <div className="flex justify-between text-[10px] text-indigo-400 font-bold"><span>Pasaporte Estelar</span><span>{(tariffs.passport_management || 2500).toLocaleString()}€</span></div>}
                              </div>
                            </div>
                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                              <span className="text-[9px] text-slate-500 uppercase font-black">Total Explorador</span>
                              <span className="text-2xl font-black text-white">{(
                                (bookingMode === 'mission' ? (selection.outboundFlight?.base_price || 0) * (form.seat_type === 'Supernova' ? 2.5 : 1) : 0) +
                                (p.training_mode === 'request' ? (tariffs.training || 50000) : 0) +
                                (p.passport_mode === 'request' ? (tariffs.passport_management || 2500) : 0)
                              ).toLocaleString()}€</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-12">
                  <button onClick={prevStep} className="px-10 py-5 text-slate-500 uppercase font-black text-[10px] tracking-widest hover:text-white transition-colors">Volver</button>
                  <button onClick={nextStep} className="px-16 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all shadow-2xl">Continuar</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12 pb-20">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <h2 className="text-5xl font-bold text-white tracking-tight">Experiencia de Vuelo</h2>
                  <p className="text-slate-400 text-lg">Personaliza el nivel de confort para cada explorador de la misión.</p>
                </div>

                <div className="grid grid-cols-1 gap-12">
                  {selection.passengerData.map((p: any, i: number) => (
                    <div key={i} className="p-10 rounded-[3rem] bg-white/5 border border-white/5 space-y-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-xl"><User size={24} /></div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{p.name || `Explorador ${i + 1}`} {p.primarylastname}</h3>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Configuración de asiento</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <button
                          onClick={() => { const d = [...selection.passengerData]; d[i].seat_type = 'Nova'; setSelection({ ...selection, passengerData: d }); }}
                          className={`relative p-8 rounded-[2.5rem] border-2 text-left transition-all duration-500 overflow-hidden group ${p.seat_type === 'Nova' ? 'border-blue-500 bg-blue-600/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -z-10" />
                          <div className="flex justify-between items-start mb-6">
                            <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${p.seat_type === 'Nova' ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-500'}`}>Clase Estándar</div>
                            <div className="text-right">
                              <p className="text-2xl font-black text-white">Nova</p>
                            </div>
                          </div>
                          <ul className="space-y-3 mb-8">
                            {['Asiento Ergonómico Orbital', 'Ventana de Observación Compartida', 'Menú Estándar Iris', '10kg de Equipaje Personal'].map(f => (
                              <li key={f} className="flex items-center gap-2 text-[10px] text-slate-400"><CheckCircle2 size={12} className="text-blue-500" /> {f}</li>
                            ))}
                          </ul>
                          <div className="h-40 rounded-3xl bg-black/40 overflow-hidden mb-6">
                            <img src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" alt="Nova Class" />
                          </div>
                        </button>

                        <button
                          onClick={() => { const d = [...selection.passengerData]; d[i].seat_type = 'Supernova'; setSelection({ ...selection, passengerData: d }); }}
                          className={`relative p-8 rounded-[2.5rem] border-2 text-left transition-all duration-500 overflow-hidden group ${p.seat_type === 'Supernova' ? 'border-purple-500 bg-purple-600/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-3xl -z-10" />
                          <div className="flex justify-between items-start mb-6">
                            <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${p.seat_type === 'Supernova' ? 'bg-purple-600 text-white' : 'bg-white/10 text-slate-500'}`}>Clase Premium</div>
                            <div className="text-right">
                              <p className="text-2xl font-black text-white">Supernova</p>
                            </div>
                          </div>
                          <ul className="space-y-3 mb-8">
                            {['Suite Privada Zero-G', 'Ventana Panorámica 360º', 'Catering Gourmet Interplanetario', 'Acceso a Sala VIP en Puerto', '30kg de Equipaje Personal'].map(f => (
                              <li key={f} className="flex items-center gap-2 text-[10px] text-slate-400"><Sparkles size={12} className="text-purple-400" /> {f}</li>
                            ))}
                          </ul>
                          <div className="h-40 rounded-3xl bg-black/40 overflow-hidden mb-6">
                            <img src="https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=800" className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" alt="Supernova Class" />
                          </div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 rounded-[2.5rem] bg-white/5 border border-dashed border-white/10 flex items-center gap-6 max-w-4xl mx-auto">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0"><Info size={24} /></div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="text-amber-500 font-bold uppercase tracking-widest text-[8px] block mb-1">Nota de Disponibilidad</span>
                    Es posible realizar un <span className="text-white font-bold underline">Upgrade de categoría</span> desde su propia reserva, sujeto a la disponibilidad del vuelo.
                  </p>
                </div>

                <div className="flex justify-center gap-6 mt-12">
                  <button onClick={() => setStep(3)} className="px-10 py-5 text-slate-500 uppercase font-black text-[10px] tracking-widest hover:text-white transition-colors">Volver</button>
                  <button onClick={() => setStep(5)} className="px-16 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all shadow-2xl">Continuar</button>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12 pb-20">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <h2 className="text-5xl font-bold text-white tracking-tight">Logística Pre-Vuelo</h2>
                  <p className="text-slate-400 text-lg">Organiza tu llegada al puerto espacial o tus sesiones de entrenamiento.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <button
                    onClick={() => setSelection({ ...selection, activeLogistics: selection.activeLogistics === 'hotel' ? 'none' : 'hotel' })}
                    className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-6 ${selection.activeLogistics === 'hotel' ? 'border-purple-500 bg-purple-600/10 shadow-[0_0_40px_rgba(147,51,234,0.2)]' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-purple-600/20 flex items-center justify-center text-purple-400"><Hotel size={32} /></div>
                    <div className="text-center">
                      <h4 className="text-white font-bold text-xl">Añadir Hotel</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-2">Estancia previa al lanzamiento</p>
                    </div>
                    <div className="mt-4 px-6 py-2 rounded-full border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">{selection.hotel ? 'Modificar' : 'Añadir'}</div>
                  </button>

                  <button
                    onClick={() => setSelection({ ...selection, activeLogistics: selection.activeLogistics === 'flight' ? 'none' : 'flight' })}
                    className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-6 ${selection.activeLogistics === 'flight' ? 'border-blue-500 bg-blue-600/10 shadow-[0_0_40px_rgba(59,130,246,0.2)]' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400"><Plane size={32} /></div>
                    <div className="text-center">
                      <h4 className="text-white font-bold text-xl">Añadir Vuelo Terrestre</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-2">Conexión aérea</p>
                    </div>
                    <div className="mt-4 px-6 py-2 rounded-full border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">Añadir</div>
                  </button>

                  <button
                    onClick={() => setSelection({ ...selection, activeLogistics: selection.activeLogistics === 'transfer' ? 'none' : 'transfer' })}
                    className={`p-10 rounded-[3rem] border-2 transition-all flex flex-col items-center gap-6 ${selection.activeLogistics === 'transfer' ? 'border-green-500 bg-green-600/10 shadow-[0_0_40px_rgba(34,197,94,0.2)]' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-green-600/20 flex items-center justify-center text-green-400"><Car size={32} /></div>
                    <div className="text-center">
                      <h4 className="text-white font-bold text-xl">Añadir Traslados</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-2">Transporte</p>
                    </div>
                    <div className="mt-4 px-6 py-2 rounded-full border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">{selection.transfer ? 'Modificar' : 'Añadir'}</div>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {selection.activeLogistics === 'hotel' && (
                    <motion.div key="hotel-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-12 rounded-[4rem] bg-white/5 border border-white/5 space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2">
                          <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Ciudad de Estancia</label>
                          <select
                            value={selection.hotelSearch.city}
                            onChange={e => setSelection({ ...selection, hotelSearch: { ...selection.hotelSearch, city: e.target.value } })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-purple-500 appearance-none"
                          >
                            <option value="">Seleccionar ciudad...</option>
                            {locations.map(loc => (
                              <option key={loc.id} value={loc.id.toString()} className="bg-[#0d0a1a]">{loc.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Desde</label>
                          <input
                            type="date"
                            value={selection.hotelSearch.from}
                            min={new Date().toISOString().split('T')[0]}
                            onClick={(e) => e.currentTarget.showPicker?.()}
                            onChange={e => setSelection({ ...selection, hotelSearch: { ...selection.hotelSearch, from: e.target.value } })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-purple-500 color-scheme-dark"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Hasta</label>
                          <input
                            type="date"
                            value={selection.hotelSearch.to}
                            min={selection.hotelSearch.from || new Date().toISOString().split('T')[0]}
                            onClick={(e) => e.currentTarget.showPicker?.()}
                            onChange={e => setSelection({ ...selection, hotelSearch: { ...selection.hotelSearch, to: e.target.value } })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-purple-500 color-scheme-dark"
                          />
                        </div>
                      </div>

                      {!selection.hotelSearch.city ? (
                        <div className="py-20 text-center space-y-6 opacity-40">
                          <Hotel size={48} className="mx-auto text-slate-500 mb-4" />
                          <p className="text-slate-400 text-lg italic">Selecciona una ciudad para ver los alojamientos disponibles.</p>
                        </div>
                      ) : hotels.filter(h => h.location_id?.toString() === selection.hotelSearch.city).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {hotels.filter(h => h.location_id?.toString() === selection.hotelSearch.city).map(h => (
                            <button
                              key={h.id}
                              onClick={() => setSelection({ ...selection, hotel: selection.hotel?.id === h.id ? null : h })}
                              className={`group relative rounded-[3rem] overflow-hidden border-2 transition-all duration-500 ${selection.hotel?.id === h.id ? 'border-purple-500 scale-[1.02]' : 'border-white/5 hover:border-white/10'}`}
                            >
                              <div className="aspect-[4/5] relative">
                                <img src={h.image_url || `https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800`} alt={h.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute top-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-purple-400 border border-white/10">{h.price_per_night}€/noche</div>
                                <div className="absolute bottom-8 left-8 right-8 text-left">
                                  <h4 className="text-2xl font-bold text-white mb-2">{h.name}</h4>
                                  <p className="text-xs text-slate-300 font-light line-clamp-2">{h.description}</p>
                                </div>
                              </div>
                              {selection.hotel?.id === h.id && <div className="absolute inset-0 bg-purple-600/10 flex items-center justify-center backdrop-blur-[2px]"><Check size={48} className="text-white" /></div>}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-white/5 rounded-[3rem] text-slate-600">
                          <Hotel size={48} className="mb-4 opacity-20" />
                          <p className="text-sm font-medium italic">Introduce los detalles para buscar Hoteles...</p>
                        </div>
                      )}

                      {selection.hotel && (
                        <div className="p-8 rounded-[3rem] bg-purple-600/5 border border-purple-500/20 max-w-2xl mx-auto mt-12">
                          <h5 className="text-white font-bold mb-6 text-center">Asignar Estancia a los pasajeros</h5>
                          <div className="flex flex-wrap justify-center gap-4">
                            {selection.passengerData.map((p, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  const current = [...selection.assignedHotelPassengers];
                                  if (current.includes(idx)) {
                                    setSelection({ ...selection, assignedHotelPassengers: current.filter(i => i !== idx) });
                                  } else {
                                    setSelection({ ...selection, assignedHotelPassengers: [...current, idx] });
                                  }
                                }}
                                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selection.assignedHotelPassengers.includes(idx) ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                              >
                                {p.name || `Explorador ${idx + 1}`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {selection.activeLogistics === 'flight' && (
                    <motion.div key="flight-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-12 rounded-[4rem] bg-white/5 border border-white/5 space-y-12">
                      <div className="text-center space-y-2">
                        <h4 className="text-2xl font-bold text-white">Vuelo a la ciudad de despegue o entrenamiento</h4>
                        <p className="text-xs text-slate-500">Conecta tu ubicación actual al lugar que necesites.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="space-y-2">
                          <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Origen</label>
                          <select
                            value={selection.terrestrialSearch.origin}
                            onChange={e => setSelection({ ...selection, terrestrialSearch: { ...selection.terrestrialSearch, origin: e.target.value } })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 appearance-none"
                          >
                            <option value="">Seleccionar origen...</option>
                            {locations.map(loc => (
                              <option key={loc.id} value={loc.id.toString()} className="bg-[#0d0a1a]">{loc.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Destino</label>
                          <select
                            value={selection.terrestrialSearch.destination}
                            onChange={e => setSelection({ ...selection, terrestrialSearch: { ...selection.terrestrialSearch, destination: e.target.value } })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 appearance-none"
                          >
                            <option value="">Seleccionar destino...</option>
                            {locations.map(loc => (
                              <option key={loc.id} value={loc.id.toString()} className="bg-[#0d0a1a]">{loc.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1">Fecha</label>
                          <input
                            type="date"
                            value={selection.terrestrialSearch.date}
                            onChange={e => setSelection({ ...selection, terrestrialSearch: { ...selection.terrestrialSearch, date: e.target.value } })}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-blue-500 color-scheme-dark"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-white/5 rounded-[3rem] text-slate-600">
                        <Plane size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-medium italic">Introduce los detalles para buscar vuelos de conexión terrestres...</p>
                      </div>
                    </motion.div>
                  )}

                  {selection.activeLogistics === 'transfer' && (
                    <motion.div key="transfer-section" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="p-12 rounded-[4rem] bg-white/5 border border-white/5 space-y-12">
                      <div className="max-w-md mx-auto space-y-2">
                        <label className="text-[8px] text-slate-500 uppercase font-black tracking-widest ml-1 text-center block">Seleccionar Ciudad para Traslados</label>
                        <select
                          value={selection.transferSearch.city}
                          onChange={e => setSelection({ ...selection, transferSearch: { ...selection.transferSearch, city: e.target.value } })}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm outline-none focus:border-green-500 appearance-none text-center"
                        >
                          <option value="">Elegir ciudad...</option>
                          {locations.map(loc => (
                            <option key={loc.id} value={loc.id.toString()} className="bg-[#0d0a1a]">{loc.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-4 max-w-2xl mx-auto">
                        {selection.transferSearch.city && locations.find(l => l.id.toString() === selection.transferSearch.city)?.transport_price > 0 && (
                          <button
                            onClick={() => {
                              const loc = locations.find(l => l.id.toString() === selection.transferSearch.city);
                              const virtualTransfer = {
                                id: -1,
                                name: "Transporte Oficial Iris",
                                description: `Traslado directo desde base operativa en ${loc.name}`,
                                price: loc.transport_price,
                                location_id: loc.id
                              };
                              setSelection({ ...selection, transfer: selection.transfer?.id === -1 ? null : virtualTransfer });
                            }}
                            className={`w-full p-6 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between ${selection.transfer?.id === -1 ? 'border-green-500 bg-green-600/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                          >
                            <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selection.transfer?.id === -1 ? 'bg-green-600 text-white' : 'bg-white/5 text-slate-500'}`}><Rocket size={24} className="rotate-90" /></div>
                              <div>
                                <h4 className="text-white font-bold">Transporte Oficial Iris</h4>
                                <p className="text-xs text-slate-500">Servicio gestionado por el centro de control de {locations.find(l => l.id.toString() === selection.transferSearch.city)?.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-white">{locations.find(l => l.id.toString() === selection.transferSearch.city)?.transport_price}€</p>
                            </div>
                          </button>
                        )}

                        {transfers.filter(t => t.location_id?.toString() === selection.transferSearch.city).length > 0 ? transfers.filter(t => t.location_id?.toString() === selection.transferSearch.city).map(t => (
                          <button
                            key={t.id}
                            onClick={() => setSelection({ ...selection, transfer: selection.transfer?.id === t.id ? null : t })}
                            className={`w-full p-6 rounded-[2rem] border-2 text-left transition-all flex items-center justify-between ${selection.transfer?.id === t.id ? 'border-green-500 bg-green-600/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                          >
                            <div className="flex items-center gap-6">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selection.transfer?.id === t.id ? 'bg-green-600 text-white' : 'bg-white/5 text-slate-500'}`}><Rocket size={24} className="rotate-90" /></div>
                              <div>
                                <h4 className="text-white font-bold">{t.name}</h4>
                                <p className="text-xs text-slate-500">{t.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-white">{t.price}€</p>
                            </div>
                          </button>
                        )) : !selection.transferSearch.city ? (
                          <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-white/5 rounded-[3rem] text-slate-600">
                            <Car size={48} className="mb-4 opacity-20" />
                            <p className="text-sm font-medium italic">Introduce los detalles para buscar traslados en la ciudad elegida...</p>
                          </div>
                        ) : (
                          <div className="text-center py-10 opacity-40">
                            {!(locations.find(l => l.id.toString() === selection.transferSearch.city)?.transport_price > 0) && (
                              <p className="text-slate-500 italic text-sm">No hay traslados adicionales para esta ciudad.</p>
                            )}
                          </div>
                        )}
                      </div>
                      {selection.transfer && (
                        <div className="p-8 rounded-[3rem] bg-green-600/5 border border-green-500/20 max-w-2xl mx-auto mt-8">
                          <h5 className="text-white font-bold mb-6 text-center">Asignar Traslado a la Tripulación</h5>
                          <div className="flex flex-wrap justify-center gap-4">
                            {selection.passengerData.map((p, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  const current = [...selection.assignedTransferPassengers];
                                  if (current.includes(idx)) {
                                    setSelection({ ...selection, assignedTransferPassengers: current.filter(i => i !== idx) });
                                  } else {
                                    setSelection({ ...selection, assignedTransferPassengers: [...current, idx] });
                                  }
                                }}
                                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selection.assignedTransferPassengers.includes(idx) ? 'bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                              >
                                {p.name || `Explorador ${idx + 1}`}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="grid md:grid-cols-2 gap-6 mt-12">
                  <button
                    onClick={() => setSelection({ ...selection, addRefundInsurance: !selection.addRefundInsurance })}
                    className={`p-8 rounded-[3rem] border-2 transition-all text-left flex items-center gap-6 ${selection.addRefundInsurance ? 'border-blue-500 bg-blue-600/10' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${selection.addRefundInsurance ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white/5 text-slate-500'}`}>
                      <Shield size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Seguro de Reembolso</h4>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">+10% del Total a Pagar</p>
                    </div>
                  </button>
                </div>

                <div className="flex justify-center gap-6 mt-12">
                  <button onClick={prevStep} className="px-10 py-5 text-slate-500 uppercase font-black text-[10px] tracking-widest hover:text-white transition-colors">Volver</button>
                  <button onClick={() => setStep(6)} className="px-16 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all shadow-2xl">Revisar Reserva Final</button>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-12">
                <div className="text-center max-w-3xl mx-auto">
                  <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">Factura </h2>
                  <p className="text-slate-400 text-sm uppercase tracking-[0.3em] font-black mb-12">Detalle de Servicios y Protocolos de Lanzamiento</p>
                </div>

                {['sirius', 'polaris', 'rigel'].includes(selection.package) && (
                  <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-purple-600/10 border border-purple-500/20 flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400 shrink-0"><MessageCircle size={24} /></div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="text-purple-400 font-bold uppercase tracking-widest text-[10px] block mb-1">Pack Automatizado Activado</span>
                      Al finalizar la reserva, tu gestor personal se pondrá en contacto contigo de forma privada para agendar y coordinar con precisión las fechas de los servicios incluidos en el paquete {selection.package.charAt(0).toUpperCase() + selection.package.slice(1)}.
                    </p>
                  </div>
                )}

                <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-2xl">
                  {/* Header de la Factura */}
                  <div className="p-10 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mb-1">Localizador de Reserva</p>
                      <p className="text-2xl font-black text-white uppercase tracking-tighter">
                        {bookingMode === 'mission' ? `IRIS-ORD-BOOKING-${selection.outboundFlight?.id || '000'}` : `IRIS-SERV-BOOKING-${Math.floor(Math.random() * 1000)}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Fecha de Emisión</p>
                      <p className="text-sm font-bold text-white">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Detalle de Pasajeros y Vuelos */}
                  <div className="p-10 space-y-12">
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Pasajeros y Vuelos de Salida/Regreso</h4>
                      {selection.passengerData.map((p, idx) => {
                        const multiplier = p.seat_type === 'Supernova' ? 2.5 : 1;
                        const discount = getPassengerDiscount(p);
                        const baseOutbound = (selection.outboundFlight?.base_price || 0) * multiplier;
                        const baseReturn = (selection.returnFlight?.base_price || 0) * multiplier;
                        const discountAmount = (baseOutbound + baseReturn) * discount;

                        return (
                          <div key={idx} className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center text-[10px] font-black text-purple-400">{idx + 1}</div>
                                <p className="text-lg font-bold text-white">{p.name || `Explorador ${idx + 1}`} <span className="text-[10px] text-slate-500 font-normal ml-2">({p.seat_type})</span></p>
                              </div>
                              <p className="text-lg font-bold text-white">{((baseOutbound + baseReturn) * (1 - discount)).toLocaleString()}€</p>
                            </div>

                            <div className="pl-11 space-y-2">
                              {bookingMode === 'mission' && (
                                <>
                                  <div className="flex justify-between text-[10px] text-slate-400">
                                    <span>Vuelo de Salida ({selection.outboundFlight?.origin_name} → {selection.outboundFlight?.destination_name})</span>
                                    <span>{baseOutbound.toLocaleString()}€</span>
                                  </div>
                                  {selection.returnFlight && (
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                      <span>Vuelo de Regreso ({selection.returnFlight.origin_name} → {selection.returnFlight.destination_name})</span>
                                      <span>{baseReturn.toLocaleString()}€</span>
                                    </div>
                                  )}
                                </>
                              )}
                              {discount > 0 && (
                                <div className="flex justify-between text-[10px] text-green-400 font-bold italic">
                                  <span>Descuento por Antigüedad (Fidelidad 10%)</span>
                                  <span>{discountAmount.toLocaleString()}€</span>
                                </div>
                              )}
                              {p.training_mode === 'request' && (
                                <div className="flex justify-between text-[10px] text-purple-400">
                                  <span>Gestión Iris Training</span>
                                  <span>{(tariffs.training || 50000).toLocaleString()}€</span>
                                </div>
                              )}
                              {p.passport_mode === 'request' && (
                                <div className="flex justify-between text-[10px] text-indigo-400">
                                  <span>Gestión Pasaporte Estelar</span>
                                  <span>{(tariffs.passport_management || 2500).toLocaleString()}€</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Logística Terrestre */}
                    {(selection.hotel || selection.transfer || selection.addAirTransfer) && (
                      <div className="space-y-6 pt-12 border-t border-white/5">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Logística y Traslados Terrestres</h4>

                        {selection.hotel && (
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-bold text-white">{selection.hotel.name}</p>
                              <p className="text-[10px] text-slate-500">{getNights()} noches • {selection.assignedHotelPassengers.length} pasajeros asignados</p>
                            </div>
                            <p className="text-lg font-bold text-amber-400">{(selection.hotel.price_per_night * getNights() * selection.assignedHotelPassengers.length).toLocaleString()}€</p>
                          </div>
                        )}

                        {selection.transfer && (
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-bold text-white">{selection.transfer.name}</p>
                              <p className="text-[10px] text-slate-500">{selection.assignedTransferPassengers.length} pasajeros asignados</p>
                            </div>
                            <p className="text-lg font-bold text-green-400">{(selection.transfer.price * selection.assignedTransferPassengers.length).toLocaleString()}€</p>
                          </div>
                        )}

                        {selection.addAirTransfer && (
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-bold text-white">Vuelos Terrestres (Conexión Base)</p>
                              <p className="text-[10px] text-slate-500">{selection.passengerData.length} pasajeros asignados</p>
                            </div>
                            <p className="text-lg font-bold text-blue-400">{(1500 * selection.passengerData.length).toLocaleString()}€</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer de la Factura (Total) */}
                  <div className="p-12 bg-white/[0.03] border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Total Facturado</p>
                      <p className="text-6xl font-black text-white tracking-tighter">{getTotal().toLocaleString()}€</p>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={prevStep} className="px-8 py-4 text-slate-500 uppercase font-black text-[10px] tracking-widest hover:text-white transition-colors">Volver</button>
                      <button onClick={handleBooking} disabled={isCreating} className="px-12 py-5 bg-purple-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-purple-500 transition-all shadow-[0_0_40px_rgba(147,51,234,0.3)] disabled:opacity-50">
                        {isCreating ? 'Procesando Misión...' : 'Confirmar Reserva'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-12 text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-40">
                  <span className="flex items-center gap-2"><Shield size={14} /> Pago Seguro</span>
                  <span className="flex items-center gap-2"><Globe size={14} /> Jurisdiccion de Naciones Unidas del Espacio</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-[#06040d]">
      <Starfield />
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="text-purple-500 animate-spin" size={48} /></div>}>
        <BookingContent />
      </Suspense>
    </main>
  );
}
