"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, AlertCircle, Rocket, ChevronLeft, CheckCircle2 } from "lucide-react";
import { irisApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [debugToken, setDebugToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await irisApi.forgotPassword(email);
      console.log("Respuesta API Forgot Password:", response);
      if (response.debug_token) {
        setDebugToken(response.debug_token);
      } else {
        console.warn("No se recibió debug_token.");
      }
      setSuccess(true);

      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 10000);
    } catch (err: any) {
      setError(err.message || "Error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#110e20] flex items-center justify-center px-6">      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 aurora-blur rounded-full pointer-events-none" />

      {/* Simulación de Email de Notificación */}
      {success && debugToken && (
        <div className="fixed top-10 right-10 z-50 animate-bounce-in max-w-xs w-full">
          <div className="card-purple p-6 rounded-2xl shadow-2xl border-purple-500/50 bg-[#0d0a1a]">
            <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white">
                <Mail size={14} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">Comunicación Iris</p>
                <p className="text-[8px] text-slate-500 italic">Recuperación de Acceso</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 mb-4 font-light leading-relaxed">
              Copia este código para recuperar tu contraseña:
            </p>
            <div className="bg-white/5 rounded-lg py-3 text-center border border-white/10">
              <span className="text-2xl font-bold text-purple-400 tracking-[0.3em]">{debugToken}</span>
            </div>
            <button
              onClick={() => router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`)}
              className="w-full mt-4 py-2 bg-white text-black rounded-full font-bold text-[8px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all"
            >
              Recuperar Contraseña
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-md">
        <Link href="/auth/login" className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="mono-text text-[10px] uppercase tracking-widest">Volver</span>
        </Link>

        <div className="flex flex-col items-center mb-10 text-center">
          <Image src="/img/logo_iris.png" alt="Iris" width={48} height={48} className="object-contain mb-4" />
          <h1 className="text-3xl font-bold text-white tracking-tight">Recuperar Acceso</h1>
          <p className="text-slate-500 mt-2 text-sm font-light">Te enviaremos un código para restablecer tu contraseña</p>
        </div>

        <div className="card-purple p-8 rounded-[2.5rem]">
          {success ? (
            <div className="text-center py-6 animate-fade-in">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Solicitud Enviada</h2>
              <p className="text-slate-400 text-sm">Redirigiéndote para que introduzcas tu código...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                  <Mail size={10} /> Email de la cuenta
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                />
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
                  <><Rocket size={12} /> Enviar Código</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
