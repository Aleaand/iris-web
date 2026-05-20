import React from "react";
import Navbar from "@/components/Navbar";
import Starfield from "@/components/Starfield";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen relative bg-[#06040d] text-white pt-40 pb-20 px-6">
      <Starfield />
      <Navbar />
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">Política de Privacidad Estelar</h1>
        
        <div className="space-y-8 text-slate-300 font-light leading-relaxed">
          <p>
            En Iris Aerospace, tu privacidad es una prioridad, tanto en la Tierra como en el espacio exterior. Al registrarte en nuestros sistemas y reservar vuelos interplanetarios, recopilamos información biométrica y de contacto necesaria para garantizar tu seguridad.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Protección de Datos Biométricos</h2>
          <p>
            Todos los datos médicos y físicos recogidos durante el Iris Training y la emisión del Pasaporte Espacial se encriptan con tecnología cuántica de extremo a extremo. Estos datos no son compartidos con terceros sin tu autorización explícita.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Cookies y Navegación</h2>
          <p>
            Nuestros sistemas de la nave y la web recopilan datos anónimos de navegación para mejorar la interfaz del portal y optimizar las trayectorias de experiencia del usuario.
          </p>

          <p className="mt-12 text-sm text-slate-500">Última actualización: Ciclo Estelar 2026.</p>
        </div>
      </div>
    </main>
  );
}
