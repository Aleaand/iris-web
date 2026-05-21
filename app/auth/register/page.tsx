"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Lock, AlertCircle, Rocket, CheckCircle2, Eye, EyeOff, Calendar, Phone } from "lucide-react";
import { irisApi } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    email: "",
    phone: "",
    birth_date: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [compliance, setCompliance] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (!compliance) {
      setError("Debes aceptar el tratamiento de datos para continuar.");
      setLoading(false);
      return;
    }

    try {
      await irisApi.register({
        nombre: formData.nombre,
        apellido1: formData.apellido1,
        apellido2: formData.apellido2,
        email: formData.email,
        phone: formData.phone,
        birth_date: formData.birth_date,
        password: formData.password,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Error al registrar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#110e20] flex items-center justify-center px-6 py-20">      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-indigo-600/10 aurora-blur rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/">
            <Image src="/img/logo_iris.png" alt="Iris" width={48} height={48} className="object-contain mb-4" />
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Enbarcate en esta misión</h1>
          <p className="text-slate-500 mt-2 text-sm font-light">Inicia tu viaje interplanetario hoy mismo</p>
        </div>

        {/* Card */}
        <div className="card-purple p-8 md:p-12 rounded-[2.5rem]">
          {success ? (
            <div className="text-center py-10 animate-fade-in">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">¡Registro completado!</h2>
              <p className="text-slate-400 text-sm">Redirigiéndote al acceso en unos segundos...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre y Apellidos */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                      <User size={10} /> Nombre
                    </label>
                    <input
                      type="text" required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest mb-2 block">1º Apellido</label>
                      <input
                        type="text" required
                        value={formData.apellido1}
                        onChange={(e) => setFormData({ ...formData, apellido1: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest mb-2 block">2º Apellido</label>
                      <input
                        type="text"
                        value={formData.apellido2}
                        onChange={(e) => setFormData({ ...formData, apellido2: e.target.value })}
                        placeholder="(Opcional)"
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Email y Teléfono */}
                <div>
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                    <Mail size={10} /> Email
                  </label>
                  <input
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                    <Phone size={10} /> Teléfono
                  </label>
                  <input
                    type="tel" required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 outline-none transition-all"
                  />
                </div>

                {/* Fecha de Nacimiento */}
                <div className="md:col-span-2">
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                    <Calendar size={10} /> Fecha de Nacimiento
                  </label>
                  <input
                    type="date" required
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 outline-none transition-all"
                  />
                </div>

                {/* Contraseñas con OJO */}
                <div className="relative">
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                    <Lock size={10} /> Contraseña
                  </label>
                  <input
                    type={showPassword ? "text" : "password"} required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 outline-none transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-9 text-slate-500 hover:text-purple-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div>
                  <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                    <Lock size={10} /> Repetir
                  </label>
                  <input
                    type={showPassword ? "text" : "password"} required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Compliance Checkbox */}
              <div className="flex items-start gap-4 p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all cursor-pointer" onClick={() => setCompliance(!compliance)}>
                <div className={`mt-1 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${compliance ? 'bg-purple-600 border-purple-600' : 'border-white/20'}`}>
                  {compliance && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-slate-400 leading-relaxed font-light">
                    Acepto el <span className="text-white font-bold">tratamiento de datos personales </span> y los protocolos de seguridad del <span className="text-purple-400 font-bold italic underline">Protocolo de Iris Aerospace</span>.
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-shake">
                  <AlertCircle size={14} className="shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 mt-4 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold text-[10px] uppercase tracking-[0.3em] hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Rocket size={12} /> Registrarme en Iris</>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-slate-500 text-xs font-light">
              ¿Ya tienes cuenta?{" "}
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
