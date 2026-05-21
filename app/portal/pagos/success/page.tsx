"use client";
import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Rocket, ArrowRight, Download, Globe } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { irisApi } from "@/lib/api";

function SuccessContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const reservaId = searchParams.get("reserva_id");
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    async function checkReceiptAndTriggerTasks() {
      if (!session?.user || !reservaId) return;
      const token = (session.user as any).accessToken;
      try {
        const resData = await irisApi.getReservations(token);
        const reservations = Array.isArray(resData) ? resData : (resData.datos || resData.reservas || []);
        const resObj = reservations.find((r: any) => String(r.id) === String(reservaId));
        
        if (resObj?.stripe_receipt_url) {
          setReceiptUrl(resObj.stripe_receipt_url);
        }

        // Trigger Automated Tasks (Passport / Training)
        const clientName = session.user.name || "Cliente Iris";
        const services = resObj?.services || [];
        
        if (services.includes('Passport Management')) {
          await irisApi.createManagerTask(token, {
            title: `Solicitud Burocrática de Pasaporte: ${clientName}`,
            type: 'passport',
            client_name: clientName,
            reservation_id: parseInt(reservaId),
            description: `El cliente ha contratado la gestión de pasaporte estelar para la reserva #${reservaId}.`,
            priority: 'high'
          });
        }

        if (services.includes('Iris Training')) {
          await irisApi.createManagerTask(token, {
            title: `Agendar Protocolo Iris Training: ${clientName}`,
            type: 'training',
            client_name: clientName,
            reservation_id: parseInt(reservaId),
            description: `Reserva #${reservaId} confirmada. El cliente requiere entrenamiento previo al lanzamiento.`,
            priority: 'medium'
          });
        }
      } catch (e) { 
        console.error("Error al procesar post-pago:", e); 
      }
    }
    checkReceiptAndTriggerTasks();
  }, [session, reservaId]);

  return (
    <div className="max-w-3xl mx-auto text-center space-y-12 py-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="w-32 h-32 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.2)]"
      >
        <CheckCircle size={64} className="text-green-400" />
      </motion.div>

      <div className="space-y-4">
        <h1 className="text-6xl font-black text-white tracking-tighter">¡RESERVA CONFIRMADA!</h1>
        <p className="text-slate-400 uppercase tracking-[0.4em] text-[10px] font-black">Tu reserva_id ha sido registrado con éxito</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-left">
        <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl hover:bg-white/5 transition-all">
          <Rocket className="text-purple-400 mb-4" size={24} />
          <h3 className="text-white font-bold mb-2">Reserva #{reservaId}</h3>
          <Link href="/portal/reservas" className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
            Ver Documento de Reserva <ArrowRight size={12} />
          </Link>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl">
          <Globe className="text-blue-400 mb-4" size={24} />
          <h3 className="text-white font-bold mb-2">Próximos Pasos</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Recibirás un mensaje de tu Gestor Iris para coordinar la reserva.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
        <Link
          href="/portal/reservas"
          className="px-10 py-5 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all flex items-center gap-3 shadow-2xl"
        >
          Gestionar Mis Reservas <ArrowRight size={14} />
        </Link>
        {receiptUrl ? (
          <a
            href={receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-green-500/30 transition-all flex items-center gap-3"
          >
            Descargar Factura Stripe <Download size={14} />
          </a>
        ) : (
          <button
            disabled
            className="px-10 py-5 bg-white/5 text-slate-500 border border-white/10 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-3 opacity-50 cursor-not-allowed"
          >
            Generando Factura... <Download size={14} />
          </button>
        )}
      </div>

      <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest pt-12">Gracias por confiar en Iris Aerospace • Hacia lo infinito</p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#110e20] selection:bg-purple-500/30">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Rocket className="animate-bounce text-purple-500" /></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
