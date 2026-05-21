import React from "react";
import Navbar from "@/components/Navbar";
export default function RefundPolicy() {
  return (
    <main className="min-h-screen relative bg-[#110e20] text-white pt-40 pb-20 px-6">      <Navbar />
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">Política de Cancelación y Reembolso</h1>
        
        <div className="space-y-12 text-slate-300 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Baremo de Reembolso</h2>
            <p className="mb-4">Si la reserva incluye el Seguro de Reembolso, se aplicará la siguiente escala de devolución sobre los servicios propios de Iris Aerospace (vuelo espacial):</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-purple-400">Más de 30 días:</strong> Reembolso del 90%.</li>
              <li><strong className="text-purple-400">Entre 30 y 7 días:</strong> Reembolso del 50%.</li>
              <li><strong className="text-purple-400">Entre 7 días y 72 horas:</strong> Reembolso del 10%.</li>
              <li><strong className="text-purple-400">Menos de 72 horas:</strong> Sin derecho a reembolso (0%).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Cancelación por Incumplimiento</h2>
            <p className="mb-4">El pasajero debe disponer de Pasaporte e Iris Training 72h antes del despegue.</p>
            <p className="mb-4 text-red-400">Si no se cumplen estos requisitos, el sistema anulará la plaza automáticamente.</p>
            <p><strong>Penalización:</strong> Retención del 100% del importe total por bloqueo de recursos y ventana de lanzamiento.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Ejecución y Plazos</h2>
            <ul className="list-none space-y-2">
              <li><strong className="text-white">Método:</strong> Devolución automática al método original de pago.</li>
              <li><strong className="text-white">Plazo:</strong> Hasta 30 días naturales para el procesamiento bancario.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Servicios Externos y Casos Especiales (No Reembolsables)</h2>
            <p className="mb-4">Los siguientes servicios no admiten devolución bajo ninguna circunstancia una vez confirmada la reserva:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Vuelo Terrestre (Conexión):</strong> Billetes de avión.</li>
              <li><strong className="text-white">Alojamiento (Hotel):</strong> Reservas de estancia externa.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Casos Especiales de Gestión</h2>
            <ul className="list-disc pl-6 space-y-4">
              <li><strong className="text-white">Iris Training:</strong> No se reembolsará si el día de entrenamiento ya ha sido aprobado, si el proceso está en curso o si ya ha sido realizado.</li>
              <li><strong className="text-white">Gestión de Pasaporte Espacial:</strong> No se reembolsará una vez iniciado el proceso de gestión administrativa por parte de la agencia.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Garantía Iris Aerospace</h2>
            <p>Se emitirá un reembolso del 100% o reubicación gratuita solo si la cancelación es por motivos técnicos de la Iris Aerospace o condiciones meteorológicas espaciales adversas.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
