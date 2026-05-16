"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { MessageCircle, Calendar, Video, Phone, Send, Loader2, User, Check, Clock, Globe, ShieldCheck, MessageSquare } from "lucide-react";
import { irisApi } from "@/lib/api";
import { Message, ManagerProfile } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function MiGestorPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [manager, setManager] = useState<ManagerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [availability, setAvailability] = useState<{ date: string, time: string, full: string }[]>([]);
  const [meetingType, setMeetingType] = useState<'videollamada' | 'llamada'>('videollamada');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const taskProcessed = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const anyModalOpen = showCalendar || showConfirmModal || cancellingId;
    if (anyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showCalendar, showConfirmModal, cancellingId]);

  const upcomingMeetings = (messages || []).filter(msg => {
    const isMeetingType = msg.type === 'videollamada' || msg.type === 'llamada';
    const hasProgramada = (msg.notes || "").toUpperCase().includes('PROGRAMADA');
    return isMeetingType || hasProgramada;
  }).map(msg => {
    const dateMatch = (msg.notes || "").match(/(\d{4}-\d{2}-\d{2})[T\s](\d{2}:\d{2})/);
    let fecha: Date;
    let hora: string;
    let isPast = false;

    if (dateMatch) {
      fecha = new Date(`${dateMatch[1]}T${dateMatch[2]}`);
      hora = dateMatch[2];
    } else {
      fecha = new Date(msg.created_at);
      hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    isPast = fecha < hoy;

    return { ...msg, fecha, hora, isPast };
  }).sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    async function loadData() {
      if (!session?.user) return;
      const token = (session.user as any).accessToken;
      try {
        const [msgData, managerData] = await Promise.all([
          irisApi.getMessages(token),
          irisApi.getManagerProfile(token)
        ]);
        setMessages(msgData.datos || []);
        setManager(managerData);
      } catch (error) {
        console.error("Error cargando datos del gestor:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [session]);

  // -- Task Handling (Antares) --
  useEffect(() => {
    if (!session?.user || taskProcessed.current) return;
    
    const newTask = searchParams.get("new_task");
    if (newTask === "contact_gestor") {
      taskProcessed.current = true;
      const token = (session.user as any).accessToken;

      const runTask = async () => {
        try {
          await irisApi.createManagerTask(token, {
            title: `URGENTE: Contacto Cliente Antares`,
            type: 'booking_request',
            client_name: session.user?.name || "Cliente Iris",
            description: `SOLICITUD DE ALTA PRIORIDAD DESDE BOOKING.\nEstado: Pendiente de contacto inicial.`,
            priority: 'high'
          });
        } catch (err) {
          console.error("Error al crear la tarea automática:", err);
        }
      };
      runTask();
    }
  }, [session, searchParams]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !session?.user) return;

    setSending(true);
    const token = (session.user as any).accessToken;
    try {
      const response = await irisApi.sendMessage(token, newMessage);
      setMessages([...messages, response.mensaje]);
      setNewMessage("");
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    } finally {
      setSending(false);
    }
  };

  const handleSchedule = async () => {
    if (!selectedSlot || !session?.user) return;
    const token = (session.user as any).accessToken;

    let jitsiUrl = "";
    if (meetingType === 'videollamada') {
      jitsiUrl = `https://meet.jit.si/iris-verification-${(session.user as any).id}-${selectedSlot.replace(/:/g, '-')}`;
    }

    const notas = `REUNIÓN PROGRAMADA: ${selectedSlot}\n${meetingType === 'videollamada' ? 'Videollamada de verificación' : 'Llamada telefónica'}`;

    try {
      setSending(true);
      const res = await irisApi.sendMessage(token, notas, meetingType, jitsiUrl);
      setMessages([...messages, res.mensaje]);
      setShowConfirmModal(false);
      setShowCalendar(false);
      setSelectedSlot(null);
    } catch (error) {
      console.error("Error programando:", error);
    } finally {
      setSending(false);
    }
  };

  const handleCancelMeeting = async () => {
    if (!cancellingId || !session?.user) return;
    const token = (session.user as any).accessToken;
    try {
      await irisApi.cancelMeeting(token, cancellingId);
      setMessages(messages.filter(m => m.id !== cancellingId));
      setCancellingId(null);
    } catch (error) {
      console.error("Error cancelando reunión:", error);
    }
  };

  const openBooking = async () => {
    if (!session?.user) return;
    const token = (session.user as any).accessToken;
    setShowCalendar(true);
    setLoadingSlots(true);
    try {
      const data = await irisApi.getAvailability(token);
      setAvailability(data.slots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="text-purple-500 animate-spin mb-4" />
        <p className="mono-text text-[10px] uppercase tracking-[0.3em] text-slate-500">Conectando con terminal de asistencia...</p>
      </div>
    );
  }
  return (
    <div className="animate-fade-in space-y-10 pb-20 max-w-6xl mx-auto">

      {/* Header & Manager Info */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white border-4 border-[#06040d] shadow-2xl relative z-10">
              {manager?.name?.split(' ').map(n => n[0]).join('') || "..."}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-[#06040d] rounded-full z-20 shadow-lg" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="mono-text text-[8px] uppercase tracking-widest text-green-400">Gestor En Línea</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">{manager?.name || "Asignando gestor..."}</h1>
            <p className="text-slate-500 text-sm font-light mt-1">Tu gestor estará disponible para ayudarte con cualquier duda o consulta que tengas.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={openBooking}
            className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-purple-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-900/20"
          >
            Agendar Nueva Cita
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Chat */}
        <div className="lg:col-span-2 flex flex-col h-[600px] card-purple rounded-[3rem] overflow-hidden border-white/5">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle size={18} className="text-purple-400" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Canal Asíncrono de Seguridad</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
              <ShieldCheck size={12} className="text-purple-400" />
              <span className="text-[8px] uppercase tracking-widest text-slate-500">Encriptación E2EE Activa</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-[url('/img/stars_bg.png')] bg-fixed">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-700 mb-6">
                  <MessageSquare size={32} />
                </div>
                <h4 className="text-white font-bold mb-2">Comienza la conversación</h4>
                <p className="text-slate-500 text-xs font-light max-w-xs">Cualquier duda sobre tus tramites, entrenamiento o vuelo será resuelta por tu gestor aquí.</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex flex-col ${msg.sender_type === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.sender_type === 'manager' && msg.type !== 'nota_cliente' && (
                      <div className="flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                        {msg.type === 'llamada' && <span className="text-[9px] font-black text-amber-400 tracking-[0.1em]">LLAMADA</span>}
                        {msg.type === 'videollamada' && <span className="text-[9px] font-black text-blue-400 tracking-[0.1em]">VIDEOLLAMADA</span>}
                        {msg.type === 'email' && <span className="text-[9px] font-black text-emerald-400 tracking-[0.1em]">EMAIL</span>}
                        {msg.type === 'otro' && <span className="text-[9px] font-black text-slate-400 tracking-[0.1em]">NOTA</span>}
                      </div>
                    )}

                    <div className={`p-6 rounded-3xl text-sm leading-relaxed ${msg.sender_type === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-none shadow-xl shadow-purple-900/40'
                      : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5 backdrop-blur-2xl ring-1 ring-white/5'
                      }`}>
                      <div className="whitespace-pre-wrap font-light">{msg.notes}</div>

                      {msg.type === 'videollamada' && msg.zoom_link && (
                        <div className="mt-5 pt-5 border-t border-white/10">
                          <a
                            href={msg.zoom_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl transition-all font-bold text-[10px] uppercase tracking-[0.2em] group shadow-lg shadow-blue-900/20"
                          >
                            <Video size={16} className="group-hover:scale-110 transition-transform" />
                            Entrar a la Sala
                          </a>
                        </div>
                      )}
                    </div>

                    <span className="text-[7px] text-slate-600 mt-3 uppercase tracking-[0.3em] flex items-center gap-2 font-mono">
                      {new Date(msg.created_at).toLocaleDateString([], { day: '2-digit', month: '2-digit' })} — {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.sender_type === 'user' && <Check size={10} className="text-purple-500" />}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-6 border-t border-white/5 bg-white/[0.02]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje a tu gestor..."
                className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-16 py-4 text-sm text-white outline-none focus:border-purple-500/50 transition-all"
              />
              <button
                disabled={!newMessage.trim() || sending}
                className="absolute right-2 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all disabled:opacity-20"
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </form>
        </div>

        {/* Info Column */}
        <div className="space-y-8">
          <div className="card-purple p-8 rounded-[2.5rem] border-white/5 bg-white/[0.02]">
            <h4 className="text-white font-bold mb-6 flex items-center gap-2">
              <Clock size={16} className="text-purple-400" /> Disponibilidad
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                <span className="text-slate-500">Lunes - Viernes</span>
                <span className="text-slate-300 font-bold">09:00 - 18:00</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                <span className="text-slate-500">Sábados</span>
                <span className="text-slate-300 font-bold">Emergencias</span>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-[10px] text-slate-500 leading-relaxed font-light italic">
                "Mi objetivo es asegurar que tu transición de la Tierra a la órbita sea impecable. No dudes en consultarme cualquier detalle logístico."
              </p>
            </div>
          </div>

          {/* Panel de Próximas Citas */}
          <div className="card-purple p-8 rounded-[2.5rem] bg-linear-to-br from-indigo-900/20 to-transparent border-indigo-500/20">
            <Calendar size={32} className="text-indigo-400 mb-6" />
            <h4 className="text-white font-bold mb-2">Próximas Citas</h4>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest mb-6">Agenda de Verificación Estelar</p>

            <div className="space-y-4 mb-8">
              {upcomingMeetings.filter(m => !m.isPast).length > 0 ? (
                upcomingMeetings.filter(m => !m.isPast).map(msg => (
                  <div key={msg.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                        {(msg.type === 'videollamada' || msg.notes.toLowerCase().includes('video')) ? 'Video' : 'Llamada'}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">{msg.hora}</span>
                    </div>
                    <p className="text-white text-[11px] font-bold mb-3 capitalize">
                      {msg.fecha.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    {((msg.type === 'videollamada' || msg.notes.toLowerCase().includes('video')) || msg.zoom_link) && (
                      <a
                        href={msg.zoom_link || msg.notes.match(/https?:\/\/[^\s\]]+/)?.[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white transition-colors"
                      >
                        Unirse a sala <Globe size={10} />
                      </a>
                    )}

                    <button
                      onClick={() => setCancellingId(msg.id)}
                      className="mx-4 text-[8px] font-bold uppercase tracking-widest text-red-400/50 hover:text-red-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Sin citas programadas</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
      {mounted && typeof document !== 'undefined' && createPortal(
        <>
          <AnimatePresence>
            {showCalendar && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowCalendar(false)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-md w-full h-full"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-md card-purple p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
                >
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Agendar Cita</h3>
                  <p className="text-slate-500 text-[10px] md:text-xs font-light mb-8">El sistema solo muestra huecos disponibles en horario de tu gestor (L-V, 09:00-18:00).</p>

                  <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-2xl border border-white/10">
                    <button
                      onClick={() => setMeetingType('videollamada')}
                      className={`flex-1 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${meetingType === 'videollamada' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                      <Video size={12} className="inline mr-2" /> Video
                    </button>
                    <button
                      onClick={() => setMeetingType('llamada')}
                      className={`flex-1 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${meetingType === 'llamada' ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                      <Phone size={12} className="inline mr-2" /> Llamada
                    </button>
                  </div>

                  {loadingSlots ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 size={32} className="text-purple-500 animate-spin mb-4" />
                      <p className="text-[8px] uppercase tracking-widest text-slate-500">Consultando agenda...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 mb-10 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                      {availability.map(slot => (
                        <button
                          key={slot.full}
                          onClick={() => setSelectedSlot(slot.full)}
                          className={`p-4 rounded-2xl text-[9px] uppercase tracking-widest font-bold transition-all border flex flex-col items-center gap-1 ${selectedSlot === slot.full
                            ? 'bg-purple-600 border-purple-600 text-white shadow-lg'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-purple-500/50 hover:text-white'
                            }`}
                        >
                          <span className="opacity-50">{new Date(slot.date).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                          <span className="text-xs">{slot.time}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="flex-1 py-4 text-slate-500 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      disabled={!selectedSlot}
                      onClick={() => setShowConfirmModal(true)}
                      className="flex-1 py-4 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all disabled:opacity-20"
                    >
                      Continuar
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Confirmation Modal */}
          <AnimatePresence>
            {showConfirmModal && (
              <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowConfirmModal(false)}
                  className="absolute inset-0 bg-black/90 backdrop-blur-xl w-full h-full"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative w-full max-w-sm card-purple p-10 rounded-[3rem] border-white/10 text-center shadow-2xl"
                >
                  <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    {meetingType === 'videollamada' ? <Video className="text-purple-400" size={32} /> : <Phone className="text-purple-400" size={32} />}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">¿Confirmar Cita?</h3>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-8">Resumen de Verificación</p>
                  <div className="space-y-4 mb-10 text-left bg-white/5 p-6 rounded-3xl border border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Tipo</span>
                      <span className="text-[10px] text-white font-black uppercase">{meetingType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Fecha</span>
                      <span className="text-[10px] text-white font-black">{selectedSlot && new Date(selectedSlot.split('T')[0]).toLocaleDateString([], { day: 'numeric', month: 'long' })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Hora</span>
                      <span className="text-[10px] text-white font-black">{selectedSlot?.split('T')[1]}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      disabled={sending}
                      onClick={handleSchedule}
                      className="w-full py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all shadow-xl shadow-purple-900/20 flex items-center justify-center gap-2"
                    >
                      {sending ? <Loader2 className="animate-spin" size={14} /> : 'Confirmar Reserva'}
                    </button>
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="w-full py-4 text-slate-500 text-[9px] uppercase font-bold tracking-widest hover:text-white transition-colors"
                    >
                      Volver atrás
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {cancellingId && (
              <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 overflow-hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setCancellingId(null)}
                  className="absolute inset-0 bg-red-950/40 backdrop-blur-xl w-full h-full"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative w-full max-w-xs card-purple p-8 rounded-[2rem] border-red-500/10 text-center shadow-2xl"
                >
                  <h3 className="text-lg font-bold text-white mb-4">¿Cancelar Reunión?</h3>
                  <p className="text-slate-400 text-[10px] leading-relaxed mb-8 uppercase tracking-widest">
                    Esta acción eliminará la cita de tu agenda de forma permanente.
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleCancelMeeting}
                      className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold text-[9px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/20"
                    >
                      Confirmar Cancelación
                    </button>
                    <button
                      onClick={() => setCancellingId(null)}
                      className="w-full py-3 text-slate-500 text-[9px] uppercase font-bold tracking-widest hover:text-white transition-colors"
                    >
                      Mantener Cita
                    </button>
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
