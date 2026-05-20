"use client";
import { useState, useEffect } from "react";
import { MessageCircle, Phone, Video, Send, X, Shield, Bell, ChevronRight, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { irisApi } from "@/lib/api";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function NavigatorBubble() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [manager, setManager] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (pathname !== "/") {
      setIsVisible(true);
      return;
    }

    setIsVisible(false);

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    async function fetchManager() {
      if (session?.user) {
        setLoading(true);
        const token = (session.user as any).accessToken;
        try {
          const data = await irisApi.getManagerProfile(token);
          setManager(data);
        } catch (error: any) {
          if (error.message?.includes("Token inválido") || error.message?.includes("expirado")) {
            console.warn("Sesión expirada en NavigatorBubble, cerrando sesión...");
            signOut({ callbackUrl: "/auth/login?error=SessionExpired" });
          } else {
            console.error("Error trayendo al gestor asignado:", error);
          }
        } finally {
          setLoading(false);
        }
      }
    }
    fetchManager();
  }, [session]);

  return (
    <div
      className={`fixed bottom-10 right-10 z-[100] transition-all duration-700 transform ${isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-8 pointer-events-none"
        }`}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
            className="absolute bottom-20 right-0 w-80 card-purple rounded-[2.5rem] border-purple-500/30 shadow-2xl shadow-purple-900/40 overflow-hidden"
          >
            <div className="p-6 bg-linear-to-br from-purple-600/20 to-indigo-600/20 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#06040d]">
                    {session ? (manager?.name?.split(' ').map((n: any) => n[0]).join('') || "EV") : <User size={14} />}
                  </div>
                  {session && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#06040d] rounded-full" />}
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">Asistente Iris</h4>
                  <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em]">
                    {session ? (manager?.name || "Gestor Asignado") : "Centro de Ayuda"}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-600 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {session ? (
              <div className="p-4 space-y-2">
                <Link
                  href="/portal/gestor"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <MessageCircle size={18} className="text-purple-400" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300">Enviar mensaje directo</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-700 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/portal/gestor"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <Phone size={18} className="text-indigo-400" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300">Solicitar llamada</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-700 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/portal/gestor"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between w-full p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <Video size={18} className="text-amber-400" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-300">Acordar videollamada</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-700 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User size={24} className="text-slate-500" />
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed mb-8 uppercase tracking-widest">
                  Inicia sesión para hablar con tu gestor y gestionar tus reservas.
                </p>
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <button className="w-full py-4 bg-purple-600 text-white rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-purple-500 transition-all shadow-xl shadow-purple-900/20">
                    Iniciar Sesión
                  </button>
                </Link>
              </div>
            )}

            <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
              <div className="flex items-center justify-center gap-2 text-[8px] text-slate-600 uppercase tracking-widest">
                <Shield size={10} />
                Canal de Asistencia
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen ? 'bg-white text-black' : 'bg-linear-to-tr from-purple-600 to-indigo-600 text-white shadow-purple-600/40'
          }`}
      >
        {isOpen ? <X size={28} /> : (
          <div className="relative">
            <MessageCircle size={28} />
            {session && unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 border-2 border-[#06040d] rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
        )}
      </motion.button>
    </div>
  );
}
