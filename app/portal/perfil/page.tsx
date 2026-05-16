"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { User, Mail, Lock, Eye, EyeOff, ShieldAlert, Loader2, Trash2, CheckCircle2, ChevronRight, Settings } from "lucide-react";
import { irisApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function PerfilPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      if (!session?.user) return;
      setLoading(true);
      const token = (session.user as any).accessToken;
      try {
        const data = await irisApi.getProfile(token);
        setProfileData({
          name: data.name || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Error cargando perfil:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [session]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!session?.user) return;
    const token = (session.user as any).accessToken;

    try {
      await irisApi.updateProfile(token, profileData);
      await update({ name: profileData.name });
      setSuccess("Perfil actualizado correctamente.");
    } catch (err: any) {
      setError(err.message || "Error al actualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!session?.user) return;
    const token = (session.user as any).accessToken;

    try {
      await irisApi.changePassword(token, {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
      });
      setSuccess("Contraseña actualizada correctamente.");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err.message || "Error al cambiar contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "ELIMINAR") return;

    setLoading(true);
    if (!session?.user) return;
    const token = (session.user as any).accessToken;

    try {
      await irisApi.deleteAccount(token);
      signOut({ callbackUrl: "/" });
    } catch (err: any) {
      setError(err.message || "Error al eliminar cuenta.");
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-10 pb-32 max-w-4xl mx-auto">
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
          <Settings size={10} className="text-purple-400" />
          <span className="mono-text text-[8px] uppercase tracking-widest text-purple-300">Configuración de Terminal</span>
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tight">Mi <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-400 italic">Perfil</span></h1>
        <p className="text-slate-500 mt-2 text-sm font-light">Gestiona tus credenciales y preferencias de seguridad.</p>
      </header>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400"
          >
            <CheckCircle2 size={18} />
            <p className="text-xs font-medium">{success}</p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400"
          >
            <ShieldAlert size={18} />
            <p className="text-xs font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="card-purple p-10 rounded-[3rem] space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-purple-400 border border-white/10">
              <User size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Datos Personales</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Nombre Completo</label>
              <div className="relative">
                <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="text"
                  value={profileData.name}
                  onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-10 pr-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Correo Electrónico</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="email"
                  disabled
                  value={profileData.email}
                  className="w-full bg-white/5 border border-white/10 text-slate-500 rounded-2xl pl-10 pr-5 py-4 text-sm outline-none opacity-50"
                />
              </div>
            </div>
            <button
              disabled={loading}
              className="w-full py-4 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all disabled:opacity-20 shadow-xl"
            >
              {loading ? "Actualizando..." : "Guardar Cambios"}
            </button>
          </form>
        </div>

        <div className="card-purple p-10 rounded-[3rem] space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber-400 border border-white/10">
              <Lock size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">Contraseña</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Contraseña Actual</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-10 pr-12 py-4 text-sm focus:border-purple-500/50 outline-none transition-all"
                />
                <button
                  type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Nueva Contraseña</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type={showNew ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-10 pr-12 py-4 text-sm focus:border-purple-500/50 outline-none transition-all"
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest block pl-2">Confirmar Contraseña</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-10 pr-5 py-4 text-sm focus:border-purple-500/50 outline-none transition-all"
                  placeholder="Repite la contraseña"
                />
              </div>
            </div>
            <button
              disabled={loading || !passwordData.newPassword}
              className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-20"
            >
              {loading ? "Procesando..." : "Actualizar"}
            </button>
          </form>
        </div>

      </div>

      <div className="card-purple p-12 rounded-[3rem] border-red-500/20 bg-red-500/[0.02] flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldAlert size={24} className="text-red-500" />
            <h3 className="text-2xl font-bold text-white uppercase tracking-tighter">Eliminar Cuenta</h3>
          </div>
          <p className="text-slate-500 text-sm font-light leading-relaxed max-w-lg">
            La eliminación de la cuenta es un proceso irreversible. Se perderan todos los datos asociados a la cuenta.
          </p>
        </div>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-10 py-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-900/10"
        >
          Eliminar Cuenta Permanentemente
        </button>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-[#06040d]/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md card-purple p-12 rounded-[3.5rem] border-red-500/30 shadow-2xl"
            >
              <ShieldAlert size={48} className="text-red-500 mb-8 mx-auto" />
              <h3 className="text-3xl font-bold text-white text-center mb-4 tracking-tight">¿Estás absolutamente seguro?</h3>
              <p className="text-slate-400 text-center text-sm font-light mb-8 leading-relaxed">
                Para confirmar la eliminación permanente de tu cuenta y todos tus datos, escribe <span className="text-white font-bold">ELIMINAR</span> a continuación.
              </p>

              <input
                type="text"
                placeholder="Escribe ELIMINAR"
                value={deleteConfirmation}
                onChange={e => setDeleteConfirmation(e.target.value)}
                className="w-full bg-red-500/5 border border-red-500/20 text-white rounded-2xl px-6 py-4 text-center text-sm focus:border-red-500 outline-none transition-all mb-8"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-4 text-slate-500 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  disabled={deleteConfirmation !== "ELIMINAR" || loading}
                  onClick={handleDeleteAccount}
                  className="flex-1 py-4 bg-red-500 text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-20 shadow-2xl shadow-red-900/20"
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
