"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { User, LogOut, Menu, X, ChevronRight, Bell, LayoutDashboard, Globe } from "lucide-react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHoveringTop, setIsHoveringTop] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const isPortal = pathname.startsWith("/portal");
  const isLoggedIn = status === "authenticated";
  const [menuMode, setMenuMode] = useState<'public' | 'private'>(isPortal ? 'private' : 'public');

  useEffect(() => {
    setMenuMode(pathname.startsWith("/portal") ? 'private' : 'public');
  }, [pathname]);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({
        top: window.innerHeight * 1.2,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (window.innerWidth >= 1024) {
        if (pathname === "/") {
          setIsVisible(true);
        } else if (currentScrollY > 50) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 1024 && e.clientY < 80) {
        setIsHoveringTop(true);
      } else {
        setIsHoveringTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [lastScrollY]);

  const publicLinks = [
    { label: "Atlas Estelar", href: "/destinations" },
    { label: "Reserva", href: "/booking" },
    { label: "Servicios Extras", href: "/services" },
    { label: "Legado", href: "/about" },
  ];

  const portalLinks = [
    { label: "Inicio", href: "/portal" },
    { label: "Mis Reservas", href: "/portal/reservas" },
    { label: "Mis Pasajeros", href: "/portal/pasajeros" },
    { label: "Mi Gestor", href: "/portal/gestor" },
    { label: "Mis Pagos", href: "/portal/historial-pagos" },
    { label: "Mi Perfil", href: "/portal/perfil" },
  ];

  const currentLinks = menuMode === 'private' && isLoggedIn ? portalLinks : publicLinks;

  return (
    <>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: (isVisible || isHoveringTop || isMobileMenuOpen) ? 0 : -140 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6"
      >
        <nav className="w-full max-w-6xl apple-glass rounded-full px-6 py-3 flex items-center justify-between border border-white/10 shadow-2xl shadow-black/40">

          <div className="flex items-center gap-6">
            <Link href="/#aerospace" onClick={handleLogoClick} className="flex items-center gap-3">
              <Image
                src="/img/logo_iris.png"
                alt="Iris Logo"
                width={28}
                height={28}
                className="object-contain"
              />
              <span className="text-white font-bold tracking-[0.2em] text-[10px] uppercase hidden sm:block">Iris</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={menuMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1"
              >
                {currentLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-4 py-1.5 text-[10px] uppercase font-bold tracking-[0.15em] transition-all rounded-full ${pathname === link.href
                      ? (menuMode === 'private' ? "bg-purple-600/20 text-purple-400" : "bg-white/10 text-white")
                      : (menuMode === 'private'
                        ? "text-white/50 hover:text-purple-400 hover:bg-purple-600/10"
                        : "text-white/50 hover:text-white hover:bg-white/5")
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMenuMode(prev => prev === 'public' ? 'private' : 'public')}
                  className={`p-2 rounded-full transition-all duration-300 border border-white/5 hover:border-white/20 ${menuMode === 'private' ? 'bg-purple-600/20 text-purple-400' : 'bg-white/5 text-white/40 hover:text-white'}`}
                  title={menuMode === 'public' ? "Cambiar a Modo Portal" : "Cambiar a Modo Público"}
                >
                  <motion.div
                    animate={{ rotate: menuMode === 'private' ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-repeat">
                      <path d="m17 2 4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                  </motion.div>
                </button>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-bold text-white uppercase tracking-widest">{session?.user?.name}</p>
                    <p className="text-[7px] text-slate-500 lowercase">{session?.user?.email}</p>
                  </div>
                  <Link
                    href="/portal"
                    className="w-8 h-8 rounded-full bg-linear-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase border border-white/20"
                  >
                    {session?.user?.name?.slice(0, 2) || "AJ"}
                  </Link>
                </div>
                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-red-400/60 hover:text-red-400 transition-all"
                  title="Cerrar Sesión"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 px-5 py-2 bg-purple-600/20 border border-purple-500/30 text-white text-[10px] uppercase tracking-widest rounded-full hover:bg-purple-600/40 transition-all backdrop-blur-md"
              >
                <span>Acceso</span>
                <User size={12} className="opacity-60" />
              </Link>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.div>

      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isLogoutModalOpen && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsLogoutModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm apple-glass border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl"
              >
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                  <LogOut size={32} className="text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¿Cerrar sesión?</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  ¿Estas seguro de cerrar sesion? Siempre puedes volver a iniciar sesion
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsLogoutModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-[10px] uppercase tracking-widest transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex-1 py-3 px-4 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[99] bg-[#110e20]/98 backdrop-blur-3xl flex flex-col items-center justify-center p-8 md:hidden"
            >
              {/* Header superior dentro del menú móvil */}
              <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Image
                    src="/img/logo_iris.png"
                    alt="Iris Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                  <span className="text-white font-bold tracking-[0.2em] text-[10px] uppercase">Iris</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95"
                  aria-label="Cerrar menú"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col items-center gap-6 w-full max-w-xs mt-12">
                {currentLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between w-full px-6 py-4 rounded-2xl border transition-all duration-300 group ${isActive
                          ? (menuMode === 'private' ? "bg-purple-600/20 border-purple-500/30 text-purple-400" : "bg-white/10 border-white/10 text-white")
                          : (menuMode === 'private'
                            ? "bg-white/5 border-white/5 text-white/80 hover:text-purple-400 hover:bg-purple-600/10 hover:border-purple-500/20"
                            : "bg-white/5 border-white/5 text-white/80 hover:text-white hover:bg-white/10")
                        }`}
                    >
                      <span className="text-sm uppercase tracking-[0.2em] font-medium">{link.label}</span>
                      <ChevronRight size={14} className={`transition-all duration-300 ${isActive ? "opacity-100 translate-x-1" : "opacity-20 group-hover:opacity-100 group-hover:translate-x-1"}`} />
                    </Link>
                  );
                })}

                {(!isLoggedIn || menuMode !== 'private') && (
                  <Link
                    href={isLoggedIn ? "/portal" : "/auth/login"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-10 w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold uppercase tracking-[0.3em] text-[10px] text-center shadow-2xl shadow-purple-600/20 transition-all duration-300 active:scale-[0.98]"
                  >
                    {isLoggedIn ? "Ir al Portal" : "Iniciar Sesión"}
                  </Link>
                )}

                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className={`text-red-400 text-[10px] uppercase tracking-widest font-bold hover:text-red-300 transition-colors ${menuMode === 'private' ? 'mt-6' : 'mt-4'
                      }`}
                  >
                    Cerrar Sesión
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}