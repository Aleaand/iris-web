"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Users, Plus, Loader2, User, CreditCard, Trash2, ShieldCheck, AlertCircle, ShieldAlert, CheckCircle2, Pencil } from "lucide-react";
import { irisApi } from "@/lib/api";
import { Passenger } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function PasajerosPage() {
  const { data: session } = useSession();
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    primarylastname: "",
    secondarylastname: "",
    document_number: "",
    document_country: "ESP",
    birth_date: "",
    blood_type: "",
    allergies: "",
    physical_fitness: "No apto",
    iris_passport_number: "",
    iris_passport_expiration: "",
    training_certificate_date: "",
  });
  const [complianceAccepted, setComplianceAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    action: () => void;
    type: 'danger' | 'info';
  }>({
    show: false,
    title: "",
    message: "",
    action: () => { },
    type: 'info'
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    async function loadPassengers() {
      if (!session?.user) return;
      const token = (session.user as any).accessToken;
      try {
        const data = await irisApi.getPassengers(token);
        setPassengers(data.datos || []);
      } catch (error) {
        console.error("Error loading passengers:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPassengers();
  }, [session]);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!session?.user) return;
    const age = calculateAge(formData.birth_date);
    if (age < 18) {
      setError("No se permite el registro de menores de 18 años.");
      return;
    }

    if (!editingId && !complianceAccepted) {
      setError("Es obligatorio aceptar el tratamiento de datos y el Protocolo Iris para continuar.");
      return;
    }

    if (editingId) {
      setConfirmModal({
        show: true,
        title: "Actualizar Documentación",
        message: "¿Confirmas la actualización de la documentación de este pasajero?",
        type: 'info',
        action: () => executeSubmit()
      });
    } else {
      executeSubmit();
    }
  };

  const executeSubmit = async () => {
    setConfirmModal(prev => ({ ...prev, show: false }));
    setProcessing(true);
    const token = (session!.user as any).accessToken;
    try {
      if (editingId) {
        const response = await irisApi.updatePassenger(token, editingId, formData);
        setPassengers(passengers.map(p => p.id === editingId ? (response.datos || response) : p));
        setEditingId(null);
      } else {
        const response = await irisApi.createPassenger(token, formData);
        setPassengers([...passengers, response.pasajero || response.datos || response]);
        setShowForm(false);
      }

      setFormData({
        name: "", primarylastname: "", secondarylastname: "",
        document_number: "", document_country: "ESP", birth_date: "",
        blood_type: "", allergies: "", physical_fitness: "No apto",
        iris_passport_number: "", iris_passport_expiration: "", training_certificate_date: ""
      });
      setComplianceAccepted(false);
    } catch (error: any) {
      setError(error.message || "Error al procesar pasajero.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!session?.user) {
      console.error("No hay sesión activa para realizar la eliminación.");
      return;
    }

    setConfirmModal({
      show: true,
      title: "Baja del Manifiesto",
      message: "¿Confirmas la eliminación definitiva de este pasajero? Esta acción no se puede deshacer.",
      type: 'danger',
      action: async () => {
        setConfirmModal(prev => ({ ...prev, show: false }));

        const token = (session.user as any).accessToken;
        try {
          await irisApi.deletePassenger(token, id);
          console.log("Pasajero eliminado con éxito del servidor.");
          setPassengers(prev => prev.filter(p => p.id !== id));
        } catch (error: any) {
          console.error("Fallo en la eliminación:", error);
          setError(error.message || "No se puede eliminar este pasajero con reservas activas.");
        }
      }
    });
  };

  const handleEdit = (p: Passenger) => {
    setEditingId(p.id);
    setFormData({
      name: p.name || "",
      primarylastname: p.primarylastname || "",
      secondarylastname: p.secondarylastname || "",
      document_number: p.document_number || "",
      document_country: p.document_country || "ESP",
      birth_date: p.birth_date ? p.birth_date.split('T')[0] : "",
      blood_type: p.blood_type || "",
      allergies: p.allergies || "",
      physical_fitness: p.physical_fitness || "No apto",
      iris_passport_number: p.iris_passport_number || "",
      iris_passport_expiration: p.iris_passport_expiration ? p.iris_passport_expiration.split('T')[0] : "",
      training_certificate_date: p.training_certificate_date ? p.training_certificate_date.split('T')[0] : "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="text-purple-500 animate-spin mb-4" />
        <p className="mono-text text-[10px] uppercase tracking-[0.3em] text-slate-500">Cargando lista de pasajeros...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10 pb-20">

      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
            <Users size={10} className="text-purple-400" />
            <span className="mono-text text-[8px] uppercase tracking-widest text-purple-300">Lista de Pasajeros</span>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Mis <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400 italic">Pasajeros</span>
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-light">Gestiona los pasajeros que viajarán contigo en tus misiones.</p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            if (editingId) {
              setEditingId(null);
              setFormData({
                name: "", primarylastname: "", secondarylastname: "",
                document_number: "", document_country: "ESP", birth_date: "",
                blood_type: "", allergies: "", physical_fitness: "No apto",
                iris_passport_number: "", iris_passport_expiration: "", training_certificate_date: ""
              });
            }
          }}
          className={`flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all shadow-2xl ${showForm
            ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
            : "bg-white text-black hover:bg-purple-600 hover:text-white"
            }`}
        >
          {showForm ? "Cerrar Formulario" : <><Plus size={14} /> Añadir Pasajero</>}
        </button>
      </header>

      {/* Notificaciones Globales */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-5 rounded-[2rem] bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-400 shadow-2xl shadow-red-500/5"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-1">Alerta de Seguridad</p>
              <p className="text-[10px] font-light leading-relaxed opacity-80">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="p-2 hover:bg-white/5 rounded-lg transition-all">
              <Loader2 className="rotate-45" size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formulario con Validación de Edad y Compliance */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card-purple p-10 rounded-[3rem] border-purple-500/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Users size={120} />
            </div>

            <h2 className="text-2xl font-bold text-white mb-8">
              {editingId ? `Editando a ${formData.name}` : "Registro de Nuevo Pasajero"}
            </h2>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Nombre *</label>
                  <input
                    required
                    disabled={!!editingId}
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Ej: Marc"
                  />
                </div>
                <div className="space-y-2">
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Primer Apellido *</label>
                  <input
                    required
                    disabled={!!editingId}
                    value={formData.primarylastname}
                    onChange={e => setFormData({ ...formData, primarylastname: e.target.value })}
                    className={`w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Ej: Ribas"
                  />
                </div>
                <div className="space-y-2">
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Segundo Apellido</label>
                  <input
                    value={formData.secondarylastname}
                    onChange={e => setFormData({ ...formData, secondarylastname: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all"
                    placeholder="Ej: Costa"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Nº Identificación *</label>
                  <input
                    required
                    disabled={!!editingId}
                    value={formData.document_number}
                    onChange={e => setFormData({ ...formData, document_number: e.target.value })}
                    className={`w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Ej: 12345678Z"
                  />
                </div>
                <div className="space-y-2">
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">País del Documento *</label>
                  <select
                    disabled={!!editingId}
                    value={formData.document_country}
                    onChange={e => setFormData({ ...formData, document_country: e.target.value })}
                    className={`w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all appearance-none ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="ESP">España (ESP)</option>
                    <option value="USA">EE.UU. (USA)</option>
                    <option value="GBR">Reino Unido (GBR)</option>
                    <option value="FRA">Francia (FRA)</option>
                    <option value="DEU">Alemania (DEU)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Fecha de Nacimiento *</label>
                  <input
                    required
                    disabled={!!editingId}
                    type="date"
                    value={formData.birth_date}
                    onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                    className={`w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all color-scheme-dark ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Tipo de Sangre</label>
                  <select
                    value={formData.blood_type}
                    onChange={e => setFormData({ ...formData, blood_type: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all appearance-none"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Aptitud Física</label>
                  <select
                    value={formData.physical_fitness}
                    onChange={e => setFormData({ ...formData, physical_fitness: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all appearance-none"
                  >
                    <option value="No apto">No apto</option>
                    <option value="Apto">Apto</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Alergias</label>
                  <input
                    value={formData.allergies}
                    onChange={e => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all"
                    placeholder="Ninguna / Polen / Penicilina..."
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-6">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={16} /> Documentación de Expedición
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Nº Pasaporte Iris</label>
                    <input
                      value={formData.iris_passport_number}
                      onChange={e => setFormData({ ...formData, iris_passport_number: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all"
                      placeholder="Ej: IRIS-XXXX-XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Expiración Pasaporte</label>
                    <input
                      type="date"
                      value={formData.iris_passport_expiration}
                      onChange={e => setFormData({ ...formData, iris_passport_expiration: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all color-scheme-dark"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Fecha Certificado Training</label>
                    <input
                      type="date"
                      value={formData.training_certificate_date}
                      onChange={e => setFormData({ ...formData, training_certificate_date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all color-scheme-dark"
                    />
                  </div>
                </div>
              </div>

              {!editingId && (
                <div className="pt-4">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-1">
                      <input
                        type="checkbox"
                        checked={complianceAccepted}
                        onChange={e => setComplianceAccepted(e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-md border transition-all ${complianceAccepted ? 'bg-purple-600 border-purple-600' : 'bg-white/5 border-white/20 group-hover:border-purple-500/50'}`}>
                        {complianceAccepted && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 leading-relaxed font-light">
                      Acepto el tratamiento de datos y de seguridad para el <span className="text-purple-400 font-bold">Protocolo Iris</span>. Entiendo que los datos serán cruzados con agencias de seguridad internacional para la validación del vuelo orbital.
                    </span>
                  </label>
                </div>
              )}



              <div className="flex flex-col md:flex-row gap-4">
                <button
                  disabled={processing}
                  className="w-full md:w-auto px-12 py-5 bg-white text-black rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50 shadow-xl shadow-purple-900/10"
                >
                  {processing ? "Sincronizando..." : (editingId ? "Actualizar Datos de Tripulante" : "Validar y Guardar Pasajero")}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setShowForm(false);
                      setFormData({
                        name: "", primarylastname: "", secondarylastname: "",
                        document_number: "", document_country: "ESP", birth_date: "",
                        blood_type: "", allergies: "", physical_fitness: "No apto",
                        iris_passport_number: "", iris_passport_expiration: "", training_certificate_date: ""
                      });
                    }}
                    className="w-full md:w-auto px-12 py-5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {passengers.map(p => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-purple p-8 rounded-[2.5rem] flex flex-col justify-between group transition-all hover:border-purple-500/40 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/5 blur-[40px]" />

            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <User size={28} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-700 hover:text-purple-400 hover:bg-purple-500/10 transition-all"
                  title="Editar datos y documentación"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p.id);
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:text-red-400 hover:bg-red-500/10 transition-all relative z-20"
                  title="Eliminar del manifiesto"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-1 mb-8 relative z-10">
              <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">{p.name} {p.primarylastname}</h3>
              <p className="text-slate-500 text-[10px] font-light mono-text uppercase tracking-widest">ID: {p.document_number}</p>
              <p className="text-slate-600 text-[9px] uppercase tracking-widest">Nacimiento: {new Date(p.birth_date).toLocaleDateString()}</p>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {p.ofac_status === 'Limpiado' || p.ofac_status === 'Clean' ? (
                  <>
                    <ShieldCheck size={14} className="text-green-400" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-green-400">
                      OFAC Clear
                    </span>
                  </>
                ) : null}
              </div>

              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Pasajero</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {passengers.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 bg-white/[0.01] border border-dashed border-white/10 rounded-[4rem]"
        >
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-700">
            <Users size={32} />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Manifiesto Vacío</h3>
          <p className="text-slate-600 text-sm font-light max-w-xs mx-auto">Registra a tus pasajeros para poder incluirlos en tus próximas reservas orbitales.</p>
        </motion.div>
      )}

      <AnimatePresence>
        {confirmModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-md p-8 rounded-[2.5rem] border backdrop-blur-md shadow-2xl ${confirmModal.type === 'danger'
                ? 'bg-red-500/5 border-red-500/20 shadow-red-500/10'
                : 'bg-purple-500/5 border-purple-500/20 shadow-purple-500/10'
                }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${confirmModal.type === 'danger' ? 'bg-red-500/10 text-red-400' : 'bg-purple-500/10 text-purple-400'
                }`}>
                {confirmModal.type === 'danger' ? <ShieldAlert size={32} /> : <AlertCircle size={32} />}
              </div>

              <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{confirmModal.title}</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed mb-8">
                {confirmModal.message}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmModal.action}
                  className={`flex-1 py-4 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all ${confirmModal.type === 'danger'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                  className="flex-1 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
