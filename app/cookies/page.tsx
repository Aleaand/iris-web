import React from "react";
import Navbar from "@/components/Navbar";
export default function CookiesPage() {
  return (
    <main className="min-h-screen relative bg-[#110e20] text-white pt-40 pb-20 px-6">      <Navbar />
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">Política de Cookies Cuánticas</h1>
        
        <div className="space-y-8 text-slate-300 font-light leading-relaxed">
          <p>
            En Iris Aerospace utilizamos "cookies" y tecnologías de almacenamiento local para garantizar que tu experiencia digital fluya tan rápido como la velocidad de la luz.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">¿Qué son las Cookies Cuánticas?</h2>
          <p>
            Son pequeños fragmentos de datos almacenados en tu dispositivo que nos permiten recordar tus preferencias planetarias, las cabinas que más visitas y tu estado de autenticación en nuestro portal espacial.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Tipos de Cookies que utilizamos</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li><strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento del sistema central de reservas y el inicio de sesión seguro.</li>
            <li><strong>Cookies de Telemetría (Analíticas):</strong> Nos ayudan a entender cómo navegas por nuestras constelaciones de páginas para mejorar la interfaz de usuario.</li>
            <li><strong>Cookies de Personalización:</strong> Recuerdan tu idioma preferido y ajustes visuales para futuros vuelos.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Control de Cookies</h2>
          <p>
            Puedes ajustar la configuración de tu navegador terrestre para rechazar todas o algunas de las cookies. Sin embargo, desactivar las cookies esenciales podría causar anomalías gravitacionales en tu proceso de reserva.
          </p>
        </div>
      </div>
    </main>
  );
}
