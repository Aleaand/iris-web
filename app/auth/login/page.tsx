"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, AlertCircle, Rocket, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales incorrectas. Verifica tu email y contraseña.");
    } else {
      router.push("/portal");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#110e20] flex items-center justify-center px-6">      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 aurora-blur rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/">
            <Image src="/img/logo_iris.png" alt="Iris" width={48} height={48} className="object-contain mb-4" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Accede a tu cuenta</h1>
        </div>

        {/* Card */}
        <div className="card-purple p-8 rounded-[2rem]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                <Mail size={10} /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <div className="relative">
              <label className="mono-text text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                <Lock size={10} /> Contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                required
                className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 text-slate-500 hover:text-purple-400 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-[9px] text-slate-500 hover:text-purple-400 transition-colors uppercase tracking-widest">
                ¿Has olvidado tu contraseña?
              </Link>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 text-white font-bold text-[10px] uppercase tracking-widest hover:shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Iniciar Sesión</>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-xs">
              ¿No tienes cuenta?{" "}
              <Link href="/auth/register" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
