"use client";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Globe, Twitter, Instagram, Linkedin, Rocket, Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-[#0d021f] border-t border-white/5 pt-20 pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/img/logo_iris.png"
                alt="Iris Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-white font-black tracking-[0.3em] text-sm uppercase">Iris <span className="text-purple-400">Aerospace</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Redefiniendo los límites de la exploración humana. Iris Aerospace no es solo una agencia, es tu puente hacia el cosmos y las experiencias más allá de la atmósfera terrestre.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Globe, href: "#" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-purple-600/20 hover:border-purple-500/30 transition-all group"
                >
                  <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.2em]">Exploración</h4>
            <ul className="space-y-4">
              {[
                { label: "Atlas Estelar", href: "/destinations" },
                { label: "Reserva tu Vuelo", href: "/booking" },
                { label: "Protocolos de Seguridad", href: "/safety" },
                { label: "Nuestra Flota", href: "/fleet" },
                { label: "Centro de Entrenamiento", href: "/training" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-purple-400 text-sm transition-colors flex items-center gap-2 group">
                    <div className="w-1 h-1 rounded-full bg-purple-500/0 group-hover:bg-purple-500 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.2em]">Contacto </h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+34900000000" className="flex items-center gap-4 text-slate-400 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-purple-500/30">
                    <Phone size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Línea Directa</p>
                    <p className="text-sm">+34 900 834 212</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:orbit@irisaerospace.com" className="flex items-center gap-4 text-slate-400 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-purple-500/30">
                    <Mail size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Soporte</p>
                    <p className="text-sm">contactiris@iris.com</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-4 text-slate-400 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Globe size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Base Central</p>
                    <p className="text-sm">Centro Espacial de New York, EE.UU</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <p className="text-slate-500 text-[11px] font-medium tracking-widest uppercase">
              © 2026 <span className="text-white">Alejandra Andrade</span>. Todos los derechos reservados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            <Link href="/privacy" className="text-slate-500 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Privacidad</Link>
            <Link href="/terms" className="text-slate-500 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Términos</Link>
            <Link href="/cookies" className="text-slate-500 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Cookies</Link>
            <Link href="/refund" className="text-slate-500 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Reembolsos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
