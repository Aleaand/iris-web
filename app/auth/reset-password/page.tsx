"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, AlertCircle, Rocket, CheckCircle2, Key, Eye, EyeOff } from "lucide-react";
import { irisApi } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    token: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      await irisApi.resetPassword({
        email: formData.email,
        token: formData.token,
        newPassword: formData.newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Error al restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-purple p-8 rounded-[2.5rem]">
      {success ? (
        <div className="text-center py-6 animate-fade-in">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Contraseña Actualizada</h2>
          <p className="text-slate-400 text-sm">Ya puedes iniciar sesión con tu nueva clave.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
              <Key size={10} /> Código de Recuperación
            </label>
            <input
              type="text"
              value={formData.token}
              onChange={(e) => setFormData({ ...formData, token: e.target.value })}
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors tracking-[0.5em] text-center font-bold"
            />
          </div>

          <div>
            <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
              <Lock size={10} /> Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
              <Lock size={10} /> Confirmar Contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle size={14} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Actualizar Contraseña</>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#110e20] flex items-center justify-center px-6">      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 aurora-blur rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-10 text-center">
          <Image src="/img/logo_iris.png" alt="Iris" width={48} height={48} className="object-contain mb-4" />
          <h1 className="text-3xl font-bold text-white tracking-tight">Nueva Clave</h1>
          <p className="text-slate-500 mt-2 text-sm font-light">Introduce el código enviado y tu nueva contraseña</p>
        </div>

        <Suspense fallback={<div className="text-white text-center">Cargando...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
