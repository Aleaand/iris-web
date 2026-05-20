import React from "react";
import Navbar from "@/components/Navbar";
import Starfield from "@/components/Starfield";

export default function TermsPage() {
  return (
    <main className="min-h-screen relative bg-[#06040d] text-white pt-40 pb-20 px-6">
      <Starfield />
      <Navbar />
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">Términos y Condiciones</h1>
        
        <div className="space-y-8 text-slate-300 font-light leading-relaxed">
          <p>
            Al utilizar los servicios de Iris Aerospace y abordar cualquiera de nuestras naves estelares (Clase Helios, Kronos, u otras), aceptas los términos establecidos a continuación.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Aceptación del Riesgo Espacial</h2>
          <p>
            El viaje interestelar conlleva riesgos inherentes. El pasajero asume toda la responsabilidad tras pasar los controles de seguridad y firmar el manifiesto de vuelo.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Requisitos de Abordaje</h2>
          <p>
            Es obligatorio presentar un Pasaporte Espacial válido y haber completado satisfactoriamente el Iris Training. El incumplimiento resultará en la denegación de embarque sin reembolso, salvo que se aplique la Política de Cancelación pertinente.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Conducta a Bordo</h2>
          <p>
            Se requiere un comportamiento adecuado y el seguimiento de las instrucciones del Capitán y la tripulación en todo momento. En caso de emergencia o microgravedad inestable, las directrices de la IA de abordo son de cumplimiento obligatorio.
          </p>
        </div>
      </div>
    </main>
  );
}
