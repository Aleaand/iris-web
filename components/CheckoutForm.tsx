"use client";
import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";

export default function CheckoutForm({ reservationId, amount }: { reservationId: number, amount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/portal/pagos/success?reserva_id=${reservationId}`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "Error en el pago.");
    } else {
      setMessage("Ocurrió un error inesperado.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="mono-text text-[8px] text-slate-500 uppercase tracking-widest">Total a pagar</p>
          <p className="text-3xl font-bold text-white">€{amount.toLocaleString()}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
          <ShieldCheck size={24} />
        </div>
      </div>

      <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
        <PaymentElement />
      </div>

      {message && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle size={14} />
          {message}
        </div>
      )}

      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full py-4 bg-white text-black rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Procesando...
          </div>
        ) : (
          "Confirmar Pago Seguro"
        )}
      </button>
    </form>
  );
}
