"use client";
import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CreditCard, Loader2, Rocket, AlertCircle } from "lucide-react";
import { irisApi } from "@/lib/api";
import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function PagosContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const reservaId = searchParams.get("reserva_id");

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    async function initPayment() {
      if (!session?.user || !reservaId) return;
      const token = (session.user as any).accessToken;

      try {
        const resData = await irisApi.getReservations(token);
        const reservations = Array.isArray(resData) ? resData : (resData.datos || resData.reservas || []);
        const resObj = reservations.find((r: any) => String(r.id) === String(reservaId));

        if (!resObj) throw new Error("Reserva no encontrada en tu cuenta. Por favor, verifica en 'Mis Reservas'.");

        if (resObj.booking_group_id) {
          const groupTotal = reservations
            .filter((r: any) => r.booking_group_id === resObj.booking_group_id)
            .reduce((sum: number, r: any) => sum + parseFloat(r.total_price), 0);
          setAmount(groupTotal);
        } else {
          setAmount(parseFloat(resObj.total_price));
        }
        const data = await irisApi.createPaymentIntent(token, parseInt(reservaId));
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || "Error al iniciar el pago.");
      } finally {
        setLoading(false);
      }
    }

    initPayment();
  }, [session, reservaId]);

  if (!reservaId) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={48} className="text-slate-700 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No se ha seleccionado ninguna reserva</h2>
        <p className="text-slate-500">Ve a "Mis Reservas" y selecciona una para realizar el pago.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <Loader2 size={48} className="text-purple-500 animate-spin mb-4" />
        <p className="mono-text text-[10px] uppercase tracking-widest text-slate-500">Abriendo pasarela de pago seguro...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-center">
        <AlertCircle size={32} className="text-red-400 mx-auto mb-4" />
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="card-purple p-10 rounded-[3rem]">
        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
            <CheckoutForm reservationId={parseInt(reservaId)} amount={amount} />
          </Elements>
        )}
      </div>
    </div>
  );
}

export default function PagosPage() {
  return (
    <div className="animate-fade-in space-y-10">
      <header>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
          <CreditCard size={10} className="text-purple-400" />
          <span className="mono-text text-[8px] uppercase tracking-widest text-purple-300">Pasarela de Pago</span>
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tight">Finalizar <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Transacción</span></h1>
      </header>

      <Suspense fallback={<Loader2 className="animate-spin text-purple-500 mx-auto" />}>
        <PagosContent />
      </Suspense>
    </div>
  );
}
